require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/database');

// Importar rutas
const inventoryRoutes = require('./src/routes/inventoryRoutes');
const toolsRoutes = require('./src/routes/toolsRoutes');
const movementsRoutes = require('./src/routes/movementsRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Conectar a MongoDB antes de cada request (crítico para Vercel serverless)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Error conectando a DB:', error);
        // Continuar aunque falle la conexión
        next();
    }
});

// Rutas API
app.use('/api/inventory', inventoryRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/movements', movementsRoutes);

// Ruta principal
app.get('/', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } catch (error) {
        res.json({
            success: true,
            message: 'API de Gestión de Inventario de Cocina',
            endpoints: {
                health: '/api/health',
                inventory: '/api/inventory',
                tools: '/api/tools',
                movements: '/api/movements'
            }
        });
    }
});

// Ruta de health check
app.get('/api/health', (req, res) => {
    const mongoose = require('mongoose');
    const dbStatus = mongoose.connection.readyState;
    const statusMap = {
        0: 'desconectado',
        1: 'conectado',
        2: 'conectando',
        3: 'desconectando'
    };

    res.json({
        success: true,
        message: 'API funcionando correctamente',
        database: `MongoDB ${statusMap[dbStatus]}`,
        gestion_cocina_MONGODB_URI: process.env.gestion_cocina_MONGODB_URI ? 'Configurada' : 'NO configurada',
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
        timestamp: new Date().toISOString()
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);

    res.status(err.status || 500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Error en el servidor',
        path: req.path
    });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
        path: req.path,
        method: req.method
    });
});

// Para desarrollo local
if (require.main === module) {
    const PORT = process.env.PORT || 3000;

    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
            console.log(`📊 Usando MongoDB`);
            console.log(`🌍 Modo: ${process.env.NODE_ENV || 'development'}`);
        });
    }).catch(err => {
        console.error('Error al iniciar servidor:', err);
        process.exit(1);
    });
}

// Exportar para Vercel (CRÍTICO)
module.exports = app;