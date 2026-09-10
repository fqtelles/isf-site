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
# 1. Swap
#
# Sem swap, um pico de memória vira OOM killer matando processo em vez de
# degradar desempenho. 2GB é amortecedor, não extensão de RAM: com muito swap
# um vazamento faz a máquina agonizar por horas, o que é pior que falhar rápido
# e o PM2 reerguer. swappiness 10 porque o padrão 60 manda página ociosa pro
# disco mesmo sobrando RAM, o que só piora latência num servidor.
# --------------------------------------------------------------------------
echo "[1/10] Configurando swap..."
if [ -f /swapfile ] || swapon --show | grep -q .; then
    echo "  -> Swap já configurado. Pulando."
else
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo 'vm.swappiness=10' > /etc/sysctl.d/99-swappiness.conf
    sysctl -w vm.swappiness=10
    echo "  -> Swap de 2GB ativo e persistente no boot."
fi

# --------------------------------------------------------------------------
# 2. Dependências do sistema
# --------------------------------------------------------------------------
echo "[2/10] Instalando dependências do sistema..."
apt-get update -qq
apt-get install -y curl git nginx certbot python3-certbot-nginx openssl

# --------------------------------------------------------------------------
# 3. Node.js 20 via NodeSource
# --------------------------------------------------------------------------
echo "[3/10] Instalando Node.js 20..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi
echo "Node $(node -v) / npm $(npm -v)"

# --------------------------------------------------------------------------
# 4. PM2
# --------------------------------------------------------------------------
echo "[4/10] Instalando PM2..."
npm install -g pm2

# --------------------------------------------------------------------------
# 5. Clonar repositório
# --------------------------------------------------------------------------
echo "[5/10] Clonando repositório na branch $BRANCH..."
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
# 6. Instalar dependências Node
# --------------------------------------------------------------------------
echo "[6/10] Instalando dependências npm..."
npm ci --omit=dev

# --------------------------------------------------------------------------
# 7. Arquivo .env de produção
# --------------------------------------------------------------------------
echo "[7/10] Configurando variáveis de ambiente..."
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
# 8. Banco de dados + seed
# --------------------------------------------------------------------------
echo "[8/10] Inicializando banco de dados..."
npx prisma generate
npx prisma db push --accept-data-loss
npm run db:seed

# --------------------------------------------------------------------------
# 9. Build do Next.js
# --------------------------------------------------------------------------
echo "[9/10] Fazendo build de produção..."
npm run build

# --------------------------------------------------------------------------
# 10. PM2 — iniciar e configurar no boot
# --------------------------------------------------------------------------
echo "[10/10] Iniciando aplicação com PM2..."
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
