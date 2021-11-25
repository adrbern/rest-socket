const { validationResult } = require('express-validator');

const esAdminRole = async (req, res, next) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'se quiere verificar el rol sin el token primero'
        })
    }

    const { rol, nombre } = req.usuario;

    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es administrador - no puede hacer esto`
        })
    }

    next();
}

const tieneRol = (...roles) => {
    return (req, res , next) => {
        console.log(roles, req.usuario.rol);

        if (!req.usuario) {
            return res.status(500).json({
                msg: 'se quiere verificar el rol sin el token primero'
            })
        }

        if(!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: `El servicio require uno de estos roles ${roles}`
            });
        } 


        next();
    };
}

module.exports = {
    esAdminRole,
    tieneRol
}