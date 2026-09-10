#!/bin/bash
# =============================================================================
# backup-to-gdrive.sh — Backup automático do site ISF Segurança para Google Drive
# Faz backup do banco SQLite, pasta public/ e configs, e envia via rclone.
#
# Uso manual:  sudo bash /var/www/isf-site/scripts/backup-to-gdrive.sh
# Via cron:    configurado automaticamente pelo setup-backup.sh
# =============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# Configurações
# ---------------------------------------------------------------------------
APP_DIR="/var/www/isf-site"
BACKUP_TMP="/var/backups/isf-gdrive"
DB_PATH="$APP_DIR/prisma/dev.db"
PUBLIC_DIR="$APP_DIR/public"
LOG_FILE="/var/log/isf-backup.log"
# Remote criptografado: o backup inclui o .env (ADMIN_PASSWORD, ADMIN_SECRET,
# RESEND_API_KEY) e o banco (dados pessoais dos leads do site). "gdrive" segue
# existindo no rclone.conf só para o restore ler os backups antigos.
RCLONE_REMOTE="gdrive-crypt"
GDRIVE_FOLDER="ISF-Backups"
RETENTION_DAYS=30

# Marca de último backup verificado. É o que o maintenance.sh usa para saber se
# os backups estão realmente acontecendo — só é escrita após a verificação.
SUCCESS_STAMP="/var/lib/isf-backups/site.last-success"

TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_DIR="$BACKUP_TMP/$TIMESTAMP"

