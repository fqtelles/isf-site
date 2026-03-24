#!/bin/bash
# =============================================================================
# deploy.sh — Atualização do site ISF Segurança na VPS
# Executar na VPS sempre que houver uma nova versão na branch main
# =============================================================================

set -e

APP_DIR="/var/www/isf-site"
BRANCH="main"
UPLOADS_DIR="$APP_DIR/public/uploads"
BACKUP_DIR="/var/backups/isf-uploads"

echo "========================================"
echo "  Deploy ISF Segurança"
echo "========================================"

cd "$APP_DIR"

# -----------------------------------------------------------------------------
# PROTEÇÃO DE UPLOADS
# Garante que public/uploads é uma pasta real (nunca symlink) e faz backup.
# -----------------------------------------------------------------------------
echo "[0/5] Protegendo uploads..."

# Se public/uploads for um symlink, converte para pasta real
if [ -L "$UPLOADS_DIR" ]; then
  echo "  -> Symlink detectado em public/uploads. Convertendo para pasta real..."
  LINK_TARGET=$(readlink "$UPLOADS_DIR")
  rm "$UPLOADS_DIR"
  mkdir -p "$UPLOADS_DIR"
  if [ -d "$LINK_TARGET" ] && [ "$(ls -A "$LINK_TARGET" 2>/dev/null)" ]; then
    cp -r "$LINK_TARGET/." "$UPLOADS_DIR/"
    echo "  -> Arquivos copiados de $LINK_TARGET para $UPLOADS_DIR."
  fi
fi

# Garante que a pasta existe como diretório real
mkdir -p "$UPLOADS_DIR"

# Backup das imagens antes de qualquer alteração no código
BACKUP_STAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="$BACKUP_DIR/$BACKUP_STAMP"
if [ "$(ls -A "$UPLOADS_DIR" 2>/dev/null)" ]; then
  mkdir -p "$BACKUP_PATH"
  cp -r "$UPLOADS_DIR/." "$BACKUP_PATH/"
  echo "  -> Backup salvo em $BACKUP_PATH"
  # Mantém apenas os 5 backups mais recentes
  ls -1dt "$BACKUP_DIR"/*/ 2>/dev/null | tail -n +6 | xargs rm -rf 2>/dev/null || true
else
  echo "  -> Nenhum upload encontrado para backup (pasta vazia)."
fi

# -----------------------------------------------------------------------------

echo "[1/5] Atualizando código..."
git fetch origin
# Descarta apenas arquivos auto-gerados que sempre conflitam no pull
git checkout -- package-lock.json prisma/schema.prisma 2>/dev/null || true
git checkout "$BRANCH"
git pull origin "$BRANCH"

# Garante que o git pull não substituiu uploads por symlink ou .gitkeep
if [ -L "$UPLOADS_DIR" ]; then
  echo "  -> git pull criou symlink em public/uploads. Revertendo para pasta real..."
  rm "$UPLOADS_DIR"
  mkdir -p "$UPLOADS_DIR"
  cp -r "$BACKUP_PATH/." "$UPLOADS_DIR/" 2>/dev/null || true
fi

echo "[2/5] Instalando dependências..."
npm ci --omit=dev

echo "[3/5] Atualizando banco de dados..."
npx prisma generate
npx prisma db push --accept-data-loss

echo "[4/5] Build de produção..."
npm run build

echo "[5/5] Reiniciando aplicação..."
pm2 restart isf-site

echo ""
echo "Deploy concluído! pm2 logs isf-site para ver os logs."
