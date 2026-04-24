#!/bin/sh
# ============================================================
# Init-Restore Script (Portable) — Auto-restore al arrancar
# Soporta: Docker Secrets y Env Vars.
# Optimizado para ZimaOS (Zero-SSH) y modo SKIP_AUTO_RESTORE.
# ============================================================

TEMP_DIR="/tmp/init-restore"
cleanup() { rm -rf "$TEMP_DIR"; }
trap cleanup EXIT
set -e

# ── CARGA DE SECRETOS (Prioridad: Secrets > Env Vars) ────────
echo "[$(date)] Cargando credenciales para restauración..."

if [ -f /run/secrets/postgres_password ]; then
  export PGPASSWORD=$(cat /run/secrets/postgres_password)
else
  export PGPASSWORD=${POSTGRES_PASSWORD:-}
fi

if [ -f /run/secrets/r2_access_key ]; then
  R2_AK=$(cat /run/secrets/r2_access_key)
else
  R2_AK=${R2_ACCESS_KEY_ID:-}
fi

if [ -f /run/secrets/r2_secret_key ]; then
  R2_SK=$(cat /run/secrets/r2_secret_key)
else
  R2_SK=${R2_SECRET_ACCESS_KEY:-}
fi

if [ -f /run/secrets/backup_encryption_key ]; then
  ENC_KEY=$(cat /run/secrets/backup_encryption_key)
else
  ENC_KEY=${BACKUP_ENCRYPTION_KEY:-}
fi

R2_BUCKET_NAME=${R2_BUCKET_NAME:-$R2_BUCKET}

notify_telegram() {
  local msg="$1"
  if [ -n "$TELEGRAM_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
    curl -s -o /dev/null -d "chat_id=${TELEGRAM_CHAT_ID}" -d "text=${msg}" \
         "https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage" || true
  fi
}

# ── PASO 0: Verificar SKIP_AUTO_RESTORE ──────────────────────
if [ "$SKIP_AUTO_RESTORE" = "true" ]; then
  echo "[INFO] SKIP_AUTO_RESTORE=true detectado. Omitiendo restauración automática."
  exit 0
fi

# ── PASO 1: Esperar a que PostgreSQL esté listo ──────────────
echo "[INFO] Esperando a que PostgreSQL esté disponible..."
attempt=0
until pg_isready -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" > /dev/null 2>&1; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge 30 ]; then
    echo "[ERROR] PostgreSQL no respondió después de 30 intentos. Abortando."
    exit 1
  fi
  sleep 2
done

# ── PASO 2: Verificar si la DB tiene tablas ──────────────────
TABLE_COUNT=$(psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" \
  -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" \
  2>/dev/null | tr -d ' ')

if [ -n "$TABLE_COUNT" ] && [ "$TABLE_COUNT" -gt 0 ]; then
  echo "[INFO] DB existente detectada ($TABLE_COUNT tablas). Omitiendo auto-restore."
  exit 0
fi

# ── PASO 3: Restauración desde R2 ────────────────────────────
if [ -z "$R2_ENDPOINT" ] || [ -z "$R2_AK" ]; then
  echo "[WARN] R2 no configurado correctamente. No se puede realizar auto-restore."
  exit 0
fi

echo "[INFO] DB vacía detectada. Iniciando auto-restore desde Cloudflare R2..."

if ! command -v aws > /dev/null 2>&1 || ! command -v openssl > /dev/null 2>&1; then
  apk add --no-cache aws-cli openssl curl > /dev/null 2>&1
fi

export AWS_ACCESS_KEY_ID="$R2_AK"
export AWS_SECRET_ACCESS_KEY="$R2_SK"

# 4. Buscar backup más reciente (buscando el prefijo de inventario-tic)
LATEST=$(aws s3 ls "s3://${R2_BUCKET_NAME}/" \
  --endpoint-url "$R2_ENDPOINT" \
  | grep 'backup-inventario-tic-.*\.sql\.gz\.enc$' \
  | sort -r | head -n 1 | awk '{print $4}')

if [ -z "$LATEST" ]; then
  echo "[INFO] No se encontraron backups en R2 para Inventario. Se asume base de datos nueva."
  exit 0
fi

echo "[INFO] Backup seleccionado: $LATEST"

# 5. Descargar
mkdir -p "$TEMP_DIR"
LOCAL_ENC="${TEMP_DIR}/${LATEST}"
LOCAL_SHA="${LOCAL_ENC}.sha256"

aws s3 cp "s3://${R2_BUCKET_NAME}/${LATEST}" "$LOCAL_ENC" --endpoint-url "$R2_ENDPOINT" --no-progress
aws s3 cp "s3://${R2_BUCKET_NAME}/${LATEST}.sha256" "$LOCAL_SHA" --endpoint-url "$R2_ENDPOINT" --no-progress

# 6. Integridad (Portabilidad Mac/Linux)
CHECK_CMD="sha256sum -c"
if ! command -v sha256sum > /dev/null 2>&1; then CHECK_CMD="shasum -a 256 -c"; fi

cd "$TEMP_DIR"
cat "$LOCAL_SHA" | awk -v file="$LATEST" '{print $1 "  " file}' > "${LOCAL_SHA}.tmp" && mv "${LOCAL_SHA}.tmp" "$LOCAL_SHA"

if ! $CHECK_CMD "$LOCAL_SHA" > /dev/null 2>&1; then
  echo "[ERROR] Checksum inválido."
  notify_telegram "FALLO AUTO-RESTORE - Checksum inv%C3%A1lido para ${LATEST}"
  exit 1
fi
cd /

# 7. Descifrar y Restaurar
DECRYPTED_GZ="${LOCAL_ENC%.enc}"
openssl enc -d -aes-256-cbc -pbkdf2 -iter 100000 -pass pass:"$ENC_KEY" \
  -in "$LOCAL_ENC" -out "$DECRYPTED_GZ"

gunzip -c "$DECRYPTED_GZ" | psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" > /dev/null

echo "[OK] Auto-restore completado exitosamente: $LATEST"
notify_telegram "RESTORE AUTOMATICO EXITOSO - Inventario TIC%0AARCHIVO: ${LATEST}"
