require("dotenv").config();

const postgres = require("postgres");

function conectar(){
    return postgres({
        host : process.env.DB_HOST,
        database : process.env.DB_NAME,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD
    })
}

//Función para obtener todas las claves

function claves(){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = conectar();

            let claves = await conexion`SELECT * FROM claves`;
            
            conexion.end();

            ok(claves);

        }
        catch(error){
            ko({error:"error en el servidor"});
        }
    })
}

//Función para obtener los claves según el tipo_id

function obtenerTipos(tipo_id){
    return new Promise(async (ok, ko) => {
        try{
            const conexion = conectar();
            

            let resultado = await conexion`SELECT * FROM claves WHERE tipo_id = ${tipo_id}`;

            conexion.end ();

            ok(resultado);
        }catch(error){
            ko({error})
        }
    })
}

//Función para crear una nueva clave

function crearClave({titulo,tipo_id,usuario,contraseña,tipo}){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = conectar();

            let [{id}] = await conexion`INSERT INTO claves (titulo,tipo_id,usuario,contraseña,tipo) VALUES (${titulo}, ${tipo_id}, ${usuario},${contraseña}, ${tipo}) RETURNING id`;

            conexion.end();

            ok(id);

        }
        catch(error){
            ko({error});
        }
    })
}

//Función para borrar una clave por id

function borrarClave(id){
    return new Promise(async(ok,ko) => {
        try{

            const conexion = conectar();

            let {count} = await conexion`DELETE FROM claves WHERE id = ${id}`;

            conexion.end();

            ok(count);

        }catch(error){
            ko({error: "error en el servidor"});
        }
    })
}

//Función para actualizar una clave

function actualizarClave({id,titulo,tipo_id,usuario,contraseña,tipo}){
    return new Promise(async (ok,ko) => {

        try{
            const conexion = conectar();

            let {count} = await conexion`UPDATE claves SET titulo = ${titulo}, tipo_id = ${tipo_id}, usuario = ${usuario}, contraseña = ${contraseña}, tipo = ${tipo} WHERE id = ${id}`;

            conexion.end();

            ok(count);
        }catch(error){
            ko({error:"error en el servidor"});
        }
    })
}

//Función para obtener tanto el id como el nombre de la tabla tipos

function tipos(){
    return new Promise(async (ok,ko) => {

        try{
            const conexion = conectar();

            let resultado = await conexion`SELECT * FROM tipos`;

            conexion.end();

            ok(resultado);
        }catch(error){
            ko({error:"error en el servidor"});
        }
    })
}

module.exports = {claves,tipos,obtenerTipos,crearClave,borrarClave,actualizarClave};