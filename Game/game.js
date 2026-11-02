// 1. Funciones del ciclo de vida del juego
function preload() {
    // Carga de recursos (imágenes, sonidos)

    //MAPAS------------------------------------
    this.load.image('map1', '../img/Maps/Mapa.jpg');
    this.load.image('map2', '../img/Maps/Mapa2.jpg');
    this.load.image('map3', '../img/Maps/Mapa3.jpg');
    //----------------------------------------
    //SONIDOS---------------------------------

    //----------------------------------------
    //Personajes------------------------------
    this.load.image('player1', '../img/Characters/Char1.png');

    //----------------------------------------
}

function create() {
    // Inicialización y pintado inicial de objetos
    this.map = this.add.image(400, 300, 'map1'); // Agrega la imagen del mapa al centro del canvas
    this.map.setScale(0.45, 0.33); 
    this.map.setDepth(-1); // Establece la profundidad del mapa para que esté detrás del jugador
    
    // Guardamos la referencia en this.player para poder moverlo en update()
    this.player1 = this.add.image(115, 520, 'player1'); 
    this.player1.setScale(0.05); // Escala del jugador
    this.player1.direction = 'none'; // Inicializamos la dirección por defecto
    this.player1.angle = 0;
    this.player1.setDepth(1);
    // Captura de las teclas de dirección
    this.cursors = this.input.keyboard.createCursorKeys();

    // Registramos las teclas A, D, W, S en create()
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
//Permite registrar cada tecla de forma individual, para luego usarlas directamente

//Estela de movimiento del jugador
this.player1.trailGraphics = this.add.graphics() //Objeto gráfico que se usará para dibujar la estela del jugador
this.player1.trailGraphics.setDepth(0); //Por debajo del jugador
this.player1.trail = []; //Basicamente una cola que guardara los puntos (coordenadas) por los
//que pasa el jugador y cuando supere cierto numero, se borra el primero que se insertó y asi constantemente
//this.player1.trailGraphics.lineStyle(10, 0xFF0000, 1); //Establecemos el estilo de la línea de la estela (grosor, color y opacidad)

}

function update(time, delta) {
    // Bucle del juego ejecutado continuamente

    this.player1.trail.push({ x: this.player1.x, y: this.player1.y }); // Guardamos la posición actual del jugador en la estela
    if(this.player1.trail.length > 50){
        this.player1.trail.shift(); // Eliminamos el primer punto de la estela si supera los 50 puntos
    }

    //  Limpiamos el gráfico anterior
    this.player1.trailGraphics.clear();
    this.player1.trailGraphics.lineStyle(10, 0xFF0000, 1); 
    if(this.player1.trail.length > 1){ //Ya ha avanzado mas de un punto
        this.player1.trailGraphics.beginPath();
        this.player1.trailGraphics.moveTo(this.player1.trail[0].x, this.player1.trail[0].y);

        for (let i = 1; i < this.player1.trail.length; i++) {
            this.player1.trailGraphics.lineTo(this.player1.trail[i].x, this.player1.trail[i].y);
        }
        
        this.player1.trailGraphics.strokePath();
    }
        //-------------------------------------------------------------------------------------------------

    //El uso del angle funciona correctamente, ya que lo rotamos respecto al punto de origen
    // Mover a la izquierda (Flecha Izquierda o Tecla A)
    if (this.cursors.left.isDown || this.keyA.isDown) {
        this.player1.angle = -90; // Rotar el jugador hacia la izquierda
        this.player1.direction = 'left'; // Guardar la dirección del jugador por si la necesitaramos en adelante
       
        console.log('Jugador moviéndose a la izquierda');
      
    }
    // Mover a la derecha (Flecha Derecha o Tecla D)
    else if (this.cursors.right.isDown || this.keyD.isDown) {
        this.player1.angle = 90; // Rotar el jugador hacia la derecha
        this.player1.direction = 'right'; // Guardar la dirección del jugador por si la necesitaramos en adelante
        
        console.log('Jugador moviéndose a la derecha');
    }

    // Mover hacia arriba (Flecha Arriba o Tecla W)
    if (this.cursors.up.isDown || this.keyW.isDown) {
        this.player1.angle = 0; // Rotar el jugador hacia arriba
        this.player1.direction = 'up';
        
        console.log('Jugador moviéndose hacia arriba');
    }
    // Mover hacia abajo (Flecha Abajo o Tecla S)
    else if (this.cursors.down.isDown || this.keyS.isDown) {
        this.player1.angle = 180; // Rotar el jugador hacia abajo (180º)
        this.player1.direction = 'down';
      
        console.log('Jugador moviéndose hacia abajo');
    }

    switch(this.player1.direction){

case 'up':
    this.player1.y -= 5;


    break;      

case 'down':
    this.player1.y += 5;
    break;
        
case 'left':
    this.player1.x -= 5;
    break;

case 'right':
    this.player1.x += 5;
    break;


    }
}



// 2. Configuración del motor
const config = {
    type: Phaser.CANVAS, // Elige WebGL si está disponible, si no Canvas
    width: 800,
    height: 600,
    // Vinculas directamente la etiqueta HTML que ya creaste
    canvas: document.getElementById('gameCanvas'),
    
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// 3. Arrancar el motor de Phaser
const game = new Phaser.Game(config);