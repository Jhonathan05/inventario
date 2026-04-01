const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const path = require('path');
const fs = require('fs');
// const XLSX = require('xlsx'); // Reemplazado por exceljs
const ExcelJS = require('exceljs');

// Función auxiliar para obtener fecha formateada
const getFormattedDate = (date = new Date()) => {
    const now = date;
    // Formato: AAAA / MM / DD para plantilla Excel
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy} / ${mm} / ${dd}`;
};

// ==========================================
// HELPER PARA GENERAR WORKBOOK (EXCEL)
// ==========================================
const crearWorkbookActa = async (data) => {
    const { tipo, activos, funcionarioOrigen, funcionarioDestino, usuarioTI, observaciones, fecha } = data;
    const templatePath = path.join(__dirname, '../../plantillas/novedad_activo.xlsx');

    if (!fs.existsSync(templatePath)) {
        throw new Error('Plantilla "novedad_activo.xlsx" no encontrada.');
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);
    const worksheet = workbook.worksheets[0];

    const setCell = (cellRef, value) => {
        const cell = worksheet.getCell(cellRef);
        cell.value = value;
    };

    setCell('L7', getFormattedDate(new Date(fecha)));

    let tipoNovedadExcel = '';
    let quienEntrega = {};
    let quienRecibe = {};

    if (tipo === 'ASIGNACION') {
        quienEntrega = usuarioTI;
        quienRecibe = funcionarioOrigen;
        tipoNovedadExcel = 'Inventario Físico';
    } else if (tipo === 'DEVOLUCION') {
        quienEntrega = funcionarioOrigen;
        quienRecibe = usuarioTI;
        tipoNovedadExcel = 'Inventario Físico';
    } else if (tipo === 'TRASLADO') {
        quienEntrega = funcionarioOrigen;
        quienRecibe = funcionarioDestino;
        tipoNovedadExcel = 'Cambio de responsable';
    }

    setCell('E7', tipoNovedadExcel);

    // Llenar activos (filas 11-25)
    let currentRow = 11;
    activos.forEach((activo) => {
        if (currentRow > 25) return;
        setCell(`E${currentRow}`, activo.tipo || activo.descripcion || 'ACTIVO');
        setCell(`G${currentRow}`, activo.marca || '-');
        setCell(`H${currentRow}`, activo.modelo || '-');
        setCell(`I${currentRow}`, activo.serial || 'S/N');
        setCell(`J${currentRow}`, activo.placa || '-');
        setCell(`K${currentRow}`, observaciones || '');
        currentRow++;
    });

    // Firmas
    setCell('E28', quienEntrega.nombre);
    setCell('K28', quienEntrega.cargo);
    setCell('J28', quienEntrega.codigoPersonal || '');

    setCell('E31', quienRecibe.nombre);
    setCell('K31', quienRecibe.cargo);
    setCell('J31', quienRecibe.codigoPersonal || '');

    return workbook;
};

// Generar Novedad
router.post('/generar', authMiddleware, requireRole('ADMIN', 'ANALISTA_TIC'), async (req, res) => {
    try {
        const { tipo, funcionarioId, activosIds, observaciones, funcionarioDestinoId } = req.body;
        const usuario = req.user; // Usuario logueado (TI)

        if (!activosIds || activosIds.length === 0) {
            return res.status(400).json({ error: 'Debe seleccionar al menos un activo' });
        }

        const funcionario = await prisma.funcionario.findUnique({ where: { id: parseInt(funcionarioId) } });
        if (!funcionario) return res.status(404).json({ error: 'Funcionario no encontrado' });

        let funcionarioDestino = null;
        if (tipo === 'TRASLADO') {
            if (!funcionarioDestinoId) {
                return res.status(400).json({ error: 'Se requiere funcionario destino para TRASLADO' });
            }
            funcionarioDestino = await prisma.funcionario.findUnique({ where: { id: parseInt(funcionarioDestinoId) } });
            if (!funcionarioDestino) return res.status(404).json({ error: 'Funcionario destino no encontrado' });
        }

        // 1. Obtener activos y validar sus estados
        const activos = await prisma.activo.findMany({
            where: { id: { in: activosIds } }
        });

        // Validaciones Estrictas por Tipo
        const errores = [];
        for (const activo of activos) {
            if (tipo === 'ASIGNACION') {
                if (activo.estado !== 'DISPONIBLE') {
                    errores.push(`Activo ${activo.placa} (${activo.marca} ${activo.modelo}) no está DISPONIBLE.`);
                }
            } else if (tipo === 'DEVOLUCION') {
                const asignacion = await prisma.asignacion.findFirst({
                    where: {
                        activoId: activo.id,
                        funcionarioId: parseInt(funcionarioId),
                        fechaFin: null
                    }
                });
                if (!asignacion && activo.estado !== 'ASIGNADO') {
                    errores.push(`Activo ${activo.placa} no está ASIGNADO o no pertenece a ${funcionario.nombre}.`);
                }
            } else if (tipo === 'TRASLADO') {
                const asignacion = await prisma.asignacion.findFirst({
                    where: {
                        activoId: activo.id,
                        funcionarioId: parseInt(funcionarioId),
                        fechaFin: null
                    }
                });
                if (!asignacion) {
                    errores.push(`Activo ${activo.placa} no está asignado a ${funcionario.nombre} para traslado.`);
                }
            }
        }

        if (errores.length > 0) {
            return res.status(400).json({ error: 'Errores de validación', detalles: errores });
        }

        // 2. Preparar Snapshot para Base de Datos y Futuro Excel
        const usuarioTI = {
            id: usuario.id,
            nombre: usuario.nombre,
            cargo: usuario.rol === 'ADMIN' ? 'COORDINADOR TIC' : 'ANALISTA TIC',
            dependencia: 'TIC'
        };

        const funcionarioOrigen = {
            id: funcionario.id,
            nombre: funcionario.nombre,
            cargo: funcionario.cargo || 'Funcionario',
            area: funcionario.area || 'General',
            codigoPersonal: funcionario.codigoPersonal || ''
        };

        let funcionarioDestinoSnapshot = null;
        if (tipo === 'TRASLADO') {
            funcionarioDestinoSnapshot = {
                id: funcionarioDestino.id,
                nombre: funcionarioDestino.nombre,
                cargo: funcionarioDestino.cargo,
                area: funcionarioDestino.area,
                codigoPersonal: funcionarioDestino.codigoPersonal || ''
            };
        }

        const snapshot = {
            activos: activos.map(a => ({
                id: a.id,
                placa: a.placa,
                serial: a.serial,
                tipo: a.tipo || a.descripcion,
                marca: a.marca,
                modelo: a.modelo
            })),
            funcionarioOrigen,
            funcionarioDestino: funcionarioDestinoSnapshot,
            usuarioTI,
            observaciones,
            fecha: new Date()
        };

        // 3. Persistencia en Base de Datos

        // 4. Persistencia en Base de Datos
        const resultado = await prisma.$transaction(async (tx) => {
            const acta = await tx.acta.create({
                data: {
                    tipo: tipo,
                    archivoUrl: null, // Ya no se genera archivo físico al crear
                    observaciones: observaciones,
                    creadoPorId: usuario.id,
                    funcionarioId: parseInt(funcionarioId),
                    detalles: JSON.stringify(snapshot)
                }
            });

            // Actualizar Estados
            for (const activo of activos) {
                if (tipo === 'ASIGNACION') {
                    await tx.activo.update({
                        where: { id: activo.id },
                        data: {
                            estado: 'ASIGNADO',
                            empresaFuncionario: funcionario.empresaFuncionario,
                            tipoPersonal: funcionario.vinculacion,
                            cedulaFuncionario: funcionario.cedula,
                            shortname: funcionario.shortname,
                            nombreFuncionario: funcionario.nombre,
                            departamento: funcionario.departamento,
                            ciudad: funcionario.ciudad,
                            cargo: funcionario.cargo,
                            area: funcionario.area
                        }
                    });
                    await tx.asignacion.create({
                        data: {
                            activoId: activo.id,
                            funcionarioId: parseInt(funcionarioId),
                            tipo: 'ASIGNACION',
                            fechaInicio: new Date(),
                            observaciones: observaciones || 'Asignación por Acta',
                            realizadoPor: usuario.nombre
                        }
                    });

                } else if (tipo === 'DEVOLUCION') {
                    await tx.asignacion.updateMany({
                        where: {
                            activoId: activo.id,
                            funcionarioId: parseInt(funcionarioId),
                            fechaFin: null
                        },
                        data: {
                            fechaFin: new Date(),
                            observaciones: observaciones ? `Devolución: ${observaciones}` : undefined
                        }
                    });
                    await tx.activo.update({
                        where: { id: activo.id },
                        data: {
                            estado: 'DISPONIBLE',
                            empresaFuncionario: null,
                            tipoPersonal: null,
                            cedulaFuncionario: null,
                            shortname: null,
                            nombreFuncionario: null,
                            departamento: null,
                            ciudad: null,
                            cargo: null,
                            area: null
                        }
                    });

                } else if (tipo === 'TRASLADO') {
                    await tx.asignacion.updateMany({
                        where: {
                            activoId: activo.id,
                            funcionarioId: parseInt(funcionarioId),
                            fechaFin: null
                        },
                        data: {
                            fechaFin: new Date(),
                            observaciones: `Traslado a ${snapshot.funcionarioDestino.nombre}`
                        }
                    });

                    await tx.activo.update({
                        where: { id: activo.id },
                        data: {
                            estado: 'ASIGNADO',
                            empresaFuncionario: funcionarioDestino.empresaFuncionario,
                            tipoPersonal: funcionarioDestino.vinculacion,
                            cedulaFuncionario: funcionarioDestino.cedula,
                            shortname: funcionarioDestino.shortname,
                            nombreFuncionario: funcionarioDestino.nombre,
                            departamento: funcionarioDestino.departamento,
                            ciudad: funcionarioDestino.ciudad,
                            cargo: funcionarioDestino.cargo,
                            area: funcionarioDestino.area
                        }
                    });

                    await tx.asignacion.create({
                        data: {
                            activoId: activo.id,
                            funcionarioId: parseInt(funcionarioDestinoId),
                            tipo: 'TRASLADO',
                            fechaInicio: new Date(),
                            observaciones: observaciones || `Traslado desde ${snapshot.funcionarioOrigen.nombre}`,
                            realizadoPor: usuario.nombre
                        }
                    });
                }
            }
            return acta;
        });

        res.json({
            message: 'Acta registrada exitosamente',
            acta: resultado
        });

    } catch (error) {
        console.error('Error generando acta:', error);
        res.status(500).json({ error: error.message || 'Error interno del servidor' });
    }
});

// Listar Historial de Actas
router.get('/', authMiddleware, async (req, res) => {
    try {
        const actas = await prisma.acta.findMany({
            include: {
                creadoPor: { select: { nombre: true, email: true } },
                funcionario: { select: { nombre: true, area: true } }
            },
            orderBy: { fecha: 'desc' }
        });
        res.json(actas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener historial de actas' });
    }
});

// Descargar Excel Bajo Demanda
router.get('/:id/download-xlsx', authMiddleware, async (req, res) => {
    try {
        const acta = await prisma.acta.findUnique({
            where: { id: parseInt(req.params.id) }
        });

        if (!acta) return res.status(404).json({ error: 'Acta no encontrada' });

        const snapshot = typeof acta.detalles === 'string' ? JSON.parse(acta.detalles) : acta.detalles;

        // Si el snapshot es del formato antiguo (solo array de activos), no podemos regenerar bien.
        // Pero para nuevos registros, tendrá todo.
        if (!snapshot || !snapshot.activos) {
            return res.status(400).json({ error: 'Este acta no tiene suficiente información para ser regenerada (formato antiguo).' });
        }

        const workbook = await crearWorkbookActa({
            ...snapshot,
            tipo: acta.tipo,
            fecha: acta.fecha
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Acta_${acta.tipo}_${acta.id}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Error al generar Excel:', error);
        res.status(500).json({ error: 'Error al generar el archivo Excel' });
    }
});

module.exports = router;
