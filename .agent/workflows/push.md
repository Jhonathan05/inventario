---
description: Cómo realizar commits y pushes con versionado semántico a GitHub
---

Este flujo de trabajo describe cómo usar el script `version-push.ps1` para mantener un control de versiones limpio y subir cambios a GitHub.

### Requisitos Previos

1. Tener cambios listos para commit.
2. Los cambios deben estar en el área de preparación (staged).

### Pasos para realizar el push

1. Abre una terminal de PowerShell en la raíz del proyecto.
2. Prepara tus archivos:
   ```powershell
   git add .
   ```
3. Ejecuta el script de versionado:
   ```powershell
   # Por defecto incrementa el parche (patch: 1.0.0 -> 1.0.1)
   .\version-push.ps1 -CommitMessage "Descripción de tus cambios"

   # Para una nueva funcionalidad (minor: 1.0.0 -> 1.1.0)
   .\version-push.ps1 -CommitMessage "Nueva funcionalidad" -Type minor

   # Para cambios mayores (major: 1.0.0 -> 2.0.0)
   .\version-push.ps1 -CommitMessage "Cambio mayor" -Type major
   ```

### ¿Qué hace el script?

- Verifica que haya cambios preparados (staged).
- Incrementa la versión en `backend/package.json` y `frontend/package.json`.
- Realiza el commit con el mensaje proporcionado.
- Crea una etiqueta (tag) de git con la nueva versión (ej. `v1.0.1`).
- Sube la rama actual y las etiquetas a GitHub.

### Recomendaciones

- Usa mensajes de commit descriptivos.
- Sigue el esquema de versionado semántico según el impacto de tus cambios.
