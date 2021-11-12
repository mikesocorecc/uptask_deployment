import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if(btnEliminar){
btnEliminar.addEventListener('click', (e) => {
  // Obtengo el valor del atributo data
  const urlProyecto = e.target.dataset.proyectoUrl;

  // console.log(urlProyecto);
  // return;

  
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
      // Enivar la peticion a axios
      const url = `${location.origin}/proyectos/${urlProyecto}`;

      // Axios
      axios.delete(url, {params: { urlProyecto } } )
      .then(function(respuesta)  {
          console.log(respuesta);
          // return;
      Swal.fire(
        'Proyecto eliminado!',
        respuesta.data,
        'success'
      );
      setTimeout(() => {
        window.location.href = '/'
    }, 3000);
          
     }).catch( (error) => {
      Swal.fire(
        'Error!',
        'No se pudo eliminar el proyecto',
        'error'
      );
       console.log(error);
     })
      
 


    }
  })
})
}

export default btnEliminar;