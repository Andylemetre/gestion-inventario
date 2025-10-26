const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// GET /api/inventory - Obtener todos los insumos
router.get('/', inventoryController.getAllInventory);

// GET /api/inventory/:id - Obtener un insumo específico
router.get('/:id', inventoryController.getInventoryById);

// POST /api/inventory - Crear o actualizar insumo
router.post('/', inventoryController.createOrUpdateInventory);

// PUT /api/inventory/quantity - Actualizar cantidad
router.put('/quantity', inventoryController.updateInventoryQuantity);

// DELETE /api/inventory/:id - Eliminar insumo
router.delete('/:id', inventoryController.deleteInventory);

module.exports = router;
