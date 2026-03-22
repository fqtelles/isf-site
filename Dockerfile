FROM node:20-alpine

# OpenSSL necessário para Prisma
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Instalar dependências primeiro (cache layer)
COPY package.json package-lock.json* ./
COPY prisma ./prisma

RUN npm ci
RUN npx prisma generate

# Copiar código fonte
COPY . .

# Build de produção
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# DATABASE_URL aponta para o banco seed durante o build; em runtime o entrypoint
# sobrescreve para /data/dev.db (volume persistente)
ENV DATABASE_URL="file:/app/prisma/dev.db"

RUN npm run build

# Entrypoint
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

ENTRYPOINT ["./entrypoint.sh"]
