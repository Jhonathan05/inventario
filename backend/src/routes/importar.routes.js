const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Multer en memoria para no guardar el archivo en disco
const upload = multer({ storage: multer.memoryStorage() });

// ──────────────────────────────────────────────────────────────────────────────
// COLUMNAS EXACTAS EN ORDEN (coinciden con el Excel del usuario)
// ──────────────────────────────────────────────────────────────────────────────

const COLUMNAS_ACTIVOS = [
    'EMPRESA PROPIETARIO DEL EQUIPO',
    'DEPENDENCIA',
    'FUENTE DE RECURSO',
    'TIPO DE RECURSO',
    'TIPO',
    'SERIAL',
    'PLACA',
    'MARCA',
    'MODELO',
    'NOMBRE DE EQUIPO',
    'ESTADO OPERATIVO',
    'RAZÓN DEL ESTADO',
    'ADMINISTRADO/CONTROLADO',
    'PROCESADOR',
    'MEMORIA RAM',
    'TAMAÑO DISCO DURO',
    'SISTEMA OPERATIVO',
    'FECHA DE COMPRA',
    'FIN DE GARANTIA',
    'TIEMPO USO (AÑOS)',
    'TIPO DE PROPIEDAD',
    'CHEKLIST (RESPONSABLE TI)',
    'ORDEN DE REMISIÓN',
    'OBSERVACIONES',
];

const COLUMNAS_FUNCIONARIOS = [
    'NOMBRE',
    'SHORTNAME',
    'CEDULA',
    'CODIGO PERSONAL',
    'VINCULACION',
    'EMPRESA FUNCIONARIO',
    'PROYECTO',
    'DEPARTAMENTO',
    'CIUDAD',
    'SECCIONAL',
    'MUNICIPIO',
    'CARGO',
    'AREA',
    'UBICACION',
    'PISO',
    'EMAIL',
    'TELEFONO',
];

const COLUMNAS_CMDB = [
    'EMPRESA PROPIETARIO DEL EQUIPO',
    'DEPENDENCIA',
    'FUENTE DE RECURSO',
    'EMPRESA FUNCIONARIO',
    'EMPLEADO O CONTRATISTA',
    'CEDULA DEL FUNCIONARIO/CONTRATISTA',
    'SHORTNAME',
    'NOMBRES Y APELLIDOS',
    'DEPARTAMENTO',
    'CIUDAD',
    'CARGO',
    'ÁREA',
    'UBICACIÓN Y PISO',
    'TIPO DE RECURSO',
    'TIPO',
    'SERIAL',
    'PLACA',
    'MARCA',
    'MODELO',
    'NOMBRE DE EQUIPO',
    'ESTADO OPERATIVO',
    'RAZÓN DEL ESTADO',
    'ADMINISTRADO/CONTROLADO',
    'PROCESADOR',
    'MEMORIA RAM',
    'TAMAÑO DISCO DURO',
    'SISTEMA OPERATIVO',
    'FECHA DE COMPRA',
    'FIN DE GARANTIA',
    'TIEMPO USO (AÑOS)',
    'TIPO DE PROPIEDAD',
    'CHEKLIST (RESPONSABLE TI)',
    'ORDEN DE REMISIÓN',
    'OBSERVACIONES'
];

// Fila de ejemplo para Activos
const EJEMPLO_ACTIVO = {
    'EMPRESA PROPIETARIO DEL EQUIPO': 'FEDERACION',
    'DEPENDENCIA': 'SUCURSAL IBAGUE',
    'FUENTE DE RECURSO': 'FON1',
    'TIPO DE RECURSO': 'PAC',
    'TIPO': 'EQUIPO PORTATIL',
    'SERIAL': 'SN12345',
    'PLACA': 'IBG-001',
    'MARCA': 'DELL',
    'MODELO': 'Latitude 5520',
    'NOMBRE DE EQUIPO': 'LAPTOP-IBG01',
    'ESTADO OPERATIVO': 'EN OPERACIÓN',
    'RAZÓN DEL ESTADO': 'DISPONIBLE',
    'ADMINISTRADO/CONTROLADO': 'CONTROLADO',
    'PROCESADOR': 'Intel Core i5-1135G7',
    'MEMORIA RAM': '16GB',
    'TAMAÑO DISCO DURO': '512GB SSD',
    'SISTEMA OPERATIVO': 'Windows 11 Pro',
    'FECHA DE COMPRA': '15/03/2022',
    'FIN DE GARANTIA': '15/03/2025',
    'TIEMPO USO (AÑOS)': '3',
    'TIPO DE PROPIEDAD': 'PROPIO',
    'CHEKLIST (RESPONSABLE TI)': 'Juan Pérez',
    'ORDEN DE REMISIÓN': 'OR-2022-001',
    'OBSERVACIONES': 'Equipo en buen estado',
};

