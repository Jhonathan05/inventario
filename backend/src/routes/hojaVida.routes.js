const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// GET /api/hojavida  -- Listado global de todos los mantenimientos con filtros
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { estado, tipo, search } = req.query;
        const where = {};
        if (estado) where.estado = estado;
        if (tipo) where.tipo = tipo;
        if (search) {
            where.OR = [
                { descripcion: { contains: search, mode: 'insensitive' } },
                { casoAranda: { contains: search, mode: 'insensitive' } },
                { activo: { placa: { contains: search, mode: 'insensitive' } } },
                { activo: { marca: { contains: search, mode: 'insensitive' } } },
                { activo: { modelo: { contains: search, mode: 'insensitive' } } },
            ];
        }
        const registros = await prisma.hojaVida.findMany({
            where,
            include: {
                activo: { select: { id: true, placa: true, marca: true, modelo: true, serial: true, categoria: { select: { nombre: true } } } },
                responsable: { select: { id: true, nombre: true } },
                trazas: { orderBy: { fecha: 'desc' }, take: 1 }
            },
            orderBy: { fecha: 'desc' }
        });
        res.json(registros);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener mantenimientos' });
    }
});

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
        const { activoId, tipo, descripcion, fecha, ticketId } = req.body;
        const tId = ticketId ? parseInt(ticketId) : null;
        let responsableId = null;

        // Si viene de un ticket, heredar el técnico asignado
        if (tId) {
            const ticket = await prisma.ticket.findUnique({
                where: { id: tId },
                select: { asignadoAId: true }
            });
            if (ticket && ticket.asignadoAId) {
                responsableId = ticket.asignadoAId;
            }
        }

        const registro = await prisma.hojaVida.create({
            data: {
                activoId: parseInt(activoId),
                tipo,
                descripcion,
                fecha: new Date(fecha),
                estado: 'CREADO',
                registradoPor: req.user.nombre,
                ticketId: tId,
                responsableId
            }
        });

        // Si viene de un ticket, crear traza en el ticket
        if (tId) {
            await prisma.trazaTicket.create({
                data: {
                    ticketId: tId,
                    tipoTraza: 'COMENTARIO',
                    comentario: `Se registró un evento de Hoja de Vida asociado (ID: ${registro.id}): ${descripcion}`,
                    creadoPorId: req.user.id
                }
            });
        }

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
        console.log('--- PROCESSING PUT /hojavida/:id/procesar ---');
        console.log('ID:', id);
        console.log('Body:', JSON.stringify(req.body, null, 2));
        console.log('User:', req.user);

        const { tipo, responsableId, diagnostico, casoAranda, costo, estado, nuevaNota } = req.body;

        const hv = await prisma.hojaVida.findUnique({ where: { id: parseInt(id) } });
        if (!hv) return res.status(404).json({ error: 'Registro no encontrado' });

        const dataToUpdate = {};
        if (tipo) dataToUpdate.tipo = tipo;
        if (responsableId) dataToUpdate.responsableId = parseInt(responsableId);
        if (diagnostico) dataToUpdate.diagnostico = diagnostico;
        if (casoAranda) dataToUpdate.casoAranda = casoAranda;
        if (costo) dataToUpdate.costo = parseFloat(costo);
        if (estado) dataToUpdate.estado = estado;

        console.log('Data to Update:', dataToUpdate);

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

        // Crear traza si hubo cambio de estado O si se envió una nueva nota de bitácora
        // O si se subió un archivo nuevo
        const huboCambioEstado = estado && estado !== hv.estado;
        const contenidoNota = nuevaNota || (diagnostico !== hv.diagnostico ? diagnostico : '');

        let observacionFinal = contenidoNota;

        // Si hay archivo, agregamos la nota de que se subió un archivo
        if (req.file) {
            const fileNote = `[Archivo Adjunto: ${req.file.originalname}]`;
            observacionFinal = observacionFinal ? `${fileNote} - ${observacionFinal}` : fileNote;
        }

        console.log('Hubo cambio estado:', huboCambioEstado);
        console.log('Nueva Nota Raw:', nuevaNota);
        console.log('Contenido Nota Final:', observacionFinal);

        if (huboCambioEstado || observacionFinal) {
            console.log('Creating Traza...');
            const traza = await prisma.trazaHojaVida.create({
                data: {
                    hojaVidaId: parseInt(id),
                    estadoAnterior: hv.estado,
                    estadoNuevo: estado || hv.estado,
                    observacion: observacionFinal || `Cambio de estado a ${estado}`,
                    usuarioId: req.user.id
                }
            });
            console.log('Traza created:', traza);
        } else {
            console.log('No condition met for Traza creation.');
        }

        res.json(actualizado);
    } catch (err) {
        console.error('Error in PUT /procesar:', err);
        res.status(500).json({ error: 'Error al procesar registro' });
    }
});

module.exports = router;
