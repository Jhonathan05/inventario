const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const { validateData } = require('../middleware/validate.middleware');
const { crearTicketSchema, actualizarEstadoSchema, asignarTicketSchema, agregarComentarioSchema } = require('../schemas/ticket.schema');


// Todas las rutas de tickets requieren autenticación
router.use(authMiddleware);

// ─── Rutas principales (CRUD) ─────────────────────────
// Crear ticket con adjuntos opcionales (multipart/form-data, campo 'adjuntos')
router.post('/', upload.array('adjuntos', 10), validateData(crearTicketSchema), ticketController.crearTicket);
router.get('/', ticketController.obtenerTickets);
router.get('/resumen-alertas', ticketController.obtenerResumenAlertas);
router.get('/:id', ticketController.obtenerTicketPorId);

// ─── Ciclo de vida ────────────────────────────────────
router.put('/:id/estado', validateData(actualizarEstadoSchema), ticketController.actualizarEstado);
router.put('/:id/asignar', validateData(asignarTicketSchema), ticketController.asignarTicket);

// Agregar comentario/nota con adjuntos opcionales
router.post('/:id/comentarios', upload.array('adjuntos', 10), validateData(agregarComentarioSchema), ticketController.agregarComentario);

// ─── Archivos ─────────────────────────────────────────
router.get('/adjunto/:documentoId', ticketController.descargarAdjunto);

module.exports = router;
