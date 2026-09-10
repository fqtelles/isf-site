#!/bin/bash
# =============================================================================
# maintenance.sh — Manutenção periódica da VPS ISF Segurança
# Executar semanalmente via cron (ex: todo domingo às 02:00)
#
# Uso manual:  sudo bash /var/www/isf-site/scripts/maintenance.sh
# Via cron:    crontab -e
#              0 2 * * 0  bash /var/www/isf-site/scripts/maintenance.sh
# =============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# Configurações
# ---------------------------------------------------------------------------
APP_DIR="/var/www/isf-site"
DB_PATH="$APP_DIR/prisma/dev.db"
LOG_FILE="/var/log/isf-maintenance.log"
RCLONE_REMOTE="gdrive"
GDRIVE_FOLDER="ISF-Backups/maintenance"
GDRIVE_RETENTION=90           # dias de retenção dos logs no Google Drive

DISK_THRESHOLD=80             # % de uso do disco para emitir aviso
MEM_THRESHOLD=85              # % de uso de memória para emitir aviso
CERT_WARN_DAYS=30             # dias antes do vencimento para emitir aviso de SSL
SSH_TOP_N=10                  # quantos IPs mais agressivos verificar contra o fail2ban
SSH_DANGER_THRESHOLD=20       # falhas em 7 dias a partir das quais um IP é considerado "perigoso"

TIMESTAMP=$(date '+%Y-%m-%d_%H-%M-%S')
DATE=$(date '+%Y-%m-%d')
WARNINGS=0
ERRORS=0
WARNING_MESSAGES=()
ERROR_MESSAGES=()
APP_STATUS="desconhecido"
REBOOT_PENDING="não"

