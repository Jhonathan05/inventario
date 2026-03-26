const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');

// Helper para guardar un documento adjunto
const guardarAdjunto = async (file, ticketId = null, trazaTicketId = null) => {
    return prisma.documento.create({
        data: {
            nombre: file.originalname,
            nombreArchivo: file.filename,
            ruta: `uploads/${file.filename}`,
            tipo: file.mimetype,
            tamano: file.size,
            ticketId: ticketId,
            trazaTicketId: trazaTicketId
        }
    });
};

// ==========================================
// CREAR UN NUEVO TICKET (con adjuntos opcionales)
// ==========================================
exports.crearTicket = async (req, res) => {
    try {
        const { titulo, descripcion, prioridad, tipo, funcionarioId, activoId, solucionTecnica, conclusiones } = req.body;
        const creadoPorId = req.user.id;

        const ticket = await prisma.ticket.create({
            data: {
                titulo,
                descripcion,
                prioridad: prioridad || 'MEDIA',
                tipo: tipo || 'REQUERIMIENTO',
                funcionarioId: parseInt(funcionarioId),
                activoId: activoId ? parseInt(activoId) : null,
                creadoPorId,
                estado: 'CREADO',
                solucionTecnica,
                conclusiones,
                trazas: {
                    create: {
                        tipoTraza: 'CREACION',
                        comentario: 'Ticket creado exitosamente.',
                        estadoNuevo: 'CREADO',
                        creadoPorId
                    }
                }
            },
            include: {
                funcionario: true,
                activo: true,
                creadoPor: { select: { id: true, nombre: true } }
            }
        });

        // Guardar archivos adjuntos opcionales
        if (req.files && req.files.length > 0) {
            await Promise.all(req.files.map(file => guardarAdjunto(file, ticket.id, null)));
        }

        res.status(201).json(ticket);
    } catch (error) {
        console.error('Error al crear ticket:', error);
        res.status(500).json({ error: 'Error interno al crear el ticket.' });
    }
};

// ==========================================
// OBTENER TODOS LOS TICKETS (CON FILTROS)
// ==========================================
exports.obtenerTickets = async (req, res) => {
    try {
        const { estado, prioridad, tipo, asignadoAId, funcionarioId } = req.query;

        let where = {};
        if (estado) where.estado = estado;
        if (prioridad) where.prioridad = prioridad;
        if (tipo) where.tipo = tipo;
        if (asignadoAId) where.asignadoAId = parseInt(asignadoAId);
        if (funcionarioId) where.funcionarioId = parseInt(funcionarioId);

        const tickets = await prisma.ticket.findMany({
            where,
            include: {
                funcionario: { select: { id: true, nombre: true, area: true, cargo: true } },
                activo: { select: { id: true, placa: true, tipo: true } },
                asignadoA: { select: { id: true, nombre: true } },
                creadoPor: { select: { id: true, nombre: true } }
            },
            orderBy: { creadoEn: 'desc' }
        });

        res.json(tickets);
    } catch (error) {
        console.error('Error al obtener tickets:', error);
        res.status(500).json({ error: 'Error interno al obtener los tickets.' });
    }
};

// ==========================================
// OBTENER UN TICKET POR ID (CON TRAZAS Y ADJUNTOS)
// ==========================================
exports.obtenerTicketPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const ticket = await prisma.ticket.findUnique({
            where: { id: parseInt(id) },
            include: {
                funcionario: true,
                activo: true,
                asignadoA: { select: { id: true, nombre: true, email: true } },
                creadoPor: { select: { id: true, nombre: true } },
                adjuntos: true, // Adjuntos del ticket en general (evidencia inicial)
                trazas: {
                    include: {
                        creadoPor: { select: { id: true, nombre: true } },
                        adjuntos: true  // Adjuntos por cada traza/comentario
                    },
                    orderBy: { creadoEn: 'asc' } // asc para timeline cronológico
                }
            }
        });

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket no encontrado.' });
        }

        res.json(ticket);
    } catch (error) {
        console.error('Error al obtener el ticket:', error);
        res.status(500).json({ error: 'Error interno al obtener el ticket.' });
    }
};

