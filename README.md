# Sistema de Inventario Tecnológico

Este es un aplicativo web robusto diseñado para gestionar el inventario de activos tecnológicos de una organización. Permite el control de placas, seriales, marcas, modelos, asignaciones a funcionarios, traslados de responsabilidad y mantenimiento periódico (Hoja de Vida).

## 🚀 Inicio Rápido

### Requisitos Previos
- **OrbStack** (Recomendado para macOS) o Docker Desktop.
- PowerShell o ZSH (para scripts de automatización).

### Levantar el Entorno
1. Clona el repositorio.
2. Abre una terminal en la raíz del proyecto.
3. Ejecuta:
   ```bash
   # Usando docker-compose estándar (funciona en OrbStack)
   docker-compose up -d --build
   ```

## 🛠️ Despliegue y Acceso (Entorno Dev)

| Servicio | URL Localhost | Dominio OrbStack (macOS) | Puerto |
|---|---|---|---|
| **Frontend** | [http://localhost:8085](http://localhost:8085) | [http://inventario.local](http://inventario.local) | `8085` |
| **Backend API** | [http://localhost:3003](http://localhost:3003) | [http://api.inventario.local](http://api.inventario.local) | `3003` |
| **Adminer** | [http://localhost:8084](http://localhost:8084) | [http://db.inventario.local](http://db.inventario.local) | `8084` |
| **PostgreSQL**| `localhost:5434` | - | `5434` |

### Credenciales de Acceso
- **Aplicación Web**:
  - Usuario: `admin@inventario.com`
  - Contraseña: `Admin123!`
- **Base de Datos (PostgreSQL)**:
  - Servidor: `postgres` (desde Docker) / `localhost` (desde Host)
  - Usuario: `inventario_dev`
  - Contraseña: `dev_password_123`
  - Base de Datos: `inventario_db`

## 🤖 Atajos del Agente (Workflows)

Puedes usar los siguientes comandos con el asistente AI para agilizar tu flujo:

- `/start`: Sincroniza el código más reciente y restaura la base de datos.
- `/finish`: Crea un respaldo de la BD y sube los cambios a GitHub.
- `/push`: Realiza un commit con versionado semántico automático.

## 📁 Estructura del Proyecto

- `backend/`: Código fuente de la API, esquema de Prisma y lógica de negocio.
- `frontend/`: Aplicación cliente en React con TailwindCSS.
- `database/backups/`: Almacena los volcados SQL automáticos de la base de datos.
- `uploads/`: Carpeta para documentos adjuntos (PDFs e Imágenes).
- `.agent/workflows/`: Definición de los atajos para la IA.

## ⚙️ Tecnologías Utilizadas

- **Frontend**: React 19, Vite, TailwindCSS, Axios, HeroIcons.
- **Backend**: Node.js, Express, Prisma ORM, JWT, Multer.
- **Infraestructura**: Docker, Nginx, PostgreSQL.

---
Mantenido por Antigravity AI. Inspirado en las mejoras de `control-viaticos`.
