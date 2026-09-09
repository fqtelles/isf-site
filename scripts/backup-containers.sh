#!/bin/bash
# =============================================================================
# backup-containers.sh — Backup dos dados dos containers LXD para o Google Drive
#
# Faz backup só do que é insubstituível dentro de /home/hermes, ignorando o que
# é recriável (caches, node_modules, venvs, runtimes) e a wiki (que já tem
# sincronização própria via rclone).
#
# Roda a partir do HOST, lendo o rootfs do container direto no disco — isso é
# possível porque o storage pool do LXD usa driver "dir". Não precisa de rclone
# nem de nenhuma configuração dentro do container.
#
# Usa "rclone sync" em vez de tarball versionado: com vários GB, subir um
# tarball novo por dia não escala (nem em tempo de upload, nem em espaço no
# Drive). O sync mantém um espelho e envia só o que mudou. Para não perder
# histórico, todo arquivo alterado ou apagado é movido para _versions/<data>
# antes de ser sobrescrito — assim uma deleção acidental não se propaga
# irreversivelmente para o backup.
#
# Uso manual:   sudo bash /var/www/isf-site/scripts/backup-containers.sh
# Simulação:    sudo bash /var/www/isf-site/scripts/backup-containers.sh --dry-run
# Via cron:     0 4 * * *  bash /var/www/isf-site/scripts/backup-containers.sh
# =============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# Configurações
# ---------------------------------------------------------------------------
CONTAINER="${CONTAINER:-hermes-agent-container}"
LXD_CONTAINERS="/var/snap/lxd/common/lxd/storage-pools/default/containers"
SOURCE_DIR="$LXD_CONTAINERS/$CONTAINER/rootfs/home/hermes"

# Remote do rclone. O padrão é um remote "crypt" — os dados são conversas e
# arquivos pessoais, então sobem criptografados (a chave fica só na VPS).
# Veja no fim deste arquivo como criar o remote.
RCLONE_REMOTE="${CONTAINERS_RCLONE_REMOTE:-gdrive-crypt}"
DEST_PATH="hermes-backup/$CONTAINER"

VERSIONS_RETENTION=30          # dias de retenção das versões antigas
LOG_FILE="/var/log/isf-containers-backup.log"

DATE=$(date '+%Y-%m-%d')
DRY_RUN=0
[ "${1:-}" = "--dry-run" ] && DRY_RUN=1

# ---------------------------------------------------------------------------
# O que NÃO subir: tudo que é recriável a partir de uma reinstalação, mais a
# wiki, que já tem sincronização própria com o Google Drive.
# ---------------------------------------------------------------------------
EXCLUDES=(
  "wiki/**"                    # já sincronizada via rclone separadamente
  ".cache/**"                  # pip, uv, playwright
  ".npm/**"
  ".agent-browser/**"          # binários de browser
  ".cua-driver/**"
  ".hermes/node/**"            # runtime do node
  ".hermes/bin/**"
  ".hermes/patchright/**"      # venv do patchright
  ".local/lib/node_modules/**"
  ".local/share/uv/**"         # interpretadores CPython baixados pelo uv
  "**/node_modules/**"
  "**/.venv/**"
  "**/venv/**"
  "**/venvs/**"                # o plural existe e não era pego pelos padrões acima
  "**/__pycache__/**"
  "**/*.pyc"
)

# ---------------------------------------------------------------------------
# Funções auxiliares
# ---------------------------------------------------------------------------
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

fail() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERRO: $1" | tee -a "$LOG_FILE"
  exit 1
}

# ---------------------------------------------------------------------------
# Verificações
# ---------------------------------------------------------------------------
log "========================================"
log "  Backup do container $CONTAINER — início"
[ "$DRY_RUN" -eq 1 ] && log "  (MODO SIMULAÇÃO — nada será enviado)"
log "========================================"

command -v rclone &>/dev/null || fail "rclone não instalado."
[ -d "$SOURCE_DIR" ] || fail "Diretório de origem não encontrado: $SOURCE_DIR"

# mkdir em vez de lsd: é idempotente, valida o acesso ao remote e ainda cria a
# pasta de destino caso ainda não exista — um remote novo aponta para uma pasta
# que só passa a existir no primeiro envio, e um "lsd" nela falha com
# "directory not found" mesmo estando tudo certo.
if ! rclone mkdir "$RCLONE_REMOTE:$DEST_PATH" 2>/dev/null; then
  fail "Remote '$RCLONE_REMOTE' não configurado ou inacessível. Veja as instruções no fim de $0."
fi

# ---------------------------------------------------------------------------
# Monta os argumentos de exclusão
# ---------------------------------------------------------------------------
EXCLUDE_ARGS=()
for pattern in "${EXCLUDES[@]}"; do
  EXCLUDE_ARGS+=(--exclude "$pattern")
