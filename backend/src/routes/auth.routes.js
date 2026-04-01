const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const rateLimit = require('express-rate-limit');

// Configuración del limitador: 10 intentos por cada 15 minutos
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10,                   
  message: { error: 'Demasiados intentos fallidos. Intenta nuevamente en 15 minutos.' },
  standardHeaders: true, 
  legacyHeaders: false,  
});

// POST /api/auth/login
router.post('/login', loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos' });
        }

        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario || !usuario.activo) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const valid = await bcrypt.compare(password, usuario.password);
        if (!valid) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol, nombre: usuario.nombre },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            token,
            usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
        });
    } catch (err) {
        res.status(500).json({ error: 'Error interno al iniciar sesión' });
    }
});

// POST /api/auth/cambiar-password
const { authMiddleware } = require('../middleware/auth.middleware');
router.post('/cambiar-password', authMiddleware, async (req, res) => {
    try {
        const { passwordActual, passwordNueva } = req.body;
        const usuario = await prisma.usuario.findUnique({ where: { id: req.user.id } });
        const valid = await bcrypt.compare(passwordActual, usuario.password);
        if (!valid) return res.status(400).json({ error: 'Contraseña actual incorrecta' });

        const hash = await bcrypt.hash(passwordNueva, 10);
        await prisma.usuario.update({ where: { id: req.user.id }, data: { password: hash } });
        res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al cambiar contraseña' });
    }
});

module.exports = router;
