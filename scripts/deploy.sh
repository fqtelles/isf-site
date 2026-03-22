#!/bin/bash
# =============================================================================
# deploy.sh — Atualização do site ISF Segurança na VPS
# Executar na VPS sempre que houver uma nova versão na branch main
# =============================================================================

set -e

APP_DIR="/var/www/isf-site"
BRANCH="main"

echo "========================================"
echo "  Deploy ISF Segurança"
echo "========================================"

cd "$APP_DIR"

echo "[1/5] Atualizando código..."
git fetch origin
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"

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
