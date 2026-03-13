const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authMiddleware } = require('../middleware/auth.middleware');
const path = require('path');
const fs = require('fs');
// const XLSX = require('xlsx'); // Reemplazado por exceljs
const ExcelJS = require('exceljs');

// Función auxiliar para obtener fecha formateada
const getFormattedDate = () => {
    const now = new Date();
    // Formato: AAAA / MM / DD para plantilla Excel
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy} / ${mm} / ${dd}`;
};

// Generar Novedad
router.post('/generar', authMiddleware, async (req, res) => {
    try {
        const { tipo, funcionarioId, activosIds, observaciones, funcionarioDestinoId } = req.body;
        const usuario = req.user; // Usuario logueado (TI)

        if (!activosIds || activosIds.length === 0) {
            return res.status(400).json({ error: 'Debe seleccionar al menos un activo' });
        }

        const funcionario = await prisma.funcionario.findUnique({ where: { id: parseInt(funcionarioId) } });
        if (!funcionario) return res.status(404).json({ error: 'Funcionario no encontrado' });

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

        // 2. Preparar Datos para Excel
        let quienEntrega = {}; // { nombre, cargo, dependencia }
        let quienRecibe = {};
        let tipoNovedadExcel = ''; // Valor para celda E7

        // Datos del Usuario TI (Logueado)
        const usuarioTI = {
            nombre: usuario.nombre,
            cargo: usuario.rol === 'ADMIN' ? 'COORDINADOR TIC' : 'ANALISTA TIC',
            dependencia: 'TIC'
        };

        const funcionarioDatos = {
            nombre: funcionario.nombre,
            cargo: funcionario.cargo || 'Funcionario',
            dependencia: funcionario.area || 'General'
        };

        if (tipo === 'ASIGNACION') {
            quienEntrega = usuarioTI;
            quienRecibe = funcionarioDatos;
            tipoNovedadExcel = 'Inventario Físico';

        } else if (tipo === 'DEVOLUCION') {
            quienEntrega = funcionarioDatos;
            quienRecibe = usuarioTI;
            tipoNovedadExcel = 'Inventario Físico';

        } else if (tipo === 'TRASLADO') {
            if (!funcionarioDestinoId) {
                return res.status(400).json({ error: 'Se requiere funcionario destino para TRASLADO' });
            }
            const funcionarioDestino = await prisma.funcionario.findUnique({ where: { id: parseInt(funcionarioDestinoId) } });
            if (!funcionarioDestino) return res.status(404).json({ error: 'Funcionario destino no encontrado' });

            quienEntrega = funcionarioDatos;
            quienRecibe = {
                nombre: funcionarioDestino.nombre,
                cargo: funcionarioDestino.cargo,
                dependencia: funcionarioDestino.area
            };
            tipoNovedadExcel = 'Cambio de responsable';
        }

        // 3. Generar Archivo Excel con ExcelJS
        const templatePath = path.join(__dirname, '../../plantillas/novedad_activo.xlsx'); // Usar .xlsx convertido
        const uploadDir = path.join(__dirname, '../../uploads/actas');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        // Guardar como .xlsx ahora porque exceljs trabaja con xlsx
        const fileName = `Acta_${tipo}_${Date.now()}.xlsx`;
        const outputPath = path.join(uploadDir, fileName);

        if (!fs.existsSync(templatePath)) {
            // Fallback si no existe el xlsx convertido: intentar usar el xls con SheetJS?
            // No, fallar explícitamente para que el usuario sepa que necesitamos la plantilla bien.
            throw new Error('Plantilla "novedad_activo.xlsx" no encontrada. Ejecute el script de conversión.');
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);

        const worksheet = workbook.worksheets[0]; // Primera hoja

        const setCell = (cellRef, value) => {
            const cell = worksheet.getCell(cellRef);
            cell.value = value;
            // ExcelJS mantiene estilos automáticamente al asignar valor
        };

        // Llenar Encabezados
        setCell('L7', getFormattedDate());        // Fecha
        setCell('E7', tipoNovedadExcel);          // Tipo Novedad

        // Llenar Tabla (Filas 11-25)
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

        // Llenar Firmas
        setCell('E28', quienEntrega.nombre);
        setCell('K28', quienEntrega.cargo);

        setCell('E31', quienRecibe.nombre);
        setCell('K31', quienRecibe.cargo);

        // Guardar archivo generated
        await workbook.xlsx.writeFile(outputPath);

        // 4. Persistencia en Base de Datos
        const resultado = await prisma.$transaction(async (tx) => {
            const acta = await tx.acta.create({
                data: {
                    tipo: tipo,
                    archivoUrl: `/uploads/actas/${fileName}`,
                    observaciones: observaciones,
                    creadoPorId: usuario.id,
                    funcionarioId: parseInt(funcionarioId),
                    detalles: JSON.stringify(activos.map(a => ({ id: a.id, placa: a.placa, serial: a.serial })))
                }
            });

            // Actualizar Estados
            for (const activo of activos) {
                if (tipo === 'ASIGNACION') {
                    await tx.activo.update({
                        where: { id: activo.id },
                        data: { estado: 'ASIGNADO' }
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
                        data: { estado: 'DISPONIBLE' }
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
                            observaciones: `Traslado a ${quienRecibe.nombre}`
                        }
                    });
                    await tx.asignacion.create({
                        data: {
                            activoId: activo.id,
                            funcionarioId: parseInt(funcionarioDestinoId),
                            tipo: 'TRASLADO',
                            fechaInicio: new Date(),
                            observaciones: observaciones || `Traslado desde ${quienEntrega.nombre}`,
                            realizadoPor: usuario.nombre
                        }
                    });
                }
            }
            return acta;
        });

        res.json({
            message: 'Acta generada exitosamente',
            acta: resultado,
            archivoUrl: resultado.archivoUrl
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

module.exports = router;
