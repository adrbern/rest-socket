const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const { existeProducto, existeCategoria } = require('../helpers/db-validators');

const router = Router();

/*
{{url}}/api/Productos
*/

// Obtener todas las Productos - publico
router.get('/', obtenerProductos);

// Objeter una Producto por id - publico
router.get('/:id', [
    check('id').custom(existeProducto),
    check('id', 'No es un ID de mongo valido').isMongoId(),
    validarCampos
], obtenerProducto);

// Crear Producto - privada - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', "el nombre es obligatorio").not().isEmpty(),
    check('categoria').custom(existeCategoria),
    check('categoria', "la categoria es obligatoria").isMongoId(),
    validarCampos
], crearProducto);

// Actualizar Producto - privada - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('id').custom(existeProducto),
    check('id', 'No es un ID de mongo valido').isMongoId(),
    validarCampos
], actualizarProducto);

// Borrar una Producto - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id').custom(existeProducto),
    check('id', 'No es un ID de mongo valido').isMongoId(),
    validarCampos
], borrarProducto);
module.exports = router;