class Credits extends Phaser.Scene {

    constructor() {
        super('Credits');
    }

    // Inicialización de la pantalla de créditos
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
            100,
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
            170,
            'CRÉDITOS',
            {
                fontSize: '26px',
                color: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        // 5. Información de los créditos
        this.add.text(
            width / 2,
            290,
            'Desarrollado por:\n\nJavier Arcas Calvo\nMartín Carmona Espartero\nAdriel Nava de Santos\nFelipe Owen Zhu Zhang',
            {
                fontSize: '20px',
                color: '#ffffff',
                align: 'center',
                lineSpacing: 8
            }
        ).setOrigin(0.5);

        // 6. Instrucción para volver al menú
        this.add.text(
            width / 2,
            height - 60,
            'PULSA ESC PARA VOLVER',
            {
                fontSize: '16px',
                color: '#00ffff'
            }
        ).setOrigin(0.5);

        // 7. Configuración del teclado
        this.input.keyboard.on('keydown-ESC', () => {

            this.scene.start('MainMenu');

        });
    }
}