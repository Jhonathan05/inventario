const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// Todas las rutas de tickets requieren autenticación
router.use(authMiddleware);

// Rutas principales (CRUD Tickets)
router.post('/', ticketController.crearTicket);
router.get('/', ticketController.obtenerTickets);
router.get('/:id', ticketController.obtenerTicketPorId);

// Rutas de gestión del ciclo de vida del Ticket (Trazabilidad)
router.put('/:id/estado', ticketController.actualizarEstado);
router.put('/:id/asignar', ticketController.asignarTicket);
router.post('/:id/comentarios', ticketController.agregarComentario);

module.exports = router;
