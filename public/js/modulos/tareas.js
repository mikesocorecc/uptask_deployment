import Swal from 'sweetalert2';
import axios from "axios";
import   { actualizarAvance } from '../funciones/avances'

const tareas = document.querySelector('.listado-pendientes');

if(tareas){

    tareas.addEventListener('click', (e) => {
        // console.log(e.target.classList);
        if(e.target.classList.contains('fa-check-circle')){
            // console.log('actualizando');
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            // console.log(idTarea);

            //Hacer un request haci /tareas/id
            const url = `${location.origin}/tareas/${idTarea}`
            // console.log(url);
            // Conectar con el controlador de la tarea
            axios.patch(url, { idTarea })
            .then(function(respuesta){
                // console.log(respuesta);
                if(respuesta.status === 200){
                    icono.classList.toggle('completo');
                    actualizarAvance();
                }
            })

        }
        if(e.target.classList.contains('fa-trash')){
            // console.log('eliminado');
            const tareaHTML = e.target.parentElement.parentElement,
                  idTarea = tareaHTML.dataset.tarea;

                //   console.log(tareaHTML);
                //   console.log(idTarea);
                // Preguntar si se desea eliminar
                Swal.fire({
                    title: 'Está seguro?',
                    text: "No podrás revertir esto!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, eliminarlo!',
                    cancelButtonText: 'Cancelar'
                  }).then((result) => {
                    if (result.isConfirmed) {
                    //   Enivar la peticion a axios
                    const url = `${location.origin}/tareas/${idTarea}`
                        
                      // Axios
                      axios.delete(url, {params: { idTarea }})
                      .then(function(respuesta) {
                        //   console.log(respuesta);
                        if(respuesta.status === 200){
                            Swal.fire(
                                'Proyecto eliminado!',
                                respuesta.data,
                                'success'
                              );
                             
                            //   Quito el elemtno
                            tareaHTML.parentElement.removeChild(tareaHTML);
                            actualizarAvance();
                        }
                      }).catch((error) => {
                        Swal.fire(
                            'Error!',
                            'No se pudo eliminar la tarea',
                            'error'
                          );
                      });
                      
                 
                
                
                    }
                  })
        }
    })

}

export default tareas;