const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Rutas de inventario
router.get('/', inventoryController.getAll);
router.get('/low-stock', inventoryController.getLowStock);
router.get('/search', inventoryController.search);
router.get('/:id', inventoryController.getById);
router.post('/', inventoryController.create);
router.put('/:id', inventoryController.update);
router.delete('/:id', inventoryController.delete);

module.exports = router;