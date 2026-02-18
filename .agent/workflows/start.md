---
description: Preparar el entorno de trabajo descargando los últimos cambios
---

Este flujo de trabajo asegura que tengas la versión más reciente del código y los datos antes de empezar.

### Pasos

1. Ejecuta el comando de inicio:
   // turbo
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\sync-project.ps1 -Action start
   ```

2. Responde `s` (sí) a las preguntas para:
   - Descargar el código más reciente (`git pull`).
   - Restaurar la base de datos desde el archivo `latest.sql`.

> [!TIP]
> Usa este comando siempre que cambies de computadora o después de que un compañero haya subido cambios.
