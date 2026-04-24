#!/bin/sh
set -e

echo "🚀 Iniciando proceso de arranque del Backend..."

# Verificar variables críticas
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL no está definida."
  exit 1
fi

# Extraer host de DATABASE_URL si existe, de lo contrario usar 'postgres'
DB_HOST=$(echo $DATABASE_URL | sed -e 's|.*@||' -e 's|:.*||' -e 's|/.*||')
DB_USER=$(echo $DATABASE_URL | sed -e 's|//||' -e 's|:.*||' -e 's|.*@||' | cut -d: -f1)

echo "🔍 Configuración detectada:"
echo "   - Host DB: $DB_HOST"
echo "   - Usuario DB: $DB_USER"
echo "   - Entorno: $NODE_ENV"

echo "🟡 Esperando a que la base de datos ($DB_HOST) esté lista..."
MAX_RETRIES=30
COUNT=0
until pg_isready -h "$DB_HOST" -U "$DB_USER" || [ $COUNT -eq $MAX_RETRIES ]; do
  COUNT=$((COUNT + 1))
  echo "⏳ ($COUNT/$MAX_RETRIES) BD no disponible, reintentando en 2s..."
  sleep 2
done

if [ $COUNT -eq $MAX_RETRIES ]; then
  echo "❌ ERROR: No se pudo conectar a la base de datos después de $MAX_RETRIES reintentos."
  exit 1
fi

echo "✅ Base de datos conectada con éxito."

# Generar cliente Prisma (por si no se hizo en el build o hay cambios de volumen)
echo "💎 Generando cliente Prisma..."
./node_modules/.bin/prisma generate

# Sincronizamos el esquema de forma no interactiva tras la restauración
if [ "$NODE_ENV" = "development" ]; then
  echo "📐 Sincronizando esquema (db push)..."
  ./node_modules/.bin/prisma db push --accept-data-loss
else
  echo "🚀 [PROD] Ejecutando migraciones..."
  ./node_modules/.bin/prisma migrate deploy
fi

echo "🌱 Ejecutando carga de datos (Seeds)..."
node prisma/seed.js || echo "⚠️ Seed base omitido o con advertencias."
# node prisma/seed_catalogos.js || echo "⚠️ Seed de catálogos omitido o con advertencias."

if [ "$NODE_ENV" = "development" ]; then
  echo "🛠️ Iniciando servidor en modo DESARROLLO (nodemon)..."
  exec npm run dev
else
  echo "🚀 Iniciando servidor en modo PRODUCCIÓN..."
  exec node src/server.js
fi
