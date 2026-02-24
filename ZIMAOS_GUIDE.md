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

## 🗄️ Configuración de Almacenamiento en RAID / Discos Externos

Si tienes un **RAID personalizado** o un disco externo en ZimaOS y quieres que los archivos adjuntos (uploads) se guarden allí en lugar del almacenamiento principal, sigue estos pasos:

### 1. Identificar la ruta de tu RAID
En ZimaOS, los discos adicionales o RAIDs se montan bajo la carpeta `/DATA/`.
1. Abre la aplicación **Files** (Archivos) en tu escritorio de ZimaOS.
2. Localiza tu RAID en la barra lateral izquierda.
3. Entra en la carpeta donde quieras guardar los archivos.
4. Haz clic en la barra de direcciones o en las opciones de la carpeta para obtener la **Ruta Completa** (ejemplo: `/DATA/Storage/MiRAID/inventario_uploads`).

### 2. Cambiar la ruta en la aplicación
Si ya instalaste la aplicación:
1. En el dashboard de ZimaOS, busca el icono de **Inventario TIC**.
2. Haz clic en los tres puntos (`...`) del icono y selecciona **Settings** (Ajustes).
3. Busca la sección de **Volumes** o **Storage**.
4. Localiza la línea que apunta al contenedor `/app/uploads`.
5. Cambia la caja de texto de la **izquierda (Host)** por tu ruta personalizada del RAID.
6. Haz clic en **Save** (Guardar).

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
*   **Solución**: He actualizado el archivo `docker-compose.zima.yml` con un script de inicio más robusto que reintenta la conexión y muestra progreso. **Copia la última versión del archivo**.
*   **Verificar Progreso**: 
    1. En ZimaOS, haz clic en los `...` del icono de la App.
    2. Selecciona **Logs**.
    3. Busca la pestaña o servicio llamado **backend**.
    4. Deberías ver mensajes como: `🟡 Esperando a que la base de datos esté lista...`, `✅ Base de datos conectada...` y `🌱 Ejecutando carga de datos iniciales (seed)...`.
    5. Solo cuando veas el mensaje `🚀 Iniciando servidor de producción...`, el sistema estará listo para el login.

---

## 🔐 Credenciales por Defecto

*   **Administrador**: `admin@inventario.com` / `Admin123!`
*   **Consulta**: `invitado@cafedecolombia.com` / `C0m1t3*`

---

## 📂 Persistencia de Datos
Los datos y archivos se guardan en tu ZimaOS dentro de `/DATA/AppData/inventario/`. **No borres esta carpeta** si quieres conservar tu información al actualizar la App.

---

## 🧠 Lecciones Aprendidas (Para futuros proyectos)

Al migrar de un entorno local en Windows (Docker Desktop) a un servidor de Producción basado en Linux (ZimaOS / Alpine Linux), encontramos dos "trampas" silenciosas que causan errores catastróficos tipo `502 Bad Gateway`:

### 1. Sensibilidad a Mayúsculas/Minúsculas (Case Sensitivity)
* **El Problema**: Windows ignora si un archivo se llama `hojaVida.js` o `hojavida.js`. En desarrollo local funcionará siempre. Pero Alpine Linux (y cualquier servidor de producción real) **es estricto**. Si el archivo físico tiene una "V" mayúscula, el código `require('./hojavida')` fallará instantáneamente con `MODULE_NOT_FOUND`.
* **La Lección**: SIEMPRE verifica que los nombres de archivo en los `import` y `require` coincidan *exactamente* letra por letra con el disco duro. Nunca confíes en que "localmente me funciona".

### 2. Comandos Multilínea en YAML (`docker-compose.yml`)
* **El Problema**: Al intentar inyectar un script shell complejo dentro del `docker-compose.zima.yml` usando el operador `>`:
  ```yaml
  command: >
    sh -c "
      until pg_isready...
      npx prisma...
    "
  ```
  El operador YAML `>` (folded scalar) aplasta todos los saltos de línea convirtiéndolos en espacios. Esto rompe bucles `until/while` y corta ejecuciones condicionadas por `&&` o `||` en Shell, haciendo que el contenedor de Docker se congele o no termine su inicialización, sin soltar un error claro.
* **La Lección**: Si tu contenedor requiere más de una sola línea secuencial para encender (ej. esperar a la BD, migrar, seed, start), **EVITA** poner la lógica en el `docker-compose.yml`. En su lugar, crea un script físico `start.sh`, instálalo en el Dockerfile (`COPY start.sh /`, `RUN chmod +x`) y llama a ese script como tu `CMD`.
