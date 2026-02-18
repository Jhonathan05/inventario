# Script para restaurar la base de datos desde una copia de seguridad
param (
    [Parameter(Mandatory = $false)]
    [string]$File = "database/backups/latest.sql"
)

if (!(Test-Path $File)) {
    Write-Host "❌ Error: El archivo '$File' no existe." -ForegroundColor Red
    Write-Host "Asegúrate de haber realizado un backup o haber hecho 'git pull'." -ForegroundColor Yellow
    return
}

Write-Host "⏳ Restaurando base de datos desde $File..." -ForegroundColor Yellow
Get-Content $File | docker exec -i inventario-db-dev psql -U inventario_dev inventario_db
Write-Host "✅ Base de datos restaurada con éxito." -ForegroundColor Green
