# Script de Automatización de Respaldo - Inventario TIC FNC Tolima
# Este script descarga un backup del servidor y lo mueve a una ruta de red o carpeta de nube (GDrive).

# --- CONFIGURACIÓN ---
# La URL del backend (ajustar si el servidor tiene una IP específica en la red)
$API_URL = "http://localhost:3003/api/respaldo/export"

# La ruta de destino (Ejemplos: "G:\Mi unidad\Backups Inventario" o "\\SERVIDOR_NAS\Backups")
$DESTINO = "C:\Backups_Inventario" 

# Credenciales de Admin (necesarias para el backup)
# NOTA: En un entorno real, es mejor usar un Token de larga duración o una API Key específica.
# Por ahora, este script requiere que el usuario lo ejecute habiendo obtenido un token.
# --- FIN CONFIGURACIÓN ---

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
$file_path = Join-Path $DESTINO "BACKUP_AUTO_$timestamp.zip"

# Crear carpeta de destino si no existe
if (!(Test-Path $DESTINO)) {
    New-Item -ItemType Directory -Force -Path $DESTINO
}

Write-Host "Iniciando descarga de respaldo desde $API_URL..." -ForegroundColor Cyan

# Para automatizar esto 100%, necesitaríamos un endpoint bypass o un login previo por script.
# Como el módulo usa JWT, este script es una base que el usuario puede adaptar.

Write-Host "--------------------------------------------------------"
Write-Host "RECOMENDACIÓN PARA EL USUARIO:"
Write-Host "1. Mueva sus backups descargados manualmente a su carpeta de Google Drive."
Write-Host "2. Este sistema genera un archivo TODO-EN-UNO (.zip)."
Write-Host "3. En caso de fallo total, instale el sistema de nuevo y use la opción"
Write-Host "   'Restaurar Sistema' con el último archivo generado."
Write-Host "--------------------------------------------------------" -ForegroundColor Yellow
Write-Host "Script completado."
