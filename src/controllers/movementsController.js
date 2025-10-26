const db = require('../config/database');

// Obtener todos los movimientos
exports.getAllMovements = async (req, res) => {
    try {
        const { tipo } = req.query;
        let query = 'SELECT * FROM movimientos';
        let params = [];

        if (tipo && tipo !== 'todos') {
            query += ' WHERE tipo_elemento = ?';
            params.push(tipo);
        }

        query += ' ORDER BY fecha DESC';

        const [rows] = await db.query(query, params);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error al obtener movimientos:', error);
        res.status(500).json({ success: false, message: 'Error al obtener movimientos' });
    }
};

// Crear movimiento de insumo
exports.createInventoryMovement = async (req, res) => {
    try {
        const { nombre, tipo, cantidad, motivo } = req.body;

        if (!nombre || !tipo || cantidad === undefined || !motivo) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }

        // Obtener información del insumo
        const [insumo] = await db.query('SELECT cantidad, unidad FROM insumos WHERE nombre = ?', [nombre]);

        if (insumo.length === 0) {
            return res.status(404).json({ success: false, message: 'Insumo no encontrado' });
        }

        // Validar stock suficiente para salidas
        if (tipo === 'salida' && insumo[0].cantidad < cantidad) {
            return res.status(400).json({ success: false, message: 'Stock insuficiente' });
        }

        // Calcular nueva cantidad
        const nuevaCantidad = tipo === 'entrada'
            ? parseFloat(insumo[0].cantidad) + parseFloat(cantidad)
            : parseFloat(insumo[0].cantidad) - parseFloat(cantidad);

        // Actualizar cantidad del insumo
        await db.query('UPDATE insumos SET cantidad = ? WHERE nombre = ?', [nuevaCantidad, nombre]);

        // Registrar movimiento
        await db.query(
            'INSERT INTO movimientos (tipo_elemento, elemento_nombre, tipo_movimiento, cantidad, unidad, motivo) VALUES (?, ?, ?, ?, ?, ?)',
            ['insumo', nombre, tipo, cantidad, insumo[0].unidad, motivo]
        );

        res.json({ success: true, message: 'Movimiento registrado correctamente' });
    } catch (error) {
        console.error('Error al crear movimiento de insumo:', error);
        res.status(500).json({ success: false, message: 'Error al crear movimiento de insumo' });
    }
};

// Crear movimiento de herramienta
exports.createToolMovement = async (req, res) => {
    try {
        const { nombre, tipo, cantidad, motivo } = req.body;

        if (!nombre || !tipo || cantidad === undefined || !motivo) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }

        // Obtener información de la herramienta
        const [herramienta] = await db.query('SELECT cantidad FROM herramientas WHERE nombre = ?', [nombre]);

        if (herramienta.length === 0) {
            return res.status(404).json({ success: false, message: 'Herramienta no encontrada' });
        }

        // Validar cantidad suficiente para salidas
        if (tipo === 'salida' && herramienta[0].cantidad < cantidad) {
            return res.status(400).json({ success: false, message: 'Cantidad insuficiente' });
        }

        // Calcular nueva cantidad
        const nuevaCantidad = tipo === 'entrada'
            ? parseInt(herramienta[0].cantidad) + parseInt(cantidad)
            : parseInt(herramienta[0].cantidad) - parseInt(cantidad);

        // Actualizar cantidad de la herramienta
        await db.query('UPDATE herramientas SET cantidad = ? WHERE nombre = ?', [nuevaCantidad, nombre]);

        // Registrar movimiento
        await db.query(
            'INSERT INTO movimientos (tipo_elemento, elemento_nombre, tipo_movimiento, cantidad, unidad, motivo) VALUES (?, ?, ?, ?, ?, ?)',
            ['herramienta', nombre, tipo, cantidad, 'unid', motivo]
        );

        res.json({ success: true, message: 'Movimiento registrado correctamente' });
    } catch (error) {
        console.error('Error al crear movimiento de herramienta:', error);
        res.status(500).json({ success: false, message: 'Error al crear movimiento de herramienta' });
    }
};