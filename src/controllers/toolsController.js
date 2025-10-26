const db = require('../config/database');

// Obtener todas las herramientas
exports.getAllTools = async (req, res) => {
    try {
        const { ubicacion } = req.query;
        let query = 'SELECT * FROM herramientas';
        let params = [];

        if (ubicacion && ubicacion !== 'todas') {
            query += ' WHERE ubicacion = ?';
            params.push(ubicacion);
        }

        query += ' ORDER BY nombre';

        const [rows] = await db.query(query, params);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error al obtener herramientas:', error);
        res.status(500).json({ success: false, message: 'Error al obtener herramientas' });
    }
};

// Obtener herramienta por ID
exports.getToolById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM herramientas WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Herramienta no encontrada' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('Error al obtener herramienta:', error);
        res.status(500).json({ success: false, message: 'Error al obtener herramienta' });
    }
};

// Crear o actualizar herramienta
exports.createOrUpdateTool = async (req, res) => {
    try {
        const { nombre, cantidad, categoria, ubicacion } = req.body;

        if (!nombre || cantidad === undefined || !categoria || !ubicacion) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }

        // Verificar si ya existe
        const [existing] = await db.query('SELECT id FROM herramientas WHERE nombre = ?', [nombre]);

        if (existing.length > 0) {
            // Actualizar
            await db.query(
                'UPDATE herramientas SET cantidad = ?, categoria = ?, ubicacion = ? WHERE nombre = ?',
                [cantidad, categoria, ubicacion, nombre]
            );
            res.json({ success: true, message: 'Herramienta actualizada correctamente', id: existing[0].id });
        } else {
            // Crear nueva
            const [result] = await db.query(
                'INSERT INTO herramientas (nombre, cantidad, categoria, ubicacion) VALUES (?, ?, ?, ?)',
                [nombre, cantidad, categoria, ubicacion]
            );
            res.status(201).json({ success: true, message: 'Herramienta creada correctamente', id: result.insertId });
        }
    } catch (error) {
        console.error('Error al crear/actualizar herramienta:', error);
        res.status(500).json({ success: false, message: 'Error al crear/actualizar herramienta' });
    }
};

// Actualizar cantidad de herramienta
exports.updateToolQuantity = async (req, res) => {
    try {
        const { nombre, cantidad, tipo } = req.body;

        if (!nombre || cantidad === undefined || !tipo) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, cantidad y tipo son requeridos'
            });
        }

        const [rows] = await db.query('SELECT cantidad FROM herramientas WHERE nombre = ?', [nombre]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Herramienta no encontrada' });
        }

        const nuevaCantidad = tipo === 'entrada'
            ? rows[0].cantidad + cantidad
            : rows[0].cantidad - cantidad;

        if (nuevaCantidad < 0) {
            return res.status(400).json({ success: false, message: 'Cantidad insuficiente' });
        }

        await db.query('UPDATE herramientas SET cantidad = ? WHERE nombre = ?', [nuevaCantidad, nombre]);

        res.json({ success: true, message: 'Cantidad actualizada correctamente', nuevaCantidad });
    } catch (error) {
        console.error('Error al actualizar cantidad:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar cantidad' });
    }
};

// Eliminar herramienta
exports.deleteTool = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM herramientas WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Herramienta no encontrada' });
        }

        res.json({ success: true, message: 'Herramienta eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar herramienta:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar herramienta' });
    }
};

// Obtener conteo por ubicación
exports.getLocationCounts = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                ubicacion,
                COUNT(*) as count
            FROM herramientas
            GROUP BY ubicacion
        `);

        const counts = {
            todas: 0,
            bodega: 0,
            taller: 0,
            pañol: 0
        };

        rows.forEach(row => {
            counts[row.ubicacion] = row.count;
            counts.todas += row.count;
        });

        res.json({ success: true, data: counts });
    } catch (error) {
        console.error('Error al obtener conteos:', error);
        res.status(500).json({ success: false, message: 'Error al obtener conteos' });
    }
};