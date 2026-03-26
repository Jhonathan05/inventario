const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

// GET /api/asignaciones
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { activoId, funcionarioId, activa } = req.query;
        const where = {};
        if (activoId) where.activoId = parseInt(activoId);
        if (funcionarioId) where.funcionarioId = parseInt(funcionarioId);
        if (activa === 'true') where.fechaFin = null;

        const asignaciones = await prisma.asignacion.findMany({
            where,
            include: {
                activo: { include: { categoria: true } },
                funcionario: true,
                documentos: true,
            },
            orderBy: { fechaInicio: 'desc' },
        });
        res.json(asignaciones);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener asignaciones' });
    }
});

// POST /api/asignaciones - Asignar, trasladar o devolver
router.post('/', authMiddleware, requireRole('ADMIN', 'TECNICO'), async (req, res) => {
    try {
        const { activoId, funcionarioId, tipo, observaciones } = req.body;

        // Cerrar asignación activa anterior
        await prisma.asignacion.updateMany({
            where: { activoId: parseInt(activoId), fechaFin: null },
            data: { fechaFin: new Date() },
        });

        // Determinar nuevo estado del activo
        let nuevoEstado = 'DISPONIBLE';
        if (tipo === 'ASIGNACION' || tipo === 'TRASLADO') nuevoEstado = 'ASIGNADO';

        // Actualizar estado del activo
        await prisma.activo.update({
            where: { id: parseInt(activoId) },
            data: { estado: nuevoEstado },
        });

        // Crear nueva asignación (No se crea para DEVOLUCION ya que solo cierra la anterior)
        if (tipo === 'DEVOLUCION') {
            return res.status(201).json({ message: 'Activo devuelto a TI correctamente' });
        }

        const data = {
            activoId: parseInt(activoId),
            funcionarioId: parseInt(funcionarioId),
            tipo,
            observaciones,
            realizadoPor: req.user.nombre,
        };

        const asignacion = await prisma.asignacion.create({
            data,
            include: { activo: true, funcionario: true },
        });

        res.status(201).json(asignacion);
    } catch (err) {
        res.status(500).json({ error: 'Error al registrar asignación' });
    }
});

// POST /api/asignaciones/devolucion - Devolver a TI
router.post('/devolucion', authMiddleware, requireRole('ADMIN', 'TECNICO'), async (req, res) => {
    try {
        const { activoId, observaciones } = req.body;

        // Cerrar asignación activa
        await prisma.asignacion.updateMany({
            where: { activoId: parseInt(activoId), fechaFin: null },
            data: { fechaFin: new Date() },
        });

        // Marcar activo como disponible
        await prisma.activo.update({
            where: { id: parseInt(activoId) },
            data: { estado: 'DISPONIBLE' },
        });

        res.json({ message: 'Activo devuelto a TI correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al registrar devolución' });
    }
});

module.exports = router;
