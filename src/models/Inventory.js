const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true
    },
    categoria: {
        type: String,
        required: [true, 'La categoría es requerida'],
        enum: ['Ingrediente', 'Condimento', 'Bebida', 'Otros'],
        default: 'Ingrediente'
    },
    cantidad: {
        type: Number,
        required: [true, 'La cantidad es requerida'],
        min: [0, 'La cantidad no puede ser negativa'],
        default: 0
    },
    unidad: {
        type: String,
        required: [true, 'La unidad es requerida'],
        enum: ['kg', 'g', 'l', 'ml', 'unidad', 'paquete'],
        default: 'unidad'
    },
    stock_minimo: {
        type: Number,
        min: [0, 'El stock mínimo no puede ser negativo'],
        default: 0
    },
    precio_unitario: {
        type: Number,
        min: [0, 'El precio no puede ser negativo'],
        default: 0
    },
    proveedor: {
        type: String,
        trim: true,
        default: ''
    },
    ubicacion: {
        type: String,
        trim: true,
        default: ''
    },
    fecha_vencimiento: {
        type: Date,
        default: null
    },
    notas: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual para verificar si está por debajo del stock mínimo
inventorySchema.virtual('necesitaReabastecimiento').get(function () {
    return this.cantidad <= this.stock_minimo;
});

// Virtual para calcular el valor total
inventorySchema.virtual('valorTotal').get(function () {
    return this.cantidad * this.precio_unitario;
});

// Índices para mejorar el rendimiento
inventorySchema.index({ nombre: 1 });
inventorySchema.index({ categoria: 1 });
inventorySchema.index({ fecha_vencimiento: 1 });

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;