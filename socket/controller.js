const { Socket } = require('socket.io');
const { comprobarJWT } = require('../helpers');
const { ChatMensajes } = require('../models')

const chatMensajes = new ChatMensajes;

const socketController = async(socket = new Socket(), io ) => {
    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);
    
    if(!usuario) {
       return socket.disconnect();
    }

    // Agregar el usuario conectado
    chatMensajes.conectarUsuario(usuario);

    // Como es el propio al pasar por referencia se consigue emitir a todos menos a si mismo
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    console.log(`Se conecto el usuario ${usuario.nombre}`);
    // ASi solo se manda a la propia persona
    socket.emit('recibir-mensajes', chatMensajes.ultimos10)

    // Conectarlo a una sala especial
    socket.join(usuario.id) // Global, socket.id y otra por usuario.id

    // Limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);

        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    })

    socket.on('enviar-mensaje', ({uid, mensaje}) => {
        console.log({uid, mensaje});

        if (uid) {
            // Mensaje privado
            socket.to(uid).emit('mensaje-privado', {de: usuario.nombre, mensaje})
        } else {
            chatMensajes.enviarMenaje(usuario.id, usuario.nombre, mensaje);
            io.emit("recibir-mensajes", chatMensajes.ultimos10)
        }
    });
}


module.exports = {
    socketController
};