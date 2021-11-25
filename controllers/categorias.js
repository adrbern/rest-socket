const { response } = require('express');
const { Categoria } = require('../models');
const categoria = require('../models/categoria');

// Obtener categorias - paginado - total - populate
// Obtener categoria - populate {}
// Actualizar categoria
// Borrar categoria - estado a false

const crearCategoria = async(req, res) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDb = await Categoria.findOne({ nombre });

    if(categoriaDb) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDb.nombre} ya existe` 
        });
    }

    const categoria = new Categoria( {
        nombre,
        usuario: req.usuario._id
    });

    await categoria.save();

    res.status(201).json(categoria);
}

const obtenerCategorias = async(req, res) => {
    const {
        limite = 5,
        desde = 0
    } = req.body;
    const filter = { estado: true };

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(filter),
        Categoria.find(filter)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        msg: "Get API controlador",
        total,
        categorias
    });
}

const obtenerCategoria = async(req, res) => {
    const id = req.params.id;

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.json({
        categoria
    });
}

const actualizarCategoria = async(req, res) => {
    const id = req.params.id;
    const { estado, usuario, ...data } = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.json({
        categoria
    });
}

const borrarCategoria = async(req, res) => {
    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json({
        categoria
    });
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
};