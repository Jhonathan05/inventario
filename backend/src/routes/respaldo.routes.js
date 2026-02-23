const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exportBackup, importBackup } = require('../controllers/respaldo.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

// Configuración de multer para carga temporal de backups
const uploadDir = path.join(__dirname, '../../temp_backup');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `import_${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (path.extname(file.originalname).toLowerCase() === '.zip') {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos .zip de respaldo'));
        }
    }
});

// Rutas (Protegidas: Solo Admin)
router.get('/export', [authMiddleware, requireRole('ADMIN')], exportBackup);
router.post('/import', [authMiddleware, requireRole('ADMIN'), upload.array('backups', 60)], importBackup);

module.exports = router;
