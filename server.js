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
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Conectar a MongoDB antes de cada request (importante para Vercel)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Error conectando a DB:', error);
        next();
    }
});

// Rutas API
app.use('/api/inventory', inventoryRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/movements', movementsRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta de health check
app.get('/api/health', (req, res) => {
    const dbStatus = require('mongoose').connection.readyState;
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
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Solo iniciar servidor si no está en Vercel
if (process.env.NODE_ENV !== 'production') {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
            console.log(`📊 Usando MongoDB`);
        });
    });
}

// Exportar para Vercel
module.exports = app;