#!/bin/sh
set -e

# Diretório de uploads persistentes (volume Railway montado em /data)
DATA_DIR="${DATA_DIR:-/data}"
UPLOADS_DIR="$DATA_DIR/uploads"

echo "==> Preparando diretório de uploads..."
mkdir -p "$UPLOADS_DIR"

# Link da pasta de uploads para o volume persistente
if [ ! -L "/app/public/uploads" ]; then
  echo "==> Linkando uploads para volume persistente..."
  rm -rf /app/public/uploads
  ln -s "$UPLOADS_DIR" /app/public/uploads
fi

echo "==> Aplicando schema no banco de dados..."
npx prisma db push

echo "==> Populando banco de dados se necessário..."
node prisma/seed.js

echo "==> Iniciando Next.js na porta ${PORT:-3000}..."
exec node_modules/.bin/next start -p "${PORT:-3000}" -H 0.0.0.0
