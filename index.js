//#Importar (no es ECMAscript 6) 
const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
// const expressValidator = require("express-validator");
// const { expressValidator } = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
// Importar las variables
require('dotenv').config({path: 'variables.env'});

//Helpers con algunas funciones
const helpers  = require('./helpers');

// Crear la conexxion a la bd
const db = require('./config/db');
// Autenticate solo se conecta al servidor

// Importar el modelos
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

// db.authenticate()
// Sync crea la estructura de la bd
db.sync()
.then(() => console.log('conectado al servidor mysql') )
.catch((error) => console.log(error));

//#Crear una app expres
const app = express();

//#Cargas archivos staticos(carpeta public)
app.use(express.static('public'));

//#Habilitar body parser para leer request
app.use(bodyParser.urlencoded({extended:true}));

// Agregamos la validacion de express-validator
// app.use(expressValidator());

//#Habilitar pug
app.set('view engine', 'pug');
//#añadir carpeta de las vistas pug
app.set('views', path.join(__dirname, './views'));

// Agregar flash messages
app.use(flash());

// Agregando cookieparser
app.use(cookieParser());

// Agregando la lib de sesiones (permiten navegar entre distintas paginas cuando hay sesion)
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

// usamos arrancamos una instancia de passport (Boilerplate)
app.use(passport.initialize());
app.use(passport.session());
// Pasar var dump a la aplicacion
app.use((req, res, next) => {
    // console.log(req.user);
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null; //Agrego los datos de la sesion  a un objeto global
  
    next();
});

// Global de fecha
app.use((req, res, next) => {
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    next();
})

app.use('/', routes());

//#Puerto en que se ejecutara
// Servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('El servidor esta funcionando');
});

// Llamo a mi archivo de configuracion email
require('./handler/email');