done

# ---------------------------------------------------------------------------
# Tamanho do conjunto que será enviado
# ---------------------------------------------------------------------------
log "Calculando o tamanho do que será copiado..."
SIZE_INFO=$(rclone size "$SOURCE_DIR" "${EXCLUDE_ARGS[@]}" 2>/dev/null | tr '\n' ' ')
log "  -> $SIZE_INFO"

if [ "$DRY_RUN" -eq 1 ]; then
  log ""
  log "Simulando o sync (nenhum arquivo será enviado)..."
  rclone sync "$SOURCE_DIR" "$RCLONE_REMOTE:$DEST_PATH" \
    "${EXCLUDE_ARGS[@]}" \
    --links \
    --dry-run \
    --stats-one-line \
    --stats 30s 2>&1 | tail -20 | tee -a "$LOG_FILE"
  log ""
  log "Simulação concluída. Nada foi enviado."
  exit 0
fi

# ---------------------------------------------------------------------------
# Sync incremental
#
# --backup-dir: o que for sobrescrito ou apagado vai para _versions/<data> em
# vez de ser destruído, então uma deleção acidental na origem não apaga a única
# cópia que existe no backup.
# ---------------------------------------------------------------------------
log "Sincronizando para $RCLONE_REMOTE:$DEST_PATH ..."

# O gargalo aqui é quantidade de arquivos, não banda: cada arquivo pequeno paga
# uma ida e volta na API do Drive mais a cifragem. Com transfers=4 o ritmo fica
# em ~1 arquivo/s, o que levaria horas. Paralelizar mais é o que resolve.
nice -n 19 ionice -c3 rclone sync "$SOURCE_DIR" "$RCLONE_REMOTE:$DEST_PATH/current" \
  "${EXCLUDE_ARGS[@]}" \
  --links \
  --backup-dir "$RCLONE_REMOTE:$DEST_PATH/_versions/$DATE" \
  --transfers 16 \
  --checkers 16 \
  --fast-list \
  --log-file="$LOG_FILE" \
  --log-level INFO \
  --stats-one-line \
  --stats 60s

log "  -> Sync concluído."

# ---------------------------------------------------------------------------
# Limpeza das versões antigas
# ---------------------------------------------------------------------------
log "Removendo versões com mais de ${VERSIONS_RETENTION} dias..."
CUTOFF_EPOCH=$(date -d "${VERSIONS_RETENTION} days ago" +%s)

rclone lsf "$RCLONE_REMOTE:$DEST_PATH/_versions/" --dirs-only 2>/dev/null \
  | sed 's#/$##' \
  | while read -r version_date; do
      VERSION_EPOCH=$(date -d "$version_date" +%s 2>/dev/null || echo 0)
      if [ "$VERSION_EPOCH" -gt 0 ] && [ "$VERSION_EPOCH" -lt "$CUTOFF_EPOCH" ]; then
        log "  -> Removendo versão antiga: $version_date"
        rclone purge "$RCLONE_REMOTE:$DEST_PATH/_versions/$version_date" 2>/dev/null || true
      fi
    done

# ---------------------------------------------------------------------------
# Resumo
# ---------------------------------------------------------------------------
REMOTE_SIZE=$(rclone size "$RCLONE_REMOTE:$DEST_PATH/current" 2>/dev/null | tr '\n' ' ')
log "========================================"
log "  Backup concluído!"
log "  Origem:  $SOURCE_DIR"
log "  Destino: $RCLONE_REMOTE:$DEST_PATH/current"
log "  No destino: $REMOTE_SIZE"
log "========================================"

# =============================================================================
# COMO CRIAR O REMOTE CRIPTOGRAFADO (uma vez só)
#
#   # 1. Gere uma senha forte e GUARDE em um gerenciador de senhas ANTES de
#   #    seguir. Sem ela o backup é irrecuperável — nem você nem ninguém lê.
#   openssl rand -base64 24
#
#   # 2. Crie o remote com a senha gerada acima.
#   #    O parâmetro password2 (salt) é opcional e foi deixado de fora: sem ele
#   #    o rclone usa um salt padrão. Isso só enfraquece o cifrado se a senha
#   #    for fraca, por isso a senha precisa ser longa e aleatória.
#   rclone config create gdrive-crypt crypt \
#     remote=gdrive:Hermes-Backups-Crypt \
#     password="$(rclone obscure 'SUA-SENHA-AQUI')"
#
#   # 3. Confirme que funciona
#   rclone lsd gdrive-crypt:
#
# Os arquivos sobem com nome e conteúdo criptografados: o Google vê apenas
# blobs. A chave fica em /root/.config/rclone/rclone.conf, na VPS.
# =============================================================================
