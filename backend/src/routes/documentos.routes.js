const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { authMiddleware } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const fs = require('fs');
const path = require('path');

// POST /api/documentos/upload
// Expects multipart/form-data with 'file' and other fields (activoId, hojaVidaId, etc)
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se subió ningún archivo' });
        }

        const { activoId, hojaVidaId, asignacionId } = req.body;

        const documento = await prisma.documento.create({
            data: {
                nombre: req.file.originalname,
                nombreArchivo: req.file.filename,
                ruta: `uploads/${req.file.filename}`,
                tipo: req.file.mimetype,
                tamano: req.file.size,
                activoId: activoId ? parseInt(activoId) : null,
                hojaVidaId: hojaVidaId ? parseInt(hojaVidaId) : null,
                asignacionId: asignacionId ? parseInt(asignacionId) : null,
            }
        });

        res.status(201).json(documento);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al subir documento' });
    }
});

// DELETE /api/documentos/:id
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const doc = await prisma.documento.findUnique({
            where: { id: parseInt(req.params.id) }
        });

        if (!doc) return res.status(404).json({ error: 'Documento no encontrado' });

        // Delete file from disk
        const filePath = path.join(__dirname, '../../uploads', doc.nombreArchivo);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await prisma.documento.delete({ where: { id: doc.id } });

        res.json({ message: 'Documento eliminado' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminado documento' });
    }
});

module.exports = router;
