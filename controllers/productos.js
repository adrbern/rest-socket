const { response } = require('express');
const { Producto } = require('../models');

// Obtener categorias - paginado - total - populate
// Obtener categoria - populate {}
// Actualizar categoria
// Borrar categoria - estado a false

const crearProducto = async(req, res) => {
    const { estado, usuario, ...body} = req.body;

    const productoDb = await Producto.findOne({ nombre: body.nombre });

    if(productoDb) {
        return res.status(400).json({
            msg: `La producto ${productoDb.nombre} ya existe` 
        });
    }

    body.nombre = body.nombre.toUpperCase();
    body.usuario = req.usuario._id;

    const producto = new Producto( {
        ...body
    });

    await producto.save();

    res.status(201).json(producto);
}

const obtenerProductos = async(req, res) => {
    const {
        limite = 5,
        desde = 0
    } = req.body;
    const filter = { estado: true };

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(filter),
        Producto.find(filter)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        msg: "Get API controlador",
        total,
        productos
    });
}

const obtenerProducto = async(req, res) => {
    const id = req.params.id;

    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.json({
        producto
    });
}

const actualizarProducto = async(req, res) => {
    const id = req.params.id;
    const { estado, usuario, ...data } = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json({
        producto
    });
}

const borrarProducto = async(req, res) => {
    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json({
        producto
    });
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
};