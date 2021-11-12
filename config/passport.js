const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Referencia al modelo donde autenticamos
const Usuarios = require('../models/Usuarios');

// Local strategy -- Login con credenciales propias (usuario y password )
passport.use( 
    new LocalStrategy(
        // Por default passport espera un usuario y contraseña
        // Sobreescribir eso
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: { 
                        email,
                        activo: 1
                     }
                });
                // Uso una funcion creada para verificar el password
                if(!usuario.verificarPassword(password)){
                    return done(null, false, {
                        message: 'Contraseña incorrecta'
                    });
                }
                // El email existe y pass es correcto
                return done(null, usuario)
            } catch (error) {
                // El usuario no existe
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                })
            }
        }
    )
)

// Serializar el usuario (objeto usuarios)
passport.serializeUser( ( usuario, callback) => {
    callback(null, usuario);
});
// Deserealizarlo (volverlo a convertir en objeto)
passport.deserializeUser( (usuario, callback) => {
    callback(null, usuario);
});

// Exportar el modulo
module.exports = passport;