# 🚀 Guía de Instalación y Solución de Problemas - ZimaOS

Esta guía contiene las instrucciones para desplegar correctamente la aplicación **Inventario TIC** en sistemas ZimaOS / CasaOS y cómo resolver los problemas más comunes durante la instalación.

---

## 📦 Instalación Paso a Paso

1.  **Obtener la configuración**: Copia el contenido del archivo `docker-compose.zima.yml` de este repositorio.
2.  **App Store**: En tu panel de ZimaOS, abre el **App Store**.
3.  **Instalación Personalizada**: Haz clic en **Custom Install** (esquina superior derecha).
4.  **Importar YAML**: 
    *   Haz clic en el icono de **Import** (documento con flecha) en la parte superior derecha de la ventana emergente.
    *   Pega el código del archivo YAML.
    *   Haz clic en **Submit**.

---

## 🛠️ Solución de Problemas Comunes

### 1. Mensaje de advertencia "Atención" al importar
Es normal que ZimaOS pida confirmar los datos leídos. Tras hacer clic en **OK**, verifica los siguientes puntos en el formulario:

*   **Pestaña Frontend**:
    *   **Puerto (Host)**: `3080`
    *   **Puerto (Container)**: `80`
    *   **Protocolo**: `TCP`
*   **Web UI**:
    *   Puerto: `3080`
    *   Ruta: `/`

### 2. Error: "invalid mount config for type 'bind': field Source must not be empty"
Este error ocurre cuando faltan las rutas del "Host" en la sección de volúmenes/almacenamiento. Asegúrate de configurar las rutas así:

*   **Servicio `postgres`**:
    *   **Host**: `/DATA/AppData/inventario/db`
    *   **Contenedor**: `/var/lib/postgresql/data`
*   **Servicio `backend`**:
    *   **Host**: `/DATA/AppData/inventario/uploads`
    *   **Contenedor**: `/app/uploads`

### 3. Error al iniciar sesión (Login Error)
Si al intentar entrar por primera vez recibes "Error al iniciar sesión":
*   **Causa**: Las tablas o el usuario administrador aún no se han creado en la base de datos.
*   **Solución**: El archivo `docker-compose.zima.yml` actual incluye un comando de auto-inicialización. Asegúrate de haber usado la **última versión del archivo**. 
*   **Tiempo de espera**: La primera vez puede tardar entre 30 y 60 segundos en terminar de configurar la base de datos.

---

## 🔐 Credenciales por Defecto

*   **Administrador**: `admin@inventario.com` / `Admin123!`
*   **Consulta**: `invitado@cafedecolombia.com` / `C0m1t3*`

---

## 📂 Persistencia de Datos
Los datos y archivos se guardan en tu ZimaOS dentro de `/DATA/AppData/inventario/`. **No borres esta carpeta** si quieres conservar tu información al actualizar la App.
