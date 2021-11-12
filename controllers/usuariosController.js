const Usuarios = require('../models/Usuarios'); 
const enviarEmail = require('../handler/email');
// Form crear usuario
exports.formCrearCuenta = (req,res ) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear cuenta en uptask'
    });
}

// Crear una cuenta de usaurio
exports.crearCuenta =  async (req, res) => {
    // res.send('enviando')
    // console.log(req.body);
    // Leer los datos
    const { email, password } = req.body;
    try {
        // Crear el usuarios
        await Usuarios.create({
        email, password
    });

    // Crear una URL de confirmar
    const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

    // Crear el objeto de usuario
    const usuario = {
        email
    }

    // Enviar email
    await enviarEmail.enviar({
        usuario,
        subject: 'Confirma tu cuenta UpTask',
        confirmarUrl,
         archivo: 'confirmar-cuenta'
    });
    // Enviar o redirigir al usuario
    req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
    res.redirect('/iniciar-sesion');
    } catch (error) {
        // Creo los errores
        req.flash('error', error.errors.map(error => error.message ))
        // console.log(error);
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear cuenta en uptask',
            email, 
            password
        });
    }

}

// Form einiciar sesion
exports.formIniciarSesion = (req,res ) => {
    // console.log(res.locals.mensajes);
    const {error} =  res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar sesion',
        error
    });
}

// Restablecer la contraseña
exports.formRestablecerPassword = (req, res) => {
    res.render('restablecer' , {
        nombrePagina: 'Restablecer tu password'
    })
}

// Confirmar cuenta mediante correo (cambia el estado)
exports.confirmarCuenta = async (req, res) =>  {
// res.json(req.params.correo);
    const usuario = await Usuarios.findOne(
        {
            where: {
               email : req.params.correo
            }
        }
    );

    // Si no existe el correo
    if(!usuario){
        req.flash('error', 'Esta cuenta no existe');
        res.redirect('/crear-cuenta');
    }

    // Activo el usuario
    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Usuario activado correctamente');
    res.redirect('/iniciar-sesion');
}
