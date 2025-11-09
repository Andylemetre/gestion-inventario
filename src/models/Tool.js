const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true
    },
    tipo: {
        type: String,
        required: [true, 'El tipo es requerido'],
        enum: ['Utensilio', 'Electrodoméstico', 'Recipiente', 'Otros'],
        default: 'Utensilio'
    },
    cantidad: {
        type: Number,
        required: [true, 'La cantidad es requerida'],
        min: [0, 'La cantidad no puede ser negativa'],
        default: 1
    },
    estado: {
        type: String,
        required: [true, 'El estado es requerido'],
        enum: ['Excelente', 'Bueno', 'Regular', 'Malo', 'En reparación'],
        default: 'Bueno'
    },
    ubicacion: {
        type: String,
        trim: true,
        default: ''
    },
    fecha_compra: {
        type: Date,
        default: null
    },
    costo: {
        type: Number,
        min: [0, 'El costo no puede ser negativo'],
        default: 0
    },
    proveedor: {
        type: String,
        trim: true,
        default: ''
    },
    proximo_mantenimiento: {
        type: Date,
        default: null
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

// Virtual para verificar si necesita mantenimiento
toolSchema.virtual('necesitaMantenimiento').get(function () {
    if (!this.proximo_mantenimiento) return false;
    return new Date() >= this.proximo_mantenimiento;
});

// Índices
toolSchema.index({ nombre: 1 });
toolSchema.index({ tipo: 1 });
toolSchema.index({ estado: 1 });
toolSchema.index({ proximo_mantenimiento: 1 });

const Tool = mongoose.model('Tool', toolSchema);

module.exports = Tool;