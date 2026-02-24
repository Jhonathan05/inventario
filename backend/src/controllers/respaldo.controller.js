const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');

const UPLOADS_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');
const BACKUP_TEMP_DIR = path.join(__dirname, '../../temp_backup');

// Helper: parse DATABASE_URL safely
const parseDbUrl = () => {
    const url = new URL(process.env.DATABASE_URL);
    return {
        user: url.username,
        pass: url.password,
        host: url.hostname,
        port: url.port || '5432',
        name: url.pathname.replace(/^\//, ''),
    };
};

// Helper: ejecutar comando de shell con variables de entorno
const runCommand = (cmd, args, env = {}) => {
    return new Promise((resolve, reject) => {
        const proc = spawn(cmd, args, {
            env: { ...process.env, ...env },
            stdio: ['ignore', 'pipe', 'pipe'],
        });

        let stderr = '';
        proc.stderr.on('data', (data) => { stderr += data.toString(); });

        proc.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Proceso '${cmd}' falló con código ${code}. Stderr: ${stderr.trim()}`));
            } else {
                resolve();
            }
        });

        proc.on('error', (err) => {
            reject(new Error(`No se pudo ejecutar '${cmd}': ${err.message}`));
        });
    });
};

// Helper: limpiar directorio temporal
const cleanupFiles = (...paths) => {
    for (const p of paths) {
        try {
            if (fs.existsSync(p)) {
                const stat = fs.statSync(p);
                if (stat.isDirectory()) {
                    fs.rmSync(p, { recursive: true, force: true });
                } else {
                    fs.unlinkSync(p);
                }
            }
        } catch (e) {
            console.warn(`[Backup] No se pudo limpiar ${p}:`, e.message);
        }
    }
};

// ──────────────────────────────────────────────────────────────────────────────
// EXPORT: Genera un ZIP con SQL Dump + Uploads
// ──────────────────────────────────────────────────────────────────────────────
const exportBackup = async (req, res) => {
    const { startDate, endDate } = req.query;

    // Asegurar directorio temporal
    fs.mkdirSync(BACKUP_TEMP_DIR, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const dbFileName = `db_dump_${timestamp}.sql`;
    const zipFileName = `BACKUP_INVENTARIO_FNC_${timestamp}.zip`;
    const dbFilePath = path.join(BACKUP_TEMP_DIR, dbFileName);
    const zipFilePath = path.join(BACKUP_TEMP_DIR, zipFileName);

    let dbInfo;
    try {
        dbInfo = parseDbUrl();
    } catch (e) {
        return res.status(500).json({ message: 'No se pudo leer la URL de la base de datos', error: e.message });
    }

    try {
        // 1. Ejecutar pg_dump con spawn (más seguro que exec con shell)
        const dumpStream = fs.createWriteStream(dbFilePath);
        await new Promise((resolve, reject) => {
            const pgDump = spawn('pg_dump', [
                '-h', dbInfo.host,
                '-p', dbInfo.port,
                '-U', dbInfo.user,
                '-d', dbInfo.name,
                '-F', 'p',        // Formato plain SQL
                '--no-password',
                '--no-owner',
                '--no-privileges',
            ], {
                env: { ...process.env, PGPASSWORD: dbInfo.pass },
                stdio: ['ignore', 'pipe', 'pipe'],
            });

            let stderr = '';
            pgDump.stdout.pipe(dumpStream);
            pgDump.stderr.on('data', d => { stderr += d.toString(); });

            pgDump.on('close', (code) => {
                dumpStream.end();
                if (code !== 0) {
                    reject(new Error(`pg_dump falló (código ${code}): ${stderr.trim()}`));
                } else {
                    resolve();
                }
            });
            pgDump.on('error', (err) => reject(new Error(`No se encontró pg_dump: ${err.message}`)));
        });

        // Verificar que el dump tiene contenido útil
        const dumpSize = fs.statSync(dbFilePath).size;
        if (dumpSize < 100) {
            throw new Error('El volcado SQL está vacío o es inválido. Revise la conexión a la base de datos.');
        }

        // 2. Crear el archivo ZIP
        const zip = new AdmZip();
        zip.addLocalFile(dbFilePath, '', dbFileName);

        // Agregar uploads si existen, aplicando filtro de fechas si se solicitó
        let filteredFilesCount = 0;
        if (fs.existsSync(UPLOADS_DIR)) {
            const uploadContents = fs.readdirSync(UPLOADS_DIR);

            if (startDate || endDate) {
                const start = startDate ? new Date(startDate).getTime() : 0;
                // Ajustar al final del día
                const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : Infinity;

                uploadContents.forEach(item => {
                    const itemPath = path.join(UPLOADS_DIR, item);
                    const stats = fs.statSync(itemPath);
                    // Usar mtime (modificación) o birthtime (creación)
                    const itemTime = stats.mtimeMs || stats.birthtimeMs;

                    if (itemTime >= start && itemTime <= end) {
                        if (stats.isDirectory()) {
                            zip.addLocalFolder(itemPath, `uploads/${item}`);
                        } else {
                            zip.addLocalFile(itemPath, 'uploads');
                        }
                        filteredFilesCount++;
                    }
                });
            } else {
                if (uploadContents.length > 0) {
                    zip.addLocalFolder(UPLOADS_DIR, 'uploads');
                    filteredFilesCount = uploadContents.length;
                }
            }
        }

        // Agregar un archivo de metadatos para validación posterior
        const meta = JSON.stringify({
            version: '1.0',
            app: 'Inventario TIC FNC Tolima',
            created: new Date().toISOString(),
            dbName: dbInfo.name,
            dateRange: { startDate, endDate },
            filesIncluded: filteredFilesCount
        });
        zip.addFile('backup_meta.json', Buffer.from(meta));

        zip.writeZip(zipFilePath);

        // 3. Enviar el ZIP al cliente
        res.download(zipFilePath, zipFileName, (downloadErr) => {
            cleanupFiles(dbFilePath, zipFilePath);
            if (downloadErr) {
                console.error('[Backup] Error al enviar archivo:', downloadErr.message);
            }
        });

    } catch (err) {
        cleanupFiles(dbFilePath, zipFilePath);
        console.error('[Backup] Error exportando:', err.message);
        return res.status(500).json({ message: 'Error al generar el respaldo', error: err.message });
    }
};

// ──────────────────────────────────────────────────────────────────────────────
// IMPORT: Restaurar sistema desde uno o múltiples ZIP
// ──────────────────────────────────────────────────────────────────────────────
const importBackup = async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No se recibió ningún archivo de respaldo' });
    }

    const extractPath = path.join(BACKUP_TEMP_DIR, `restore_mega_${Date.now()}`);

    try {
        // 1. Extraer TODOS los ZIPs recibidos al mismo directorio temporal (se combinan las carpetas uploads)
        fs.mkdirSync(extractPath, { recursive: true });
        for (const file of req.files) {
            const zip = new AdmZip(file.path);
            zip.extractAllTo(extractPath, true); // true = overwrite
        }

        // 2. Validar el archivo de metadatos
        const metaPath = path.join(extractPath, 'backup_meta.json');
        if (!fs.existsSync(metaPath)) {
            throw new Error('El archivo ZIP no es un respaldo válido de Inventario TIC (falta backup_meta.json).');
        }

        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        if (meta.app !== 'Inventario TIC FNC Tolima') {
            throw new Error(`El respaldo es de una aplicación diferente: "${meta.app}"`);
        }

        // 3. Encontrar el archivo SQL MÁS RECIENTE
        // Ya que todos se extrajeron, pueden haber múltiples db_dump.sql. Tomaremos el de fecha más reciente para aplicar.
        const allFiles = fs.readdirSync(extractPath);
        const sqlFiles = allFiles.filter(f => f.endsWith('.sql'));
        if (sqlFiles.length === 0) {
            throw new Error('No se encontró ningún volcado SQL en los archivos de respaldo.');
        }

        // Ordenamos descendentemente (alfabéticamente el timestamp del nombre: db_dump_YYYY-MM-DD...)
        sqlFiles.sort((a, b) => b.localeCompare(a));
        const sqlFile = sqlFiles[0]; // Seleccionamos la bd más nueva
        const sqlFilePath = path.join(extractPath, sqlFile);

        let dbInfo;
        try {
            dbInfo = parseDbUrl();
        } catch (e) {
            throw new Error('No se pudo leer la URL de la base de datos para restaurar.');
        }

        // 4. Limpiar el esquema actual y restaurar
        // Paso 4a: DROP SCHEMA para limpiar
        await runCommand('psql', [
            '-h', dbInfo.host,
            '-p', dbInfo.port,
            '-U', dbInfo.user,
            '-d', dbInfo.name,
            '--no-password',
            '-c', 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;',
        ], { PGPASSWORD: dbInfo.pass });

        // Paso 4b: Restaurar el SQL dump
        const restoreStream = fs.createReadStream(sqlFilePath);
        await new Promise((resolve, reject) => {
            const psql = spawn('psql', [
                '-h', dbInfo.host,
                '-p', dbInfo.port,
                '-U', dbInfo.user,
                '-d', dbInfo.name,
                '--no-password',
            ], {
                env: { ...process.env, PGPASSWORD: dbInfo.pass },
                stdio: ['pipe', 'ignore', 'pipe'],
            });

            let stderr = '';
            restoreStream.pipe(psql.stdin);
            psql.stderr.on('data', d => { stderr += d.toString(); });

            psql.on('close', (code) => {
                if (code !== 0) {
                    reject(new Error(`psql falló (código ${code}): ${stderr.trim()}`));
                } else {
                    resolve();
                }
            });
            psql.on('error', (err) => reject(new Error(`No se encontró psql: ${err.message}`)));
        });

        // 5. Restaurar archivos de uploads si existen en el ZIP
        const uploadRestorePath = path.join(extractPath, 'uploads');
        if (fs.existsSync(uploadRestorePath)) {
            // Limpiar uploads actual
            fs.mkdirSync(UPLOADS_DIR, { recursive: true });
            fs.readdirSync(UPLOADS_DIR).forEach(f => {
                try { fs.rmSync(path.join(UPLOADS_DIR, f), { recursive: true, force: true }); } catch { }
            });
            // Copiar los archivos restaurados
            fs.cpSync(uploadRestorePath, UPLOADS_DIR, { recursive: true });
        }

        // 6. Limpiar temporales (incluyendo los ZIPs origiales)
        const pathsToClean = [extractPath, ...req.files.map(f => f.path)];
        cleanupFiles(...pathsToClean);

        console.log(`[Backup] Restauración combinada completada. DB usada: ${sqlFile} - Archivos procesados: ${req.files.length}`);
        res.json({
            message: `Sistema restaurado correctamente uniendo ${req.files.length} archivo(s). Base de datos usada: ${sqlFile}.`,
            backupDate: meta.created,
        });

    } catch (err) {
        const pathsToClean = [extractPath];
        if (req.files) req.files.forEach(f => pathsToClean.push(f.path));
        cleanupFiles(...pathsToClean);

        console.error('[Backup] Error en restauración múltiple:', err.message);
        res.status(500).json({ message: 'Error durante la restauración', error: err.message });
    }
};

module.exports = { exportBackup, importBackup };
