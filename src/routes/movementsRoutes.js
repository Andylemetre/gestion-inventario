const express = require('express');
const router = express.Router();
const movementsController = require('../controllers/movementsController');

// GET /api/movements - Obtener todos los movimientos (con filtro opcional por tipo)
router.get('/', movementsController.getAllMovements);

// POST /api/movements/inventory - Crear movimiento de insumo
router.post('/inventory', movementsController.createInventoryMovement);

// POST /api/movements/tool - Crear movimiento de herramienta
router.post('/tool', movementsController.createToolMovement);

module.exports = router;