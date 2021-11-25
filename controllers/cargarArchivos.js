const { response } = require('express');
const { subirArchivo } = require('../helpers');

const path = require('path');
const fs = require('fs');

const { Usuario, Producto} = require('../models');

const cargarArchivo = async(req, res = response) => {
    try {
        // const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');
        const nombre = await subirArchivo(req.files, undefined, 'imgs');

        res.json({ nombre });
    } catch (e) {
        res.status(400).json({ msg: e });
    }

}

const actualizarImagen = async(req, res = response) => {
    const { id, coleccion } = req.params;
    
    let modelo;

    switch(coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if(!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el Id ${id}`
                });
            }

        break;
        case 'productos':
            modelo = await Producto.findById(id);

            if(!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el Id ${id}`
                });
            }

        break;
        default:
            return res.status(500).json({
                msg: 'Se me olvido valiadar esto'
            });
    }
    
    // Limpiar imagenes previas
    if (modelo.img) {
        // console.log(modelo.img)
        // Hay que borrar la imagen 
         const pathImage = path.join(__dirname, '../uploads', coleccion, modelo.img);

        if (fs.existsSync(pathImage)) {
            fs.unlinkSync(pathImage);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json(modelo);
}

const mostrarImagen = async(req, res = response) => {
    const { id, coleccion } = req.params;
    
    let modelo;

    switch(coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if(!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el Id ${id}`
                });
            }

        break;
        case 'productos':
            modelo = await Producto.findById(id);

            if(!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el Id ${id}`
                });
            }

        break;
        default:
            return res.status(500).json({
                msg: 'Se me olvido valiadar esto'
            });
    }
    
    // Limpiar imagenes previas
    if (modelo.img) {
        // console.log(modelo.img)
        // Hay que borrar la imagen 
         const pathImage = path.join(__dirname, '../uploads', coleccion, modelo.img);

        if (fs.existsSync(pathImage)) {
            return res.sendFile(pathImage);
        }
    }

    const pathImage = path.join(__dirname, '../assets/no-image.jpg');

    res.sendFile(pathImage);
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen
}