# ---------------------------------------------------------------------------
# Funções auxiliares
# ---------------------------------------------------------------------------
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Dead-man switch: um monitor externo espera um ping a cada execução. Se o ping
# não chegar — cron parado, VPS fora do ar, script morto no meio — o alerta vem
# de fora. Nenhuma verificação rodando dentro da VPS cobre esses casos, porque
# quem avisaria é justamente o que não está rodando.
# A URL fica em HEALTHCHECK_SITE_BACKUP_URL no .env; sem ela, isso é inerte.
if [ -f "$APP_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1090
  source "$APP_DIR/.env"
  set +a
fi

hc_ping() {
  [ -n "${HEALTHCHECK_SITE_BACKUP_URL:-}" ] || return 0
  # Nunca deixa o monitoramento derrubar o backup: falha de ping é ignorada.
  curl -fsS -m 10 --retry 3 -o /dev/null "${HEALTHCHECK_SITE_BACKUP_URL}${1:-}" || true
}

cleanup() {
  local rc=$?
  if [ -d "$BACKUP_DIR" ]; then
    rm -rf "$BACKUP_DIR"
    log "Pasta temporária removida: $BACKUP_DIR"
  fi
  # Qualquer saída diferente de zero — inclusive morte no meio por set -e —
  # avisa o monitor. O ping de sucesso é enviado explicitamente no fim.
  if [ "$rc" -ne 0 ]; then
    hc_ping "/fail"
  fi
}
trap cleanup EXIT

hc_ping "/start"

# ---------------------------------------------------------------------------
# Início
# ---------------------------------------------------------------------------
log "========================================"
log "  Backup ISF Segurança — início"
log "========================================"

mkdir -p "$BACKUP_DIR"

# ---------------------------------------------------------------------------
# 1. Backup do banco de dados SQLite (seguro para DB em uso)
# ---------------------------------------------------------------------------
log "[1/5] Fazendo backup do banco de dados..."

if [ -f "$DB_PATH" ]; then
  nice -n 19 sqlite3 "$DB_PATH" ".backup '$BACKUP_DIR/database.sqlite'"
  log "  -> Banco salvo: database.sqlite ($(du -h "$BACKUP_DIR/database.sqlite" | cut -f1))"
else
  log "  -> AVISO: Banco não encontrado em $DB_PATH. Pulando."
fi

# Copia também o WAL/SHM se existirem (para referência, o .backup já inclui tudo)
for ext in "-wal" "-shm"; do
  if [ -f "${DB_PATH}${ext}" ]; then
    cp "${DB_PATH}${ext}" "$BACKUP_DIR/database${ext}"
  fi
done

# ---------------------------------------------------------------------------
# 2. Backup da pasta public/ (uploads, imagens, favicons, etc.)
# ---------------------------------------------------------------------------
log "[2/5] Compactando pasta public/..."

if [ -d "$PUBLIC_DIR" ]; then
  nice -n 19 ionice -c3 tar -czf "$BACKUP_DIR/public.tar.gz" -C "$APP_DIR" public/
  log "  -> public.tar.gz ($(du -h "$BACKUP_DIR/public.tar.gz" | cut -f1))"
else
  log "  -> AVISO: Pasta $PUBLIC_DIR não encontrada. Pulando."
fi

# ---------------------------------------------------------------------------
# 3. Backup de arquivos de configuração
# ---------------------------------------------------------------------------
log "[3/5] Copiando arquivos de configuração..."

CONFIG_DIR="$BACKUP_DIR/config"
mkdir -p "$CONFIG_DIR"

# Lista de arquivos de config importantes
config_files=(
  ".env"
  "prisma/schema.prisma"
  "ecosystem.config.js"
  "next.config.mjs"
  "package.json"
  "package-lock.json"
)

for file in "${config_files[@]}"; do
  src="$APP_DIR/$file"
  if [ -f "$src" ]; then
    mkdir -p "$CONFIG_DIR/$(dirname "$file")"
    cp "$src" "$CONFIG_DIR/$file"
    log "  -> $file"
  fi
done

# Copia pasta nginx/ inteira
if [ -d "$APP_DIR/nginx" ]; then
  cp -r "$APP_DIR/nginx" "$CONFIG_DIR/nginx"
  log "  -> nginx/"
fi

# Compacta configs
nice -n 19 tar -czf "$BACKUP_DIR/config.tar.gz" -C "$BACKUP_DIR" config/
rm -rf "$CONFIG_DIR"
log "  -> config.tar.gz ($(du -h "$BACKUP_DIR/config.tar.gz" | cut -f1))"

# ---------------------------------------------------------------------------
# 4. Upload para Google Drive via rclone
# ---------------------------------------------------------------------------
log "[4/5] Enviando para Google Drive ($RCLONE_REMOTE:$GDRIVE_FOLDER/$TIMESTAMP/)..."

if ! command -v rclone &> /dev/null; then
  log "  -> ERRO: rclone não instalado. Execute setup-backup.sh primeiro."
  exit 1
fi

if ! rclone lsd "$RCLONE_REMOTE:" &> /dev/null; then
  log "  -> ERRO: Remote '$RCLONE_REMOTE' não configurado. Veja as instruções de criação no final de scripts/backup-containers.sh."
  exit 1
fi

nice -n 19 rclone copy "$BACKUP_DIR/" "$RCLONE_REMOTE:$GDRIVE_FOLDER/$TIMESTAMP/" \
  --progress \
  --log-file="$LOG_FILE" \
  --log-level INFO

log "  -> Upload concluído!"

# ---------------------------------------------------------------------------
# Verificação do que subiu
#
# As etapas acima apenas AVISAM e seguem quando não encontram o banco ou a
# pasta public/. Sem esta verificação, um backup vazio seria considerado bom e
# a limpeza abaixo continuaria apagando os backups antigos que ainda prestavam
# — em 30 dias, nenhuma cópia aproveitável, silenciosamente.
# ---------------------------------------------------------------------------
BACKUP_VERIFICADO=1

for artefato in database.sqlite public.tar.gz config.tar.gz; do
  if [ ! -f "$BACKUP_DIR/$artefato" ]; then
    log "  -> ERRO: $artefato não foi gerado neste backup."
    BACKUP_VERIFICADO=0
  fi
done

# Confirma que o que existe localmente chegou íntegro ao destino
if [ "$BACKUP_VERIFICADO" -eq 1 ]; then
  if rclone check "$BACKUP_DIR/" "$RCLONE_REMOTE:$GDRIVE_FOLDER/$TIMESTAMP/" --one-way 2>&1 | tail -3 | tee -a "$LOG_FILE" | grep -q "0 differences found"; then
    log "  -> Verificação OK: destino confere com a origem."
  else
    log "  -> ERRO: destino não confere com a origem."
    BACKUP_VERIFICADO=0
  fi
fi

if [ "$BACKUP_VERIFICADO" -eq 1 ]; then
  mkdir -p "$(dirname "$SUCCESS_STAMP")"
  date '+%Y-%m-%d %H:%M:%S' > "$SUCCESS_STAMP"
fi

# ---------------------------------------------------------------------------
# 5. Limpeza de backups antigos no Google Drive
# ---------------------------------------------------------------------------
if [ "$BACKUP_VERIFICADO" -ne 1 ]; then
  log "[5/5] Backup NÃO verificado — limpeza cancelada para preservar os backups antigos."
  log "========================================"
  log "  Backup FALHOU a verificação. Investigue antes da próxima execução."
  log "========================================"
  exit 1
fi

log "[5/5] Removendo backups com mais de ${RETENTION_DAYS} dias no Google Drive..."

rclone lsd "$RCLONE_REMOTE:$GDRIVE_FOLDER/" 2>/dev/null | while read -r _ _ _ folder_name; do
  # Extrai a data do nome da pasta (formato: YYYY-MM-DD_HH-MM-SS)
  folder_date="${folder_name%%_*}-${folder_name#*-}"
  folder_date="${folder_name:0:10}"

  if [ -n "$folder_date" ]; then
    folder_epoch=$(date -d "$folder_date" +%s 2>/dev/null || echo 0)
    cutoff_epoch=$(date -d "$RETENTION_DAYS days ago" +%s)

    if [ "$folder_epoch" -gt 0 ] && [ "$folder_epoch" -lt "$cutoff_epoch" ]; then
      log "  -> Removendo backup antigo: $folder_name"
      rclone purge "$RCLONE_REMOTE:$GDRIVE_FOLDER/$folder_name/" 2>/dev/null || true
    fi
  fi
done

# ---------------------------------------------------------------------------
# Resumo
# ---------------------------------------------------------------------------
hc_ping

TOTAL_SIZE=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)
log "========================================"
log "  Backup concluído! Tamanho total: $TOTAL_SIZE"
log "  Destino: $RCLONE_REMOTE:$GDRIVE_FOLDER/$TIMESTAMP/"
log "========================================"
