const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

// GET /api/licencias - Listar licencias con filtros y paginado
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { search, tipoLicencia, asignada, page = 1, limit = 50 } = req.query;
        const where = {};

        if (tipoLicencia) where.tipoLicencia = tipoLicencia;
        
        if (asignada === 'true') {
            where.activoId = { not: null };
        } else if (asignada === 'false') {
            where.activoId = null;
        }

        if (search) {
            where.OR = [
                { software: { contains: search, mode: 'insensitive' } },
                { llaveLicencia: { contains: search, mode: 'insensitive' } },
                { observaciones: { contains: search, mode: 'insensitive' } },
                { activo: { placa: { contains: search, mode: 'insensitive' } } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        const [licencias, total] = await Promise.all([
            prisma.licencia.findMany({
                where,
                skip,
                take,
                include: {
                    activo: {
                        select: { id: true, placa: true, marca: true, modelo: true, activoFijo: true, nombreEquipo: true }
                    }
                },
                orderBy: { creadoEn: 'desc' },
            }),
            prisma.licencia.count({ where })
        ]);

        res.json({
            data: licencias,
            pagination: {
                page: parseInt(page),
                limit: take,
                total,
                pages: Math.ceil(total / take)
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener licencias' });
    }
});

// GET /api/licencias/:id - Detalle de licencia
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const licencia = await prisma.licencia.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                activo: true
            }
        });
        if (!licencia) return res.status(404).json({ error: 'Licencia no encontrada' });
        res.json(licencia);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener la licencia' });
    }
});

// POST /api/licencias - Crear licencia
router.post('/', authMiddleware, requireRole('ADMIN', 'ANALISTA_TIC'), async (req, res) => {
    try {
        const data = req.body;
        
        // Conversiones de tipos
        if (data.cantidad) data.cantidad = parseInt(data.cantidad);
        if (data.costo) data.costo = parseFloat(data.costo);
        if (data.fechaCompra) data.fechaCompra = new Date(data.fechaCompra);
        if (data.vencimiento) data.vencimiento = new Date(data.vencimiento);
        if (data.activoId) data.activoId = parseInt(data.activoId);

        const licencia = await prisma.licencia.create({
            data,
            include: { activo: { select: { placa: true } } }
        });
        
        res.status(201).json(licencia);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear la licencia', detail: err.message });
    }
});

// PUT /api/licencias/:id - Actualizar licencia
router.put('/:id', authMiddleware, requireRole('ADMIN', 'ANALISTA_TIC'), async (req, res) => {
    try {
        const data = req.body;
        
        if (data.cantidad !== undefined) data.cantidad = parseInt(data.cantidad);
        if (data.costo !== undefined) data.costo = parseFloat(data.costo) || null;
        if (data.fechaCompra !== undefined) data.fechaCompra = data.fechaCompra ? new Date(data.fechaCompra) : null;
        if (data.vencimiento !== undefined) data.vencimiento = data.vencimiento ? new Date(data.vencimiento) : null;
        if (data.activoId !== undefined) data.activoId = data.activoId ? parseInt(data.activoId) : null;

        const licencia = await prisma.licencia.update({
            where: { id: parseInt(req.params.id) },
            data,
            include: { activo: { select: { placa: true } } }
        });
        res.json(licencia);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar la licencia', detail: err.message });
    }
});

// DELETE /api/licencias/:id - Eliminar licencia
router.delete('/:id', authMiddleware, requireRole('ADMIN'), async (req, res) => {
    try {
        await prisma.licencia.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: 'Licencia eliminada correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar la licencia' });
    }
});

module.exports = router;
