const Movement = require('../models/Movement');
const Inventory = require('../models/Inventory');
const Tool = require('../models/Tool');

// Obtener todos los movimientos
exports.getAll = async (req, res) => {
    try {
        const { limit = 100, tipo_item, tipo_movimiento } = req.query;

        const filter = {};
        if (tipo_item) filter.tipo_item = tipo_item;
        if (tipo_movimiento) filter.tipo_movimiento = tipo_movimiento;

        const movements = await Movement.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: movements
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los movimientos',
            error: error.message
        });
    }
};

// Obtener movimientos por item
exports.getByItem = async (req, res) => {
    try {
        const { itemId } = req.params;

        const movements = await Movement.find({ item_id: itemId })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: movements
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los movimientos del item',
            error: error.message
        });
    }
};

// Crear movimiento manual
exports.create = async (req, res) => {
    try {
        const { tipo_item, item_id, tipo_movimiento, cantidad, motivo, usuario } = req.body;

        // Validar que el item existe
        let item;
        let tipo_item_ref;

        if (tipo_item === 'inventario') {
            item = await Inventory.findById(item_id);
            tipo_item_ref = 'Inventory';
        } else if (tipo_item === 'herramienta') {
            item = await Tool.findById(item_id);
            tipo_item_ref = 'Tool';
        }

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item no encontrado'
            });
        }

        const cantidadAnterior = item.cantidad;
        let cantidadNueva = cantidadAnterior;

        // Calcular nueva cantidad según el tipo de movimiento
        switch (tipo_movimiento) {
            case 'entrada':
                cantidadNueva = cantidadAnterior + cantidad;
                break;
            case 'salida':
                cantidadNueva = cantidadAnterior - cantidad;
                if (cantidadNueva < 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'No hay suficiente stock para realizar esta salida'
                    });
                }
                break;
            case 'ajuste':
                cantidadNueva = cantidad;
                break;
            case 'uso':
                cantidadNueva = cantidadAnterior - cantidad;
                if (cantidadNueva < 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'No hay suficiente cantidad para registrar este uso'
                    });
                }
                break;
            case 'devolucion':
                cantidadNueva = cantidadAnterior + cantidad;
                break;
        }

        // Actualizar cantidad del item
        item.cantidad = cantidadNueva;
        await item.save();

        // Crear movimiento
        const movement = await Movement.create({
            tipo_item,
            item_id,
            tipo_item_ref,
            nombre_item: item.nombre,
            tipo_movimiento,
            cantidad,
            cantidad_anterior: cantidadAnterior,
            cantidad_nueva: cantidadNueva,
            motivo: motivo || '',
            usuario: usuario || 'Sistema'
        });

        res.status(201).json({
            success: true,
            message: 'Movimiento registrado exitosamente',
            data: movement
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear el movimiento',
            error: error.message
        });
    }
};

// Obtener estadísticas de movimientos
exports.getStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const filter = {};
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const stats = await Movement.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: {
                        tipo_item: '$tipo_item',
                        tipo_movimiento: '$tipo_movimiento'
                    },
                    total: { $sum: 1 },
                    cantidad_total: { $sum: '$cantidad' }
                }
            },
            {
                $group: {
                    _id: '$_id.tipo_item',
                    movimientos: {
                        $push: {
                            tipo: '$_id.tipo_movimiento',
                            total: '$total',
                            cantidad_total: '$cantidad_total'
                        }
                    },
                    total_general: { $sum: '$total' }
                }
            }
        ]);

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas',
            error: error.message
        });
    }
};