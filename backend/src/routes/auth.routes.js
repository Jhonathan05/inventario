const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const logger = require('../lib/logger');

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
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            { id: usuario.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        logger.info(`Usuario logueado exitosamente: ${email}`);
        res.json({
            token,
            usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
        });
    } catch (err) {
        logger.error(`Error interno al iniciar sesión para ${req.body.email}: ${err.message}`);
        res.status(500).json({ error: 'Error interno al iniciar sesión' });
    }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ error: 'No refresh token provided' });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const usuario = await prisma.usuario.findUnique({ where: { id: decoded.id } });
        
        if (!usuario || !usuario.activo) {
            return res.status(401).json({ error: 'Usuario inactivo o no encontrado' });
        }

        const newToken = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol, nombre: usuario.nombre },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token: newToken });
    } catch (err) {
        logger.error(`Error en refresh: ${err.message}`);
        res.status(401).json({ error: 'Refresh token inválido o expirado' });
    }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.json({ message: 'Sesión terminada exitosamente' });
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

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const usuario = await prisma.usuario.findUnique({
            where: { id: req.user.id },
            select: { id: true, nombre: true, email: true, rol: true, activo: true }
        });
        if (!usuario || !usuario.activo) {
            return res.status(401).json({ error: 'Sesión inválida o usuario inactivo' });
        }
        res.json({
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
});

module.exports = router;
