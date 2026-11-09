
class Help extends Phaser.Scene {

    constructor() {
        super('Help');
    }

    // Inicialización de la pantalla de ayuda
    create() {

        // 1. Obtener las dimensiones del canvas
        const canvas = document.getElementById('gameCanvas');

        const width = canvas.width;
        const height = canvas.height;

        // 2. Background del menú
        this.add.image(width / 2, height / 2, 'menuOptions')
            .setDisplaySize(width, height);

        // 3. Título
        this.add.text(
            width / 2,
            65,
            'NEON RACERS',
            {
                fontSize: '42px',
                color: '#00ffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        // 4. Subtítulo
        this.add.text(
            width / 2,
            120,
            'AYUDA',
            {
                fontSize: '26px',
                color: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        // 5. Objetivo del juego
        this.add.text(
            width / 2,
            165,
            'OBJETIVO',
            {
                fontSize: '20px',
                color: '#00ffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        this.add.text(
            width / 2,
            195,
            'Evita las colisiones y sobrevive a tu rival.',
            {
                fontSize: '16px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        // 6. Controles de los jugadores
        this.add.text(
            width / 2,
            235,
            'CONTROLES',
            {
                fontSize: '20px',
                color: '#00ffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        // Jugador 1
        this.add.text(
            width / 4,
            285,
            'JUGADOR 1\n\nWASD - Movimiento',
            {
                fontSize: '16px',
                color: '#ffffff',
                align: 'center',
                lineSpacing: 5
            }
        ).setOrigin(0.5);

        // Jugador 2
        this.add.text(
            width * 3 / 4,
            285,
            'JUGADOR 2\n\n↑ ↓ ← →  - Movimiento',
            {
                fontSize: '16px',
                color: '#ffffff',
                align: 'center',
                lineSpacing: 5
            }
        ).setOrigin(0.5);

        // 7. Potenciadores
        this.add.text(
            width / 2,
            355,
            'POTENCIADORES',
            {
                fontSize: '20px',
                color: '#00ffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        // Cada potenciador tiene su imagen y descripción
        const potenciadores = [
            {
                imagen: 'objeto_velocidad',
                descripcion: 'Aumenta tu velocidad.'
            },
            {
                imagen: 'objeto_inmortalidad',
                descripcion: 'Protección temporal.'
            },
            {
                imagen: 'objeto_eliminador',
                descripcion: 'Borra la estela rival.'
            },
            {
                imagen: 'objeto_congelar',
                descripcion: 'Inmoviliza al rival.'
            },
            {
                imagen: 'objeto_traza',
                descripcion: 'Alarga tu estela.'
            }
        ];

        potenciadores.forEach((potenciador, index) => {

            const y = 390 + index * 34;

            // Imagen del potenciador
            this.add.image(
                270,
                y,
                potenciador.imagen
            ).setDisplaySize(28, 28);

            // Descripción del potenciador
            this.add.text(
                310,
                y,
                potenciador.descripcion,
                {
                    fontSize: '15px',
                    color: '#ffffff'
                }
            ).setOrigin(0, 0.5);
        });

        // 8. Instrucción para volver al menú
        this.add.text(
            width / 2,
            height - 40,
            'PULSA ESC PARA VOLVER',
            {
                fontSize: '16px',
                color: '#00ffff'
            }
        ).setOrigin(0.5);

        // 9. Configuración del teclado
        this.input.keyboard.on('keydown-ESC', () => {

            this.scene.start('MainMenu');

        });
    }
}