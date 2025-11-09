const mongoose = require('mongoose');

const movementSchema = new mongoose.Schema({
    tipo_item: {
        type: String,
        required: [true, 'El tipo de item es requerido'],
        enum: ['inventario', 'herramienta'],
        default: 'inventario'
    },
    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'El ID del item es requerido'],
        refPath: 'tipo_item_ref'
    },
    tipo_item_ref: {
        type: String,
        required: true,
        enum: ['Inventory', 'Tool']
    },
    nombre_item: {
        type: String,
        required: [true, 'El nombre del item es requerido'],
        trim: true
    },
    tipo_movimiento: {
        type: String,
        required: [true, 'El tipo de movimiento es requerido'],
        enum: ['entrada', 'salida', 'ajuste', 'uso', 'devolucion'],
        default: 'entrada'
    },
    cantidad: {
        type: Number,
        required: [true, 'La cantidad es requerida'],
        default: 0
    },
    cantidad_anterior: {
        type: Number,
        default: 0
    },
    cantidad_nueva: {
        type: Number,
        default: 0
    },
    motivo: {
        type: String,
        trim: true,
        default: ''
    },
    usuario: {
        type: String,
        trim: true,
        default: 'Sistema'
    },
    notas: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Índices para mejorar el rendimiento
movementSchema.index({ item_id: 1 });
movementSchema.index({ tipo_item: 1 });
movementSchema.index({ tipo_movimiento: 1 });
movementSchema.index({ createdAt: -1 });
movementSchema.index({ item_id: 1, createdAt: -1 });

const Movement = mongoose.model('Movement', movementSchema);

module.exports = Movement;