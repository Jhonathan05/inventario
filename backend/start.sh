#!/bin/sh
set -e

echo "🟡 Esperando a que la base de datos esté lista..."
until pg_isready -h postgres -U inventario_user; do
  echo "⏳ BD no disponible, reintentando en 2s..."
  sleep 2
done

echo "✅ Base de datos conectada."
echo "📐 Aplicando esquema de base de datos..."
npx prisma db push --accept-data-loss

echo "🌱 Cargando datos iniciales (seed)..."
node prisma/seed.js || echo "⚠️  Seed ya ejecutado o con advertencias, continuando..."

echo "🚀 Iniciando servidor de producción..."
exec node src/server.js
