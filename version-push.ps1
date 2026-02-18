param (
    [Parameter(Mandatory = $false)]
    [string]$CommitMessage,

    [Parameter(Mandatory = $false)]
    [ValidateSet("patch", "minor", "major")]
    [string]$Type = "patch",

    [Parameter(Mandatory = $false)]
    [switch]$DryRun
)

# 1. Verificar cambios staged
$staged = git diff --cached --name-only
if ($null -eq $staged -or $staged.Length -eq 0) {
    Write-Error "No hay cambios preparados. Usa 'git add .' antes de ejecutar este script."
    exit 1
}

# 2. Obtener versión actual (backend como fuente de verdad)
$backendPath = "backend/package.json"
$frontendPath = "frontend/package.json"

if (-not (Test-Path $backendPath)) {
    Write-Error "No se encontró $backendPath"
    exit 1
}

$backendJson = Get-Content $backendPath | ConvertFrom-Json
$currentVersion = $backendJson.version
Write-Host "Versión actual: $currentVersion"

# 3. Calcular nueva versión
$parts = $currentVersion.Split('.')
[int]$major = $parts[0]
[int]$minor = $parts[1]
[int]$patch = $parts[2]

switch ($Type) {
    "major" { $major++; $minor = 0; $patch = 0 }
    "minor" { $minor++; $patch = 0 }
    "patch" { $patch++ }
}

$newVersion = "$major.$minor.$patch"
Write-Host "Nueva versión ($Type): $newVersion"

if ($DryRun) {
    Write-Host "[DRY RUN] Se actualizaría a la versión $newVersion"
    exit 0
}

# 4. Actualizar package.json
function Update-PackageVersion($path, $version) {
    if (Test-Path $path) {
        $json = Get-Content $path | ConvertFrom-Json
        $json.version = $version
        $jsonText = $json | ConvertTo-Json -Depth 20
        [System.IO.File]::WriteAllText((Get-Item $path).FullName, $jsonText)
        Write-Host "Actualizado $path a $version"
    }
    else {
        Write-Warning "Archivo no encontrado: $path"
    }
}

Update-PackageVersion $backendPath $newVersion
Update-PackageVersion $frontendPath $newVersion

# 5. Commit
git add $backendPath $frontendPath
if (-not $CommitMessage) {
    $CommitMessage = "Release v$newVersion"
}

git commit -m "$CommitMessage"

# 6. Tag
git tag -a "v$newVersion" -m "Version $newVersion"
Write-Host "Tag creado: v$newVersion"

# 7. Push
$branch = git branch --show-current
Write-Host "Subiendo a origin $branch..."
git push origin $branch
git push origin --tags

Write-Host "✅ Versión $newVersion subida a GitHub." -ForegroundColor Green
