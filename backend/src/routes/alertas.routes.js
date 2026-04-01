const express = require('express');
const router = express.Router();
const alertasController = require('../controllers/alertas.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/', alertasController.getAlertas);
router.patch('/:id/leida', alertasController.marcarLeida);
router.delete('/limpiar', alertasController.limpiarAlertas);

module.exports = router;
