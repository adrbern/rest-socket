const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://rest-socket-adr.herokuapp.com/api/auth/';
    
let usuario = null;
let socket = null;

// Refencias HTML
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');

//  Validar el token de localstorage
const validarJWT = async() => {
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor')
    }

    const resp = await fetch(url, {
        headers: {
            'x-token': token
        }
    });

    const {usuario: usuarioDB, token: tokenDB} = await resp.json();
    console.log(usuarioDB, tokenDB);

    localStorage.setItem('token', tokenDB);
    usuario = usuarioDB;
    document.title = usuario.nombre;

    await conectarSocket();
}

const conectarSocket = async() => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Socket Online')
    })
    socket.on('disconnect', () => {
        console.log('Socket Offline')
    });

    socket.on('recibir-mensajes', (payload) => {
        // TODO recibir mensjes
        console.log(payload)
        dibujarMensajes(payload)
    });

    socket.on('usuarios-activos', (payload) => {
        // TODO usuarios activos
        console.log(payload)
        dibujarUsuarios(payload)
    });

    socket.on('mensaje-privado', (payload) => {
        // TODO mensajes privados
        console.log('Mensaje privado: ' + payload.de +  ": " + payload.mensaje);
    });
} 


const dibujarMensajes = (mensajes = []) => {
    let mensajesHtml = '';
    mensajes.forEach(({ nombre, mensaje }) => {
        mensajesHtml += `
        <li>
            <p>
                <span class="text-primary">${nombre}</span>
                <span>${mensaje}</span>
            </p>
        </li>`;
    });


    ulMensajes.innerHTML = mensajesHtml;
}


const dibujarUsuarios = (usuarios = []) => {
    let usersHtml = '';
    usuarios.forEach(({ uid, nombre }) => {
        usersHtml += `
        <li>
            <p>
                <h5 class="text-success">${nombre}</h5>
                <span class="fs-6 text-muted">${uid}</span>
            </p>
        </li>`;
    });


    ulUsuarios.innerHTML = usersHtml;
}

txtMensaje.addEventListener('keyup', (ev) => {
    console.log(ev);

    const mensaje = txtMensaje.value;
    const uid = txtUid.value;

    if(ev.keyCode !== 13) {
        return ;
    }
    if(mensaje.length === 0) {
        return;
    }

    socket.emit('enviar-mensaje', { mensaje, uid });
    txtMensaje.value = ''
})

const main = async() => {
await validarJWT();
}

main();