# Cron/root não carregam o nvm por padrão — sem isso, "pm2" não é encontrado
# mesmo com a aplicação rodando normalmente.
for nvm_bin in /root/.nvm/versions/node/*/bin; do
  [ -d "$nvm_bin" ] && PATH="$PATH:$nvm_bin"
done
export PATH

# ---------------------------------------------------------------------------
# Funções auxiliares
# ---------------------------------------------------------------------------
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

success() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] OK: $1" | tee -a "$LOG_FILE"
}

warn() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] AVISO: $1" | tee -a "$LOG_FILE"
  WARNING_MESSAGES+=("$1")
  ((WARNINGS++)) || true
}

error() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERRO: $1" | tee -a "$LOG_FILE"
  ERROR_MESSAGES+=("$1")
  ((ERRORS++)) || true
}

# Dead-man switch: um monitor externo espera um ping a cada execução. Se não
# chegar — cron parado, VPS fora do ar, script morto no meio — o alerta vem de
# fora. Nenhuma verificação daqui de dentro cobre isso, porque quem avisaria é
# justamente o que não está rodando.
# A URL fica em HEALTHCHECK_MAINTENANCE_URL no .env; sem ela, isso é inerte.
hc_ping() {
  [ -n "${HEALTHCHECK_MAINTENANCE_URL:-}" ] || return 0
  # Falha de ping nunca derruba a manutenção.
  curl -fsS -m 10 --retry 3 -o /dev/null "${HEALTHCHECK_MAINTENANCE_URL}${1:-}" || true
}

# Cobre morte inesperada. O desfecho normal é sinalizado no relatório final,
# conforme a contagem de erros.
trap 'rc=$?; if [ "$rc" -ne 0 ]; then hc_ping "/fail"; fi' EXIT

section() {
  log ""
  log "------------------------------------------------------------"
  log "  $1"
  log "------------------------------------------------------------"
}

# ---------------------------------------------------------------------------
# Início
# ---------------------------------------------------------------------------
# Carregado aqui, e não só na seção de e-mail, porque o ping de início precisa
# da URL antes de qualquer verificação rodar.
if [ -f "$APP_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1090
  source "$APP_DIR/.env"
  set +a
fi

hc_ping "/start"

log ""
log "========================================"
log "  Manutenção ISF Segurança — início"
log "  $TIMESTAMP"
log "========================================"

# ---------------------------------------------------------------------------
# 1. Atualização do sistema
# ---------------------------------------------------------------------------
section "[1/9] Atualização do sistema"

log "Atualizando lista de pacotes..."
apt-get update -qq 2>&1 | tee -a "$LOG_FILE"

log "Aplicando upgrades disponíveis..."
DEBIAN_FRONTEND=noninteractive apt-get upgrade -y \
  -o Dpkg::Options::="--force-confdef" \
  -o Dpkg::Options::="--force-confold" \
  2>&1 | tee -a "$LOG_FILE"

log "Removendo pacotes órfãos..."
apt-get autoremove -y 2>&1 | tee -a "$LOG_FILE"
apt-get autoclean -y 2>&1 | tee -a "$LOG_FILE"

if [ -f /var/run/reboot-required ]; then
  REBOOT_PENDING="sim"
  warn "Reboot necessário após atualização do kernel. Reinicie manualmente em uma janela de manutenção."
else
  success "Sistema atualizado. Nenhum reboot necessário."
fi

# ---------------------------------------------------------------------------
# 2. Monitoramento de recursos
# ---------------------------------------------------------------------------
section "[2/9] Monitoramento de recursos"

# Disco
DISK_USAGE=$(df / | awk 'NR==2 {gsub(/%/,""); print $5}')
log "Uso do disco (/): ${DISK_USAGE}%"
if [ "$DISK_USAGE" -ge "$DISK_THRESHOLD" ]; then
  warn "Disco em ${DISK_USAGE}% — acima do limite de ${DISK_THRESHOLD}%!"
  df -h | tee -a "$LOG_FILE"
else
  success "Disco em ${DISK_USAGE}% (limite: ${DISK_THRESHOLD}%)"
fi

# Memória
MEM_TOTAL=$(free -m | awk '/^Mem:/ {print $2}')
MEM_USED=$(free -m  | awk '/^Mem:/ {print $3}')
MEM_USAGE=$(( MEM_USED * 100 / MEM_TOTAL ))
log "Uso de memória: ${MEM_USED}MB / ${MEM_TOTAL}MB (${MEM_USAGE}%)"
if [ "$MEM_USAGE" -ge "$MEM_THRESHOLD" ]; then
  warn "Memória em ${MEM_USAGE}% — acima do limite de ${MEM_THRESHOLD}%!"
else
  success "Memória em ${MEM_USAGE}% (limite: ${MEM_THRESHOLD}%)"
fi

# CPU load average
LOAD_1MIN=$(uptime | awk -F'load average:' '{print $2}' | cut -d',' -f1 | tr -d ' ')
CPU_CORES=$(nproc)
log "CPU load (1 min): $LOAD_1MIN | Cores: $CPU_CORES"
LOAD_INT=$(echo "$LOAD_1MIN" | cut -d'.' -f1)
if [ "$LOAD_INT" -ge "$CPU_CORES" ]; then
  warn "CPU load (${LOAD_1MIN}) igual ou superior ao número de cores (${CPU_CORES})."
else
  success "CPU load normal: ${LOAD_1MIN}"
fi

# ---------------------------------------------------------------------------
# 3. Health check dos serviços
# ---------------------------------------------------------------------------
section "[3/9] Health check dos serviços"

# Nginx
if systemctl is-active --quiet nginx; then
  success "Nginx está rodando."
else
  error "Nginx está parado! Tentando reiniciar..."
  systemctl start nginx && log "  -> Nginx reiniciado." || error "Falha ao reiniciar Nginx."
fi

# PM2 + app isf-site
if command -v pm2 &>/dev/null; then
  APP_STATUS=$(pm2 jlist 2>/dev/null | python3 -c "
import sys, json
procs = json.load(sys.stdin)
isf = [p for p in procs if p.get('name') == 'isf-site']
print(isf[0]['pm2_env']['status'] if isf else 'not_found')
" 2>/dev/null || echo "error")

  log "Status PM2 isf-site: $APP_STATUS"
  if [ "$APP_STATUS" = "online" ]; then
    success "App isf-site está online."
  elif [ "$APP_STATUS" = "not_found" ]; then
    error "App isf-site não encontrada no PM2!"
  else
    error "App isf-site com status '$APP_STATUS'. Tentando reiniciar..."
    pm2 restart isf-site 2>&1 | tee -a "$LOG_FILE" || error "Falha ao reiniciar isf-site."
  fi
else
  warn "PM2 não encontrado. Pulando verificação da aplicação."
fi

# Certbot timer / cron
if systemctl is-active --quiet certbot.timer 2>/dev/null; then
  success "Certbot timer ativo (renovação automática OK)."
elif systemctl list-timers --all 2>/dev/null | grep -q certbot; then
  success "Certbot timer encontrado."
elif crontab -l 2>/dev/null | grep -q certbot; then
  success "Certbot configurado via cron."
else
  warn "Nenhuma renovação automática de SSL detectada (certbot.timer ou cron)."
fi

# Containers LXD: apenas reporta, nunca age. Um container pode estar parado de
# propósito, então isso é aviso e não erro — e a manutenção não tenta iniciar
# nem parar nada. Não usa lista fixa de nomes: qualquer container novo passa a
# ser verificado sozinho. /snap/bin não está no PATH de shell não-interativo,
# daí procurar o caminho explícito.
LXC_BIN=""
for candidato in lxc /snap/bin/lxc; do
  command -v "$candidato" &>/dev/null && { LXC_BIN="$candidato"; break; }
done

CONTAINERS_PARADOS=""
if [ -n "$LXC_BIN" ]; then
  while IFS=, read -r c_nome c_estado; do
    [ -z "$c_nome" ] && continue
    if [ "$c_estado" = "RUNNING" ]; then
      success "Container $c_nome está rodando."
    else
      warn "Container $c_nome está em estado '$c_estado'."
      CONTAINERS_PARADOS="$CONTAINERS_PARADOS $c_nome($c_estado)"
    fi
  done < <("$LXC_BIN" list --format csv -c ns 2>/dev/null)
else
  log "LXD não encontrado. Pulando verificação de containers."
fi

# ---------------------------------------------------------------------------
# 3.1 Frescor dos backups
#
# O script antes só olhava o TAMANHO do log de backup, para truncar — nunca se
# o backup tinha acontecido. Foi assim que cinco meses sem backup passaram sem
# ninguém notar. Agora lê a marca que cada script de backup escreve apenas
# após verificar o próprio resultado, e trata atraso como ERRO, não aviso.
# ---------------------------------------------------------------------------
section "[3.1/9] Frescor dos backups"

BACKUPS_ATRASADOS=""

check_backup_freshness() {
  local nome="$1" stamp="$2" max_dias="$3"

  if [ ! -f "$stamp" ]; then
    error "Backup '$nome': nunca registrou uma execução verificada ($stamp ausente)."
    BACKUPS_ATRASADOS="$BACKUPS_ATRASADOS $nome(sem registro)"
    return
  fi

  local idade_dias=$(( ( $(date +%s) - $(stat -c %Y "$stamp") ) / 86400 ))
  if [ "$idade_dias" -gt "$max_dias" ]; then
    error "Backup '$nome': último sucesso há ${idade_dias} dias (limite: ${max_dias})."
    BACKUPS_ATRASADOS="$BACKUPS_ATRASADOS $nome(${idade_dias}d)"
  else
    success "Backup '$nome': último sucesso há ${idade_dias} dia(s)."
  fi
}

check_backup_freshness "site" "/var/lib/isf-backups/site.last-success" 2

# ---------------------------------------------------------------------------
# 4. Verificação do SSL
# ---------------------------------------------------------------------------
section "[4/9] Verificação dos certificados SSL"

if command -v certbot &>/dev/null; then
  # Extrai a data de expiração de cada certificado
  certbot certificates 2>/dev/null | tee -a "$LOG_FILE" | grep -E "Domains:|Expiry Date:" | while read -r line; do
    log "  $line"
  done

  # Verifica se algum certificado expira em menos de CERT_WARN_DAYS dias
  EXPIRY_DATES=$(certbot certificates 2>/dev/null | grep "Expiry Date:" | grep -oP '\d{4}-\d{2}-\d{2}' || true)
  TODAY_EPOCH=$(date +%s)
  WARNED=0
  while IFS= read -r expiry; do
    if [ -n "$expiry" ]; then
      EXPIRY_EPOCH=$(date -d "$expiry" +%s 2>/dev/null || echo 0)
      DAYS_LEFT=$(( (EXPIRY_EPOCH - TODAY_EPOCH) / 86400 ))
      if [ "$DAYS_LEFT" -lt "$CERT_WARN_DAYS" ]; then
        warn "Certificado expira em ${DAYS_LEFT} dias ($expiry) — abaixo do limite de ${CERT_WARN_DAYS} dias!"
        WARNED=1
      else
        success "Certificado válido por mais ${DAYS_LEFT} dias ($expiry)."
      fi
    fi
  done <<< "$EXPIRY_DATES"
  [ "$WARNED" -eq 0 ] && [ -z "$EXPIRY_DATES" ] && warn "Nenhum certificado encontrado via certbot."
else
  warn "certbot não instalado. Pulando verificação de SSL."
fi

# ---------------------------------------------------------------------------
# 5. Limpeza de logs
# ---------------------------------------------------------------------------
section "[5/9] Limpeza de logs"

# Journalctl: mantém apenas 30 dias
log "Limpando journal (mantendo 30 dias)..."
journalctl --vacuum-time=30d 2>&1 | tee -a "$LOG_FILE" || true
success "Journal limpo."

# PM2 logs > 50MB: trunca
if [ -d "/var/log/pm2" ]; then
  find /var/log/pm2 -type f -name "*.log" | while read -r pmlog; do
    SIZE=$(du -m "$pmlog" 2>/dev/null | cut -f1)
    if [ "${SIZE:-0}" -ge 50 ]; then
      warn "PM2 log grande detectado: $pmlog (${SIZE}MB). Truncando..."
      > "$pmlog"
    fi
  done
  success "Logs PM2 verificados."
fi

# Log de backup > 5MB: trunca para não crescer indefinidamente
BACKUP_LOG="/var/log/isf-backup.log"
if [ -f "$BACKUP_LOG" ]; then
  SIZE=$(du -m "$BACKUP_LOG" | cut -f1)
  if [ "${SIZE:-0}" -ge 5 ]; then
    warn "Log de backup grande (${SIZE}MB). Truncando $BACKUP_LOG..."
    > "$BACKUP_LOG"
  else
    success "Log de backup OK (${SIZE}MB)."
  fi
fi

# /tmp: remove arquivos com mais de 7 dias
find /tmp -type f -atime +7 -delete 2>/dev/null || true
success "Arquivos antigos de /tmp removidos."

# ---------------------------------------------------------------------------
# 6. Limpeza do cache Nginx
# ---------------------------------------------------------------------------
section "[6/9] Limpeza do cache Nginx"

NGINX_CACHE="/var/cache/nginx/isf"
if [ -d "$NGINX_CACHE" ]; then
  REMOVED=$(find "$NGINX_CACHE" -type f -mtime +1 -delete -print 2>/dev/null | wc -l)
  success "Cache Nginx: $REMOVED entradas antigas removidas (> 1 dia)."
else
  log "Diretório de cache Nginx não encontrado ($NGINX_CACHE). Pulando."
fi

# ---------------------------------------------------------------------------
# 7. Verificação de segurança
# ---------------------------------------------------------------------------
section "[7/9] Verificação de segurança (SSH)"

# Tenta com a unit "ssh" e fallback para "sshd"
SSH_UNIT="ssh"
if ! journalctl -u ssh --since "7 days ago" --no-pager -q &>/dev/null; then
  SSH_UNIT="sshd"
fi

FAILED_COUNT=$(journalctl -u "$SSH_UNIT" --since "7 days ago" --no-pager -q 2>/dev/null \
  | grep -c "Failed password" || true)

log "Tentativas de login SSH com falha (últimos 7 dias): $FAILED_COUNT"
if [ "$FAILED_COUNT" -gt 100 ]; then
  warn "Alto volume de tentativas de login SSH: $FAILED_COUNT."
fi

TOP_OFFENDERS=$(journalctl -u "$SSH_UNIT" --since "7 days ago" --no-pager -q 2>/dev/null \
  | grep "Failed password" \
  | grep -oP 'from \K[\d.]+' \
  | sort | uniq -c | sort -rn | head -"$SSH_TOP_N" || true)

log "Top $SSH_TOP_N IPs com falha de autenticação:"
if [ -n "$TOP_OFFENDERS" ]; then
  log "$TOP_OFFENDERS"
else
  log "  (nenhum ou comando não disponível)"
fi

# Confere se os IPs mais agressivos (>= SSH_DANGER_THRESHOLD falhas) já estão
# banidos pelo fail2ban, em qualquer jail ativo — não só o sshd.
UNBANNED_OFFENDERS="não verificado (fail2ban ausente/inativo)"
if command -v fail2ban-client &>/dev/null && systemctl is-active --quiet fail2ban 2>/dev/null; then
  UNBANNED_OFFENDERS=""
  JAILS=$(fail2ban-client status 2>/dev/null | grep "Jail list" | sed 's/.*://' | tr ',' '\n' | tr -d ' ')
  BANNED_IPS=""
  for jail in $JAILS; do
    JAIL_BANNED=$(fail2ban-client status "$jail" 2>/dev/null | grep "Banned IP list:" | sed 's/.*Banned IP list://')
    BANNED_IPS="$BANNED_IPS $JAIL_BANNED"
  done

  if [ -n "$TOP_OFFENDERS" ]; then
    while read -r count ip; do
      [ -z "$ip" ] && continue
      if [ "$count" -ge "$SSH_DANGER_THRESHOLD" ]; then
        if echo "$BANNED_IPS" | grep -qw "$ip"; then
          log "  -> $ip ($count tentativas): banido"
        else
          warn "IP perigoso NÃO banido pelo fail2ban: $ip ($count tentativas nos últimos 7 dias)."
          UNBANNED_OFFENDERS="$UNBANNED_OFFENDERS $ip($count)"
        fi
      fi
    done <<< "$TOP_OFFENDERS"
  fi

  if [ -z "$UNBANNED_OFFENDERS" ]; then
    success "Todos os IPs mais agressivos (>= $SSH_DANGER_THRESHOLD tentativas) já estão banidos pelo fail2ban."
  fi
else
  warn "fail2ban não encontrado ou inativo. Não foi possível verificar se os IPs mais agressivos estão banidos."
fi

success "Verificação de segurança concluída."

# ---------------------------------------------------------------------------
# 8. Integridade do banco de dados
# ---------------------------------------------------------------------------
section "[8/9] Integridade do banco de dados SQLite"

if [ -f "$DB_PATH" ]; then
  if command -v sqlite3 &>/dev/null; then
    INTEGRITY=$(sqlite3 "$DB_PATH" "PRAGMA integrity_check;" 2>&1)
    log "Resultado: $INTEGRITY"
    if [ "$INTEGRITY" = "ok" ]; then
      success "Banco de dados íntegro."
    else
      error "Falha na integridade do banco! Resultado: $INTEGRITY"
    fi
  else
    warn "sqlite3 não instalado. Pulando verificação de integridade."
  fi
else
  warn "Banco não encontrado em $DB_PATH. Pulando."
fi

# ---------------------------------------------------------------------------
# 9. Relatório final + upload para Google Drive
# ---------------------------------------------------------------------------
section "[9/9] Relatório final"

log ""
log "========================================"
log "  Resumo da manutenção"
log "  Data: $(date '+%Y-%m-%d %H:%M:%S')"
log "  Avisos:  $WARNINGS"
log "  Erros:   $ERRORS"

if [ "$ERRORS" -gt 0 ]; then
  log "  Status:  FALHA (${ERRORS} erro(s) encontrado(s))"
elif [ "$WARNINGS" -gt 0 ]; then
  log "  Status:  ATENÇÃO (${WARNINGS} aviso(s))"
else
  log "  Status:  SUCESSO"
fi
log "  Log:     $LOG_FILE"
log "========================================"

# Upload do log de hoje para o Google Drive
if command -v rclone &>/dev/null; then
  if rclone lsd "$RCLONE_REMOTE:" &>/dev/null 2>&1; then
    GDRIVE_LOG_NAME="maintenance_${DATE}.log"
    log ""
    log "Enviando log para $RCLONE_REMOTE:$GDRIVE_FOLDER/$GDRIVE_LOG_NAME ..."

    # Cria um snapshot do log atual (o log ainda pode crescer durante o upload)
    SNAPSHOT=$(mktemp)
    cp "$LOG_FILE" "$SNAPSHOT"

    rclone copyto "$SNAPSHOT" "$RCLONE_REMOTE:$GDRIVE_FOLDER/$GDRIVE_LOG_NAME" \
      --log-file="$LOG_FILE" \
      --log-level WARNING 2>/dev/null || warn "Falha ao enviar log para o Google Drive."

    rm -f "$SNAPSHOT"
    success "Log enviado para $RCLONE_REMOTE:$GDRIVE_FOLDER/$GDRIVE_LOG_NAME"

    # Limpeza de logs antigos no Google Drive (> GDRIVE_RETENTION dias)
    log "Removendo logs com mais de ${GDRIVE_RETENTION} dias no Google Drive..."
    CUTOFF_EPOCH=$(date -d "${GDRIVE_RETENTION} days ago" +%s)

    rclone lsf "$RCLONE_REMOTE:$GDRIVE_FOLDER/" 2>/dev/null \
      | grep "^maintenance_" \
      | sed 's/.log$//' \
      | while read -r fname; do
          LOG_DATE="${fname#maintenance_}"
          LOG_EPOCH=$(date -d "$LOG_DATE" +%s 2>/dev/null || echo 0)
          if [ "$LOG_EPOCH" -gt 0 ] && [ "$LOG_EPOCH" -lt "$CUTOFF_EPOCH" ]; then
            log "  -> Removendo: ${fname}.log"
            rclone deletefile "$RCLONE_REMOTE:$GDRIVE_FOLDER/${fname}.log" 2>/dev/null || true
          fi
        done
    success "Limpeza de logs antigos no Google Drive concluída."
  else
    warn "Remote '$RCLONE_REMOTE' não acessível. Log NÃO enviado para o Google Drive."
  fi
else
  warn "rclone não instalado. Log NÃO enviado para o Google Drive."
fi

# ---------------------------------------------------------------------------
# Envio do relatório por e-mail (reaproveita o Resend já usado no formulário
# de contato — RESEND_API_KEY já configurado em .env)
# ---------------------------------------------------------------------------
log ""
log "Enviando relatório por e-mail..."

# MAINTENANCE_EMAIL é opcional em .env; por padrão usa o mesmo CONTACT_EMAIL
# que já recebe os leads do site.
MAINTENANCE_EMAIL_TO="${MAINTENANCE_EMAIL:-${CONTACT_EMAIL:-}}"

WARN_LIST_JOINED=""
[ "${#WARNING_MESSAGES[@]}" -gt 0 ] && WARN_LIST_JOINED=$(printf '%s\n' "${WARNING_MESSAGES[@]}")
ERROR_LIST_JOINED=""
[ "${#ERROR_MESSAGES[@]}" -gt 0 ] && ERROR_LIST_JOINED=$(printf '%s\n' "${ERROR_MESSAGES[@]}")

if [ -z "${RESEND_API_KEY:-}" ] || [ -z "$MAINTENANCE_EMAIL_TO" ]; then
  warn "RESEND_API_KEY ou e-mail de destino (MAINTENANCE_EMAIL/CONTACT_EMAIL) não configurado em .env. Relatório não enviado por e-mail."
elif ! command -v python3 &>/dev/null; then
  warn "python3 não encontrado. Relatório não enviado por e-mail."
else
  if [ "$ERRORS" -gt 0 ]; then
    STATUS_LABEL="FALHA"
  elif [ "$WARNINGS" -gt 0 ]; then
    STATUS_LABEL="ATENÇÃO"
  else
    STATUS_LABEL="SUCESSO"
  fi

  if RESEND_API_KEY="$RESEND_API_KEY" \
     RESEND_FROM="${RESEND_FROM:-ISF Site <onboarding@resend.dev>}" \
     MAIL_TO="$MAINTENANCE_EMAIL_TO" \
     MAIL_SUBJECT="Manutenção ISF — $STATUS_LABEL — $DATE ($WARNINGS aviso(s), $ERRORS erro(s))" \
     LOG_PATH="$LOG_FILE" \
     LOG_DATE="$DATE" \
     SM_STATUS="$STATUS_LABEL" \
     SM_WARNINGS="$WARNINGS" \
     SM_ERRORS="$ERRORS" \
     SM_DISK="${DISK_USAGE}%" \
     SM_MEM="${MEM_USAGE}%" \
     SM_LOAD="${LOAD_1MIN} (${CPU_CORES} cores)" \
     SM_APP="$APP_STATUS" \
     SM_REBOOT="$REBOOT_PENDING" \
     SM_SSH_FAILED="$FAILED_COUNT" \
     SM_SSH_UNBANNED="${UNBANNED_OFFENDERS:-nenhum}" \
     SM_DB="${INTEGRITY:-não verificado}" \
     SM_BACKUPS="${BACKUPS_ATRASADOS:-em dia}" \
     SM_CONTAINERS="${CONTAINERS_PARADOS:-todos rodando}" \
     SM_WARN_LIST="$WARN_LIST_JOINED" \
     SM_ERROR_LIST="$ERROR_LIST_JOINED" \
     python3 <<'PYEOF'
import base64
import json
import os
import urllib.error
import urllib.request

log_path = os.environ["LOG_PATH"]
with open(log_path, "r", errors="replace") as f:
    full_text = f.read()

# Mantém no anexo só a execução mais recente, não o log acumulado inteiro.
marker = "Manutenção ISF Segurança — início"
idx = full_text.rfind(marker)
if idx != -1:
    start = full_text.rfind("========================================", 0, idx)
    run_text = full_text[start if start != -1 else idx:]
else:
    run_text = full_text

status = os.environ["SM_STATUS"]
status_color = {"SUCESSO": "#16a34a", "ATENÇÃO": "#d97706", "FALHA": "#dc2626"}.get(status, "#374151")

rows = [
    ("Status", status),
    ("Avisos / Erros", f"{os.environ['SM_WARNINGS']} / {os.environ['SM_ERRORS']}"),
    ("Disco (/)", os.environ["SM_DISK"]),
    ("Memória", os.environ["SM_MEM"]),
    ("CPU load (1 min)", os.environ["SM_LOAD"]),
    ("App isf-site (PM2)", os.environ["SM_APP"]),
    ("Containers", os.environ["SM_CONTAINERS"]),
    ("Backups", os.environ["SM_BACKUPS"]),
    ("Reboot pendente", os.environ["SM_REBOOT"]),
    ("Falhas de login SSH (7d)", os.environ["SM_SSH_FAILED"]),
    ("IPs perigosos não banidos", os.environ["SM_SSH_UNBANNED"]),
    ("Integridade do banco", os.environ["SM_DB"]),
]
def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

rows_html = "".join(
    f"<tr><td style='padding:6px 12px;color:#6b7280;border-bottom:1px solid #f0f0f0;'>{esc(label)}</td>"
    f"<td style='padding:6px 12px;color:#1a1d20;font-weight:600;border-bottom:1px solid #f0f0f0;'>{esc(value)}</td></tr>"
    for label, value in rows
)

def build_list(title, color, raw_env_value):
    items = [m for m in raw_env_value.split("\n") if m.strip()]
    if not items:
        return ""
    li = "".join(f"<li style='margin-bottom:4px;'>{esc(m)}</li>" for m in items)
    return (
        f"<div style='margin-top:16px;'>"
        f"<strong style='color:{color};'>{title}:</strong>"
        f"<ul style='margin:6px 0 0;padding-left:20px;color:#1a1d20;font-size:0.85rem;'>{li}</ul>"
        f"</div>"
    )

details_html = build_list("Erros", "#dc2626", os.environ.get("SM_ERROR_LIST", ""))
details_html += build_list("Avisos", "#d97706", os.environ.get("SM_WARN_LIST", ""))

html = f"""
<div style="font-family:Arial,sans-serif;">
  <h2 style="margin:0 0 4px;color:{status_color};">Manutenção ISF — {status}</h2>
  <p style="margin:0 0 16px;color:#6b7280;font-size:0.9rem;">{os.environ['LOG_DATE']}</p>
  <table style="border-collapse:collapse;font-size:0.9rem;">{rows_html}</table>
  {details_html}
  <p style="margin:20px 0 0;color:#6b7280;font-size:0.85rem;">Log completo desta execução em anexo.</p>
</div>
"""

attachment_content = base64.b64encode(run_text.encode("utf-8")).decode("ascii")

payload = json.dumps({
    "from": os.environ["RESEND_FROM"],
    "to": os.environ["MAIL_TO"],
    "subject": os.environ["MAIL_SUBJECT"],
    "html": html,
    "attachments": [{
        "filename": f"maintenance_{os.environ['LOG_DATE']}.log",
        "content": attachment_content,
    }],
}).encode("utf-8")

req = urllib.request.Request(
    "https://api.resend.com/emails",
    data=payload,
    method="POST",
    headers={
        "Authorization": f"Bearer {os.environ['RESEND_API_KEY']}",
        "Content-Type": "application/json",
        # O User-Agent padrão do urllib ("Python-urllib/3.x") é bloqueado
        # pelo WAF (Cloudflare error 1010, "browser signature banned").
        "User-Agent": "isf-maintenance-script/1.0",
    },
)
try:
    with urllib.request.urlopen(req, timeout=15) as resp:
        resp.read()
        raise SystemExit(0 if resp.status < 300 else 1)
except urllib.error.HTTPError as e:
    body = e.read().decode(errors="replace")
    print(f"Erro ao enviar e-mail: HTTP {e.code} {e.reason} — {body}")
    raise SystemExit(1)
except Exception as e:
    print(f"Erro ao enviar e-mail: {e}")
    raise SystemExit(1)
PYEOF
  then
    success "Relatório enviado por e-mail para $MAINTENANCE_EMAIL_TO."
  else
    warn "Falha ao enviar relatório por e-mail."
  fi
fi

# Erro na manutenção conta como falha para o monitor externo: o relatório pode
# até chegar por e-mail, mas se algo estiver quebrado o alerta não depende de
# alguém ter lido o e-mail.
if [ "$ERRORS" -gt 0 ]; then
  hc_ping "/fail"
else
  hc_ping
fi

log ""
log "Manutenção finalizada."
