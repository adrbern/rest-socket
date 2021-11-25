const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req, res, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    console.log(token);

    try {
        const { uid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
        
        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg: "Token no valido- usuario no existe en bd"
            })
        }

        // Verificar si el uid tiene estado en true

        if(!usuario.estado) {
            return res.status(401).json({
                msg: "token n valido- usuario con estado a false"
            })
        }

        req.usuario = usuario;
        console.log(uid);

        next(); 
    } catch(err) {
        console.log(err);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }
}

module.exports = {
    validarJWT
}