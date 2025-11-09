const express = require('express');
const router = express.Router();
const movementsController = require('../controllers/movementsController');

// Rutas de movimientos
router.get('/', movementsController.getAll);
router.get('/stats', movementsController.getStats);
router.get('/item/:itemId', movementsController.getByItem);
router.post('/', movementsController.create);

module.exports = router;