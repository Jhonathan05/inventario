const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('crypto').randomUUID ? require('crypto') : { v4: () => Math.random().toString(36).substr(2, 9) };
const prisma = require('../lib/prisma');
const { authMiddleware } = require('../middleware/auth.middleware');

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${ext}`;
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes (JPG, PNG, WEBP) y PDFs'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// POST /api/documentos/upload
router.post('/upload', authMiddleware, upload.single('archivo'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No se recibió ningún archivo' });

        const { activoId, asignacionId, hojaVidaId } = req.body;

        const documento = await prisma.documento.create({
            data: {
                nombre: req.file.originalname,
                nombreArchivo: req.file.filename,
                ruta: `/uploads/${req.file.filename}`,
                tipo: req.file.mimetype,
                tamano: req.file.size,
                activoId: activoId ? parseInt(activoId) : null,
                asignacionId: asignacionId ? parseInt(asignacionId) : null,
                hojaVidaId: hojaVidaId ? parseInt(hojaVidaId) : null,
            },
        });

        res.status(201).json(documento);
    } catch (err) {
        res.status(500).json({ error: 'Error al subir documento' });
    }
});

// GET /api/documentos?activoId=X
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { activoId, asignacionId, hojaVidaId } = req.query;
        const where = {};
        if (activoId) where.activoId = parseInt(activoId);
        if (asignacionId) where.asignacionId = parseInt(asignacionId);
        if (hojaVidaId) where.hojaVidaId = parseInt(hojaVidaId);

        const documentos = await prisma.documento.findMany({ where, orderBy: { creadoEn: 'desc' } });
        res.json(documentos);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener documentos' });
    }
});

// DELETE /api/documentos/:id
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const doc = await prisma.documento.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!doc) return res.status(404).json({ error: 'Documento no encontrado' });

        // Eliminar archivo físico
        const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');
        const filePath = path.join(uploadDir, doc.nombreArchivo);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        await prisma.documento.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: 'Documento eliminado' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar documento' });
    }
});

module.exports = router;
