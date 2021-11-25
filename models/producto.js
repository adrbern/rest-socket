const { Schema, model } = require('mongoose'); 
const categoria = require('./categoria');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El rol es obligatorio'],
        unique: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true,
    },
    description: {
        type: String
    },
    disponible: {
        type: Boolean,
        default: true,
    },
    img: {
        type: String
    }
});

ProductoSchema.methods.toJSON = function() {
    const { __v, estado, ...producto } = this.toObject();

    return producto;
}


module.exports = model('Producto', ProductoSchema);