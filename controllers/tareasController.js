const  Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async (req, res, next) => {
    // res.send('enviado')
    // console.log(req.params.url);
    // Obtenemos el proyecto actual
const proyecto = await Proyectos.findOne({where: { url: req.params.url }});

// Leer el valor del input
const { tarea } = req.body;
// Estado 0=incompleto 1=completo
const estado = 0;
// idrelacion
const proyectoId = proyecto.id;

//Insertar en la bd
const resultado = await Tareas.create({ tarea , estado, proyectoId});
if(!resultado){
    return next();
}
// Redireccionar
res.redirect(`/proyectos/${req.params.url}`);

// console.log(proyecto);
// console.log(req.body);


}

exports.cambiaEstadoTareas = async (req,res, next) =>{
    // res.send('Todo ok...');
    // Cuando se manda datos por patch se accede mediante params
    const {id } = req.params;
    const tarea = await Tareas.findOne({where: { id : id } });
    // console.log(tareas);
    // Cambiar el estado
    let estado = 0;
    if(tarea.estado == estado){
        estado = 1;
    }
    tarea.estado = estado;
    const resultado = await tarea.save();
    // Si no hay resultado o conexion a la bd
    if(!resultado) return next();

    // Si todo es ok
    res.status(200).send('Actualizado con exito');
}

exports.eliminarTarea =  async (req,res, next) =>{
    // res.send('eliminado');
    // console.log(req.params);
    const { id } = req.params;
    // Eliminar la tarea
    const resultado = await Tareas.destroy({where: {id}});

    if(!resultado) return next();
    res.status(200).send('Eliminado con exito...!');
}