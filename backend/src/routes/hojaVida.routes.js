const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

// GET /api/hoja-vida?activoId=X
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { activoId } = req.query;
        const where = {};
        if (activoId) where.activoId = parseInt(activoId);

        const registros = await prisma.hojaVida.findMany({
            where,
            include: { activo: { include: { categoria: true } }, documentos: true },
            orderBy: { fecha: 'desc' },
        });
        res.json(registros);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener hoja de vida' });
    }
});

// GET /api/hoja-vida/:id
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const registro = await prisma.hojaVida.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { activo: true, documentos: true },
        });
        if (!registro) return res.status(404).json({ error: 'Registro no encontrado' });
        res.json(registro);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener registro' });
    }
});

// POST /api/hoja-vida
router.post('/', authMiddleware, requireRole('ADMIN', 'TECNICO'), async (req, res) => {
    try {
        const { activoId, tipo, descripcion, tecnico, costo, fecha, proximoMantenimiento } = req.body;

        // Si es mantenimiento, actualizar estado del activo
        if (tipo === 'MANTENIMIENTO' || tipo === 'REPARACION') {
            await prisma.activo.update({
                where: { id: parseInt(activoId) },
                data: { estado: 'EN_MANTENIMIENTO' },
            });
        }

        const registro = await prisma.hojaVida.create({
            data: {
                activoId: parseInt(activoId),
                tipo,
                descripcion,
                tecnico,
                costo: costo ? parseFloat(costo) : null,
                fecha: fecha ? new Date(fecha) : new Date(),
                proximoMantenimiento: proximoMantenimiento ? new Date(proximoMantenimiento) : null,
                registradoPor: req.user.nombre,
            },
            include: { activo: true },
        });
        res.status(201).json(registro);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear registro de hoja de vida' });
    }
});

// PUT /api/hoja-vida/:id
router.put('/:id', authMiddleware, requireRole('ADMIN', 'TECNICO'), async (req, res) => {
    try {
        const registro = await prisma.hojaVida.update({
            where: { id: parseInt(req.params.id) },
            data: req.body,
        });
        res.json(registro);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar registro' });
    }
});

// DELETE /api/hoja-vida/:id
router.delete('/:id', authMiddleware, requireRole('ADMIN'), async (req, res) => {
    try {
        await prisma.hojaVida.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: 'Registro eliminado' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar registro' });
    }
});

module.exports = router;
