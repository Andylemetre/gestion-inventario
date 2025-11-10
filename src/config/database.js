const mongoose = require('mongoose');

// Configuración optimizada para Vercel (Serverless)
let isConnected = false;

const connectDB = async () => {
    // Si ya está conectado, reusar la conexión
    if (isConnected) {
        console.log('✅ Usando conexión existente de MongoDB');
        return;
    }

    // Verificar que existe la URI
    if (!process.env.MONGODB_URI) {
        console.error('❌ MONGODB_URI no está definida en las variables de entorno');
        return;
    }

    try {
        // Configuración optimizada para serverless
        const conn = await mongoose.connect(process.env.gestion_cocina_MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            // Importante para Vercel: usar pooling mínimo
            maxPoolSize: 10,
            minPoolSize: 2,
            // Buffering deshabilitado para mejor control
            bufferCommands: false,
        });

        isConnected = true;
        console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
        console.log(`📦 Base de datos: ${conn.connection.name}`);

        // Manejar eventos de la conexión
        mongoose.connection.on('disconnected', () => {
            isConnected = false;
            console.log('🔌 Mongoose desconectado de MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            isConnected = false;
            console.error('❌ Error de conexión de Mongoose:', err.message);
        });

    } catch (error) {
        isConnected = false;
        console.error('❌ Error al conectar a MongoDB:', error.message);
        console.error('📝 Detalles:', error);
    }
};

module.exports = connectDB;