require("dotenv").config();

const express = require("express");
const {json} = require("body-parser");
const cors = require("cors");
const {claves,tipos,obtenerTipos,crearClave,borrarClave,actualizarClave} = require("./db");

const servidor = express()

servidor.use(cors());
servidor.use(json());

if(process.env.PRUEBAS){
    servidor.use(express.static("./pruebas"))
}

servidor.get("/claves", async (peticion,respuesta) => {
    try{
        let resultado = await claves();

        respuesta.json(resultado);
    }
    catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }
})

servidor.get("/claves/tipo/:tipo_id([1-4])", async(peticion,respuesta) => {
    try{
        let tipo_id = peticion.params.tipo_id;
        let resultado = await obtenerTipos(tipo_id);
        respuesta.json(resultado);
     }catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }
})

servidor.get("/claves/tipo", async(peticion,respuesta) => {
    try{
        let resultado = await tipos();

        respuesta.json(resultado);
    }
    catch(error){
        respuesta.status(500)
        respuesta.json(error)
    }
}) 

servidor.post("/claves/nueva", async (peticion,respuesta,siguiente) => {

    let {titulo,tipo_id,usuario,contraseña,tipo} = peticion.body;
    
    if(!titulo || titulo.trim() == "" || !tipo_id || !usuario || usuario.trim() == "" || !contraseña || contraseña.trim() == "" || !tipo || tipo.trim() == ""){
        return siguiente(true);
    }

    try{

        let id = await crearClave(peticion.body);

        respuesta.json({id});
    }
    catch(error){

        respuesta.status(500);

        respuesta.json(error);
    }
})


servidor.delete("/claves/borrar/:id([0-9]+)", async(peticion,respuesta) => {
    try{
        let count = await borrarClave(peticion.params.id);

        respuesta.json({resultado : count ? "ok" : "ko"});

    }catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }
})

servidor.put("/claves/actualizar/:id([0-9]+)", async(peticion,respuesta,siguiente) => {
    let {titulo,tipo_id,usuario,contraseña,tipo} = peticion.body;
    
    if(!titulo || titulo.trim() == "" || !tipo_id || !usuario || usuario.trim() == "" || !contraseña || contraseña.trim() == "" || !tipo || tipo.trim() == ""){
        return siguiente(true);
    }
    try{
        let id = peticion.params.id;
        let count = await actualizarClave({id,titulo,tipo_id,usuario,contraseña,tipo});
        respuesta.json({resultado : count ? "ok" : "ko"});
    }catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }
})

servidor.use((peticion,respuesta) => {
    respuesta.status(404);
    respuesta.json({error : "recurso no encontrado"});
})

servidor.use((error,peticion,respuesta,siguiente) => {
    respuesta.status(400);
    respuesta.json({error : "error en la petición"});
})

servidor.listen(process.env.PORT);