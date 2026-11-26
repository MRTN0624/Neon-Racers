class Ranking extends Phaser.Scene {
    constructor() {
        super('Ranking');
    }

    async create() {
        const { width, height } = this.scale;

        // Título de la escena
        this.add.text(width / 2, 50, 'TOP 10 RANKINGS', {
            fontSize: '36px',
            fontFamily: 'Arial',
            color: '#ffd700',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 8. Instrucción para volver al menú (la ponemos antes para que siempre funcione, aunque no haya datos)
        const text = this.add.text(
            width / 2,
            height - 40,
            'PULSA ESC PARA VOLVER',
            {
                fontSize: '16px',
                color: '#00ffff',
                fontFamily: 'PixelFont',
            }
        ).setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        // Eventos de ratón para el texto de volver al menú
        text.on('pointerdown', () => this.scene.start('MainMenu'));
        text.on('pointerover', () => {
            text.setColor('#ffffff');
            text.setScale(1.05);
        });
        text.on('pointerout', () => {
            text.setColor('#00ffff');
            text.setScale(1);
        });

        // 9. Configuración del teclado
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('MainMenu');
        });

        // Mensaje temporal mientras carga
        const loadingText = this.add.text(width / 2, height / 2, 'Cargando puntuaciones...', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);

        try {
            // 1. Pedimos los datos a tu servidor Node.js (ruta relativa sin /src)
            const response = await fetch('http://localhost:8080/rankings');
            if (!response.ok) throw new Error('Error al conectar con el servidor');

            const rankings = await response.json(); //Parsear el stringify del res
            loadingText.destroy(); // Quitamos el texto de carga

            // 2. Ordenamos de mayor a menor puntuación y nos quedamos con los 10 primeros
            const top10 = rankings
                .sort((a, b) => b.score - a.score)
                .slice(0, 10);

            if (top10.length === 0) {
                this.add.text(width / 2, height / 2, 'Aún no hay puntuaciones registradas', {
                    fontSize: '22px',
                    color: '#cccccc'
                }).setOrigin(0.5);
                return;
            }

            // 3. Dibujamos cada fila en pantalla
            let startY = 120;
            const lineHeight = 40;

            top10.forEach((entry, index) => {
                const pos = index + 1;
                // Destacamos el podio con colores
                const color = pos === 1 ? '#ffd700' : pos === 2 ? '#c0c0c0' : pos === 3 ? '#cd7f32' : '#ffffff';

                const fila = `${pos}. ${entry.name.padEnd(15, ' ')} - ${entry.score} pts`;

                this.add.text(width / 2, startY + (index * lineHeight), fila, {
                    fontSize: '22px',
                    fontFamily: 'monospace', // Monospace alinea mejor las columnas
                    color: color
                }).setOrigin(0.5);
            });

        } catch (error) {
            console.error(error);
            loadingText.setText('No se pudo cargar el ranking');
            loadingText.setColor('#ff4444');
        }
    }
}
