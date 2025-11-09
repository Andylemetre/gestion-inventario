const Inventory = require('../models/Inventory');
const Movement = require('../models/Movement');

// Obtener todos los items del inventario
exports.getAll = async (req, res) => {
    try {
        const items = await Inventory.find().sort({ nombre: 1 });
        res.json({
            success: true,
            data: items
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el inventario',
            error: error.message
        });
    }
};

// Obtener un item por ID
exports.getById = async (req, res) => {
    try {
        const item = await Inventory.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item no encontrado'
            });
        }

        res.json({
            success: true,
            data: item
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el item',
            error: error.message
        });
    }
};

// Crear nuevo item
exports.create = async (req, res) => {
    try {
        const newItem = new Inventory(req.body);
        const savedItem = await newItem.save();

        // Registrar movimiento
        await Movement.create({
            tipo_item: 'inventario',
            item_id: savedItem._id,
            tipo_item_ref: 'Inventory',
            nombre_item: savedItem.nombre,
            tipo_movimiento: 'entrada',
            cantidad: savedItem.cantidad,
            cantidad_anterior: 0,
            cantidad_nueva: savedItem.cantidad,
            motivo: 'Creación inicial',
            usuario: 'Sistema'
        });

        res.status(201).json({
            success: true,
            message: 'Item creado exitosamente',
            data: savedItem
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear el item',
            error: error.message
        });
    }
};

// Actualizar item
exports.update = async (req, res) => {
    try {
        const item = await Inventory.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item no encontrado'
            });
        }

        const cantidadAnterior = item.cantidad;
        const updatedItem = await Inventory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        // Si cambió la cantidad, registrar movimiento
        if (req.body.cantidad !== undefined && req.body.cantidad !== cantidadAnterior) {
            const diferencia = req.body.cantidad - cantidadAnterior;
            await Movement.create({
                tipo_item: 'inventario',
                item_id: updatedItem._id,
                tipo_item_ref: 'Inventory',
                nombre_item: updatedItem.nombre,
                tipo_movimiento: diferencia > 0 ? 'entrada' : 'salida',
                cantidad: Math.abs(diferencia),
                cantidad_anterior: cantidadAnterior,
                cantidad_nueva: updatedItem.cantidad,
                motivo: 'Actualización manual',
                usuario: 'Sistema'
            });
        }

        res.json({
            success: true,
            message: 'Item actualizado exitosamente',
            data: updatedItem
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar el item',
            error: error.message
        });
    }
};

// Eliminar item
exports.delete = async (req, res) => {
    try {
        const item = await Inventory.findByIdAndDelete(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Item eliminado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el item',
            error: error.message
        });
    }
};

// Obtener items con stock bajo
exports.getLowStock = async (req, res) => {
    try {
        const items = await Inventory.find({
            $expr: { $lte: ['$cantidad', '$stock_minimo'] }
        }).sort({ nombre: 1 });

        res.json({
            success: true,
            data: items
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener items con stock bajo',
            error: error.message
        });
    }
};

// Buscar items
exports.search = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Debe proporcionar un término de búsqueda'
            });
        }

        const items = await Inventory.find({
            $or: [
                { nombre: { $regex: query, $options: 'i' } },
                { categoria: { $regex: query, $options: 'i' } },
                { proveedor: { $regex: query, $options: 'i' } }
            ]
        }).sort({ nombre: 1 });

        res.json({
            success: true,
            data: items
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al buscar items',
            error: error.message
        });
    }
};