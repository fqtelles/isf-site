#!/bin/bash
# =============================================================================
# restore-from-gdrive.sh — Restauração de backup do Google Drive
# Uso: sudo bash /var/www/isf-site/scripts/restore-from-gdrive.sh
# =============================================================================

set -euo pipefail

APP_DIR="/var/www/isf-site"
RESTORE_TMP="/var/backups/isf-restore"
RCLONE_REMOTE="gdrive"
GDRIVE_FOLDER="ISF-Backups"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # Sem cor

log()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✗]${NC} $1"; }
info() { echo -e "${CYAN}[i]${NC} $1"; }

# ---------------------------------------------------------------------------
# Verificações iniciais
# ---------------------------------------------------------------------------
echo ""
echo "========================================"
echo "  Restauração — ISF Segurança"
echo "========================================"
echo ""

if ! command -v rclone &> /dev/null; then
  err "rclone não instalado. Execute setup-backup.sh primeiro."
  exit 1
fi

if ! rclone lsd "$RCLONE_REMOTE:" &> /dev/null; then
  err "Remote '$RCLONE_REMOTE' não configurado. Execute setup-backup.sh primeiro."
  exit 1
fi

# ---------------------------------------------------------------------------
# 1. Listar backups disponíveis
# ---------------------------------------------------------------------------
info "Buscando backups disponíveis no Google Drive..."
echo ""

BACKUPS=$(rclone lsd "$RCLONE_REMOTE:$GDRIVE_FOLDER/" 2>/dev/null | awk '{print $NF}' | sort -r)

if [ -z "$BACKUPS" ]; then
  err "Nenhum backup encontrado em $RCLONE_REMOTE:$GDRIVE_FOLDER/"
  exit 1
fi

echo "  Backups disponíveis:"
echo "  ────────────────────"
i=1
declare -a BACKUP_LIST
while IFS= read -r backup; do
  BACKUP_LIST+=("$backup")
  echo "  $i) $backup"
  i=$((i + 1))
done <<< "$BACKUPS"
echo ""

# ---------------------------------------------------------------------------
# 2. Selecionar backup
# ---------------------------------------------------------------------------
read -p "  Escolha o número do backup (ou 'q' para sair): " CHOICE

if [ "$CHOICE" = "q" ] || [ "$CHOICE" = "Q" ]; then
  echo "Cancelado."
  exit 0
fi

if ! [[ "$CHOICE" =~ ^[0-9]+$ ]] || [ "$CHOICE" -lt 1 ] || [ "$CHOICE" -gt ${#BACKUP_LIST[@]} ]; then
  err "Opção inválida."
  exit 1
fi

SELECTED="${BACKUP_LIST[$((CHOICE - 1))]}"
echo ""
info "Backup selecionado: $SELECTED"

# ---------------------------------------------------------------------------
# 3. Escolher o que restaurar
# ---------------------------------------------------------------------------
echo ""
echo "  O que deseja restaurar?"
echo "  ───────────────────────"
echo "  1) Tudo (banco + public/ + configs)"
echo "  2) Apenas o banco de dados"
echo "  3) Apenas a pasta public/ (imagens e arquivos)"
echo "  4) Apenas os arquivos de configuração"
echo ""
read -p "  Escolha (1-4): " RESTORE_CHOICE

RESTORE_DB=false
RESTORE_PUBLIC=false
RESTORE_CONFIG=false

case $RESTORE_CHOICE in
  1) RESTORE_DB=true; RESTORE_PUBLIC=true; RESTORE_CONFIG=true ;;
  2) RESTORE_DB=true ;;
  3) RESTORE_PUBLIC=true ;;
  4) RESTORE_CONFIG=true ;;
  *) err "Opção inválida."; exit 1 ;;
esac

# ---------------------------------------------------------------------------
# 4. Confirmação
# ---------------------------------------------------------------------------
echo ""
warn "ATENÇÃO: Isso vai sobrescrever dados atuais na VPS."
echo "  Backup: $SELECTED"
echo "  Restaurar: banco=$RESTORE_DB | public=$RESTORE_PUBLIC | config=$RESTORE_CONFIG"
echo ""
read -p "  Tem certeza? (s/N): " CONFIRM

if [ "$CONFIRM" != "s" ] && [ "$CONFIRM" != "S" ]; then
  echo "Cancelado."
  exit 0
fi

# ---------------------------------------------------------------------------
# 5. Baixar backup do Google Drive
# ---------------------------------------------------------------------------
echo ""
RESTORE_DIR="$RESTORE_TMP/$SELECTED"
mkdir -p "$RESTORE_DIR"

info "Baixando backup do Google Drive..."
rclone copy "$RCLONE_REMOTE:$GDRIVE_FOLDER/$SELECTED/" "$RESTORE_DIR/" --progress
log "Download concluído."

# ---------------------------------------------------------------------------
# 6. Parar a aplicação
# ---------------------------------------------------------------------------
echo ""
info "Parando a aplicação..."
pm2 stop isf-site 2>/dev/null || warn "PM2: app já estava parada ou PM2 não encontrado."
log "Aplicação parada."

# ---------------------------------------------------------------------------
# 7. Restaurar banco de dados
# ---------------------------------------------------------------------------
if [ "$RESTORE_DB" = true ]; then
  echo ""
  info "Restaurando banco de dados..."

  if [ -f "$RESTORE_DIR/database.sqlite" ]; then
    # Backup de segurança do banco atual
    if [ -f "$APP_DIR/prisma/dev.db" ]; then
      cp "$APP_DIR/prisma/dev.db" "$APP_DIR/prisma/dev.db.antes-restore"
      info "  Banco atual salvo em dev.db.antes-restore"
    fi

    cp "$RESTORE_DIR/database.sqlite" "$APP_DIR/prisma/dev.db"
    log "  Banco de dados restaurado."
  else
    warn "  database.sqlite não encontrado no backup. Pulando."
  fi
