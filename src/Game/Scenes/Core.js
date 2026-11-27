

import SocketManager from "../SocketManager.js";
class Core extends Phaser.Scene {

    constructor() {
        super('Core');
    }
//tanto init como create pueden recibir data, una variable que representa
//un paquete de datos que es enviado al llamar al scene start de esta escena
//Solo contendrá lo que se haya mandado desde la escena que ha lanzado esta ultima


// Recuperar las puntuaciones al reiniciar la escena
    init(data) {
        this.score1 = data.score1 || 0;
        this.score2 = data.score2 || 0;
        this.isOnline = data.isOnline;
    }

    // Inicialización y pintado inicial de objetos
    create() {

        RandomObjects = []; //al reiniciar la escena reiniciamos el array

        this.sound.removeByKey('musicMenu');
        const maps = {

            map1: {
                key: 'map1',
                music: 'game_music',
                bounds: {
                    x: 45,
                    y: 25,
                    width: 710,
                    height: 545
                }
            },

            map2: {
                key: 'map2',
                music: 'game_music2',
                bounds: {
                    x: 45,
                    y: 25,
                    width: 710,
                    height: 545
                }
            },

            map3: {
                key: 'map3',
                music: 'game_music3',
                bounds: {
                    x: 45,
                    y: 25,
                    width: 710,
                    height: 545
                }
            }

        };

        // Selección aleatoria del mapa utilizando las claves del objeto maps
        const mapKeys = Object.keys(maps);
         // const claves = Object.keys(persona);
        // console.log(claves); // Output: ['nombre', 'edad', 'ciudad']

        const selectedMap = Phaser.Math.RND.pick(mapKeys);

        //const selectedMap = 'map3';

        // Inicialización y pintado inicial de objetos
        const mapConfig = maps[selectedMap];

        // Pintamos el mapa seleccionado
        this.map = this.add.image(400, 300, mapConfig.key);

        this.map.setDisplaySize(900, 680);
        this.map.setDepth(-1);

        this.physics.world.setBounds(
            mapConfig.bounds.x,
            mapConfig.bounds.y,
            mapConfig.bounds.width,
            mapConfig.bounds.height
        );   //<------------- AQUI LIMITES DE MUNDO
        //Estos valores, los he ido probando y me han convencido


        const cursors = this.input.keyboard.createCursorKeys(); //Para jugador 2

        const controlsPlayer2 = {
            // Captura de las teclas de dirección
            up: cursors.up,
            down: cursors.down,
            left: cursors.left,
            right: cursors.right
        };

        const controlsPlayer1 = {
            // Registramos las teclas A, D, W, S en create()
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
            //Permite registrar cada tecla de forma individual, para luego usarlas directamente
        };

        this.players = [ //ARRAY DE PLAYERS

            createPlayer(this, 115, 520, 'player1', 'none', 0, controlsPlayer1, 0x990000, 0xFF3333),

            createPlayer(this, 685, 80, 'player2', 'none', 180, controlsPlayer2, 0x000099, 0x3333FF)

        ];
//WEBSOCKETS ----------------------------------->

if(this.online){

this.socket = SocketManager.getInstance(); //Obtenemos el socket / Iniciamos conexion con el servidor
//Para este punto hemos establecido una conexion tcp cliente servidor 
//Y hemos hecho un handshake de negociacion sobre http, ya que seguiamos trabajando con un protoclo solicitud-respuesta(http)
//Ya tenemos websocket.

//Quitamos los controles al jugador 2
this.players[1].controls = {
    up: { isDown: false },
    down: { isDown: false },
    left: { isDown: false },
    right: { isDown: false }
};
//Al ser en linea ambos usarán los mismos controles (WASD)
//No queremos que se pueda mover el jugador usando flechas ni el propio teclado de uno de los jugadores

//Funcion que se ejecuta al recibir datos del servidor
this.socket.onmessage = (event) => { //Event es un objeto que contiene toda la informacion del evento message.
data = JSON.parse(event.data);
this.players[1].x = data.x;
this.players[1].y = data.y;
this.players[1].direction = data.direction;
this.players[1].angle = data.angle;
};
//No hace falta pintar nada de las escenas, ya que eso no va a cambiar
}




//---------------------------------------------->
        this.gameOverTriggered = false;  //Ha saltado el game_over?



        // SISTEMA DE PAUSA PARA DOS JUGADORES

        const pauseGame = (event) => {

            // Evitar que mantener pulsada una tecla
            // provoque varias pausas consecutivas
            if (event.repeat) {
                return;
            }

            // No pausar si la carrera ha terminado
            if (this.gameOverTriggered) {
                return;
            }

            // Evitar abrir dos menús de pausa
            if (this.scene.isActive('PauseMenu')) {
                return;
            }

            // Pausar toda la partida
            this.scene.pause();

            // Lanzar el menú de pausa
            this.scene.launch('PauseMenu');

            // Mostrar el menú por encima del juego
            this.scene.bringToTop('PauseMenu');
        };

        // JUGADOR 1: tecla Q
        this.input.keyboard.on('keydown-Q', pauseGame);

        // JUGADOR 2: tecla P
        this.input.keyboard.on('keydown-P', pauseGame);

        this.physics.add.overlap(  //Asi phaser buscará detectar si hay superposición espacial.
            this.players[0], //Primera moto
            this.players[1], //Segunda moto
            handlePlayerOverlap,
            null,
            this
        );

        //Add Overlap tiene 5 parámetros
        // El primero es el objeto
        // contra el que quieres comprobar el solapamiento, la primera moto
        // El segundo objeto, la segunda moto, el tercero
        // la funcion que se ejecuta al detectar solapamiento,
        // El cuarto parámetro sirve para darle una funcion que se ejecuta antes de la funcion
        // principal
        // y el quinto parámetro se refiere a la escena
        //Cuando phaser llame a tu funcion, dentro de la funcion this, sera la escena

        this.physics.world.on('worldbounds', (body) => {
            if (this.gameOverTriggered) return;

            if (body.gameObject === this.players[0]) {
                resolveCollision(this, this.players[0], this.players[1], 'player1-wall');
            }
            else if (body.gameObject === this.players[1]) {
                resolveCollision(this, this.players[0], this.players[1], 'player2-wall');
            }
        });

        //Instanciacion e inicialización de la música

        this.gameplayMusic = this.sound.add(mapConfig.music, {
            loop: true,
            volume: 0.3
        });

        this.gameOverMusic = this.sound.add('musicVictory', {
            loop: true,
            volume: 0.05
        });

        this.gameplayMusic.play();

        this.time.addEvent({
            delay: 5000,
            callback: () => RandomObjectGenerator(this),
            loop: true
        });

        this.scoreText = this.add.text(720, 0, this.score1 + " - " + this.score2, {
            fontSize: '28px',
            color: '#ffffff',
            fontFamily: 'PixelFont',
        })

    }

