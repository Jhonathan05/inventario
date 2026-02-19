const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// GET /api/hojavida/activo/:activoId
router.get('/activo/:activoId', authMiddleware, async (req, res) => {
    try {
        const registros = await prisma.hojaVida.findMany({
            where: { activoId: parseInt(req.params.activoId) },
            include: {
                documentos: true,
                trazas: {
                    include: { usuario: true },
                    orderBy: { fecha: 'desc' }
                },
                responsable: true
            },
            orderBy: { fecha: 'desc' },
        });
        res.json(registros);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener hoja de vida' });
    }
});

// POST /api/hojavida
// Create: Status CREADO, optional file
router.post('/', authMiddleware, requireRole('ADMIN', 'TECNICO'), upload.single('file'), async (req, res) => {
    try {
        // req.body fields come as strings due to multipart/form-data
        const { activoId, tipo, descripcion, fecha } = req.body;

        const registro = await prisma.hojaVida.create({
            data: {
                activoId: parseInt(activoId),
                tipo,
                descripcion,
                fecha: new Date(fecha),
                estado: 'CREADO',
                registradoPor: req.user.nombre
            }
        });

        // Handle file upload if present
        if (req.file) {
            await prisma.documento.create({
                data: {
                    nombre: req.file.originalname,
                    nombreArchivo: req.file.filename,
                    ruta: `uploads/${req.file.filename}`,
                    tipo: req.file.mimetype,
                    tamano: req.file.size,
                    activoId: parseInt(activoId),
                    hojaVidaId: registro.id
                }
            });
        }

        // Crear traza inicial
        await prisma.trazaHojaVida.create({
            data: {
                hojaVidaId: registro.id,
                estadoNuevo: 'CREADO',
                observacion: 'Creación del evento',
                usuarioId: req.user.id
            }
        });

        const result = await prisma.hojaVida.findUnique({
            where: { id: registro.id },
            include: { documentos: true }
        });

        res.status(201).json(result);
    } catch (err) {
        console.error('Error creating HojaVida:', err);
        res.status(500).json({ error: `Error al crear registro: ${err.message}` });
    }
});

// PUT /api/hojavida/:id/procesar
// Update: Status change, diagnose, assign, etc.
router.put('/:id/procesar', authMiddleware, requireRole('ADMIN', 'TECNICO'), upload.single('file'), async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo, responsableId, diagnostico, casoAranda, costo, estado } = req.body;

        const hv = await prisma.hojaVida.findUnique({ where: { id: parseInt(id) } });
        if (!hv) return res.status(404).json({ error: 'Registro no encontrado' });

        const dataToUpdate = {};
        if (tipo) dataToUpdate.tipo = tipo;
        if (responsableId) dataToUpdate.responsableId = parseInt(responsableId);
        if (diagnostico) dataToUpdate.diagnostico = diagnostico;
        if (casoAranda) dataToUpdate.casoAranda = casoAranda;
        if (costo) dataToUpdate.costo = parseFloat(costo);
        if (estado) dataToUpdate.estado = estado;

        const actualizado = await prisma.hojaVida.update({
            where: { id: parseInt(id) },
            data: dataToUpdate
        });

        // Handle file upload if present
        if (req.file) {
            await prisma.documento.create({
                data: {
                    nombre: req.file.originalname,
                    nombreArchivo: req.file.filename,
                    ruta: `uploads/${req.file.filename}`,
                    tipo: req.file.mimetype,
                    tamano: req.file.size,
                    activoId: hv.activoId,
                    hojaVidaId: parseInt(id)
                }
            });
        }

        // Crear traza si hubo cambio de estado o diagnóstico significativo
        if (estado && estado !== hv.estado) {
            await prisma.trazaHojaVida.create({
                data: {
                    hojaVidaId: parseInt(id),
                    estadoAnterior: hv.estado,
                    estadoNuevo: estado,
                    observacion: diagnostico ? `Actualización de estado. Diagnóstico: ${diagnostico.substring(0, 100)}...` : 'Cambio de estado',
                    usuarioId: req.user.id
                }
            });
        }

        // Ver si necesitamos actualizar el estado del activo
        if (estado === 'FINALIZADO') {
            // Logica opcional para liberar activo
        }

        res.json(actualizado);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al procesar registro' });
    }
});

module.exports = router;
