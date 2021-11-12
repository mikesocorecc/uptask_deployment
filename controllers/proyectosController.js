// Importar modelo
const { prototype } = require('../models/Proyectos');
const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

// Lista todos los proyectos
exports.proyectosHome = async (req, res) =>{
    // console.log(res.locals.usuario);
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId } });

    res.render('index', {
        nombrePagina: 'proyectos '+ res.locals.year,
        proyectos
    });
}
// Redirige al formulario proyect
exports.formularioProyecto = async (req,res) =>{
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId } });
    res.render('nuevo-proyecto',{
        nombrePagina: 'Nuevo proyecto',
        proyectos
    })
}
// Registr Nuevo proyecto
exports.nuevoProyecto = async (req,res) =>{
// console.log(req.body);
const usuarioId = res.locals.usuario.id;
const proyectos = await Proyectos.findAll({where: { usuarioId } });
// Validar input
const { nombre } = req.body;
let errores = [];

if(!nombre){
    errores.push({'texto':'Agrega un nombre al proyecto'})
}

if(errores.length > 0){
    res.render('nuevo-proyecto', {
        nombrePagina:'Nuevo proyecto',
        errores,
        proyectos
    })
}else{
    // Insertar en la base de datos
    // Proyectos.create({ nombre }).
    // then( () => console.log('Insertado correctamente'))
    // .catch(error => console.log(error))
    // Insertando mediante promesas
    // const proyecto = await Proyectos.create({ nombre, url });
    const usuarioId = res.locals.usuario.id;
     await Proyectos.create({ nombre, usuarioId });
    res.redirect('/');
}
}

// get project by url
exports.proyectoPorUrl = async (req, res, next) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise =  Proyectos.findAll({where: { usuarioId } });
 
    // res.send(req.params.url)
    const proyectoPromise =  Proyectos.findOne({
        where: {
            url : req.params.url,
            usuarioId
        }
    });
      // Creare una promesa por que tengo dos await independientes
    const [proyectos, proyecto ] = await Promise.all([proyectosPromise, proyectoPromise ])
    
    // Consulta todas las tareas del proyecto
    const tareas = await Tareas.findAll({
        where: {
            proyectoId : proyecto.id
        }
        //, include: [
        //     {model : Proyectos }
        // ]
    });

    // console.log(tareas);

    if(!proyecto) return next();

    // console.log(proyecto);
    // Render a la vista
    res.render('tareas' , {
        nombrePagina : 'Tareas del proyecto ',
        proyecto,
        proyectos,
        tareas
    })
}

// Controlador para editar
exports.formularioEditar = async (req, res ) => {
    // Consulto todos los proyectos
 
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise =   Proyectos.findAll({where: { usuarioId } });

    // Consulto un proyecto
    const proyectoPromise =  Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    })

    // Creare una promesa por que tengo dos await independientes
    const [proyectos, proyecto ] = await Promise.all([proyectosPromise, proyectoPromise ])

    res.render('nuevo-proyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    })
}

exports.actualizarProyecto = async (req,res) =>{
    // console.log(req.body);
    // const proyectos = await Proyectos.findAll();
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId } });
    // Validar input
    const { nombre } = req.body;
    let errores = [];
    
    if(!nombre){
        errores.push({'texto':'Agrega un nombre al proyecto'})
    }
    
    if(errores.length > 0){
        res.render('nuevo-proyecto', {
            nombrePagina:'Nuevo proyecto',
            errores,
            proyectos
        })
    }else{
        // Insertar en la base de datos
        // Proyectos.create({ nombre }).
        // then( () => console.log('Insertado correctamente'))
        // .catch(error => console.log(error))
        //
    
        // Insertando mediante promesas
        // const proyecto = await Proyectos.create({ nombre, url });
         await Proyectos.update({ nombre: nombre }, {where: {id : req.params.id }});
        res.redirect('/');
    }
    }

    // Eliminar un proyecto

exports.eliminarProyecto = async (req, res, next) =>{
    // Req, res, query
    // console.log(req);
    const { urlProyecto } = req.query;
    const resultado = await Proyectos.destroy({where: { url: urlProyecto }});
    if(!resultado){
        return next();
    }
    res.status(200).send('Proyecto eliminado correctamente');
};