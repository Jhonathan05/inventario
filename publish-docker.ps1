# Script to build and push images to Docker Hub
# Usage: ./publish-docker.ps1 [version]
# Example: ./publish-docker.ps1 1.0.0

param (
    [string]$version
)

$DOCKER_USER = "puntijhon"
$PROJECT_NAME = "inventario"

# 0. Auto-detect version if not provided
if ([string]::IsNullOrEmpty($version)) {
    if (Test-Path "backend/package.json") {
        try {
            $json = Get-Content "backend/package.json" | ConvertFrom-Json
            $version = $json.version
            Write-Host "Auto-detected version from package.json: $version" -ForegroundColor Cyan
        }
        catch {
            Write-Warning "Could not read version from backend/package.json. Defaulting to 'latest'."
            $version = "latest"
        }
    }
    else {
        $version = "latest"
    }
}

Write-Host "Starting publish process for version: $version" -ForegroundColor Green

# 1. Check login
Write-Host "Checking Docker session..."
$dockerInfo = docker info 2>&1
if ($dockerInfo -match "Username: $DOCKER_USER") {
    Write-Host "Logged in as $DOCKER_USER" -ForegroundColor Green
}
else {
    Write-Host "Session not detected or user does not match." -ForegroundColor Yellow
    Write-Host "Please ensure you have run 'docker login' before continuing."
}

# 2. Build Backend
Write-Host "`nBuilding Backend image..." -ForegroundColor Cyan
docker build -t "$DOCKER_USER/$PROJECT_NAME-backend:$version" -t "$DOCKER_USER/$PROJECT_NAME-backend:latest" ./backend
if ($LASTEXITCODE -ne 0) { Write-Error "Backend build failed"; exit 1 }

# 3. Build Frontend
Write-Host "`nBuilding Frontend image..." -ForegroundColor Cyan
docker build -t "$DOCKER_USER/$PROJECT_NAME-frontend:$version" -t "$DOCKER_USER/$PROJECT_NAME-frontend:latest" ./frontend
if ($LASTEXITCODE -ne 0) { Write-Error "Frontend build failed"; exit 1 }

# 4. Push Images
Write-Host "`nPushing images to Docker Hub..." -ForegroundColor Cyan

Write-Host "Pushing Backend..."
docker push "$DOCKER_USER/$PROJECT_NAME-backend:$version"
docker push "$DOCKER_USER/$PROJECT_NAME-backend:latest"

Write-Host "Pushing Frontend..."
docker push "$DOCKER_USER/$PROJECT_NAME-frontend:$version"
docker push "$DOCKER_USER/$PROJECT_NAME-frontend:latest"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nProcess completed successfully!" -ForegroundColor Green
    Write-Host "Images available at:"
    Write-Host " - https://hub.docker.com/r/$DOCKER_USER/$PROJECT_NAME-backend"
    Write-Host " - https://hub.docker.com/r/$DOCKER_USER/$PROJECT_NAME-frontend"
}
else {
    Write-Error "Error uploading images."
}
