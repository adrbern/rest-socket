const { Router } = require('express');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPath } = require('../controllers/user');
const { check } = require('express-validator');
const { esRolValido, emailValidado, existeUsuarioPorId } = require('../helpers/db-validators');
/*
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, tieneRol } = require('../middlewares/validar-roles');
*/
const { validarCampos, validarJWT, esAdminRole, tieneRol} = require('../middlewares/index');

const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPut);

router.post('/', [
    check('nombre', 'el nombre es obligatorio').not().isEmpty(),
    check('password', 'el parssword es obligatorio  de mas de 6 letras').isLength({ min: 6 }),
    //check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('correo', 'el correo no es valido').isEmail(),
    check('correo').custom(emailValidado),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPost);

router.delete('/:id', [
    validarJWT,
    // esAdminRole,
    tieneRol('VENTAS_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);

router.patch('/', usuariosPath);     

module.exports = router;