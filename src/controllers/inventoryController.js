const db = require('../config/database');

// Obtener todos los insumos
exports.getAllInventory = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM insumos ORDER BY nombre');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error al obtener insumos:', error);
        res.status(500).json({ success: false, message: 'Error al obtener insumos' });
    }
};

// Obtener un insumo por ID
exports.getInventoryById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM insumos WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Insumo no encontrado' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('Error al obtener insumo:', error);
        res.status(500).json({ success: false, message: 'Error al obtener insumo' });
    }
};

// Crear o actualizar insumo
exports.createOrUpdateInventory = async (req, res) => {
    try {
        const { nombre, cantidad, unidad, stock_minimo } = req.body;

        if (!nombre || cantidad === undefined || !unidad || stock_minimo === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }

        // Verificar si ya existe
        const [existing] = await db.query('SELECT id FROM insumos WHERE nombre = ?', [nombre]);

        if (existing.length > 0) {
            // Actualizar
            await db.query(
                'UPDATE insumos SET cantidad = ?, unidad = ?, stock_minimo = ? WHERE nombre = ?',
                [cantidad, unidad, stock_minimo, nombre]
            );
            res.json({ success: true, message: 'Insumo actualizado correctamente', id: existing[0].id });
        } else {
            // Crear nuevo
            const [result] = await db.query(
                'INSERT INTO insumos (nombre, cantidad, unidad, stock_minimo) VALUES (?, ?, ?, ?)',
                [nombre, cantidad, unidad, stock_minimo]
            );
            res.status(201).json({ success: true, message: 'Insumo creado correctamente', id: result.insertId });
        }
    } catch (error) {
        console.error('Error al crear/actualizar insumo:', error);
        res.status(500).json({ success: false, message: 'Error al crear/actualizar insumo' });
    }
};

// Actualizar cantidad de insumo
exports.updateInventoryQuantity = async (req, res) => {
    try {
        const { nombre, cantidad, tipo } = req.body;

        if (!nombre || cantidad === undefined || !tipo) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, cantidad y tipo son requeridos'
            });
        }

        const [rows] = await db.query('SELECT cantidad FROM insumos WHERE nombre = ?', [nombre]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Insumo no encontrado' });
        }

        const nuevaCantidad = tipo === 'entrada'
            ? rows[0].cantidad + cantidad
            : rows[0].cantidad - cantidad;

        if (nuevaCantidad < 0) {
            return res.status(400).json({ success: false, message: 'Stock insuficiente' });
        }

        await db.query('UPDATE insumos SET cantidad = ? WHERE nombre = ?', [nuevaCantidad, nombre]);

        res.json({ success: true, message: 'Cantidad actualizada correctamente', nuevaCantidad });
    } catch (error) {
        console.error('Error al actualizar cantidad:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar cantidad' });
    }
};

// Eliminar insumo
exports.deleteInventory = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM insumos WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Insumo no encontrado' });
        }

        res.json({ success: true, message: 'Insumo eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar insumo:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar insumo' });
    }
};