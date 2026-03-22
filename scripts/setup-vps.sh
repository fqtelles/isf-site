#!/bin/bash
# =============================================================================
# setup-vps.sh — Setup inicial da VPS para o site ISF Segurança
# Executar UMA vez como root (ou com sudo) na VPS Debian/Ubuntu
# =============================================================================

set -e

APP_DIR="/var/www/isf-site"
REPO_URL="https://github.com/fqtelles/isf-site.git"
BRANCH="deploy/vps"
DOMAIN="www.isf.com.br"

echo "========================================"
echo "  Setup ISF Segurança — VPS com Nginx"
echo "========================================"

# --------------------------------------------------------------------------
# 1. Dependências do sistema
# --------------------------------------------------------------------------
echo "[1/9] Instalando dependências do sistema..."
apt-get update -qq
apt-get install -y curl git nginx certbot python3-certbot-nginx openssl

# --------------------------------------------------------------------------
# 2. Node.js 20 via NodeSource
# --------------------------------------------------------------------------
echo "[2/9] Instalando Node.js 20..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi
echo "Node $(node -v) / npm $(npm -v)"

# --------------------------------------------------------------------------
# 3. PM2
# --------------------------------------------------------------------------
echo "[3/9] Instalando PM2..."
npm install -g pm2

# --------------------------------------------------------------------------
# 4. Clonar repositório
# --------------------------------------------------------------------------
echo "[4/9] Clonando repositório na branch $BRANCH..."
mkdir -p /var/www
if [ -d "$APP_DIR" ]; then
    echo "Diretório já existe, atualizando..."
    git -C "$APP_DIR" fetch origin
    git -C "$APP_DIR" checkout "$BRANCH"
    git -C "$APP_DIR" pull origin "$BRANCH"
else
    git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
fi

cd "$APP_DIR"

# --------------------------------------------------------------------------
# 5. Instalar dependências Node
# --------------------------------------------------------------------------
echo "[5/9] Instalando dependências npm..."
npm ci --omit=dev

# --------------------------------------------------------------------------
# 6. Arquivo .env de produção
# --------------------------------------------------------------------------
echo "[6/9] Configurando variáveis de ambiente..."
if [ ! -f "$APP_DIR/.env" ]; then
    echo "ATENÇÃO: crie o arquivo .env em $APP_DIR com as variáveis abaixo:"
    echo "  ADMIN_PASSWORD=<senha-do-admin>"
    echo "  ADMIN_SECRET=<token-secreto>"
    echo ""
    echo "Exemplo:"
    echo "  cp $APP_DIR/.env.production.example $APP_DIR/.env"
    echo "  nano $APP_DIR/.env"
    echo ""
    read -p "Pressione Enter após criar o arquivo .env para continuar..."
fi

# --------------------------------------------------------------------------
# 7. Banco de dados + seed
# --------------------------------------------------------------------------
echo "[7/9] Inicializando banco de dados..."
npx prisma generate
npx prisma db push --accept-data-loss
npm run db:seed

# --------------------------------------------------------------------------
# 8. Build do Next.js
# --------------------------------------------------------------------------
echo "[8/9] Fazendo build de produção..."
npm run build

# --------------------------------------------------------------------------
# 9. PM2 — iniciar e configurar no boot
# --------------------------------------------------------------------------
echo "[9/9] Iniciando aplicação com PM2..."
mkdir -p /var/log/pm2
pm2 start "$APP_DIR/ecosystem.config.js"
pm2 save
pm2 startup systemd -u root --hp /root | tail -1 | bash

# --------------------------------------------------------------------------
# Nginx — configurar reverse proxy
# --------------------------------------------------------------------------
echo ""
echo "Configurando Nginx..."
cp "$APP_DIR/nginx/isf-site.conf" /etc/nginx/sites-available/isf-site
ln -sf /etc/nginx/sites-available/isf-site /etc/nginx/sites-enabled/isf-site
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# --------------------------------------------------------------------------
# SSL com Let's Encrypt
# --------------------------------------------------------------------------
echo ""
echo "========================================"
echo "  Configuração SSL"
echo "========================================"
echo "Para ativar HTTPS, execute:"
echo ""
echo "  certbot --nginx -d $DOMAIN -d ${DOMAIN#www.}"
echo ""
echo "O Certbot vai modificar automaticamente o nginx/isf-site.conf"
echo "para redirecionar HTTP → HTTPS."
echo ""

# --------------------------------------------------------------------------
# Copiar uploads (imagens) da máquina local
# --------------------------------------------------------------------------
echo "========================================"
echo "  Imagens / Uploads"
echo "========================================"
echo "As imagens NÃO estão no git. Para copiá-las da sua máquina local:"
echo ""
echo "  # No Windows (PowerShell/WSL), rode na raiz do projeto:"
echo "  rsync -avz ./public/uploads/ USUARIO@IP_DA_VPS:$APP_DIR/public/uploads/"
echo ""
echo "  # ou via SCP:"
echo "  scp -r ./public/uploads/* USUARIO@IP_DA_VPS:$APP_DIR/public/uploads/"
echo ""

echo "========================================"
echo "  Setup concluído!"
echo "========================================"
echo "  Site rodando em: http://$DOMAIN"
echo "  pm2 status         → ver status da app"
echo "  pm2 logs isf-site  → ver logs em tempo real"
echo "========================================"
