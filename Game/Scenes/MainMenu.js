class MainMenu extends Phaser.Scene {

    constructor() {
        super('MainMenu');
    }

    // Inicialización de los elementos del menú principal
    create() {

        //this.sound.stopAll(); //Si no pones este stop si estas en ayuda y vuelves al menu, se solapan las canciones y suena todo a la vez.

        // Detener la música de las partidas
        this.sound.stopByKey('game_music');
        this.sound.stopByKey('game_music2');
        this.sound.stopByKey('game_music3');

        // Música del menú principal
        // if (!this.sound.get('musicMenu') ||
        //     !this.sound.get('musicMenu').isPlaying) {

        //     this.menuMusic = this.sound.add('musicMenu', {
        //         loop: true,
        //         volume: 0.5
        //     });

        //     this.menuMusic.play();
        // }
        // else { this.menuMusic = existingMusic;
        //     if (!this.menuMusic.isPlaying) {
        //         this.menuMusic.play();
        //     }
        // }

        const menuTracks = this.sound.getAll('musicMenu'); //Coges todas las instancias de sonido las guardas en un array
        const isAlreadyPlaying = menuTracks.some(track => track.isPlaying); //Devuelve true si al menos una de las pistas esta sonando

        if (!isAlreadyPlaying) { //Si no suena nada se reproduce la musica del menu
            this.sound.removeByKey('musicMenu');
            this.menuMusic = this.sound.add('musicMenu', { loop: true });
            const menuMusic = this.menuMusic;

            const soundManager = this.sound;
            const context = soundManager.context;

            // Retirar los eventos cuando la música arranque o se destruya.
            const cleanup = () => {
                window.removeEventListener('pointerdown', unlockAudio, true);
                window.removeEventListener('pointerup', unlockAudio, true);
                window.removeEventListener('keydown', unlockAudio, true);
                soundManager.off('unlocked', playMenuMusic);
                context?.removeEventListener('statechange', playMenuMusic);
                menuMusic.off('destroy', cleanup);
            };

            const playMenuMusic = () => {
                if (!soundManager.getAll('musicMenu').includes(menuMusic)) {
                    cleanup();
                    return;
                }

                if (context && context.state !== 'running') return;
                if (soundManager.locked) return;

                if (!menuMusic.isPlaying) menuMusic.play();
                if (menuMusic.isPlaying) cleanup();
            };

            // Reactivar Web Audio dentro de una interacción del usuario.
            const unlockAudio = () => {
                if (!soundManager.getAll('musicMenu').includes(menuMusic)) {
                    cleanup();
                    return;
                }

                if (context && context.state === 'suspended') {
                    context.resume().then(playMenuMusic).catch(error => {
                        console.warn('No se pudo reactivar el audio:', error);
                    });
                } else {
                    playMenuMusic();
                }
            };

            window.addEventListener('pointerdown', unlockAudio, true);
            window.addEventListener('pointerup', unlockAudio, true);
            window.addEventListener('keydown', unlockAudio, true);
            soundManager.on('unlocked', playMenuMusic);
            context?.addEventListener('statechange', playMenuMusic);
            menuMusic.once('destroy', cleanup);
            playMenuMusic();
        }

        // 1. Configuración visual de la escena
        const canvas = document.getElementById('gameCanvas');

        const width = canvas.width;
        const height = canvas.height;

        // 2. Fondo del menú
        this.add.image(
            width / 2,
            height / 2,
            'menuBackground'
        ).setDisplaySize(width, height);

        // 3. Opciones del menú
        const options = [
            'JUGAR LOCAL',
            'JUGAR EN LÍNEA',
            'OPCIONES',
            'AYUDA',
            'CRÉDITOS',
            'SALIR'
        ];

        this.menuOptions = [];

        const startY = height / 2 - 20;
        const spacing = 50;

        options.forEach((option, index) => {

            const text = this.add.text(
                width / 2,
                startY + index * spacing,
                option,
                {
                    fontSize: '24px',
                    color: '#ffffff',
                    fontFamily: 'PixelFont',
                }
            )
                .setOrigin(0.5)
                .setInteractive({
                    useHandCursor: true
                });

            // Seleccionar al pasar el ratón
            text.on('pointerover', () => {
                this.selectedOption = index;
                this.updateMenuSelection();
            });

            // Ejecutar la opción al hacer clic
            text.on('pointerdown', () => {
                this.selectedOption = index;
                this.executeSelectedOption();
            });

            this.menuOptions.push(text);
        });

        // 4. Flecha de selección
        this.selectedOption = 0;

        this.menuArrow = this.add.image(
            width / 2 - 130,
            this.menuOptions[this.selectedOption].y,
            'menuArrow'
        ).setDisplaySize(40, 40);

        this.updateMenuSelection();

        // 5. Navegación por teclado

        // Subir con flecha arriba o W
        const moveUp = () => {

            this.selectedOption--;

            if (this.selectedOption < 0) {
                this.selectedOption =
                    this.menuOptions.length - 1;
            }

            this.updateMenuSelection();
        };

        this.input.keyboard.on('keydown-UP', moveUp);
        this.input.keyboard.on('keydown-W', moveUp);

        // Bajar con flecha abajo o S
        const moveDown = () => {

            this.selectedOption++;

            if (this.selectedOption >= this.menuOptions.length) {
                this.selectedOption = 0;
            }

            this.updateMenuSelection();
        };

        this.input.keyboard.on('keydown-DOWN', moveDown);
        this.input.keyboard.on('keydown-S', moveDown);

        // Confirmar con ENTER
        this.input.keyboard.on('keydown-ENTER', () => {
            this.executeSelectedOption();
        });

        // Retirar la pantalla de carga
        this.scene.stop('LoadingScreen');
    }

    // Ejecutar la opción seleccionada
    executeSelectedOption() {

        switch (this.selectedOption) {

            case 0: // JUGAR LOCAL
                this.scene.start('Core', {
                    score1: 0,
                    score2: 0
                });
                break;

            case 1: // JUGAR EN LÍNEA
                this.scene.start('Core', {
                    score1: 0,
                    score2: 0
                }); //Por implementar !!!
                break;

            case 2: // OPCIONES
                this.scene.start('Settings');
                break;

            case 3: // AYUDA
                this.scene.start('Help');
                break;

            case 4: // CRÉDITOS
                this.scene.start('Credits');
                break;

            case 5: // SALIR
                window.close();
                break;
        }
    }

    // Actualización visual de la opción seleccionada
    updateMenuSelection() {

        this.menuOptions.forEach((option, index) => {

            if (index === this.selectedOption) {
                option.setColor('#00ffff');
                option.setScale(1.08);
            }
            else {
                option.setColor('#ffffff');
                option.setScale(1);
            }
        });

        // Mover la flecha a la opción seleccionada
        this.menuArrow.y =
            this.menuOptions[this.selectedOption].y;
    }
}