fi

# ---------------------------------------------------------------------------
# 8. Restaurar pasta public/
# ---------------------------------------------------------------------------
if [ "$RESTORE_PUBLIC" = true ]; then
  echo ""
  info "Restaurando pasta public/..."

  if [ -f "$RESTORE_DIR/public.tar.gz" ]; then
    # Backup de segurança da pasta atual
    if [ -d "$APP_DIR/public" ]; then
      mv "$APP_DIR/public" "$APP_DIR/public.antes-restore"
      info "  Pasta atual salva em public.antes-restore/"
    fi

    tar -xzf "$RESTORE_DIR/public.tar.gz" -C "$APP_DIR/"
    log "  Pasta public/ restaurada."
  else
    warn "  public.tar.gz não encontrado no backup. Pulando."
  fi
fi

# ---------------------------------------------------------------------------
# 9. Restaurar configs
# ---------------------------------------------------------------------------
if [ "$RESTORE_CONFIG" = true ]; then
  echo ""
  info "Restaurando arquivos de configuração..."

  if [ -f "$RESTORE_DIR/config.tar.gz" ]; then
    tar -xzf "$RESTORE_DIR/config.tar.gz" -C "$RESTORE_DIR/"

    # .env
    if [ -f "$RESTORE_DIR/config/.env" ]; then
      cp "$APP_DIR/.env" "$APP_DIR/.env.antes-restore" 2>/dev/null || true
      cp "$RESTORE_DIR/config/.env" "$APP_DIR/.env"
      log "  .env restaurado"
    fi

    # prisma/schema.prisma
    if [ -f "$RESTORE_DIR/config/prisma/schema.prisma" ]; then
      cp "$RESTORE_DIR/config/prisma/schema.prisma" "$APP_DIR/prisma/schema.prisma"
      log "  prisma/schema.prisma restaurado"
    fi

    # ecosystem.config.js
    if [ -f "$RESTORE_DIR/config/ecosystem.config.js" ]; then
      cp "$RESTORE_DIR/config/ecosystem.config.js" "$APP_DIR/ecosystem.config.js"
      log "  ecosystem.config.js restaurado"
    fi

    # next.config.mjs
    if [ -f "$RESTORE_DIR/config/next.config.mjs" ]; then
      cp "$RESTORE_DIR/config/next.config.mjs" "$APP_DIR/next.config.mjs"
      log "  next.config.mjs restaurado"
    fi

    # nginx/
    if [ -d "$RESTORE_DIR/config/nginx" ]; then
      cp -r "$RESTORE_DIR/config/nginx/" "$APP_DIR/nginx/"
      cp "$APP_DIR/nginx/isf-site.conf" /etc/nginx/sites-available/isf-site 2>/dev/null || true
      nginx -t 2>/dev/null && systemctl reload nginx 2>/dev/null && log "  Nginx recarregado" || warn "  Nginx: não foi possível recarregar"
    fi

    rm -rf "$RESTORE_DIR/config/"
    log "  Configurações restauradas."
  else
    warn "  config.tar.gz não encontrado no backup. Pulando."
  fi
fi

# ---------------------------------------------------------------------------
# 10. Reiniciar a aplicação
# ---------------------------------------------------------------------------
echo ""
info "Reiniciando a aplicação..."
pm2 start isf-site
log "Aplicação reiniciada."

# ---------------------------------------------------------------------------
# 11. Verificação
# ---------------------------------------------------------------------------
echo ""
info "Verificando o site..."
sleep 3

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://isf.com.br 2>/dev/null || echo "000")

if [ "$HTTP_CODE" = "200" ]; then
  log "Site respondendo com HTTP $HTTP_CODE"
else
  warn "Site respondeu com HTTP $HTTP_CODE — verifique os logs: pm2 logs isf-site"
fi

# ---------------------------------------------------------------------------
# Resumo
# ---------------------------------------------------------------------------
echo ""
echo "========================================"
echo "  Restauração concluída!"
echo "========================================"
echo ""
echo "  Backup usado: $SELECTED"
echo ""

if [ "$RESTORE_DB" = true ] && [ -f "$APP_DIR/prisma/dev.db.antes-restore" ]; then
  echo "  Rollback do banco:   cp $APP_DIR/prisma/dev.db.antes-restore $APP_DIR/prisma/dev.db"
fi
if [ "$RESTORE_PUBLIC" = true ] && [ -d "$APP_DIR/public.antes-restore" ]; then
  echo "  Rollback do public:  rm -rf $APP_DIR/public && mv $APP_DIR/public.antes-restore $APP_DIR/public"
fi
if [ "$RESTORE_CONFIG" = true ] && [ -f "$APP_DIR/.env.antes-restore" ]; then
  echo "  Rollback do .env:    cp $APP_DIR/.env.antes-restore $APP_DIR/.env"
fi

echo ""
echo "  Para limpar após confirmar que tudo funciona:"
echo "    rm -f $APP_DIR/prisma/dev.db.antes-restore"
echo "    rm -rf $APP_DIR/public.antes-restore"
echo "    rm -f $APP_DIR/.env.antes-restore"
echo "    rm -rf $RESTORE_DIR"
echo ""
echo "========================================"
