const express = require('express');
const router = express.Router();
const toolsController = require('../controllers/toolsController');

// GET /api/tools - Obtener todas las herramientas (con filtro opcional por ubicación)
router.get('/', toolsController.getAllTools);

// GET /api/tools/counts - Obtener conteos por ubicación
router.get('/counts', toolsController.getLocationCounts);

// GET /api/tools/:id - Obtener una herramienta específica
router.get('/:id', toolsController.getToolById);

// POST /api/tools - Crear o actualizar herramienta
router.post('/', toolsController.createOrUpdateTool);

// PUT /api/tools/quantity - Actualizar cantidad
router.put('/quantity', toolsController.updateToolQuantity);

// DELETE /api/tools/:id - Eliminar herramienta
router.delete('/:id', toolsController.deleteTool);

module.exports = router;