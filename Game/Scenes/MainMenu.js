class MainMenu extends Phaser.Scene {

    constructor() {
        super('MainMenu');
    }

    // Inicialización de los elementos del menú principal
    create() {
        //Se para la musica de victory 
        
       
         this.sound.stopByKey('game_music');
         this.sound.stopByKey('game_music2');
         this.sound.stopByKey('game_music3');
        // this.menuMusic = this.sound.add('musicMenu', {
        //     loop: true,
        //     volume: 0.5
        // });
        // this.menuMusic.play();

        // Comprobamos si la música del menú ya existe y está sonando
        if (!this.sound.get('musicMenu') || !this.sound.get('musicMenu').isPlaying) {
            this.menuMusic = this.sound.add('musicMenu', {
                loop: true,
                volume: 0.5
            });
            this.menuMusic.play();
        }

        // 1. Configuración visual de la escena
        const canvas = document.getElementById('gameCanvas');

        const width = canvas.width;
        const height = canvas.height;

        // 2. Background del menú
        this.add.image(width / 2, height / 2, 'menuBackground')
            .setDisplaySize(width, height);

        // 3. Opciones del menú
        // - JUGAR
        // - OPCIONES
        // - CRÉDITOS
        const options = ['JUGAR', 'OPCIONES', 'CRÉDITOS'];

        this.menuOptions = [];

        // Posición inicial de las opciones
        const startY = height / 2;
        const spacing = 60;

        options.forEach((option, index) => {

            const text = this.add.text(
                width / 2,
                startY + index * spacing,
                option,
                {
                    fontSize: '28px',
                    color: '#ffffff',
                    fontStyle: 'bold'
                }
            ).setOrigin(0.5);

            this.menuOptions.push(text);
        });

        // 4. Flecha de selección
        // y la posicionaremos junto al botón seleccionado.
        this.selectedOption = 0;

        this.menuArrow = this.add.image(
            width / 2 - 130,
            this.menuOptions[this.selectedOption].y,
            'menuArrow'
        ).setDisplaySize(40, 40);

        // Aplicamos el resaltado inicial de la opción seleccionada
        this.updateMenuSelection();

        // 5. NAVEGACIÓN POR EL MENÚ

        // Desplazamiento hacia arriba (Flecha UP / W)
        this.input.keyboard.on('keydown-UP', () => {

            this.selectedOption--;

            if (this.selectedOption < 0) {
                this.selectedOption = this.menuOptions.length - 1;
            }

            this.updateMenuSelection();
        });

        this.input.keyboard.on('keydown-W', () => {

            this.selectedOption--;

            if (this.selectedOption < 0) {
                this.selectedOption = this.menuOptions.length - 1;
            }

            this.updateMenuSelection();
        });

        // Desplazamiento hacia abajo (Flecha DOWN / S)
        this.input.keyboard.on('keydown-DOWN', () => {

            this.selectedOption++;

            if (this.selectedOption >= this.menuOptions.length) {
                this.selectedOption = 0;
            }

            this.updateMenuSelection();
        });

        this.input.keyboard.on('keydown-S', () => {

            this.selectedOption++;

            if (this.selectedOption >= this.menuOptions.length) {
                this.selectedOption = 0;
            }

            this.updateMenuSelection();
        });

        // 6. CONFIRMACIÓN DE LA OPCIÓN SELECCIONADA
        this.input.keyboard.on('keydown-ENTER', () => {

            switch (this.selectedOption) {

                case 0: // JUGAR
                    this.scene.start('Core');
                    break;

                case 1: // OPCIONES
                    this.scene.start('Settings');
                    break;

                case 2: // CRÉDITOS
                    this.scene.start('Credits');
                    break;
            }

        });

        // Cuando el menú esté preparado, retiramos LoadingScreen
        this.scene.stop('LoadingScreen');
    }

    // Actualización visual de la opción seleccionada
    updateMenuSelection() {

        this.menuOptions.forEach((option, index) => {

            if (index === this.selectedOption) {
                option.setColor('#00ffff');
            }
            else {
                option.setColor('#ffffff');
            }

        });

        this.menuArrow.y = this.menuOptions[this.selectedOption].y;
    }

}