# 📝 CONTEXT: Proyecto Inventario TIC & ITSM

## 🎯 Propósito del Sistema
Este es un ecosistema integral para la gestión del ciclo de vida de los activos tecnológicos de la organización y la atención de requerimientos técnicos mediante una mesa de ayuda (ITSM). El sistema permite no solo el inventariado, sino la trazabilidad de asignaciones, mantenimientos (hoja de vida) y resolución de incidentes.

---

## 🏗️ Arquitectura y Stack Tecnológico

### Frontend (`/frontend`)
- **Core**: React 19 (Vite) en modo ES Modules.
- **Routing**: `react-router-dom` v7.
- **Styling**: TailwindCSS v3.4.
- **UI/UX**: HeroIcons, React Select, React Hot Toast.
- **Visualización**: Recharts para indicadores de gestión.
- **Reportes**: Generación de PDFs (`jspdf`, `html2pdf.js`) y Excel (`xlsx`).

### Backend (`/backend`)
- **Runtime**: Node.js con Express.
- **ORM**: Prisma v6.2.1 sincronizado con PostgreSQL.
- **Auth**: Autenticación basada en JWT y encriptación con `bcryptjs`.
- **Media**: Gestión de archivos adjuntos mediante `multer`.
- **Reportes**: Procesamiento de datos con `exceljs`.

### Infraestructura (Docker/OrbStack)
- **Base de Datos**: PostgreSQL 15 (Alpine).
- **GUI DB**: Adminer para gestión rápida de datos.
- **Proxies/Networking**: Configuración de dominios locales vía OrbStack (`inventario.local`, `api.inventario.local`).
- **Persistencia**: Volúmenes dedicados para `postgres_data` y `uploads`.

---

## 📂 Modelo de Dominio (Entidades Clave)

### 1. Gestión de Activos (`Activo`)
Control detallado de hardware con campos como placa, serial, activo fijo, marca, modelo y especificaciones técnicas (RAM, Disco, Procesador, etc.). Soporta estados (`DISPONIBLE`, `ASIGNADO`, `MANTENIMIENTO`, `BAJA`).

### 2. Capital Humano (`Funcionario`)
Registro de empleados y contratistas, vinculando su ubicación física (sede, piso) y cargo con los activos asignados.

### 3. ITSM & Soporte (`Ticket`)
Mesa de ayuda completa con categorización de incidentes/requerimientos, priorización (`BAJA` a `CRITICA`) y flujo de estados (`CREADO` a `COMPLETADO`). Incluye bitácora de soluciones técnicas.

### 4. Hoja de Vida (`HojaVida`)
Historial de mantenimientos preventivos y correctivos, reparaciones y suministros, con trazabilidad de costos y técnicos responsables.

---

## 🤖 Operación y Automatización

### Workflows del Agente (`/.agent/workflows`)
- `/start`: Sincronización de código y restauración de base de datos.
- `/finish`: Respaldo automático y subida a GitHub.
- `/push`: Versionado semántico simplificado.

### Scripts de Automatización (`.ps1`)
El proyecto cuenta con scripts de PowerShell para:
- `db-backup.ps1 / db-restore.ps1`: Gestión de volcados SQL.
- `publish-docker.ps1`: Construcción y publicación de imágenes.
- `sync-project.ps1`: Sincronización entre entornos de desarrollo y producción.

---

## 🚦 Accesos y Configuración (Entorno Dev)

- **Frontend**: [http://inventario.local](http://inventario.local) (Puerto 8085)
- **Backend**: [http://api.inventario.local](http://api.inventario.local) (Puerto 3003)
- **Adminer**: [http://db.inventario.local](http://db.inventario.local) (Puerto 8084)
- **Credenciales Admin**: `admin@inventario.com` / `Admin123!`

---

## ⚠️ Lecciones Críticas de Estabilidad
1.  **Sensibilidad de Mayúsculas (Linux)**: El entorno de producción corre sobre Alpine Linux. Los `import` deben coincidir *exactamente* con el nombre de archivo en disco (Path Case Sensitivity).
2.  **Scripts de Inicio Docker**: Se utiliza un archivo `start.sh` físico para manejar la inicialización (espera de DB, migraciones, seed) y evitar fallos por el "operador folding" de YAML en `docker-compose`.

---
*Mantenido por Antigravity AI — Mar 2026*
