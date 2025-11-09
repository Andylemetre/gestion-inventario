const express = require('express');
const router = express.Router();
const toolsController = require('../controllers/toolsController');

// Rutas de herramientas
router.get('/', toolsController.getAll);
router.get('/maintenance', toolsController.getNeedsMaintenance);
router.get('/search', toolsController.search);
router.get('/:id', toolsController.getById);
router.post('/', toolsController.create);
router.put('/:id', toolsController.update);
router.delete('/:id', toolsController.delete);

module.exports = router;