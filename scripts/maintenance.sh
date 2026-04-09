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

TIMESTAMP=$(date '+%Y-%m-%d_%H-%M-%S')
DATE=$(date '+%Y-%m-%d')
WARNINGS=0
ERRORS=0

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
  ((WARNINGS++)) || true
}

error() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERRO: $1" | tee -a "$LOG_FILE"
  ((ERRORS++)) || true
}

section() {
  log ""
  log "------------------------------------------------------------"
  log "  $1"
  log "------------------------------------------------------------"
}

# ---------------------------------------------------------------------------
# Início
# ---------------------------------------------------------------------------
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
  warn "Alto volume de tentativas de login SSH: $FAILED_COUNT. Considere revisar fail2ban."
fi

log "Top 5 IPs com falha de autenticação:"
journalctl -u "$SSH_UNIT" --since "7 days ago" --no-pager -q 2>/dev/null \
  | grep "Failed password" \
  | grep -oP 'from \K[\d.]+' \
  | sort | uniq -c | sort -rn | head -5 \
  | tee -a "$LOG_FILE" || log "  (nenhum ou comando não disponível)"

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

log ""
log "Manutenção finalizada."
