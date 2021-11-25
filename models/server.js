const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload')
const { dbConnection } = require('../database/config');
const { socketController } = require('../socket/controller');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server)

       this.paths = {
           auth: '/api/auth',
           usuarios: '/api/usuarios',
           categorias: '/api/categorias',
           productos: '/api/productos',
           buscar: '/api/buscar',
           uploads: '/api/uploads'
       }

        //Conexion BD
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicacion
        this.routes();

        // Sockets
        this.sockets();
    }

    async conectarDB() {
        await dbConnection();
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.usuarios, require('../routes/user'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio estatico
        this.app.use(express.static('public'));

        // FileUpload - carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    sockets() {
        this.io.on('connection', (socket) =>  socketController(socket, this.io));
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto' + this.port);
        });
    }
}

module.exports = Server;