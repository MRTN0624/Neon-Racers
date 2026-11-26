//ESTE ES NUESTRO SERVIDOR CON NODE.JS
import express from 'express';

const app = express();
//Parámetros puntuaciones

const rankings = []; //Base de datos

app.use(express.json()); // Middleware para servidor

app.listen(8080,() => {
    console.log('Servidor escuchando en http://localhost:8080');
    console.log('A la espera de conexiones con cliente');
})

//Funcion a realizar para cargar puntucion en rankings
//Por primera vez
app.post('/rankings', (req,res) =>{
    const {name, score} = req.body;

    if(!name || score === undefined){

        console.log("Peticion mal formulada, necesitas incluir un nombre para guardar tu puntuación");
        return res.status(400).json({
            error: 'Nombre requerido'
        });
        
    }
    //Te devuelve el recurso creado
    const message = {id: rankings.length + 1, name, score,
        timestamp: new Date().toISOString() //Guardamos la fecha del recurso creado
    }
    rankings.push(message); //Almacenamos en nuestra base de datos el nuevo ranking
    res.status(201).location(`/rankings/${message.id}`).json(message); //Recurso creado, es un template literal
});
//Devolvemos ranking entero
app.get('/rankings', (req, res) => {
    res.status(200).json(rankings);
});


