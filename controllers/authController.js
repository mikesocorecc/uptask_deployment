const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handler/email');

exports.autenticarUsuario =  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

// funcion para revisar si el usuario esta autenti cado 
exports.usuarioAutenticado = (req, res , next) => {
    // Si el usuario esta autenticado, continuar
    if(req.isAuthenticated()){
       return next();
    }
    // Si no, redirigir
    return res.redirect('/iniciar-sesion');
}


// Funcion para cerrar sesion
exports.cerrrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/iniciar-sesion"); 
        // Nos redirige a iniciar sesion
    })
}

// Funcion generar un token si el usuario es valido
exports.enviarToken = async (req, res) => {
    // res.send('enviando');
    // Obtengo la variable enviada desde el form
    const { email } = req.body;
    // Verificar que el usuario exista
    const usuario = await Usuarios.findOne({ where: { email } });
    // Si no hay usuario
    if(!usuario){
        // LE paso los errores
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/restablecer');
        // res.render('restablecer' , {
        //     nombrePagina: 'Restablecer tu contraseña',
        //     mensajes: req.flash()
        // })
    }

    // Generar un token 
    usuario.token = crypto.randomBytes(20).toString('hex');
    // console.log(token);
    usuario.expiracion = Date.now() + 3600000; // una hora de expiracion

    // Guardarlo en la base de datos
    await usuario.save();

    // Url de reset
    const resetUrl = `http://${req.headers.host}/restablecer/${usuario.token}`;

    // Envia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password reset',
         resetUrl,
         archivo: 'restablecer-password'
    });
    // console.log(resetUrl);

    // Terminar el proceso
    req.flash('correcto', 'Se envio un mensaje a tu correo');
    res.redirect('/iniciar-sesion');



}


exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
          token :  req.params.token
        }
    });

    // console.log(usuario);
    // SI no hay usuario
    if(!usuario){
        req.flash('error', 'No valido');
        res.redirect('/restablecer');
    }

    // Formulario para generar password
    res.render('resetPassword',{
        nombrePagina: 'Restablecer password'
    });
}


// Cambia el password por uno nuevo
exports.actualizarPassword = async (req, res) =>{
    // console.log(req.params.token);
    // res.send()
    // verificar el usuario y el token valido, tambien la fecha de verificacion
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });
    // Verifica si el usuario existe
    // console.log(usuario);
    if(!usuario){
        req.flash('error', 'No valido o token vencido');
        res.redirect('/restablecer');
    }

    // Hasehear el password
    usuario.password =   bcrypt.hashSync(req.body.password,  bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;
    // Guardamos el nuevo password
    await  usuario.save();
    //    
    req.flash('correcto', 'Se ha modificado tu contraseña correctamente');
    res.redirect('/iniciar-sesion');
}