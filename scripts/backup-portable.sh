#!/bin/sh
# ============================================================
# Backup Script (Portable) — pg_dump diario a Cloudflare R2
# Soporta: /shared/backup.env (desde UI) y Env Vars (compose).
# Optimizado para ZimaOS (Zero-SSH) y Retrocompatible.
# ============================================================

notify_failure() {
  local error_stage="$1"
  local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
  echo "[$(date)] ERROR: $error_stage"
  
  if [ -n "$TELEGRAM_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
    # Limpiar posibles saltos de linea windows (\r) invisibles
    local tk=$(echo "$TELEGRAM_TOKEN" | tr -d '\r')
    local cid=$(echo "$TELEGRAM_CHAT_ID" | tr -d '\r')
    local text="FALLO - Backup Inventario TIC%0AETAPA: ${error_stage}%0AARCHIVO: ${FILENAME}%0AFECHA: ${timestamp}"
    
    local response=$(curl -k -sS -d "chat_id=${cid}" -d "text=${text}" "https://api.telegram.org/bot${tk}/sendMessage" 2>&1 || echo "CURL_CMD_FAILED")
    echo "[$(date)] Telegram ERROR MSG enviado. Salida: $response"
  fi
}

notify_success() {
  local file_name="$1"
  local file_size="$2"
  local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
  
  if [ -n "$TELEGRAM_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
    # Limpiar posibles saltos de linea windows (\r) invisibles
    local tk=$(echo "$TELEGRAM_TOKEN" | tr -d '\r')
    local cid=$(echo "$TELEGRAM_CHAT_ID" | tr -d '\r')
    local text="OK - Backup Inventario TIC%0AARCHIVO: ${file_name}%0ATAMANO: ${file_size}%0ADESTINO: Cloudflare R2%0AFECHA: ${timestamp}"
    
    local response=$(curl -k -sS -d "chat_id=${cid}" -d "text=${text}" "https://api.telegram.org/bot${tk}/sendMessage" 2>&1 || echo "CURL_CMD_FAILED")
    echo "[$(date)] Telegram OK MSG activado. Salida: $response"
  else
    echo "[$(date)] Omitiendo Telegram: Token o ChatID vacio."
  fi
}

trap 'notify_failure "Error en linea $LINENO"' ERR
set -e

# ============================================================
# INSTALACIÓN PORTABLE DE DEPENDENCIAS (Fallback)
# ============================================================
if ! command -v curl >/dev/null 2>&1; then
  echo "[$(date)] Instalando curl (faltante en entorno)..."
  apk add --no-cache curl >/dev/null 2>&1 || true
fi

# ── CARGA DE CREDENCIALES DESDE VOLUMEN COMPARTIDO ────────
# El contenedor app escribe /shared/backup.env cuando el admin
# configura credenciales desde la UI. Cargamos primero ese archivo
# y luego las env vars del compose sobreescriben si están definidas.
if [ -f /shared/backup.env ]; then
  set -a
  . /shared/backup.env
  set +a
  echo "[$(date)] Credenciales cargadas desde /shared/backup.env"
fi

# ── CARGA DE CREDENCIALES DESDE ENV VARS ──────────────────
echo "[$(date)] Cargando credenciales desde variables de entorno..."

# PostgreSQL
export PGPASSWORD="${POSTGRES_PASSWORD:-}"

# R2
R2_AK="${R2_ACCESS_KEY_ID:-}"
R2_SK="${R2_SECRET_ACCESS_KEY:-}"
R2_BUCKET_NAME="${R2_BUCKET_NAME:-${R2_BUCKET:-}}"
R2_ENDPOINT="${R2_ENDPOINT:-}"

# Cifrado
ENC_KEY="${BACKUP_ENCRYPTION_KEY:-}"

# Telegram (ya están en el entorno, no requieren asignación)

# Validaciones
if [ -z "$PGPASSWORD" ]; then
  notify_failure "POSTGRES_PASSWORD no configurada"
  exit 1
fi

if [ -z "$ENC_KEY" ]; then
  notify_failure "BACKUP_ENCRYPTION_KEY no configurada"
  exit 1
fi

if [ -z "$R2_AK" ] || [ -z "$R2_SK" ] || [ -z "$R2_ENDPOINT" ] || [ -z "$R2_BUCKET_NAME" ]; then
  notify_failure "Credenciales R2 incompletas (R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT o R2_BUCKET_NAME vacias)"
  exit 1
fi

echo "[$(date)] Credenciales cargadas correctamente."

# ── PREPARACIÓN ──────────────────────────────────────────────
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
# Usar el prefijo inventario-tic para diferenciar los backups en el bucket R2
FILENAME="backup-inventario-tic-${TIMESTAMP}.sql.gz.enc"
BACKUP_FILE="/backups/${FILENAME}"

echo "[$(date)] Iniciando backup cifrado..."

# ── EJECUCIÓN ────────────────────────────────────────────────
pg_dump -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" --clean --if-exists \
  | gzip \
  | openssl enc -aes-256-cbc -pbkdf2 -iter 100000 -pass pass:"$ENC_KEY" \
  > "$BACKUP_FILE"

FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "[$(date)] [OK] Backup cifrado: $FILENAME ($FILE_SIZE)"

# Checksum SHA256
SHA256_FILE="${BACKUP_FILE}.sha256"
HASH_CALCULADO=$(sha256sum "$BACKUP_FILE" | awk '{print $1}')
echo "$HASH_CALCULADO  $FILENAME" > "$SHA256_FILE"

# Subida a Cloudflare R2
if [ -n "$R2_ENDPOINT" ] && [ -n "$R2_AK" ]; then
  export AWS_ACCESS_KEY_ID="$R2_AK"
  export AWS_SECRET_ACCESS_KEY="$R2_SK"

  aws s3 cp "$BACKUP_FILE" "s3://${R2_BUCKET_NAME}/${FILENAME}" \
    --endpoint-url "$R2_ENDPOINT" --no-progress
    
  aws s3 cp "$SHA256_FILE" "s3://${R2_BUCKET_NAME}/${FILENAME}.sha256" \
    --endpoint-url "$R2_ENDPOINT" --no-progress
    
  echo "[$(date)] [OK] Subido a Cloudflare R2."
  rm -f "$BACKUP_FILE" "$SHA256_FILE"
else
  echo "[$(date)] [WARN] R2_ENDPOINT o R2_AK no configurados. Backup queda local: $FILENAME"
fi

notify_success "${FILENAME}" "${FILE_SIZE}"
echo "[$(date)] Proceso finalizado."
