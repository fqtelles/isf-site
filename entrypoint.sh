#!/bin/sh
set -e

# Diretório de dados persistentes (volume Railway montado em /data)
DATA_DIR="${DATA_DIR:-/data}"
DB_PATH="$DATA_DIR/dev.db"
UPLOADS_DIR="$DATA_DIR/uploads"

echo "==> Preparando diretórios persistentes..."
mkdir -p "$DATA_DIR" "$UPLOADS_DIR"

# Primeiro deploy: marca para popular com seed após criar o schema
FIRST_DEPLOY=0
if [ ! -f "$DB_PATH" ]; then
  echo "==> Primeiro deploy detectado: banco será criado e populado."
  FIRST_DEPLOY=1
fi

# Link da pasta de uploads para o volume persistente
if [ ! -L "/app/public/uploads" ]; then
  echo "==> Linkando uploads para volume persistente..."
  rm -rf /app/public/uploads
  ln -s "$UPLOADS_DIR" /app/public/uploads
fi

# Aponta o Prisma para o banco no volume
export DATABASE_URL="file:$DB_PATH"

echo "==> Aplicando migrações do banco..."
npx prisma db push --accept-data-loss

if [ "$FIRST_DEPLOY" = "1" ]; then
  echo "==> Populando banco com dados iniciais (seed)..."
  node prisma/seed.js
fi

echo "==> Iniciando Next.js na porta ${PORT:-3000}..."
exec node_modules/.bin/next start -p "${PORT:-3000}" -H 0.0.0.0
