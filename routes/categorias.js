const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const { existeCategoria } = require('../helpers/db-validators');

const router = Router();

/*
{{url}}/api/categorias
*/

// Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

// Objeter una categoria por id - publico
router.get('/:id', [
    check('id').custom(existeCategoria),
    check('id', 'No es un ID de mongo valido').isMongoId(),
    validarCampos
], obtenerCategoria);

// Crear categoria - privada - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', "el nombre es obligatorio").not().isEmpty(),
    validarCampos
], crearCategoria);

// Actualizar categoria - privada - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombres e obligatorio').not().isEmpty(),
    check('id').custom(existeCategoria),
    check('id', 'No es un ID de mongo valido').isMongoId(),
    validarCampos
], actualizarCategoria);

// Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id').custom(existeCategoria),
    check('id', 'No es un ID de mongo valido').isMongoId(),
    validarCampos
], borrarCategoria);
module.exports = router;