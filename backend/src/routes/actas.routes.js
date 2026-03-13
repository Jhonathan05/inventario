const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const path = require('path');
const fs = require('fs');
const XlsxPopulate = require('xlsx-populate');

// Función auxiliar para obtener fecha formateada
const getFormattedDate = (date = new Date()) => {
    const now = date;
    // Formato: AAAA / MM / DD para plantilla Excel
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy} / ${mm} / ${dd}`;
};

// HELPER PARA GENERAR WORKBOOK (EXCEL)
// ==========================================
const crearWorkbookActa = async (data) => {
    const { tipo, activos, funcionarioOrigen, funcionarioDestino, usuarioTI, observaciones, fecha } = data;
    const templatePath = path.join(__dirname, '../../plantillas/novedad_activo.xlsx');

    // Cargar con xlsx-populate (este respeta mejor los logos)
    const workbook = await XlsxPopulate.fromFileAsync(templatePath);
    const sheet = workbook.sheet(0);

    // Mapeo de encabezados
    sheet.cell('L7').value(getFormattedDate(new Date(fecha))).style("fontColor", "000000");
    sheet.cell('H7').value((funcionarioOrigen?.ciudad || 'IBAGUÉ').toUpperCase()).style("fontColor", "000000");

    let tipoTexto = 'INVENTARIO FÍSICO';
    let entrega = usuarioTI || {};
    let recibe = funcionarioOrigen || {};

    if (tipo === 'DEVOLUCION') {
        entrega = funcionarioOrigen || {};
        recibe = usuarioTI || {};
    } else if (tipo === 'TRASLADO') {
        entrega = funcionarioOrigen || {};
        recibe = funcionarioDestino || {};
        tipoTexto = 'CAMBIO DE RESPONSABLE';
    }

    sheet.cell('E7').value(tipoTexto).style("fontColor", "000000");

    // Llenar tabla de activos (Filas 11 a 25)
    for (let i = 0; i < 15; i++) {
        const rowNum = 11 + i;
        const activo = activos[i];

        if (activo) {
            sheet.cell(`C${rowNum}`).value((activo.placa || activo.id || i + 1).toString().toUpperCase()).style("fontColor", "000000");
            sheet.cell(`E${rowNum}`).value((activo.tipo || activo.descripcion || '').toUpperCase()).style("fontColor", "000000");
            sheet.cell(`G${rowNum}`).value((activo.marca || '').toUpperCase()).style("fontColor", "000000");
            sheet.cell(`H${rowNum}`).value((activo.modelo || '').toUpperCase()).style("fontColor", "000000");
            sheet.cell(`I${rowNum}`).value((activo.serial || 'N/A').toUpperCase()).style("fontColor", "000000");
            sheet.cell(`J${rowNum}`).value((activo.placa || 'N/A').toUpperCase()).style("fontColor", "000000");
            sheet.cell(`K${rowNum}`).value((observaciones || 'N/A').toUpperCase()).style("fontColor", "000000");
        } else {
            // Si no hay activo, todo es N/A
            sheet.cell(`C${rowNum}`).value('N/A').style("fontColor", "000000");
            sheet.cell(`E${rowNum}`).value('N/A').style("fontColor", "000000");
            sheet.cell(`G${rowNum}`).value('N/A').style("fontColor", "000000");
            sheet.cell(`H${rowNum}`).value('N/A').style("fontColor", "000000");
            sheet.cell(`I${rowNum}`).value('N/A').style("fontColor", "000000");
            sheet.cell(`J${rowNum}`).value('N/A').style("fontColor", "000000");
            sheet.cell(`K${rowNum}`).value('N/A').style("fontColor", "000000");
        }
    }

    // Firmas
    // ENTREGA (Fila 28)
    sheet.cell('E28').value((entrega.nombre || '').toUpperCase()).style("fontColor", "000000");
    sheet.cell('J28').value((entrega.codigoPersonal || '').toUpperCase()).style("fontColor", "000000");
    sheet.cell('K28').value((entrega.cargo || '').toUpperCase()).style("fontColor", "000000");
    sheet.cell('C28').value((entrega.area || entrega.dependencia || 'TIC').toUpperCase()).style("fontColor", "000000");

    // RECIBE (Fila 31)
    sheet.cell('E31').value((recibe.nombre || '').toUpperCase()).style("fontColor", "000000");
    sheet.cell('J31').value((recibe.codigoPersonal || '').toUpperCase()).style("fontColor", "000000");
    sheet.cell('K31').value((recibe.cargo || '').toUpperCase()).style("fontColor", "000000");
    sheet.cell('C31').value((recibe.area || recibe.dependencia || '').toUpperCase()).style("fontColor", "000000");

    return workbook;
};

// Generar Novedad
router.post('/generar', authMiddleware, requireRole('ADMIN', 'TECNICO'), async (req, res) => {
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

        // 4. Persistencia en Base de Datos (usamos tx para asegurar atomicidad)
        const resultado = await prisma.$transaction(async (tx) => {
            const acta = await tx.acta.create({
                data: {
                    tipo: tipo,
                    archivoUrl: null,
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

        if (!snapshot || !snapshot.activos) {
            return res.status(400).json({ error: 'Este acta no tiene suficiente información para ser regenerada.' });
        }

        const workbook = await crearWorkbookActa({
            ...snapshot,
            tipo: acta.tipo,
            fecha: acta.fecha
        });

        const tempDir = path.join(__dirname, '../../uploads/temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        const tempFileName = `Acta_${acta.id}_${Date.now()}.xlsx`;
        const tempFilePath = path.join(tempDir, tempFileName);

        await workbook.toFileAsync(tempFilePath);

        res.download(tempFilePath, `Acta_${acta.id}.xlsx`);

    } catch (error) {
        console.error('Error al generar Excel:', error);
        res.status(500).json({ error: 'Error al generar el archivo Excel' });
    }
});

// Eliminar Acta DEFINITIVAMENTE (Solo ADMIN)
router.delete('/:id', authMiddleware, requireRole(['ADMIN']), async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar si existe antes de borrar
        const acta = await prisma.acta.findUnique({
            where: { id: parseInt(id) }
        });

        if (!acta) {
            return res.status(404).json({ error: 'Acta no encontrada' });
        }

        await prisma.acta.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Acta eliminada definitivamente del sistema' });
    } catch (error) {
        console.error('Error eliminando acta:', error);
        res.status(500).json({ error: 'Error interno al intentar eliminar el acta' });
    }
});

module.exports = router;
