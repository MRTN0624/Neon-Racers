
class Core extends Phaser.Scene {

    constructor() {
        super('Core');
    }

    // Inicialización y pintado inicial de objetos
    create() {
        this.sound.stopByKey('musicMenu');
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
        //Ejemplo de uso de esto
        // const persona = {
        //     nombre: 'Juan',
        //     edad: 25,
        //     ciudad: 'Madrid'
        // };
        //Toma un objeto y te devuelve un array con los nombre de todas sus propiedades

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

            createPlayer(this, 115, 520, 'player1', 0, controlsPlayer1, 0x990000, 0xFF3333),

            createPlayer(this, 685, 80, 'player2', 180, controlsPlayer2, 0x000099, 0x3333FF)

        ];

        this.gameOverTriggered = false;  //Ha saltado el game_over?

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

        //Instanciacion e inicialización de la música

        this.gameplayMusic = this.sound.add(mapConfig.music, {
            loop: true,
            volume: 0.3
        });

        this.gameOverMusic = this.sound.add('musicVictory', {
            loop: true,
            volume: 0.5
        });

        this.gameplayMusic.play();

        this.time.addEvent({
            delay: 5000,
            callback: () => RandomObjectGenerator(this),
            loop: true
        });

    }

    update(time, delta) {

        if (!this.gameOverTriggered) {

            // Recorremos todos los jugadores registrados
            this.players.forEach(player => {  //Es una funcion flecha que recorre el array de jugadores y actualiza cada uno de ellos
                updatePlayer(player, delta);
            });

            // Comprobar colisiones entre motos y estelas
            checkTrailCollisions(this, this.players[0], this.players[1]);

            // Comprobar colisiones entre motos y objetos
            collisionPlayerObject(this, this.players);
        }

    }

}


// Actualización de cada jugador
function updatePlayer(player, delta) {
    const deltaSec = delta / 1000;

    // --- 1. LÓGICA DE ESTELA (TRAIL) ---
    player.trail.push({ x: player.x, y: player.y });

    if (player.trail.length > player.trailMaxSize) {
        player.trail.shift();
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
    if (player.controls.left.isDown) {
        player.angle = -90;
        player.direction = 'left';
    } else if (player.controls.right.isDown) {
        player.angle = 90;
        player.direction = 'right';
    }

    if (player.controls.up.isDown) {
        player.angle = 0;
        player.direction = 'up';
    } else if (player.controls.down.isDown) {
        player.angle = 180;
        player.direction = 'down';
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

function createPlayer(scene, x, y, key, startAngle, controls, trailColor, trailGlowColor) {
    //const player = scene.add.image(x, y, key); Sin físicas
    const player = scene.physics.add.image(x, y, key); //Añadir físicas
    player.setScale(0.05);
    player.direction = 'none';
    player.angle = startAngle;
    player.setDepth(1);

    // Propiedades del jugador
    player.speed = 300;
    player.controls = controls; // Mapeo de controles pasados como objeto
    player.fullNitro = false; // Control del poder de velocidad
    player.inmortal = false; // Control del poder de inmortalidad

    // Estela de movimiento
    player.trailGraphics = scene.add.graphics();
    player.trailGraphics.setDepth(0);
    player.trail = [];
    player.trailMaxSize = 50; //Control del poder de traza aumentada
    player.trailColor = trailColor;         // Color capa base
    player.trailGlowColor = trailGlowColor; // Color capa brillo

    //Físicas
    player.setCollideWorldBounds(true); //Por defecto toma los bordes del canvas
    //Pero nosotros lo hemos definido en create
    player.alive = true; //Para Collision

    return player;
}
