//CODIGO PERTENECIENTE AL CORE DEL JUEGO


// 1. Funciones del ciclo de vida del juego
function preload() {
    // Carga de recursos (imágenes, sonidos)

    //MAPAS------------------------------------
    this.load.image('map1', '../img/Maps/Mapa.jpg');
    this.load.image('map2', '../img/Maps/Mapa2.jpg');
    this.load.image('map3', '../img/Maps/Mapa3.jpg');
    //----------------------------------------
    //SONIDOS---------------------------------
    this.load.audio('game_music','../Sounds/Tron Legacy 8 bit.mp3')
    this.load.audio('musicVictory', '../Sounds/Tron Legacy 8-Bit End Credits.mp3');
    //----------------------------------------
    //Personajes------------------------------
    this.load.image('player1', '../img/Characters/Char1.png');
    this.load.image('player2', '../img/Characters/Char2.png');
    //----------------------------------------
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
    player.cooldown = 5;
    player.maxCooldown = 5;
    player.controls = controls; // Mapeo de controles pasados como objeto

    // Estela de movimiento
    player.trailGraphics = scene.add.graphics();
    player.trailGraphics.setDepth(0);
    player.trail = [];
    player.trailColor = trailColor;         // Color capa base
    player.trailGlowColor = trailGlowColor; // Color capa brillo

    //Físicas
    player.setCollideWorldBounds(true); //Por defecto toma los bordes del canvas
    //Pero nosotros lo hemos definido en create
    player.alive = true; //Para Collision
    
    return player;
}


//Codigo refactorizado, ver atras para entenderlo mejor en flujo versiones
function create() {
    // Inicialización y pintado inicial de objetos
    this.map = this.add.image(400, 300, 'map1'); // Agrega la imagen del mapa al centro del canvas
    this.map.setDisplaySize(900, 680); // Ajusta el tamaño de la imagen del mapa para que ocupe todo el canvas
    //this.map.setScale(0.45, 0.33); 
    this.map.setDepth(-1); // Establece la profundidad del mapa para que esté detrás del jugador
    
    this.physics.world.setBounds(45, 25, 710, 545);   //<------------- AQUI LIMITES DE MUNDO
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
right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
nitro: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
//Permite registrar cada tecla de forma individual, para luego usarlas directamente
    };
this.players = [ //ARRAY DE PLAYERS
    createPlayer(this, 115, 520, 'player1', 0, controlsPlayer1, 0x990000, 0xFF3333),
    createPlayer(this, 685, 80, 'player2', 180, controlsPlayer2, 0x000099, 0x3333FF)
];

this.gameOverTriggered = false;  //Ha saltado el game_over?

this.physics.add.overlap(  //Asi phaser buscará detectar si hay superposición espacial.
    player1 = this.players[0], //Ya lo comprueba phaser de forma constante, sin necesidad de registrarlo en update
    player2 =  this.players[1], //en el momento en que lo detecte, llamaa a la funcion que delega en resolveCollision para gestionar la colision
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

this.gameplayMusic = this.sound.add('game_music', {
    loop: true,
    volume: 0.3
});

this.gameOverMusic = this.sound.add('musicVictory', {
    loop: true,
    volume: 0.5
});

this.gameplayMusic.play();


}

function update(time, delta) {
  
  if (!this.gameOverTriggered) {
    // Recorremos todos los jugadores registrados
    this.players.forEach(player => {  //Es una funcion flecha que recorre el array de jugadores y actualiza cada uno de ellos
        updatePlayer(player, delta);
    });

     // Comprobar colisiones entre motos y estelas
    
        checkTrailCollisions(this, this.players[0], this.players[1]);
    }else{
        //Ha saltado game over 
        this.gameOverMusic.play();
    }

}

function updatePlayer(player, delta) {
    const deltaSec = delta / 1000;

    // --- 1. LÓGICA DE ESTELA (TRAIL) ---
    player.trail.push({ x: player.x, y: player.y });
    if (player.trail.length > 50) {
        player.trail.shift();
    }

    player.trailGraphics.clear();
    player.trailGraphics.lineStyle(10, player.trailColor, 0.3);
    
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
        console.log (player, "desplazandose a la izquierda");
    } else if (player.controls.right.isDown) {
        player.angle = 90;
        player.direction = 'right';
        console.log (player, "desplazandose a la derecha");
    }

    if (player.controls.up.isDown) {
        player.angle = 0;
        player.direction = 'up';
        console.log (player, "desplazandose hacia arriba");
    } else if (player.controls.down.isDown) {
        player.angle = 180;
        player.direction = 'down';
        console.log (player, "desplazandose hacia abajo");
    }

    // --- 3. LÓGICA DE NITRO / COOLDOWN ---
if (player.controls.nitro && player.controls.nitro.isDown && player.cooldown > 0) {
    player.speed = 600;
    player.cooldown -= deltaSec;
} else {
    player.speed = 300;

    if (player.controls.nitro && !player.controls.nitro.isDown) {
        player.cooldown += deltaSec;
    }
}
    

    // Mantener cooldown en los rangos [0, maxCooldown]
    player.cooldown = Phaser.Math.Clamp(player.cooldown, 0, player.maxCooldown);

    // --- 4. MOVIMIENTO FÍSICO / POSICIÓN ---
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





// Configuración del motor
const config = {
    type: Phaser.CANVAS, // Elige WebGL si está disponible, si no Canvas
    width: 800,
    height: 600,
    // Vinculas directamente la etiqueta HTML que ya creaste
    canvas: document.getElementById('gameCanvas'),
    


    scene: {  //todo lo que vive en esa pantalla va colgado de esa escena
        preload: preload,
        create: create,
        update: update,

        physics:{

    default: 'arcade',
    arcade:{
     gravity: { y: 0 },  // Gravedad en píxeles, 0 para que las motos no caigan
            debug: true          // Mostrar contornos físicos
}

}
    }

   
};
// Desactivar el menú contextual del navegador sobre el juego
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});
// 3. Arrancar el motor de Phaser
const game = new Phaser.Game(config);