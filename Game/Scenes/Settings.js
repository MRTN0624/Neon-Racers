class Settings extends Phaser.Scene {

    constructor() {
        super('Settings');
    }

    create() {
        // Limpiamos pulsaciones residuales de la escena anterior
        this.input.keyboard.resetKeys();

        // 1. Obtener las dimensiones del canvas
        const canvas = document.getElementById('gameCanvas');
        const width = canvas.width;
        const height = canvas.height;

        // 2. Imagen de fondo
        this.add.image(width / 2, height / 2, 'menuOptions')
            .setDisplaySize(width, height);

        // 3. Título Principal
        this.add.text(
            width / 2,
            90,
            'NEON RACERS',
            {
                fontSize: '40px',
                color: '#00ffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        // 4. Subtítulo
        this.add.text(
            width / 2,
            150,
            'OPCIONES',
            {
                fontSize: '26px',
                color: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        // 5. Estado local de silencio (fuerza la sincronización inicial)
        this.isMuted = this.sound.mute;

        const musicText = this.add.text(
            width / 2,
            280,
            '',
            {
                fontSize: '22px',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        // Actualización de la interfaz
        const updateUI = () => {
            if (this.isMuted) {
                musicText.setText('MÚSICA: DESACTIVADA  [M]');
                musicText.setColor('#ff0055');
            } else {
                musicText.setText('MÚSICA: ACTIVADA  [M]');
                musicText.setColor('#00ff88');
            }
        };

        // Renderizado inicial garantizado
        updateUI();

        // 6. Asignación de tecla
        const keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        keyM.removeAllListeners();

        keyM.on('down', () => {
            // Alternamos nuestra variable
            this.isMuted = !this.isMuted;
            // Aplicamos el cambio al motor de sonido
            this.sound.mute = this.isMuted;
            // Refrescamos la pantalla
            updateUI();
        });

        // 7. Indicación para regresar
        this.add.text(
            width / 2,
            height - 50,
            'PULSA ESC PARA VOLVER',
            {
                fontSize: '16px',
                color: '#00ffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        // Controles de retorno
        const keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        keyESC.removeAllListeners();

        keyESC.on('down', () => this.scene.start('MainMenu'));
    }
}