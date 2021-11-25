const { Schema, model } = require('mongoose'); 

const CategoriaSchema = Schema({
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
});

CategoriaSchema.methods.toJSON = function() {
    const { __v, estado, ...categoria } = this.toObject();

    return categoria;
}


module.exports = model('Categoria', CategoriaSchema);