// Fila de ejemplo para Funcionarios
const EJEMPLO_FUNCIONARIO = {
    'NOMBRE': 'María González López',
    'SHORTNAME': 'MGonzalez',
    'CEDULA': '1234567890',
    'CODIGO PERSONAL': 'FED-001',
    'VINCULACION': 'EMPLEADO',
    'EMPRESA FUNCIONARIO': 'FEDERACION',
    'PROYECTO': 'PROYECTO X',
    'DEPARTAMENTO': 'TOLIMA',
    'CIUDAD': 'IBAGUE',
    'SECCIONAL': 'IBAGUE',
    'MUNICIPIO': 'IBAGUE',
    'CARGO': 'Analista TI',
    'AREA': 'TECNOLOGÍA',
    'UBICACION': 'Edificio Central',
    'PISO': '3',
    'EMAIL': 'mgonzalez@federacion.com',
    'TELEFONO': '3001234567',
};

// Fila de ejemplo para CMDB Unificada
const EJEMPLO_CMDB = {
    'EMPRESA PROPIETARIO DEL EQUIPO': 'FEDERACION',
    'DEPENDENCIA': 'SUCURSAL IBAGUE',
    'FUENTE DE RECURSO': 'FON1',
    'EMPRESA FUNCIONARIO': 'FEDERACION',
    'EMPLEADO O CONTRATISTA': 'EMPLEADO',
    'CEDULA DEL FUNCIONARIO/CONTRATISTA': '1234567890',
    'SHORTNAME': 'MGonzalez',
    'NOMBRES Y APELLIDOS': 'María González López',
    'DEPARTAMENTO': 'TOLIMA',
    'CIUDAD': 'IBAGUE',
    'CARGO': 'Analista TI',
    'ÁREA': 'TECNOLOGÍA',
    'UBICACIÓN Y PISO': 'Edificio Central - Piso 3',
    'TIPO DE RECURSO': 'PAC',
    'TIPO': 'EQUIPO PORTATIL',
    'SERIAL': 'SN12345',
    'PLACA': 'IBG-001',
    'MARCA': 'DELL',
    'MODELO': 'Latitude 5520',
    'NOMBRE DE EQUIPO': 'LAPTOP-IBG01',
    'ESTADO OPERATIVO': 'EN OPERACIÓN',
    'RAZÓN DEL ESTADO': 'DISPONIBLE',
    'ADMINISTRADO/CONTROLADO': 'CONTROLADO',
    'PROCESADOR': 'Intel Core i5-1135G7',
    'MEMORIA RAM': '16GB',
    'TAMAÑO DISCO DURO': '512GB SSD',
    'SISTEMA OPERATIVO': 'Windows 11 Pro',
    'FECHA DE COMPRA': '15/03/2022',
    'FIN DE GARANTIA': '15/03/2025',
    'TIEMPO USO (AÑOS)': '3',
    'TIPO DE PROPIEDAD': 'PROPIO',
    'CHEKLIST (RESPONSABLE TI)': 'Juan Pérez',
    'ORDEN DE REMISIÓN': 'OR-2022-001',
    'OBSERVACIONES': 'Equipo asignado correctamente'
};

