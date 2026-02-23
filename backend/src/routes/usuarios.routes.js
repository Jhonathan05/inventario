const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

// GET /api/usuarios
router.get('/', authMiddleware, requireRole('ADMIN'), async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany({
            select: { id: true, nombre: true, email: true, rol: true, activo: true, creadoEn: true },
            orderBy: { nombre: 'asc' },
        });
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// POST /api/usuarios
router.post('/', authMiddleware, requireRole('ADMIN'), async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const usuario = await prisma.usuario.create({
            data: { nombre, email, password: hash, rol },
            select: { id: true, nombre: true, email: true, rol: true, activo: true },
        });
        res.status(201).json(usuario);
    } catch (err) {
        if (err.code === 'P2002') return res.status(400).json({ error: 'El email ya existe' });
        res.status(500).json({ error: 'Error al crear usuario' });
    }
});

// PUT /api/usuarios/:id
router.put('/:id', authMiddleware, requireRole('ADMIN'), async (req, res) => {
    try {
        const { nombre, email, rol, activo, password } = req.body;
        const data = { nombre, email, activo };

        // Bloquear asignación/cambio de rol si quien llama no es ADMIN superior
        if (rol && req.user.rol === 'ADMIN') {
            data.rol = rol;
        }

        if (password) data.password = await bcrypt.hash(password, 10);

        const usuario = await prisma.usuario.update({
            where: { id: parseInt(req.params.id) },
            data,
            select: { id: true, nombre: true, email: true, rol: true, activo: true },
        });
        res.json(usuario);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});

module.exports = router;
