param (
    [Parameter(Mandatory = $true)]
    [ValidateSet("start", "finish")]
    [string]$Action,

    [Parameter(Mandatory = $false)]
    [string]$CommitMessage = "Auto-sync: Respaldo de sesión",

    [Parameter(Mandatory = $false)]
    [ValidateSet("patch", "minor", "major")]
    [string]$Type = "patch"
)

$ErrorActionPreference = "Stop"

function Confirm-User($question) {
    $choice = Read-Host "$question (s/n)"
    return $choice.ToLower() -eq 's'
}

try {
    if ($Action -eq "start") {
        Write-Host "--- Iniciando Sesión de Trabajo: Inventario ---" -ForegroundColor Cyan
        
        if (Confirm-User "¿Deseas descargar los últimos cambios de código desde GitHub?") {
            Write-Host "Bajando código..." -ForegroundColor Yellow
            git pull origin main
        }

        if (Confirm-User "¿Deseas restaurar la base de datos desde el respaldo más reciente en GitHub?") {
            Write-Host "Restaurando base de datos..." -ForegroundColor Yellow
            powershell -ExecutionPolicy Bypass -File .\db-restore.ps1
        }
        
        Write-Host "✅ Entorno listo para trabajar." -ForegroundColor Green
    }
    elseif ($Action -eq "finish") {
        Write-Host "--- Finalizando Sesión de Trabajo: Inventario ---" -ForegroundColor Cyan
        
        if (Confirm-User "¿Deseas crear un respaldo de la base de datos actual antes de salir?") {
            Write-Host "Creando respaldo de BD..." -ForegroundColor Yellow
            powershell -ExecutionPolicy Bypass -File .\db-backup.ps1
        }

        if (Confirm-User "¿Deseas subir todos los cambios (código + BD) a GitHub ahora?") {
            Write-Host "Subiendo a GitHub..." -ForegroundColor Yellow
            git add .
            powershell -ExecutionPolicy Bypass -File .\version-push.ps1 -CommitMessage $CommitMessage -Type $Type
        }

        Write-Host "✅ Sesión finalizada y sincronizada." -ForegroundColor Green
    }
}
catch {
    Write-Error "Ocurrió un error durante la sincronización: $_"
}
