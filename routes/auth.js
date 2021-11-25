const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignIn, renovarToken } = require('../controllers/auth');
const { validarCampos, validarJWT } = require('../middlewares');
const router = Router();

router.post('/login', [
    check('correo', 'el correo es obligatorio').isEmail(),
    check('password', 'la contraseña es obligatoria').notEmpty(),
    validarCampos
], login); 

router.post('/google', [
    check('id_token', 'id_token de google es necesario').not().isEmpty(),
    validarCampos
], googleSignIn); 

router.get('/', [
    validarJWT
], renovarToken);

module.exports = router;