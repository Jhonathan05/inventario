const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Todas las rutas de tickets requieren autenticación
router.use(authMiddleware);

// ─── Rutas principales (CRUD) ─────────────────────────
// Crear ticket con adjuntos opcionales (multipart/form-data, campo 'adjuntos')
router.post('/', upload.array('adjuntos', 10), ticketController.crearTicket);
router.get('/', ticketController.obtenerTickets);
router.get('/resumen-alertas', ticketController.obtenerResumenAlertas);
router.get('/:id', ticketController.obtenerTicketPorId);

// ─── Ciclo de vida ────────────────────────────────────
router.put('/:id/estado', ticketController.actualizarEstado);
router.put('/:id/asignar', ticketController.asignarTicket);

// Agregar comentario/nota con adjuntos opcionales
router.post('/:id/comentarios', upload.array('adjuntos', 10), ticketController.agregarComentario);

// ─── Archivos ─────────────────────────────────────────
router.get('/adjunto/:documentoId', ticketController.descargarAdjunto);

module.exports = router;
