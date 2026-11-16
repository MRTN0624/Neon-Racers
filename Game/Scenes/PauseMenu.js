class PauseMenu extends Phaser.Scene {
    constructor() {
        super('PauseMenu');
    }

    create() {
        const core = this.scene.get('Core');

        // Pausar la música de la partida
        if (core.gameplayMusic && core.gameplayMusic.isPlaying) {
            core.gameplayMusic.pause();
        }

        // Fondo oscuro semitransparente
        this.add.rectangle(
            400, 300, 800, 600, 0x050819, 0.85
        );

        // Título
        this.add.text(400, 145, 'PARTIDA EN PAUSA', {
            fontFamily: 'Arial',
            fontSize: '38px',
            color: '#00ffff',
            fontStyle: 'bold',
            stroke: '#003b66',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Opciones del menú
        const options = [
            {
                label: 'CONTINUAR',
                action: () => this.continueGame()
            },
            {
                label: 'REINICIAR',
                action: () => this.restartGame()
            },
            {
                label: 'MENÚ PRINCIPAL',
                action: () => this.goToMenu()
            }
        ];

        // Crear botones interactivos
        options.forEach((option, index) => {
            const text = this.add.text(
                400,
                265 + index * 75,
                option.label,
                {
                    fontFamily: 'Arial',
                    fontSize: '26px',
                    color: '#ffffff',
                    backgroundColor: '#14213d',
                    padding: { x: 20, y: 12 }
                }
            )
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

            text.on('pointerover', () => {
                text.setColor('#00ffff');
            });

            text.on('pointerout', () => {
                text.setColor('#ffffff');
            });

            text.on('pointerdown', option.action);
        });

        // Instrucciones de los dos jugadores
        this.add.text(400, 530, 'Q / P: CONTINUAR', {
            fontFamily: 'Arial',
            fontSize: '17px',
            color: '#ff66ff'
        }).setOrigin(0.5);

        // Jugador 1: Q
        // Jugador 2: P
        // Evitar repeticiones al mantener la tecla
        const resumeWithKeyboard = (event) => {
            if (event.repeat) {
                return;
            }

            this.continueGame();
        };

        this.input.keyboard.on('keydown-Q', resumeWithKeyboard);
        this.input.keyboard.on('keydown-P', resumeWithKeyboard);
    }

    // Reanudar la partida
    continueGame() {
        const core = this.scene.get('Core');

        if (core.gameplayMusic && core.gameplayMusic.isPaused) {
            core.gameplayMusic.resume();
        }

        this.scene.resume('Core');
        this.scene.stop();
    }

    // Reiniciar la partida
    restartGame() {
        const core = this.scene.get('Core');

        // Detener los sonidos de la partida anterior
        if (core.gameplayMusic) {
            core.gameplayMusic.stop();
        }

        if (core.gameOverMusic) {
            core.gameOverMusic.stop();
        }

        this.scene.stop('Core');
        this.scene.start('Core');
    }

    // Volver al menú principal
    goToMenu() {
        const core = this.scene.get('Core');

        if (core.gameplayMusic) {
            core.gameplayMusic.stop();
        }

        if (core.gameOverMusic) {
            core.gameOverMusic.stop();
        }

        this.scene.stop('Core');
        this.scene.start('MainMenu');
    }
}