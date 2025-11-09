const Tool = require('../models/Tool');
const Movement = require('../models/Movement');

// Obtener todas las herramientas
exports.getAll = async (req, res) => {
    try {
        const tools = await Tool.find().sort({ nombre: 1 });
        res.json({
            success: true,
            data: tools
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener las herramientas',
            error: error.message
        });
    }
};

// Obtener una herramienta por ID
exports.getById = async (req, res) => {
    try {
        const tool = await Tool.findById(req.params.id);

        if (!tool) {
            return res.status(404).json({
                success: false,
                message: 'Herramienta no encontrada'
            });
        }

        res.json({
            success: true,
            data: tool
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener la herramienta',
            error: error.message
        });
    }
};

// Crear nueva herramienta
exports.create = async (req, res) => {
    try {
        const newTool = new Tool(req.body);
        const savedTool = await newTool.save();

        // Registrar movimiento
        await Movement.create({
            tipo_item: 'herramienta',
            item_id: savedTool._id,
            tipo_item_ref: 'Tool',
            nombre_item: savedTool.nombre,
            tipo_movimiento: 'entrada',
            cantidad: savedTool.cantidad,
            cantidad_anterior: 0,
            cantidad_nueva: savedTool.cantidad,
            motivo: 'Creación inicial',
            usuario: 'Sistema'
        });

        res.status(201).json({
            success: true,
            message: 'Herramienta creada exitosamente',
            data: savedTool
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear la herramienta',
            error: error.message
        });
    }
};

// Actualizar herramienta
exports.update = async (req, res) => {
    try {
        const tool = await Tool.findById(req.params.id);

        if (!tool) {
            return res.status(404).json({
                success: false,
                message: 'Herramienta no encontrada'
            });
        }

        const cantidadAnterior = tool.cantidad;
        const updatedTool = await Tool.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        // Si cambió la cantidad, registrar movimiento
        if (req.body.cantidad !== undefined && req.body.cantidad !== cantidadAnterior) {
            const diferencia = req.body.cantidad - cantidadAnterior;
            await Movement.create({
                tipo_item: 'herramienta',
                item_id: updatedTool._id,
                tipo_item_ref: 'Tool',
                nombre_item: updatedTool.nombre,
                tipo_movimiento: diferencia > 0 ? 'entrada' : 'salida',
                cantidad: Math.abs(diferencia),
                cantidad_anterior: cantidadAnterior,
                cantidad_nueva: updatedTool.cantidad,
                motivo: 'Actualización manual',
                usuario: 'Sistema'
            });
        }

        res.json({
            success: true,
            message: 'Herramienta actualizada exitosamente',
            data: updatedTool
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar la herramienta',
            error: error.message
        });
    }
};

// Eliminar herramienta
exports.delete = async (req, res) => {
    try {
        const tool = await Tool.findByIdAndDelete(req.params.id);

        if (!tool) {
            return res.status(404).json({
                success: false,
                message: 'Herramienta no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Herramienta eliminada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la herramienta',
            error: error.message
        });
    }
};

// Obtener herramientas que necesitan mantenimiento
exports.getNeedsMaintenance = async (req, res) => {
    try {
        const tools = await Tool.find({
            proximo_mantenimiento: { $lte: new Date() }
        }).sort({ proximo_mantenimiento: 1 });

        res.json({
            success: true,
            data: tools
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener herramientas que necesitan mantenimiento',
            error: error.message
        });
    }
};

// Buscar herramientas
exports.search = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Debe proporcionar un término de búsqueda'
            });
        }

        const tools = await Tool.find({
            $or: [
                { nombre: { $regex: query, $options: 'i' } },
                { tipo: { $regex: query, $options: 'i' } },
                { estado: { $regex: query, $options: 'i' } }
            ]
        }).sort({ nombre: 1 });

        res.json({
            success: true,
            data: tools
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al buscar herramientas',
            error: error.message
        });
    }
};