// ──────────────────────────────────────────────────────────────────────────────
// HELPER: parsear fecha desde texto DD/MM/YYYY o número serial de Excel
// ──────────────────────────────────────────────────────────────────────────────
function parseFecha(value) {
    if (!value) return null;
    // Si es número (serial de Excel)
    if (typeof value === 'number') {
        const date = XLSX.SSF.parse_date_code(value);
        if (date) return new Date(date.y, date.m - 1, date.d);
    }
    const str = String(value).trim();
    if (!str) return null;
    // DD/MM/YYYY
    const match = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (match) return new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]));
    // Último intento
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
}

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/importar/plantilla/activos  — descarga Excel plantilla
// ──────────────────────────────────────────────────────────────────────────────
router.get('/plantilla/activos', (req, res) => {
    const wb = XLSX.utils.book_new();
    const wsData = [COLUMNAS_ACTIVOS, COLUMNAS_ACTIVOS.map(col => EJEMPLO_ACTIVO[col] ?? '')];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Ancho de columnas
    ws['!cols'] = COLUMNAS_ACTIVOS.map(() => ({ wch: 28 }));

    XLSX.utils.book_append_sheet(wb, ws, 'Activos');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename="Plantilla_Activos.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buf);
});

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/importar/plantilla/funcionarios  — descarga Excel plantilla
// ──────────────────────────────────────────────────────────────────────────────
router.get('/plantilla/funcionarios', (req, res) => {
    const wb = XLSX.utils.book_new();
    const wsData = [COLUMNAS_FUNCIONARIOS, COLUMNAS_FUNCIONARIOS.map(col => EJEMPLO_FUNCIONARIO[col] ?? '')];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = COLUMNAS_FUNCIONARIOS.map(() => ({ wch: 24 }));

    XLSX.utils.book_append_sheet(wb, ws, 'Funcionarios');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename="Plantilla_Funcionarios.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buf);
});

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/importar/plantilla/cmdb  — descarga Excel plantilla unificada
// ──────────────────────────────────────────────────────────────────────────────
router.get('/plantilla/cmdb', (req, res) => {
    const wb = XLSX.utils.book_new();
    const wsData = [COLUMNAS_CMDB, COLUMNAS_CMDB.map(col => EJEMPLO_CMDB[col] ?? '')];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = COLUMNAS_CMDB.map(() => ({ wch: 26 }));

    XLSX.utils.book_append_sheet(wb, ws, 'CMDB Unificada');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename="Plantilla_CMDB.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buf);
});

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/importar/activos  — procesa archivo xlsx de activos
// ──────────────────────────────────────────────────────────────────────────────
router.post('/activos', upload.single('archivo'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No se recibió ningún archivo.' });

    try {
        const wb = XLSX.read(req.file.buffer, { type: 'buffer', cellDates: false });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

        const resultados = [];

        // Cargar categorías para mapear por nombre
        const categorias = await prisma.categoria.findMany();
        const catMap = {};
        categorias.forEach(c => { catMap[c.nombre.toUpperCase()] = c.id; });

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const fila = i + 2; // +2 porque la fila 1 es encabezado

            const placa = String(row['PLACA'] || '').trim();
            const marca = String(row['MARCA'] || '').trim();
            const modelo = String(row['MODELO'] || '').trim();

            if (!placa) {
                resultados.push({ fila, estado: 'ERROR', mensaje: 'PLACA es requerida', datos: { placa } });
                continue;
            }
            if (!marca || !modelo) {
                resultados.push({ fila, estado: 'ERROR', mensaje: 'MARCA y MODELO son requeridos', datos: { placa } });
                continue;
            }

            // Mapear categoría por el campo TIPO
            const tipoStr = String(row['TIPO'] || '').trim().toUpperCase();
            const categoriaId = catMap[tipoStr] || null;

            const data = {
                placa,
                serial: String(row['SERIAL'] || '').trim() || null,
                marca,
                modelo,
                tipo: String(row['TIPO'] || '').trim() || null,
                nombreEquipo: String(row['NOMBRE DE EQUIPO'] || '').trim() || null,
                empresaPropietaria: String(row['EMPRESA PROPIETARIO DEL EQUIPO'] || '').trim() || null,
                dependencia: String(row['DEPENDENCIA'] || '').trim() || null,
                fuenteRecurso: String(row['FUENTE DE RECURSO'] || '').trim() || null,
                tipoRecurso: String(row['TIPO DE RECURSO'] || '').trim() || null,
                estadoOperativo: String(row['ESTADO OPERATIVO'] || '').trim() || null,
                razonEstado: String(row['RAZÓN DEL ESTADO'] || '').trim() || null,
                tipoControl: String(row['ADMINISTRADO/CONTROLADO'] || '').trim() || null,
                procesador: String(row['PROCESADOR'] || '').trim() || null,
                memoriaRam: String(row['MEMORIA RAM'] || '').trim() || null,
                discoDuro: String(row['TAMAÑO DISCO DURO'] || '').trim() || null,
                sistemaOperativo: String(row['SISTEMA OPERATIVO'] || '').trim() || null,
                fechaCompra: parseFecha(row['FECHA DE COMPRA']),
                garantiaHasta: parseFecha(row['FIN DE GARANTIA']),
                tiempoUso: String(row['TIEMPO USO (AÑOS)'] || '').trim() || null,
                tipoPropietario: String(row['TIPO DE PROPIEDAD'] || '').trim() || null,
                checklist: String(row['CHEKLIST (RESPONSABLE TI)'] || '').trim() || null,
                ordenRemision: String(row['ORDEN DE REMISIÓN'] || '').trim() || null,
                observaciones: String(row['OBSERVACIONES'] || '').trim() || null,
                ...(categoriaId ? { categoriaId } : {}),
            };

            try {
                const existing = await prisma.activo.findUnique({ where: { placa } });
                if (existing) {
                    await prisma.activo.update({ where: { placa }, data });
                    resultados.push({ fila, estado: 'ACTUALIZADO', mensaje: `Activo ${placa} actualizado`, datos: { placa } });
                } else {
                    await prisma.activo.create({ data });
                    resultados.push({ fila, estado: 'CREADO', mensaje: `Activo ${placa} creado`, datos: { placa } });
                }
            } catch (err) {
                resultados.push({ fila, estado: 'ERROR', mensaje: err.message, datos: { placa } });
            }
        }

        const resumen = {
            total: resultados.length,
            creados: resultados.filter(r => r.estado === 'CREADO').length,
            actualizados: resultados.filter(r => r.estado === 'ACTUALIZADO').length,
            errores: resultados.filter(r => r.estado === 'ERROR').length,
        };

        res.json({ resumen, resultados });
    } catch (err) {
        console.error('Error procesando archivo de activos:', err);
        res.status(500).json({ error: 'Error procesando el archivo. Verifique que el formato es correcto.' });
    }
});

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/importar/funcionarios  — procesa archivo xlsx de funcionarios
// ──────────────────────────────────────────────────────────────────────────────
router.post('/funcionarios', upload.single('archivo'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No se recibió ningún archivo.' });

    try {
        const wb = XLSX.read(req.file.buffer, { type: 'buffer' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

        const resultados = [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const fila = i + 2;

            const nombre = String(row['NOMBRE'] || '').trim();
            const cedula = String(row['CEDULA'] || '').trim();

            if (!nombre) {
                resultados.push({ fila, estado: 'ERROR', mensaje: 'NOMBRE es requerido', datos: { cedula } });
                continue;
            }
            if (!cedula) {
                resultados.push({ fila, estado: 'ERROR', mensaje: 'CEDULA es requerida', datos: { nombre } });
                continue;
            }

            const codigoPersonal = String(row['CODIGO PERSONAL'] || '').trim() || null;

            const data = {
                nombre,
                cedula,
                codigoPersonal,
                shortname: String(row['SHORTNAME'] || '').trim() || null,
                vinculacion: String(row['VINCULACION'] || '').trim() || null,
                empresaFuncionario: String(row['EMPRESA FUNCIONARIO'] || '').trim() || null,
                proyecto: String(row['PROYECTO'] || '').trim() || null,
                departamento: String(row['DEPARTAMENTO'] || '').trim() || null,
                ciudad: String(row['CIUDAD'] || '').trim() || null,
                seccional: String(row['SECCIONAL'] || '').trim() || null,
                municipio: String(row['MUNICIPIO'] || '').trim() || null,
                cargo: String(row['CARGO'] || '').trim() || null,
                area: String(row['AREA'] || '').trim() || null,
                ubicacion: String(row['UBICACION'] || '').trim() || null,
                piso: String(row['PISO'] || '').trim() || null,
                email: String(row['EMAIL'] || '').trim() || null,
                telefono: String(row['TELEFONO'] || '').trim() || null,
            };

            try {
                const existing = await prisma.funcionario.findUnique({ where: { cedula } });
                if (existing) {
                    // codigoPersonal requiere manejo especial si ya existe otro con ese código
                    const updateData = { ...data };
                    if (!codigoPersonal) delete updateData.codigoPersonal; // no pisar si viene vacío
                    await prisma.funcionario.update({ where: { cedula }, data: updateData });
                    resultados.push({ fila, estado: 'ACTUALIZADO', mensaje: `Funcionario ${nombre} actualizado`, datos: { cedula } });
                } else {
                    await prisma.funcionario.create({ data });
                    resultados.push({ fila, estado: 'CREADO', mensaje: `Funcionario ${nombre} creado`, datos: { cedula } });
                }
            } catch (err) {
                resultados.push({ fila, estado: 'ERROR', mensaje: err.message, datos: { cedula, nombre } });
            }
        }

        const resumen = {
            total: resultados.length,
            creados: resultados.filter(r => r.estado === 'CREADO').length,
            actualizados: resultados.filter(r => r.estado === 'ACTUALIZADO').length,
            errores: resultados.filter(r => r.estado === 'ERROR').length,
        };

        res.json({ resumen, resultados });
    } catch (err) {
        console.error('Error procesando archivo de funcionarios:', err);
        res.status(500).json({ error: 'Error procesando el archivo. Verifique que el formato es correcto.' });
    }
});

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/importar/cmdb  — procesa importación unificada (CMDB)
// ──────────────────────────────────────────────────────────────────────────────
router.post('/cmdb', upload.single('archivo'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No se recibió ningún archivo.' });

    try {
        const wb = XLSX.read(req.file.buffer, { type: 'buffer', cellDates: false });
        // Usar la primera hoja
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

        const resultados = [];
        const resumen = {
            funcionariosCreados: 0,
            funcionariosActualizados: 0,
            activosCreados: 0,
            activosActualizados: 0,
            asignacionesCreadas: 0,
            errores: 0
        };

        // Pre-cargar categorías para mapeo
        const categorias = await prisma.categoria.findMany();
        const catMap = {};
        categorias.forEach(c => { catMap[c.nombre.toUpperCase()] = c.id; });

        // Identificador del usuario que ejecuta (para tabla asignaciones)
        const realizadoPor = req.user ? req.user.email : 'Sistema de Importación';

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const fila = i + 2;

            // ==========================================
            // 1. EXTRACCIÓN Y VALIDACIÓN INICIAL
            // ==========================================
            const cedulaBruta = String(row['CEDULA DEL FUNCIONARIO/CONTRATISTA'] || '').trim();
            const esCedulaNula = ['N/A', 'NO APLICA', 'NA', 'NO APLICA.', '-', ''].includes(cedulaBruta.toUpperCase());
            const cedula = esCedulaNula ? '' : cedulaBruta;

            const placa = String(row['PLACA'] || '').trim();
            const nombreFunc = esCedulaNula ? '' : String(row['NOMBRES Y APELLIDOS'] || '').trim();

            // Si la fila no tiene cédula ni placa, se ignora
            if (!cedula && !placa) continue;

            let funcionarioId = null;
            let activoId = null;
            let errorEnFila = false;
            let msjFuncionario = "N/A";
            let msjActivo = "N/A";
            let msjAsignacion = "N/A";

            // ==========================================
            // 2. PROCESAR FUNCIONARIO (Si hay cédula)
            // ==========================================
            if (cedula && nombreFunc) {
                const dataFunc = {
                    cedula,
                    nombre: nombreFunc,
                    shortname: String(row['SHORTNAME'] || '').trim() || null,
                    vinculacion: String(row['EMPLEADO O CONTRATISTA'] || '').trim() || null,
                    empresaFuncionario: String(row['EMPRESA FUNCIONARIO'] || '').trim() || null,
                    departamento: String(row['DEPARTAMENTO'] || '').trim() || null,
                    ciudad: String(row['CIUDAD'] || '').trim() || null,
                    cargo: String(row['CARGO'] || '').trim() || null,
                    area: String(row['ÁREA'] || '').trim() || null,
                    ubicacion: String(row['UBICACIÓN Y PISO'] || '').trim() || null,
                };

                try {
                    const funcExists = await prisma.funcionario.findUnique({ where: { cedula } });
                    if (funcExists) {
                        const updated = await prisma.funcionario.update({ where: { cedula }, data: dataFunc });
                        resumen.funcionariosActualizados++;
                        funcionarioId = updated.id;
                        msjFuncionario = `Actualizado ${cedula}`;
                    } else {
                        const created = await prisma.funcionario.create({ data: dataFunc });
                        resumen.funcionariosCreados++;
                        funcionarioId = created.id;
                        msjFuncionario = `Creado ${cedula}`;
                    }
                } catch (err) {
                    errorEnFila = true;
                    resumen.errores++;
                    msjFuncionario = `Error: ${err.message}`;
                }
            } else if (cedula && !nombreFunc) {
                msjFuncionario = "Falta nombre del Funcionario";
                errorEnFila = true;
            }

            // ==========================================
            // 3. PROCESAR ACTIVO (Si hay placa)
            // ==========================================
            const marca = String(row['MARCA'] || '').trim();
            const modelo = String(row['MODELO'] || '').trim();

            if (placa && marca && modelo) {
                const tipoStr = String(row['TIPO'] || '').trim().toUpperCase();
                const categoriaId = catMap[tipoStr] || null;

                const dataActivo = {
                    placa,
                    serial: String(row['SERIAL'] || '').trim() || null,
                    marca,
                    modelo,
                    tipo: String(row['TIPO'] || '').trim() || null,
                    nombreEquipo: String(row['NOMBRE DE EQUIPO'] || '').trim() || null,
                    empresaPropietaria: String(row['EMPRESA PROPIETARIO DEL EQUIPO'] || '').trim() || null,
                    dependencia: String(row['DEPENDENCIA'] || '').trim() || null,
                    fuenteRecurso: String(row['FUENTE DE RECURSO'] || '').trim() || null,
                    tipoRecurso: String(row['TIPO DE RECURSO'] || '').trim() || null,
                    estadoOperativo: String(row['ESTADO OPERATIVO'] || '').trim() || null,
                    razonEstado: String(row['RAZÓN DEL ESTADO'] || '').trim() || null,
                    tipoControl: String(row['ADMINISTRADO/CONTROLADO'] || '').trim() || null,
                    procesador: String(row['PROCESADOR'] || '').trim() || null,
                    memoriaRam: String(row['MEMORIA RAM'] || '').trim() || null,
                    discoDuro: String(row['TAMAÑO DISCO DURO'] || '').trim() || null,
                    sistemaOperativo: String(row['SISTEMA OPERATIVO'] || '').trim() || null,
                    fechaCompra: parseFecha(row['FECHA DE COMPRA']),
                    garantiaHasta: parseFecha(row['FIN DE GARANTIA']),
                    tiempoUso: String(row['TIEMPO USO (AÑOS)'] || '').trim() || null,
                    tipoPropietario: String(row['TIPO DE PROPIEDAD'] || '').trim() || null,
                    checklist: String(row['CHEKLIST (RESPONSABLE TI)'] || '').trim() || null,
                    ordenRemision: String(row['ORDEN DE REMISIÓN'] || '').trim() || null,
                    observaciones: String(row['OBSERVACIONES'] || '').trim() || null,
                    // Campos del funcionario en el Activo (Caché por BD actual)
                    empresaFuncionario: cedula ? String(row['EMPRESA FUNCIONARIO'] || '').trim() || null : null,
                    tipoPersonal: cedula ? String(row['EMPLEADO O CONTRATISTA'] || '').trim() || null : null,
                    cedulaFuncionario: cedula || null,
                    shortname: cedula ? String(row['SHORTNAME'] || '').trim() || null : null,
                    nombreFuncionario: cedula ? nombreFunc || null : null,
                    departamento: cedula ? String(row['DEPARTAMENTO'] || '').trim() || null : null,
                    ciudad: cedula ? String(row['CIUDAD'] || '').trim() || null : null,
                    cargo: cedula ? String(row['CARGO'] || '').trim() || null : null,
                    area: cedula ? String(row['ÁREA'] || '').trim() || null : null,
                    ubicacion: cedula ? String(row['UBICACIÓN Y PISO'] || '').trim() || null : null,
                    ...(categoriaId ? { categoriaId } : {}),
                    ...(cedula ? {} : { estado: 'DISPONIBLE' }) // Se marca como disponible si no hay funcionario
                };

                try {
                    const actExists = await prisma.activo.findUnique({ where: { placa } });
                    if (actExists) {
                        const updated = await prisma.activo.update({ where: { placa }, data: dataActivo });
                        resumen.activosActualizados++;
                        activoId = updated.id;
                        msjActivo = `Actualizado ${placa}`;
                    } else {
                        const created = await prisma.activo.create({ data: dataActivo });
                        resumen.activosCreados++;
                        activoId = created.id;
                        msjActivo = `Creado ${placa}`;
                    }
                } catch (err) {
                    errorEnFila = true;
                    resumen.errores++;
                    msjActivo = `Error: ${err.message}`;
                }
            } else if (placa && (!marca || !modelo)) {
                msjActivo = "Falta Marca o Modelo";
                errorEnFila = true;
            }

            // ==========================================
            // 4. CREAR ASIGNACIÓN O LIBERAR ACTIVO
            // ==========================================
            if (funcionarioId && activoId) {
                try {
                    // Verificar si ya existe una asignación activa (fechaFin null) entre ambos
                    const asignacionExiste = await prisma.asignacion.findFirst({
                        where: {
                            activoId,
                            funcionarioId,
                            fechaFin: null
                        }
                    });

                    if (!asignacionExiste) {
                        // Antes de crear la nueva, cerramos cualquier otra asignación activa para este activo
                        await prisma.asignacion.updateMany({
                            where: { activoId, fechaFin: null },
                            data: { fechaFin: new Date(), observaciones: 'Cierre por nueva asignación (CMDB)' }
                        });

                        // Crear nueva asignación
                        await prisma.asignacion.create({
                            data: {
                                activoId,
                                funcionarioId,
                                tipo: 'ASIGNACION',
                                observaciones: 'Asignación automática por importación CMDB',
                                realizadoPor
                            }
                        });

                        // Actualizar estado del activo a ASIGNADO
                        await prisma.activo.update({
                            where: { id: activoId },
                            data: { estado: 'ASIGNADO' }
                        });

                        resumen.asignacionesCreadas++;
                        msjAsignacion = 'Asignación Creada';
                    } else {
                        msjAsignacion = 'Ya estaba asignado';
                    }
                } catch (err) {
                    errorEnFila = true;
                    resumen.errores++;
                    msjAsignacion = `Error: ${err.message}`;
                }
            } else if (!funcionarioId && activoId) {
                // Si hay activo pero no hay funcionario válido, nos aseguramos que se liber el activo
                try {
                    const asignacionExiste = await prisma.asignacion.findFirst({
                        where: { activoId, fechaFin: null }
                    });

                    if (asignacionExiste) {
                        await prisma.asignacion.updateMany({
                            where: { activoId, fechaFin: null },
                            data: { fechaFin: new Date(), observaciones: 'Liberado por importación CMDB (Funcionario N/A)' }
                        });
                        await prisma.activo.update({
                            where: { id: activoId },
                            data: { estado: 'DISPONIBLE' }
                        });
                        resumen.asignacionesCreadas++; // Lo contamos como un moviento exitoso
                        msjAsignacion = 'Activo liberado';
                    } else {
                        msjAsignacion = 'Disponible';
                    }
                } catch (err) {
                    errorEnFila = true;
                    resumen.errores++;
                    msjAsignacion = `Error liberando: ${err.message}`;
                }
            }

            // Registrar resultado de la fila
            resultados.push({
                fila,
                estado: errorEnFila ? 'ERROR' : 'PROCESADO',
                mensaje: `Func: ${msjFuncionario} | Act: ${msjActivo} | Asign: ${msjAsignacion}`,
            });
        }

        res.json({ resumen, resultados });
    } catch (err) {
        console.error('Error procesando archivo CMDB:', err);
        res.status(500).json({ error: 'Error procesando el archivo CMDB. Verifique el formato.' });
    }
});

module.exports = router;