// ==========================================
// ACTUALIZAR ESTADO DEL TICKET
// ==========================================
exports.actualizarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { nuevoEstado, comentario, solucionTecnica, conclusiones } = req.body;
        const usuarioId = req.user.id;

        const ticketActual = await prisma.ticket.findUnique({ where: { id: parseInt(id) } });

        if (!ticketActual) {
            return res.status(404).json({ error: 'Ticket no encontrado.' });
        }

        if (ticketActual.estado === nuevoEstado) {
            return res.status(400).json({ error: 'El ticket ya se encuentra en ese estado.' });
        }

        const ticketActualizado = await prisma.ticket.update({
            where: { id: parseInt(id) },
            data: {
                estado: nuevoEstado,
                solucionTecnica: solucionTecnica !== undefined ? solucionTecnica : undefined,
                conclusiones: conclusiones !== undefined ? conclusiones : undefined,
                cerradoEn: (nuevoEstado === 'COMPLETADO' || nuevoEstado === 'RESUELTO') ? new Date() : null,
                trazas: {
                    create: {
                        tipoTraza: 'CAMBIO_ESTADO',
                        comentario: comentario || `Estado cambiado de ${ticketActual.estado} a ${nuevoEstado}`,
                        estadoAnterior: ticketActual.estado,
                        estadoNuevo: nuevoEstado,
                        creadoPorId: usuarioId
                    }
                }
            }
        });

        res.json(ticketActualizado);
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        res.status(500).json({ error: 'Error al actualizar el estado del ticket.' });
    }
};

// ==========================================
// ASIGNAR TICKET A UN TÉCNICO
// ==========================================
exports.asignarTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { asignadoAId, comentario } = req.body;
        const usuarioId = req.user.id;

        if (asignadoAId) {
            const tecnico = await prisma.usuario.findUnique({ where: { id: parseInt(asignadoAId) } });
            if (!tecnico) return res.status(404).json({ error: 'Usuario asignado no encontrado.' });
        }

        const ticketActualizado = await prisma.ticket.update({
            where: { id: parseInt(id) },
            data: {
                asignadoAId: asignadoAId ? parseInt(asignadoAId) : null,
                trazas: {
                    create: {
                        tipoTraza: 'ASIGNACION',
                        comentario: comentario || (asignadoAId ? 'Ticket asignado a un técnico.' : 'Ticket desasignado.'),
                        creadoPorId: usuarioId
                    }
                }
            },
            include: {
                asignadoA: { select: { id: true, nombre: true } }
            }
        });

        res.json(ticketActualizado);
    } catch (error) {
        console.error('Error al asignar ticket:', error);
        res.status(500).json({ error: 'Error al asignar el ticket.' });
    }
};

// ==========================================
// AGREGAR COMENTARIO CON ADJUNTOS OPCIONALES
// ==========================================
exports.agregarComentario = async (req, res) => {
    try {
        const { id } = req.params;
        const { comentario } = req.body;
        const usuarioId = req.user.id;
        const hasFiles = req.files && req.files.length > 0;

        if ((!comentario || comentario.trim() === '') && !hasFiles) {
            return res.status(400).json({ error: 'El comentario o el archivo adjunto es requerido.' });
        }

        const commentText = (comentario && comentario.trim() !== '') ? comentario : 'Adjunto(s) enviado(s) sin comentario.';

        const ticketActual = await prisma.ticket.findUnique({ where: { id: parseInt(id) } });
        if (!ticketActual) return res.status(404).json({ error: 'Ticket no encontrado.' });

        // Crear la traza primero
        const nuevaTraza = await prisma.trazaTicket.create({
            data: {
                ticketId: parseInt(id),
                tipoTraza: 'COMENTARIO',
                comentario: commentText,
                creadoPorId: usuarioId
            },
            include: {
                creadoPor: { select: { id: true, nombre: true } },
                adjuntos: true
            }
        });

        // Luego guardar los archivos adjuntos asociados a esta traza
        if (req.files && req.files.length > 0) {
            await Promise.all(
                req.files.map(file => guardarAdjunto(file, null, nuevaTraza.id))
            );

            // Recargar traza con adjuntos actualizados
            const trazaConAdjuntos = await prisma.trazaTicket.findUnique({
                where: { id: nuevaTraza.id },
                include: {
                    creadoPor: { select: { id: true, nombre: true } },
                    adjuntos: true
                }
            });
            return res.status(201).json(trazaConAdjuntos);
        }

        res.status(201).json(nuevaTraza);
    } catch (error) {
        console.error('Error al agregar comentario:', error);
        res.status(500).json({ error: 'Error interno al agregar el comentario.' });
    }
};

// ==========================================
// DESCARGAR / VER ADJUNTO
// ==========================================
exports.descargarAdjunto = async (req, res) => {
    try {
        const { documentoId } = req.params;
        const doc = await prisma.documento.findUnique({ where: { id: parseInt(documentoId) } });

        if (!doc) return res.status(404).json({ error: 'Archivo no encontrado.' });

        const filePath = path.join(__dirname, '../../', doc.ruta);
        res.download(filePath, doc.nombre);
    } catch (error) {
        console.error('Error al descargar adjunto:', error);
        res.status(500).json({ error: 'Error al descargar el archivo.' });
    }
};
