//ESTE ES NUESTRO SERVIDOR CON NODE.JS
import express from 'express';

const app = express();


app.listen(8080,() => {
    console.log('Servidor escuchando en http://localhost:8080');
    console.log('A la espera de conexiones con cliente');
})