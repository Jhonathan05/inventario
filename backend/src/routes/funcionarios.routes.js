const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

// GET /api/funcionarios
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { search, activo } = req.query;
        const where = {};
        if (activo !== undefined) where.activo = activo === 'true';
        if (search) {
            where.OR = [
                { nombre: { contains: search, mode: 'insensitive' } },
                { cedula: { contains: search, mode: 'insensitive' } },
                { area: { contains: search, mode: 'insensitive' } },
            ];
        }
        const funcionarios = await prisma.funcionario.findMany({
            where,
            include: {
                _count: { select: { asignaciones: { where: { fechaFin: null } } } },
            },
            orderBy: { nombre: 'asc' },
        });
        res.json(funcionarios);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener funcionarios' });
    }
});

// GET /api/funcionarios/:id
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const funcionario = await prisma.funcionario.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                asignaciones: {
                    include: { activo: { include: { categoria: true } } },
                    orderBy: { fechaInicio: 'desc' },
                },
            },
        });
        if (!funcionario) return res.status(404).json({ error: 'Funcionario no encontrado' });
        res.json(funcionario);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener funcionario' });
    }
});

// POST /api/funcionarios
router.post('/', authMiddleware, requireRole('ADMIN', 'TECNICO'), async (req, res) => {
    try {
        const funcionario = await prisma.funcionario.create({ data: req.body });
        res.status(201).json(funcionario);
    } catch (err) {
        if (err.code === 'P2002') return res.status(400).json({ error: 'La cédula ya existe' });
        res.status(500).json({ error: 'Error al crear funcionario' });
    }
});

// PUT /api/funcionarios/:id
router.put('/:id', authMiddleware, requireRole('ADMIN', 'TECNICO'), async (req, res) => {
    try {
        const funcionario = await prisma.funcionario.update({
            where: { id: parseInt(req.params.id) },
            data: req.body,
        });
        res.json(funcionario);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar funcionario' });
    }
});

module.exports = router;
