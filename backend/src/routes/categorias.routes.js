const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

// GET /api/categorias
router.get('/', authMiddleware, async (req, res) => {
    try {
        const categorias = await prisma.categoria.findMany({
            include: { _count: { select: { activos: true } } },
            orderBy: { nombre: 'asc' },
        });
        res.json(categorias);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
});

// POST /api/categorias
router.post('/', authMiddleware, requireRole('ADMIN', 'TECNICO'), async (req, res) => {
    try {
        const { nombre, icono } = req.body;
        const categoria = await prisma.categoria.create({ data: { nombre, icono } });
        res.status(201).json(categoria);
    } catch (err) {
        if (err.code === 'P2002') return res.status(400).json({ error: 'La categoría ya existe' });
        res.status(500).json({ error: 'Error al crear categoría' });
    }
});

// PUT /api/categorias/:id
router.put('/:id', authMiddleware, requireRole('ADMIN', 'TECNICO'), async (req, res) => {
    try {
        const { nombre, icono } = req.body;
        const categoria = await prisma.categoria.update({
            where: { id: parseInt(req.params.id) },
            data: { nombre, icono },
        });
        res.json(categoria);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar categoría' });
    }
});

// DELETE /api/categorias/:id
router.delete('/:id', authMiddleware, requireRole('ADMIN'), async (req, res) => {
    try {
        await prisma.categoria.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: 'Categoría eliminada' });
    } catch (err) {
        if (err.code === 'P2003') return res.status(400).json({ error: 'No se puede eliminar: tiene activos asociados' });
        res.status(500).json({ error: 'Error al eliminar categoría' });
    }
});

module.exports = router;
