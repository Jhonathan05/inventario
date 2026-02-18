# Script para realizar copia de seguridad de la base de datos
$backupDir = "database/backups"
if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

$backupFile = "$backupDir/latest.sql"
docker exec inventario-db-dev pg_dump -U inventario_dev inventario_db > $backupFile
Write-Host "✅ Copia de seguridad actualizada en: $backupFile" -ForegroundColor Green
Write-Host "Este archivo se sincronizará con GitHub en el próximo push." -ForegroundColor Cyan
