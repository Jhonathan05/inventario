# Guía de Desarrollo y Reglas de Oro (ANTIGRAVITY)

Este repositorio contiene reglas específicas que el agente debe seguir para mantener la integridad del sistema de Inventario.

## 📊 Generación de Reportes (Excel)

### 🚨 Motor de Plantillas
- **Regla:** **NUNCA** usar `exceljs` o `xlsx` puro para plantillas que contengan logos o formatos complejos.
- **Librería Obligatoria:** Usar siempre **`xlsx-populate`**. Es la única que respeta la integridad de los logos institucionales y las celdas combinadas.

### 🎨 Estándares de Formato
- **Color de Fuente:** Todo dato inyectado debe forzarse a Negro (`.style("fontColor", "000000")`).
- **Consistencia de Datos:** Si un campo (Placa, Serial, Observación) está vacío, debe mostrarse como **"N/A"**.
- **Items:** Se eliminó el autoincremento en filas vacías. Si no hay activo, la fila debe ser "N/A" en su totalidad.

## 🔐 Seguridad y Roles (RBAC)

### 🛡️ Eliminación de Actas
- **Restricción:** Solo el rol **ADMIN** puede eliminar actas definitivamente.
- **Ruta:** `DELETE /api/actas/:id`.
- **Integridad:** Borrar el acta **NO** afecta el estado de los activos ni borra el historial de asignaciones previo (Borrado Simple).

## 🌐 Manejo de Archivos (Frontend)

### 📦 Blobs y Descargas
- **Error Crítico:** No volver a envolver la respuesta en un `new Blob()`.
- **Regla:** Usar `responseType: 'blob'` en Axios y consumir la data directamente con `window.URL.createObjectURL(response.data)`.

---
*Este archivo es la "memoria técnica" de Antigravity para el proyecto Inventario.*
