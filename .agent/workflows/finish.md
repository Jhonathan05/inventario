---
description: Guardar y subir todo el trabajo antes de cerrar la sesión
---

Este flujo de trabajo asegura que tu progreso (incluyendo datos de la BD) quede respaldado en GitHub.

### Pasos

1. Ejecuta el comando de cierre:
   // turbo
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\sync-project.ps1 -Action finish
   ```

2. Responde `s` (sí) a las preguntas para:
   - Crear un nuevo respaldo de la base de datos local.
   - Hacer commit y subir todo a GitHub.

> [!IMPORTANT]
> No olvides ejecutar esto antes de apagar tu equipo si planeas seguir trabajando en otra computadora.
