const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

// GET /api/catalogos
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { dominio, activo } = req.query;
        const where = {};
        if (dominio) where.dominio = dominio;
        if (activo !== undefined) where.activo = activo === 'true';

        const catalogos = await prisma.catalogo.findMany({
            where,
            orderBy: [
                { dominio: 'asc' },
                { valor: 'asc' }
            ]
        });
        res.json(catalogos);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener catálogos' });
    }
});

// POST /api/catalogos
router.post('/', authMiddleware, requireRole('ADMIN'), async (req, res) => {
    try {
        const { dominio, valor, descripcion, activo } = req.body;

        if (!dominio || !valor) {
            return res.status(400).json({ error: 'Dominio y valor son requeridos' });
        }

        const nuevo = await prisma.catalogo.create({
            data: {
                dominio: dominio.toUpperCase(),
                valor: valor.toUpperCase(),
                descripcion,
                activo: activo !== undefined ? activo : true
            }
        });
        res.status(201).json(nuevo);
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(400).json({ error: 'Ya existe este valor en el dominio especificado' });
        }
        res.status(500).json({ error: 'Error al crear catálogo' });
    }
});

// PUT /api/catalogos/:id
router.put('/:id', authMiddleware, requireRole('ADMIN'), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { dominio, valor, descripcion, activo } = req.body;

        const actualizado = await prisma.catalogo.update({
            where: { id },
            data: {
                dominio: dominio?.toUpperCase(),
                valor: valor?.toUpperCase(),
                descripcion,
                activo
            }
        });
        res.json(actualizado);
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(400).json({ error: 'Ya existe este valor en el dominio especificado' });
        }
        res.status(500).json({ error: 'Error al actualizar catálogo' });
    }
});

// DELETE /api/catalogos/:id
router.delete('/:id', authMiddleware, requireRole('ADMIN'), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await prisma.catalogo.delete({ where: { id } });
        res.json({ message: 'Catálogo eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar catálogo' });
    }
});

module.exports = router;
