const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

// GET /api/funcionarios
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { search, activo, area, cargo, vinculacion } = req.query;
        const where = {};

        if (activo !== undefined) where.activo = activo === 'true';
        if (area) where.area = { contains: area, mode: 'insensitive' };
        if (cargo) where.cargo = { contains: cargo, mode: 'insensitive' };
        if (vinculacion) where.vinculacion = { contains: vinculacion, mode: 'insensitive' };

        if (search) {
            where.OR = [
                { nombre: { contains: search, mode: 'insensitive' } },
                { cedula: { contains: search, mode: 'insensitive' } },
                { codigoPersonal: { contains: search, mode: 'insensitive' } },
                { area: { contains: search, mode: 'insensitive' } },
                { cargo: { contains: search, mode: 'insensitive' } },
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

// GET /api/funcionarios/opciones  — valores únicos para filtros (desde Catálogos)
router.get('/opciones', authMiddleware, async (req, res) => {
    try {
        const [areasRaw, cargosRaw, ciudadesRaw, seccionalesRaw] = await Promise.all([
            prisma.catalogo.findMany({
                where: { dominio: 'AREA', activo: true },
                select: { valor: true },
                orderBy: { valor: 'asc' },
            }),
            prisma.catalogo.findMany({
                where: { dominio: 'CARGO', activo: true },
                select: { valor: true },
                orderBy: { valor: 'asc' },
            }),
            prisma.catalogo.findMany({
                where: { dominio: 'CIUDAD', activo: true },
                select: { valor: true },
                orderBy: { valor: 'asc' },
            }),
            prisma.catalogo.findMany({
                where: { dominio: 'SECCIONAL', activo: true },
                select: { valor: true },
                orderBy: { valor: 'asc' },
            }),
        ]);
        res.json({
            areas: areasRaw.map(r => r.valor),
            cargos: cargosRaw.map(r => r.valor),
            ciudades: ciudadesRaw.map(r => r.valor),
            seccionales: seccionalesRaw.map(r => r.valor),
        });
    } catch (err) {
        console.error('Error fetching options:', err);
        res.status(500).json({ error: 'Error al obtener opciones' });
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
router.post('/', authMiddleware, requireRole('ADMIN', 'ANALISTA_TIC'), async (req, res) => {
    try {
        const data = req.body;
        if (data.codigoPersonal === '') data.codigoPersonal = null;

        const funcionario = await prisma.funcionario.create({ data });
        res.status(201).json(funcionario);
    } catch (err) {
        if (err.code === 'P2002') {
            const field = err.meta?.target?.[0];
            return res.status(400).json({
                error: field === 'cedula' ? 'La cédula ya existe' :
                    field === 'codigoPersonal' ? 'El código personal ya existe' :
                        'Dato duplicado'
            });
        }
        res.status(500).json({ error: 'Error al crear funcionario' });
    }
});

// PUT /api/funcionarios/:id
router.put('/:id', authMiddleware, requireRole('ADMIN', 'ANALISTA_TIC'), async (req, res) => {
    try {
        const data = req.body;
        if (data.codigoPersonal === '') data.codigoPersonal = null;

        const funcionario = await prisma.funcionario.update({
            where: { id: parseInt(req.params.id) },
            data,
        });
        res.json(funcionario);
    } catch (err) {
        if (err.code === 'P2002') {
            const field = err.meta?.target?.[0];
            return res.status(400).json({
                error: field === 'cedula' ? 'La cédula ya existe' :
                    field === 'codigoPersonal' ? 'El código personal ya existe' :
                        'Dato duplicado'
            });
        }
        res.status(500).json({ error: 'Error al actualizar funcionario' });
    }
});

module.exports = router;
