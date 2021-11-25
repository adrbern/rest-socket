const { response } = require('express');
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');

const usuariosGet = async (req, res = response) => {
    //const query = req.query;
    const { limite = 5, desde = 0 } = req.query;
    const filter = { estado: true };

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(filter),
        Usuario.find(filter)
            .skip(Number(limite))
            .limit(Number(limite))
    ]);
    res.json({
        msg: "Get API controlador",
        //...query
        total,
        usuarios
    });
}

const usuariosPost = async(req, res = response) => {
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // encriptar la contraseña
    const salt = bcryptjs.genSaltSync();

    usuario.password = bcryptjs.hashSync(password, salt);

    // guardar en BD
    await usuario.save();

    res.json({
        msg: "Post API controlador",
        usuario
    });
}

const usuariosPut = async(req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO validar contra base de datos
//    Usuario.findOne(id);

    if (password) {
        const salt = bcryptjs.genSaltSync();

        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        msg: "Put API controlador",
        usuario
    });
}

const usuariosPath = (req, res = response) => {
    res.json({
        msg: "Path API controlador"
    });
}

const usuariosDelete = async(req, res = response) => {
    const { id } = req.params;
    const uid = req.uid;

    //  Borrado fisico
    // const usuario = await Usuario.findByIdAndDelete(id);

    // Borrado logico
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    const usuarioAutenticado = req.usuario;
    res.json({
        msg: "Delete API controlador",
        usuario,
        usuarioAutenticado
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPath,
    usuariosDelete
}