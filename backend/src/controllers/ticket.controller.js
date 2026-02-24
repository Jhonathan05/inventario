const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ==========================================
// CREAR UN NUEVO TICKET
// ==========================================
exports.crearTicket = async (req, res) => {
    try {
        const { titulo, descripcion, prioridad, tipo, funcionarioId, activoId } = req.body;
        const creadoPorId = req.usuario.id;

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
// OBTENER UN TICKET POR ID (CON TRAZAS)
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
                trazas: {
                    include: {
                        creadoPor: { select: { id: true, nombre: true } }
                    },
                    orderBy: { creadoEn: 'desc' }
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
        const { nuevoEstado, comentario } = req.body;
        const usuarioId = req.usuario.id;

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
                cerradoEn: nuevoEstado === 'COMPLETADO' ? new Date() : null,
                trazas: {
                    create: {
                        tipoTraza: 'CAMBIO_ESTADO',
                        comentario: comentario || `Estado cambiado de ${ticketActual.estado} a ${nuevoEstado}`,
                        estadoAnterior: ticketActual.estado,
                        estadoNuevo: nuevoEstado,
                        creadoPorId: usuarioId
                    }
                }
            },
            include: {
                trazas: {
                    orderBy: { creadoEn: 'desc' },
                    take: 1,
                    include: { creadoPor: { select: { id: true, nombre: true } } }
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
        const usuarioId = req.usuario.id;

        // Verificar si el técnico existe
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
                asignadoA: { select: { id: true, nombre: true } },
                trazas: {
                    orderBy: { creadoEn: 'desc' },
                    take: 1,
                    include: { creadoPor: { select: { id: true, nombre: true } } }
                }
            }
        });

        res.json(ticketActualizado);
    } catch (error) {
        console.error('Error al asignar ticket:', error);
        res.status(500).json({ error: 'Error al asignar el ticket.' });
    }
};

// ==========================================
// AGREGAR COMENTARIO AL TICKET
// ==========================================
exports.agregarComentario = async (req, res) => {
    try {
        const { id } = req.params;
        const { comentario } = req.body;
        const usuarioId = req.usuario.id;

        if (!comentario || comentario.trim() === '') {
            return res.status(400).json({ error: 'El comentario no puede estar vacío.' });
        }

        const ticketActual = await prisma.ticket.findUnique({ where: { id: parseInt(id) } });
        if (!ticketActual) return res.status(404).json({ error: 'Ticket no encontrado.' });

        const nuevaTraza = await prisma.trazaTicket.create({
            data: {
                ticketId: parseInt(id),
                tipoTraza: 'COMENTARIO',
                comentario,
                creadoPorId: usuarioId
            },
            include: {
                creadoPor: { select: { id: true, nombre: true } }
            }
        });

        res.status(201).json(nuevaTraza);
    } catch (error) {
        console.error('Error al agregar comentario:', error);
        res.status(500).json({ error: 'Error interno al agregar el comentario.' });
    }
};