    update(time, delta) {

        if (!this.gameOverTriggered) {


            if(this.isOnline){
                updatePlayer(this.players[0],delta); //Actualizas tu jugador de forma normal
                updatePlayer(this.players[1],delta); //Actualizas la estela del rival

                if(this.socket.readyState === WebSocket.OPEN){
                    //Es decir si la conexion está abierta
                    this.socket.send(JSON.stringify({
                    x: this.players[0].x,
                    y: this.players[0].y,
                    direction: this.players[0].direction,
                    angle: this.players[0].angle}));
                }

            }else{
                // Recorremos todos los jugadores registrados
            this.players.forEach(player => {  //Es una funcion flecha que recorre el array de jugadores y actualiza cada uno de ellos
                updatePlayer(player, delta);
            });
            }
            

            // Comprobar colisiones entre motos y estelas
            checkTrailCollisions(this, this.players[0], this.players[1]);

            // Comprobar colisiones entre motos y objetos
            //collisionPlayerObject(this, this.players);
        }

    }

}


// Actualización de cada jugador
function updatePlayer(player, delta) {
    const deltaSec = delta / 1000;

    // --- 1. LÓGICA DE ESTELA (TRAIL) ---
    if (player.direction != 'none' && player.speed > 0) {
        //Si el jugador no tiene direccion o no esta congelado 
        const lastPoint = player.trail[player.trail.length - 1];

        if (!lastPoint || lastPoint.x !== player.x || lastPoint.y !== player.y) {
            //Comprueba si existe, un punto previo o la moto se ha movido en cualquiera de los ejes.
            player.trail.push({ x: player.x, y: player.y });
        }

        if (player.trail.length > player.trailMaxSize) {
            player.trail.shift();
        }
    }


    player.trailGraphics.clear();

    if (player.trail.length > 1) {

        // Primera capa: color base
        player.trailGraphics.lineStyle(10, player.trailColor, 0.3);
        player.trailGraphics.beginPath();
        player.trailGraphics.moveTo(player.trail[0].x, player.trail[0].y);

        for (let i = 1; i < player.trail.length; i++) {
            player.trailGraphics.lineTo(player.trail[i].x, player.trail[i].y);
        }

        player.trailGraphics.strokePath();

        // Segunda capa: brillo
        player.trailGraphics.lineStyle(5, player.trailGlowColor, 0.9);
        player.trailGraphics.beginPath();
        player.trailGraphics.moveTo(player.trail[0].x, player.trail[0].y);

        for (let i = 1; i < player.trail.length; i++) {
            player.trailGraphics.lineTo(player.trail[i].x, player.trail[i].y);
        }

        player.trailGraphics.strokePath();
    }

    // --- 2. ENTRADA DE CONTROLES (DIRECCIÓN) ---       
    if (player.speed > 0) {  //Si el jugador esta congelado no puede hacer nada
        if (player.controls.left.isDown && player.direction != 'right') { //El jugador no puede girar 180º
            player.angle = -90;
            player.direction = 'left';
            player.body.setSize(1200, 400, true); //Si se puede cambiar la hitbox si cambias de direccion
        } else if (player.controls.right.isDown && player.direction != 'left') {
            player.angle = 90;
            player.direction = 'right';
            player.body.setSize(1200, 400, true);
        }

        if (player.controls.up.isDown && player.direction != 'down') {
            player.angle = 0;
            player.direction = 'up';
            player.body.setSize(400, 1200, true);
        } else if (player.controls.down.isDown && player.direction != 'up') {
            player.angle = 180;
            player.direction = 'down';
            player.body.setSize(400, 1200, true);
        }
    }

    // --- 3. MOVIMIENTO FÍSICO / POSICIÓN ---
    switch (player.direction) {
        case 'up':
            player.y -= player.speed * deltaSec;
            break;
        case 'down':
            player.y += player.speed * deltaSec;
            break;
        case 'left':
            player.x -= player.speed * deltaSec;
            break;
        case 'right':
            player.x += player.speed * deltaSec;
            break;
    }
}


