const Sequelize = require('sequelize');
const db = require('../config/db');
const slug = require('slug');
const shortid = require('shortid');

// Definicion de tabla
const Proyectos = db.define('proyectos', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequelize.STRING(100),
    url: Sequelize.STRING(100)
},{
    hooks:{
       beforeCreate(proyecto){
        //    console.log('antes de insertar');
            const url = slug(proyecto.nombre).toLowerCase();
            proyecto.url = `${url}-${shortid.generate()}`;
        }
    }
}
);
 
module.exports = Proyectos;