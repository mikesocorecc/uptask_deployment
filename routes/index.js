//#Express router
 const express = require('express');
 const router = express.Router();
// Importar express validator
const { body } = require('express-validator/check');

//#Controladores
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

// Funcion de rutas
 module.exports = function(){
    //  Rutas para el home
    router.get('/',
    authController.usuarioAutenticado,
     proyectosController.proyectosHome
     );
    // Ruta formulario proyecto
    router.get('/nuevo-proyecto',
     authController.usuarioAutenticado,
     proyectosController.formularioProyecto
     );
    // Crear un proyecto
    router.post('/nuevo-proyecto', 
      authController.usuarioAutenticado,
      body('nombre').not().isEmpty().trim().escape(),
      proyectosController.nuevoProyecto
    );
    //Mostrar el proyecto por url
    router.get('/proyectos/:url',
     authController.usuarioAutenticado,
     proyectosController.proyectoPorUrl);

    // Mostrar el proyecto por id
    router.get('/proyecto/editar/:id',
     authController.usuarioAutenticado,
     proyectosController.formularioEditar )

    // Actualizar el proyecto
    router.post('/nuevo-proyecto/:id',
      authController.usuarioAutenticado, 
      body('nombre').not().isEmpty().trim().escape(),
      proyectosController.actualizarProyecto
  );

  // Eliminar proyecto
  router.delete('/proyectos/:url', 
  authController.usuarioAutenticado,
  proyectosController.eliminarProyecto );

  // RUTAS PARA LAS TAREAS
router.post('/proyectos/:url',
 authController.usuarioAutenticado,
 tareasController.agregarTarea);

// Actualizar tareas
router.patch('/tareas/:id',
 authController.usuarioAutenticado,
 tareasController.cambiaEstadoTareas);

// Eliminar tareas
router.delete('/tareas/:id',
 authController.usuarioAutenticado,
 tareasController.eliminarTarea);


// // URL para crear nueva cuenta
router.get('/crear-cuenta', usuariosController.formCrearCuenta);
// CREAR cuenta
router.post('/crear-cuenta', usuariosController.crearCuenta);
// Iniciar sesion
router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
// peticion para iniciar sesion
router.post('/iniciar-sesion', authController.autenticarUsuario);
// Cerrar sesion
router.get('/cerrar-sesion', authController.cerrrarSesion);

// Restablecer contraseña
router.get('/restablecer', usuariosController.formRestablecerPassword);
// Envio de token
router.post('/restablecer', authController.enviarToken);
// Ruta para restablecer por token
router.get('/restablecer/:token', authController.validarToken);
// Restablecer el password
router.post('/restablecer/:token', authController.actualizarPassword);


// Ruta para confirmar el correo
router.get('/confirmar/:correo',  usuariosController.confirmarCuenta)

    return router;
 }