// Reduce progresivamente el volumen de la música hasta detenerla
function fadeOutMusic(scene) {

    scene.tweens.add({
        targets: scene.gameplayMusic,
        volume: 0,
        duration: 1500, // Duración del fade out en milisegundos
        ease: 'Linear',

        onComplete: () => {
            scene.gameplayMusic.stop();
        }
    });
}

function createPlayer(scene, x, y, key, startDirection, startAngle, controls, trailColor, trailGlowColor) {
    //const player = scene.add.image(x, y, key); Sin físicas
    const player = scene.physics.add.image(x, y, key); //Añadir físicas
    player.setScale(0.05);
    player.body.setSize(400, 1200, true); //Esta exacto para que ocupe la moto no lo cambieis porfa 
    player.direction = startDirection;
    player.angle = startAngle;
    player.setDepth(1);

    // Propiedades del jugador
    player.speed = 300;
    player.controls = controls; // Mapeo de controles pasados como objeto
    //player.fullNitro = false; // Control del poder de velocidad
    player.inmortal = false; // Control del poder de inmortalidad

    // Estela de movimiento
    player.trailGraphics = scene.add.graphics();
    player.trailGraphics.setDepth(0);
    player.trail = [];
    player.trailMaxSize = 40; 
    player.trailColor = trailColor;         // Color capa base
    player.trailGlowColor = trailGlowColor; // Color capa brillo

    //Físicas
    player.setCollideWorldBounds(true); //Por defecto toma los bordes del canvas
    player.body.onWorldBounds = true; //Esta linea sirve para avisar de que el jugador a tocado los bordes del mapa
    //Pero nosotros lo hemos definido en create
    player.alive = true; //Para Collision

    return player;
}

function updateScore(scene, player1Win) {

    if (player1Win == true) {
        scene.score1 += 1;
       // guardarPuntuacionRanking(scene.player1Name, scene.score1);
    }
    else {
        scene.score2 += 1;
        //guardarPuntuacionRanking(scene.player2Name, scene.score2);
    }

    scene.scoreText.setText(scene.score1 + " - " + scene.score2);
}

//Esto sobraria en principio, al gestionarlo desde game Over
// async function guardarPuntuacionRanking(nombreJugador, puntuacion) {
//     if (!nombreJugador || puntuacion <= 0) return;

//     try {
//         // 1. Pedimos los rankings actuales para ver si el jugador ya existe
//         const response = await fetch('http://localhost:8080/rankings');
//         const rankings = await response.json(); //Tenemos la base de datos

//         const jugadorExistente = rankings.find(
//             entry => entry.name.toLowerCase() === nombreJugador.trim().toLowerCase()
//         ); //El toLowerCase es para que no distinga de diferencias, solo si coinciden nombres

//         if (jugadorExistente) {
//             // 2A. Si ya existe y la nueva puntuación es mayor, actualizamos con PUT
//             if (puntuacion > jugadorExistente.score) {
//                 await fetch(`/rankings/${jugadorExistente.id}`, {
//                     method: 'PUT',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({
//                         name: jugadorExistente.name,
//                         score: puntuacion
//                     })
//                 });
//             }
//         } else {
//             // 2B. Si no existe, creamos su entrada con POST
//             await fetch('/rankings', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     name: nombreJugador.trim(),
//                     score: puntuacion
//                 })
//             });
//         }
//     } catch (error) {
//         console.error('Error al enviar puntuación:', error);
//     }
//}