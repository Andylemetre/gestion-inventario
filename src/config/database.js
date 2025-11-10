const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.gestion_cocina_MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB conectado exitosamente');
        console.log(`📊 Base de datos: ${mongoose.connection.name}`);
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error.message);
        process.exit(1);
    }
};

// Eventos de conexión
mongoose.connection.on('connected', () => {
    console.log('🔗 Mongoose conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Error de conexión de Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('🔌 Mongoose desconectado de MongoDB');
});

// Cerrar conexión cuando se cierra la aplicación
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('🔒 Conexión de MongoDB cerrada debido a la terminación de la aplicación');
    process.exit(0);
});

module.exports = connectDB;