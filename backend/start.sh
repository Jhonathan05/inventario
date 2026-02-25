#!/bin/sh
set -e

# Extraer host de DATABASE_URL si existe, de lo contrario usar 'postgres'
DB_HOST=$(echo $DATABASE_URL | sed -e 's|.*@||' -e 's|:.*||' -e 's|/.*||')
DB_USER=$(echo $DATABASE_URL | sed -e 's|//||' -e 's|:.*||' -e 's|.*@||' | cut -d: -f1)

echo "🟡 Esperando a que la base de datos ($DB_HOST) esté lista..."
until pg_isready -h "$DB_HOST" -U "$DB_USER"; do
  echo "⏳ BD no disponible, reintentando en 2s..."
  sleep 2
done

echo "✅ Base de datos conectada."

# Generar cliente Prisma (por si no se hizo en el build o hay cambios de volumen)
echo "💎 Generando cliente Prisma..."
npx prisma generate

echo "📐 Sincronizando esquema de base de datos..."
npx prisma db push --accept-data-loss

echo "🌱 Iniciando carga de datos iniciales..."
node prisma/seed.js || echo "⚠️ Seed base ya ejecutado o con advertencias."
node prisma/seed_catalogos.js || echo "⚠️ Seed de catálogos ya ejecutado o con advertencias."

if [ "$NODE_ENV" = "development" ]; then
  echo "🛠️ Iniciando servidor en modo DESARROLLO (nodemon)..."
  exec npm run dev
else
  echo "🚀 Iniciando servidor en modo PRODUCCIÓN..."
  exec node src/server.js
fi
