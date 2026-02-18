const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

// GET /api/activos - Listar con filtros
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { categoriaId, estado, search } = req.query;
        const where = {};
        if (categoriaId) where.categoriaId = parseInt(categoriaId);
        if (estado) where.estado = estado;
        if (search) {
            where.OR = [
                { placa: { contains: search, mode: 'insensitive' } },
                { serial: { contains: search, mode: 'insensitive' } },
                { marca: { contains: search, mode: 'insensitive' } },
                { modelo: { contains: search, mode: 'insensitive' } },
            ];
        }

        const activos = await prisma.activo.findMany({
            where,
            include: {
                categoria: true,
                asignaciones: {
                    where: { fechaFin: null },
                    include: { funcionario: true },
                    take: 1,
                },
            },
            orderBy: { creadoEn: 'desc' },
        });
        res.json(activos);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener activos' });
    }
});

// GET /api/activos/:id - Detalle completo
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const activo = await prisma.activo.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                categoria: true,
                asignaciones: {
                    include: { funcionario: true, documentos: true },
                    orderBy: { fechaInicio: 'desc' },
                },
                hojaVida: {
                    include: { documentos: true },
                    orderBy: { fecha: 'desc' },
                },
                documentos: true,
            },
        });
        if (!activo) return res.status(404).json({ error: 'Activo no encontrado' });
        res.json(activo);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener activo' });
    }
});

// POST /api/activos
router.post('/', authMiddleware, requireRole('ADMIN', 'TECNICO'), async (req, res) => {
    try {
        const activo = await prisma.activo.create({ data: req.body, include: { categoria: true } });
        res.status(201).json(activo);
    } catch (err) {
        if (err.code === 'P2002') return res.status(400).json({ error: 'La placa ya existe' });
        res.status(500).json({ error: 'Error al crear activo' });
    }
});

// PUT /api/activos/:id
router.put('/:id', authMiddleware, requireRole('ADMIN', 'TECNICO'), async (req, res) => {
    try {
        const activo = await prisma.activo.update({
            where: { id: parseInt(req.params.id) },
            data: req.body,
            include: { categoria: true },
        });
        res.json(activo);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar activo' });
    }
});

// DELETE /api/activos/:id
router.delete('/:id', authMiddleware, requireRole('ADMIN'), async (req, res) => {
    try {
        await prisma.activo.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: 'Activo eliminado' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar activo' });
    }
});

module.exports = router;
