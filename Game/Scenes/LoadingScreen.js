
class LoadingScreen extends Phaser.Scene {
//esta escena solo se encarga de cargar los recursos y mostrar el progreso.
    constructor() {
        super('LoadingScreen');
    }

    // Carga de recursos y configuración de la pantalla de carga
    preload() {
         console.log("LoadingScreen: preload");
        // 1. Configuración visual de la pantalla
        // Obtener el canvas del HTML
        const canvas = document.getElementById('gameCanvas');

        // Obtener sus dimensiones
        const width = canvas.width;
        const height = canvas.height;

        // Título
        this.add.text(width / 2, height / 2 - 80, 'NEON RACERS', {
            fontSize: '38px',
            color: '#00ffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Texto de carga
        const loadingText = this.add.text(
            width / 2,
            height / 2 - 20,
            'CARGANDO...',
            {
                fontSize: '16px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        // 2. Configuración de la barra de progreso
        const barWidth = 400;
        const barHeight = 18;

        const barX = (width - barWidth) / 2;
        const barY = height / 2 + 20;

        // Fondo de la barra
        const progressBox = this.add.graphics();

        progressBox.lineStyle(2, 0x00ffff, 1);
        progressBox.strokeRect(barX, barY, barWidth, barHeight);

        // Relleno de la barra
        const progressBar = this.add.graphics();

        // Porcentaje de carga
        const percentText = this.add.text(
            width / 2,
            barY + 40,
            '0%',
            {
                fontSize: '16px',
                color: '#00ffff'
            }
        ).setOrigin(0.5);

        // 3. Evento que actualiza la barra según el progreso real
        this.load.on('progress', (value) => {

            progressBar.clear();

            progressBar.fillStyle(0x00ffff, 1);
            progressBar.fillRect(
                barX,
                barY,
                barWidth * value,
                barHeight
            );

            percentText.setText(`${Math.round(value * 100)}%`);
        });

        // 4. Mostrar el recurso que se está cargando
        this.load.on('fileprogress', (file) => {
            loadingText.setText(`CARGANDO: ${file.key}`);
        });

        // 5. Carga de recursos del juego
         // MENU------------------------------------
        this.load.image('menuBackground', '../img/Menu/MainMenu.jpg');
        this.load.image('menuArrow', '../img/Menu/arrow.png');
        this.load.image('menuOptions', '../img/Menu/backGroundOptionsMenu.jpg');
         //----------------------------------------


        // MAPAS------------------------------------
        this.load.image('map1', '../img/Maps/Mapa.jpg');
        this.load.image('map2', '../img/Maps/Mapa2.jpg');
        this.load.image('map3', '../img/Maps/Mapa3.jpg');
        //----------------------------------------

        // SONIDOS---------------------------------
        this.load.audio('game_music', '../Sounds/TRON Legacy - 8-Bit GRID 2.0.mp3');
        this.load.audio('game_music2', '../Sounds/TRON Ares Arcade.mp3');
        this.load.audio('game_music3', '../Sounds/TRON - The Son of Flynn 8-bit cover.mp3');
        this.load.audio('musicVictory', '../Sounds/Tron Legacy 8-Bit End Credits.mp3');
        this.load.audio('musicMenu','../Sounds/Tron Legacy The Grid 8 bit.mp3');
        //----------------------------------------

        // Personajes------------------------------
        this.load.image('player1', '../img/Characters/Char1.png');
        this.load.image('player2', '../img/Characters/Char2.png');
        //----------------------------------------

        // Objetos
        this.load.image('objeto_eliminador', '../img/Objects/Eliminador.png');
        this.load.image('objeto_congelar', '../img/Objects/Hielo.png');
        this.load.image('objeto_inmortalidad', '../img/Objects/Inmortalidad.png');
        this.load.image('objeto_traza', '../img/Objects/TrazaAumentada.png');
        this.load.image('objeto_velocidad', '../img/Objects/Velocidad.png');

    }

    // Cuando termina la carga, iniciamos MainMenu en paralelo
    create() {
         console.log("LoadingScreen: create");
        this.scene.launch('MainMenu');

        // Nos aseguramos de que LoadingScreen siga por encima
        this.scene.bringToTop('LoadingScreen');

        // En MainMenu, al final de create retiramos esta escena
    }
}

// La estructura:
// LoadingScreen carga los recursos.

// Cuando termina la carga, lanza MainMenu con launch().

// MainMenu ejecuta su create() y prepara sus elementos.

// Mientras tanto, mantenemos LoadingScreen visible por encima.

// Cuando el menú está preparado, detenemos LoadingScreen y dejamos visible MainMenu.

// Anotación: launch() no deja la escena preparada y esperando;
// la pone en marcha de verdad, ejecutando sus métodos de ciclo de vida.
