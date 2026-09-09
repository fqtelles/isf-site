#!/bin/bash
# =============================================================================
# setup-backup.sh — Configuração inicial do sistema de backup para Google Drive
# Executar UMA VEZ como root na VPS: sudo bash setup-backup.sh
# =============================================================================

set -e

BACKUP_SCRIPT="/var/www/isf-site/scripts/backup-to-gdrive.sh"
BACKUP_TMP="/var/backups/isf-gdrive"
LOG_FILE="/var/log/isf-backup.log"
CRON_SCHEDULE="0 3 * * *"   # Diariamente às 3h da manhã

echo "========================================"
echo "  Setup — Backup ISF Segurança"
echo "========================================"
echo ""

# ---------------------------------------------------------------------------
# 1. Instalar sqlite3
# ---------------------------------------------------------------------------
echo "[1/5] Verificando sqlite3..."
if command -v sqlite3 &> /dev/null; then
  echo "  -> sqlite3 já instalado: $(sqlite3 --version)"
else
  echo "  -> Instalando sqlite3..."
  apt-get update -qq
  apt-get install -y sqlite3
  echo "  -> sqlite3 instalado: $(sqlite3 --version)"
fi

# ---------------------------------------------------------------------------
# 2. Instalar rclone
# ---------------------------------------------------------------------------
echo ""
echo "[2/5] Verificando rclone..."
if command -v rclone &> /dev/null; then
  echo "  -> rclone já instalado: $(rclone version | head -1)"
else
  echo "  -> Instalando rclone..."
  curl https://rclone.org/install.sh | bash
  echo "  -> rclone instalado: $(rclone version | head -1)"
fi

# ---------------------------------------------------------------------------
# 3. Configurar rclone com Google Drive
# ---------------------------------------------------------------------------
echo ""
echo "[3/5] Configurando Google Drive no rclone..."
echo ""

if rclone lsd gdrive: &> /dev/null 2>&1; then
  echo "  -> Remote 'gdrive' já configurado e funcional!"
else
  echo "  ================================================================"
  echo "  ATENÇÃO: Configuração interativa do Google Drive"
  echo "  ================================================================"
  echo ""
  echo "  Como a VPS não tem navegador, siga estes passos:"
  echo ""
  echo "  1. Na sua máquina LOCAL (Windows/Mac), instale rclone:"
  echo "     https://rclone.org/downloads/"
  echo ""
  echo "  2. Na máquina LOCAL, execute:"
  echo "     rclone authorize \"drive\""
  echo ""
  echo "  3. O navegador vai abrir para autorizar acesso ao Google Drive."
  echo "     Após autorizar, o rclone mostrará um token no terminal."
  echo ""
  echo "  4. Copie o token e cole quando o rclone pedir aqui na VPS."
  echo ""
  echo "  Agora vamos configurar o remote na VPS:"
  echo "  (Quando perguntado, escolha: 'drive' como tipo, e cole o token)"
  echo ""
  read -p "  Pressione Enter para iniciar o rclone config..."
  echo ""
  rclone config
  echo ""

  # Verificar se funcionou
  if rclone lsd gdrive: &> /dev/null 2>&1; then
    echo "  -> Google Drive configurado com sucesso!"
  else
    echo "  -> AVISO: Remote 'gdrive' não detectado."
    echo "     Certifique-se de que o remote se chama 'gdrive'."
    echo "     Para renomear: rclone config"
    echo ""
    read -p "  Pressione Enter após corrigir (ou Ctrl+C para sair)..."
  fi
fi

# ---------------------------------------------------------------------------
# 4. Criar diretórios e permissões
# ---------------------------------------------------------------------------
echo ""
echo "[4/5] Criando diretórios de backup..."

mkdir -p "$BACKUP_TMP"
touch "$LOG_FILE"
chmod +x "$BACKUP_SCRIPT"

echo "  -> $BACKUP_TMP (temporário local)"
echo "  -> $LOG_FILE (log)"
echo "  -> $BACKUP_SCRIPT (executável)"

# ---------------------------------------------------------------------------
# 5. Configurar cron job
# ---------------------------------------------------------------------------
echo ""
echo "[5/5] Configurando cron job..."

CRON_LINE="$CRON_SCHEDULE $BACKUP_SCRIPT >> $LOG_FILE 2>&1"

# Verifica se o cron já existe
if crontab -l 2>/dev/null | grep -q "backup-to-gdrive"; then
  echo "  -> Cron job já existe. Atualizando..."
  crontab -l 2>/dev/null | grep -v "backup-to-gdrive" | { cat; echo "$CRON_LINE"; } | crontab -
else
  echo "  -> Adicionando cron job..."
  (crontab -l 2>/dev/null || true; echo "$CRON_LINE") | crontab -
fi

echo "  -> Cron configurado: $CRON_SCHEDULE (diariamente às 3h)"
echo ""

# ---------------------------------------------------------------------------
# Resumo
# ---------------------------------------------------------------------------
echo "========================================"
echo "  Setup concluído!"
echo "========================================"
echo ""
echo "  Backup automático: diariamente às 3h da manhã"
echo "  Destino: Google Drive > ISF-Backups/"
echo "  Retenção: 30 dias"
echo "  Log: $LOG_FILE"
echo ""
echo "  Para testar agora:"
echo "    sudo bash $BACKUP_SCRIPT"
echo ""
echo "  Para ver o cron:"
echo "    crontab -l"
echo ""
echo "  Para ver os logs:"
echo "    tail -f $LOG_FILE"
echo ""
echo "========================================"
