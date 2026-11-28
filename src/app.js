//ESTE ES NUESTRO SERVIDOR CON NODE.JS
import express from 'express';
import { WebSocketServer } from 'ws'; 
import { createServer } from 'http';

const app = express();
const server = createServer(app);

// ==========================================
// 1. SECCIÓN API REST (EXPRESS)
// ==========================================

//Parámetros puntuaciones
const rankings = []; //Base de datos en memoria

app.use(express.json()); // Middleware para leer JSON
app.use(express.static('src')); // Sirve la carpeta src (juego, imágenes, sonidos...)

//Funcion a realizar para cargar puntuacion en rankings
//Por primera vez
app.post('/rankings', (req, res) => {
    const { name, score } = req.body;

    if (!name || score === undefined) {
        console.log("Peticion mal formulada, necesitas incluir un nombre para guardar tu puntuación");
        return res.status(400).json({
            error: 'Nombre requerido'
        });
    }

    //Te devuelve el recurso creado
    const message = {
        id: rankings.length + 1,
        name,
        score,
        timestamp: new Date().toISOString() //Guardamos la fecha del recurso creado
    };

    rankings.push(message); //Almacenamos en nuestra base de datos el nuevo ranking
    res.status(201).location(`/rankings/${message.id}`).json(message); //Recurso creado
});

//Devolvemos ranking entero
app.get('/rankings', (req, res) => {
    res.status(200).json(rankings);
});

//Para devolver un id especifico
app.get('/rankings/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const resource = rankings.find(element => element.id === id);

    if (!resource) {
        console.log(`Recurso con id: ${id}, No encontrado`);
        return res.status(404).json({ error: 'No Encontrado' });
    }

    res.status(200).json(resource);
});

// Put para actualizar un score
app.put('/rankings/:id', (req, res) => {
    const id = parseInt(req.params.id); // El id del recurso no va a cambiar, solo su contenido
    const { name, score } = req.body;
    const resource = rankings.find(element => element.id === id);

    if (!resource) {
        console.log('Estás intentando actualizar un recurso que no existe.');
        return res.status(404).json({ error: 'No Encontrado' });
    }

    // Validamos que envíen los datos necesarios para el PUT
    if (!name || score === undefined) {
        return res.status(400).json({ error: 'Nombre y puntuación requeridos' });
    }

    // Actualizamos solo el contenido (el id ya lo tiene resource)
    resource.name = name;
    resource.score += score;

    console.log(`Recurso con id: ${id}, ha sido actualizado`);
    // Devolvemos el recurso actualizado
    res.status(200).json(resource);
});

//Delete, aunque no creo que lo usemos
//Podría servir, si reiniciasemos los rankings, cada x tiempo
app.delete('/rankings', (req, res) => {
    if (rankings.length === 0) {
        return res.status(204).send();
    } //Rankings ya fue borrado

    rankings.length = 0; //Arrays dinámicos
    res.status(204).send();
});


// ==========================================
// 2. SECCIÓN WEBSOCKETS (TIEMPO REAL)
// ==========================================

// Creamos el servidor WebSocket enganchado al mismo servidor HTTP y en la ruta /playersData
const wss = new WebSocketServer({ server });

// Guardamos las conexiones de los jugadores activos (máximo 2)
let players = [null, null];

wss.on('connection', (ws) => {
    // Buscamos el primer hueco libre (0 para Player 1, 1 para Player 2)
    let playerIndex = players.indexOf(null);

    if (playerIndex === -1) {
        console.log('Sala llena, rechazando conexión');
        ws.close();
        return;
    }

    players[playerIndex] = ws;
    const role = playerIndex + 1; // 1 o 2
    console.log(`Jugador ${role} conectado al WebSocket`);

    // Le avisamos al cliente de qué jugador es (1 o 2)
    ws.send(JSON.stringify({
        type: 'ASSIGN_ROLE',
        role: role
    }));

    // Cuando recibimos movimiento de este jugador, se lo reenviamos al rival
    ws.on('message', (data) => {
        const opponentIndex = playerIndex === 0 ? 1 : 0;
        const opponentSocket = players[opponentIndex];

        if (opponentSocket && opponentSocket.readyState === 1) { // 1 = WebSocket.OPEN
            opponentSocket.send(data.toString());
        }
    });

    // Si se desconecta, liberamos su hueco
    ws.on('close', () => {
        console.log(`Jugador ${role} desconectado`);
        players[playerIndex] = null;
    });
});


// ==========================================
// 3. ARRANQUE DEL SERVIDOR COMPARTIDO
// ==========================================

server.listen(8080, () => {
    console.log('Servidor escuchando en http://localhost:8080/Game/idx.html');
    console.log('A la espera de conexiones con cliente');
});
