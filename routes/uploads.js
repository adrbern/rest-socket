const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen } = require('../controllers/cargarArchivos');
const { coleccionesPermitidas } = require('../helpers/db-validators');
const { validarArchivoSubir } = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();


router.get('/:coleccion/:id', [
    check('id', 'el Id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen);

router.post('/', validarArchivoSubir, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'el Id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagen);

module.exports = router;