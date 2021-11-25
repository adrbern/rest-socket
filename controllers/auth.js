const { response, json } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req, res) => {
    const { correo, password } = req.body; 

    try {
        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo })
        
        if(!usuario) {
            return res.status(400).json({
                msg: 'Usuario /password no son correctos - correo'
            })
        }
        //Si el usuario esta activo
        if(!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario /password no son correctos - estado: false'
            })
        }

        // Verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - estado: false'
            });
        }
        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            msg: 'Login Ok',
            usuario,
            token
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            msg: "Hable con el administrador",
        });
    }
}

const googleSignIn = async(req, res) => {
    const { id_token } = req.body;

    try {
        const { nombre, img, correo } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        if (!usuario) {
            const data = {
                nombre,
                correo,
                password: ':P',
                rol: 'USER_ROLE',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        if(!usuario.estado) {
            return res.status(401).json({
                msg: "Hable con el adm usuario bloqueado"
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario.id);

        console.log(usuario);
        res.json({
            msg: "todo bien",
            usuario
        });
    } catch(e) {
        console.log(e)
        return res.status(400).json({
            ok: false,
            msg: "El token no se pudo verificar"
        })
    }
}

const renovarToken = async (req, res) => {
    const token = await generarJWT(req.usuario.id)
    res.json({usuario: req.usuario, token});
}

module.exports = {
    login,
    googleSignIn,
    renovarToken
};