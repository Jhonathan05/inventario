const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// GET /api/activos - Listar con filtros
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { categoriaId, estado, search, empresaPropietaria, estadoOperativo, tipo, funcionarioId } = req.query;
        const where = {};
        if (categoriaId) where.categoriaId = parseInt(categoriaId);
        if (estado) where.estado = estado;
        if (empresaPropietaria) where.empresaPropietaria = empresaPropietaria;
        if (estadoOperativo) where.estadoOperativo = estadoOperativo;
        if (tipo) where.tipo = tipo;
        if (funcionarioId) {
            where.asignaciones = {
                some: {
                    funcionarioId: parseInt(funcionarioId),
                    fechaFin: null
                }
            };
        }
        if (search) {
            where.OR = [
                { placa: { contains: search, mode: 'insensitive' } },
                { serial: { contains: search, mode: 'insensitive' } },
                { marca: { contains: search, mode: 'insensitive' } },
                { modelo: { contains: search, mode: 'insensitive' } },
                { nombreFuncionario: { contains: search, mode: 'insensitive' } },
                { cedulaFuncionario: { contains: search, mode: 'insensitive' } },
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

// GET /api/activos/historial/:funcionarioId - Historial de activos de un funcionario
router.get('/historial/:funcionarioId', authMiddleware, async (req, res) => {
    try {
        const id = parseInt(req.params.funcionarioId);
        const asignaciones = await prisma.asignacion.findMany({
            where: { funcionarioId: id },
            include: {
                activo: { include: { categoria: true } }
            },
            orderBy: { fechaInicio: 'desc' }
        });
        res.json(asignaciones);
    } catch (err) {
        res.status(500).json({ error: 'Error al cargar historial' });
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
                    include: {
                        documentos: true,
                        responsable: true, // Include the assigned user
                        trazas: {
                            include: { usuario: true },
                            orderBy: { fecha: 'desc' }
                        }
                    },
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
router.post('/', authMiddleware, requireRole('ADMIN', 'TECNICO'), upload.single('imagen'), async (req, res) => {
    try {
        const data = req.body;
        // Convertir campos numéricos y de fecha (multipart/form-data los envía como string)
        if (data.categoriaId) data.categoriaId = parseInt(data.categoriaId);
        if (data.valorCompra) data.valorCompra = parseFloat(data.valorCompra);
        if (data.fechaCompra) data.fechaCompra = new Date(data.fechaCompra);
        if (data.garantiaHasta) data.garantiaHasta = new Date(data.garantiaHasta);
        // Remove empty strings to allow DB defaults to work
        if (data.categoriaId === '' || isNaN(data.categoriaId)) delete data.categoriaId;

        // Manejo de imagen
        if (req.file) {
            data.imagen = `uploads/${req.file.filename}`;
        }

        const activo = await prisma.activo.create({ data, include: { categoria: true } });
        res.status(201).json(activo);
    } catch (err) {
        console.error(err);
        if (err.code === 'P2002') return res.status(400).json({ error: 'La placa ya existe' });
        res.status(500).json({ error: 'Error al crear activo', detail: err.message });
    }
});

// PUT /api/activos/:id
router.put('/:id', authMiddleware, requireRole('ADMIN', 'TECNICO'), upload.single('imagen'), async (req, res) => {
    try {
        const data = req.body;
        if (data.categoriaId) data.categoriaId = parseInt(data.categoriaId);
        if (data.valorCompra) data.valorCompra = parseFloat(data.valorCompra);
        if (data.fechaCompra) data.fechaCompra = new Date(data.fechaCompra);
        if (data.garantiaHasta) data.garantiaHasta = new Date(data.garantiaHasta);
        if (data.categoriaId === '' || isNaN(data.categoriaId)) delete data.categoriaId;

        if (req.file) {
            data.imagen = `uploads/${req.file.filename}`;
        }

        const activo = await prisma.activo.update({
            where: { id: parseInt(req.params.id) },
            data,
            include: { categoria: true },
        });
        res.json(activo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar activo', detail: err.message });
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
