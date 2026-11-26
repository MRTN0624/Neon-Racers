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
                fontFamily: 'PixelFont',
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
                fontFamily: 'PixelFont'
            }
        ).setOrigin(0.5);

        // 5. Estado local de silencio (fuerza la sincronización inicial)
        this.isMuted = this.sound.mute;

        // Volumen general
        const volActual = this.sound.volume;
        const barraX = width / 2 - 190;

        this.barraSonido = this.crearBarraVolumen(barraX, 245, 'SONIDO', volActual, (nuevoVol) => {
            this.sound.volume = nuevoVol;
            this.isMuted = (nuevoVol === 0);
            this.sound.mute = this.isMuted;
            updateUI();
        });

        // Flecha indicadora junto a la barra
        this.add.image(barraX - 30, 245, 'menuArrow')
            .setDisplaySize(20, 20);

        const musicText = this.add.text(width / 2, 315, '',
            {
                fontSize: '20px',
                fontFamily: 'PixelFont'
            }
        )
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        // Actualización de la interfaz
        const updateUI = () => {
            if (this.isMuted) {
                musicText.setText('SONIDO: DESACTIVADO  [M]');
                musicText.setColor('#ff0055');
            } else {
                musicText.setText('SONIDO: ACTIVADO  [M]');
                musicText.setColor('#00ff88');
            }
        };

        const toggleMusic = () => {
            // Alternamos nuestra variable
            this.isMuted = !this.isMuted;
            // Aplicamos el cambio al motor de sonido
            this.sound.mute = this.isMuted;
            // Refrescamos la pantalla
            updateUI();
        };

        // Renderizado inicial garantizado
        updateUI();

        // Eventos de ratón 
        musicText.on('pointerdown', toggleMusic);
        musicText.on('pointerover', () => musicText.setScale(1.05)); // Efecto ligero al pasar el ratón
        musicText.on('pointerout', () => musicText.setScale(1));

        // Controles de teclado para subir/bajar la barra con flechas o A/D
        this.input.keyboard.on('keydown-LEFT', () => this.barraSonido.bajar());
        this.input.keyboard.on('keydown-RIGHT', () => this.barraSonido.subir());

        this.input.keyboard.on('keydown-a', () => this.barraSonido.bajar());
        this.input.keyboard.on('keydown-A', () => this.barraSonido.bajar());
        this.input.keyboard.on('keydown-d', () => this.barraSonido.subir());
        this.input.keyboard.on('keydown-D', () => this.barraSonido.subir());

        // 6. Asignación de tecla
        const keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        keyM.removeAllListeners();
        keyM.on('down', toggleMusic);

        // 7. Indicación para regresar
        const text = this.add.text(
            width / 2,
            height - 50,
            'VOLVER [ESC]',
            {
                fontSize: '18px',
                color: '#00ffff',
                fontFamily: 'PixelFont'
            }
        )
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        text.on('pointerdown', () => this.scene.start('MainMenu'));
        text.on('pointerover', () => {
            text.setColor('#ffffff');
            text.setScale(1.05);
        });
        text.on('pointerout', () => {
            text.setColor('#00ffff');
            text.setScale(1);
        });

        // Controles de retorno
        const keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyESC.removeAllListeners();
        keyESC.on('down', () => this.scene.start('MainMenu'));
    }

    // Método auxiliar para crear la barra segmentada de sonido
    crearBarraVolumen(x, y, etiqueta, volumenInicial, onChange) {
        const totalBloques = 9;
        const tamanoBloque = 18;
        const espacio = 5;
        let nivelActual = Math.round(volumenInicial * totalBloques);

        this.add.text(x, y, etiqueta, {
            fontSize: '20px',
            color: '#ffffff',
            fontFamily: 'PixelFont'
        }).setOrigin(0, 0.5);
        
        // Poco despues de palabra sonido
        const inicioBarraX = x + 130;
        this.add.text(inicioBarraX, y, '[ ', {
            fontSize: '24px',
            color: '#ffffff',
            fontFamily: 'PixelFont'
        }).setOrigin(0, 0.5);

        const bloques = [];
        const primerBloqueX = inicioBarraX + 20;

        const actualizarVisual = (nuevoNivel) => {
            nivelActual = Phaser.Math.Clamp(nuevoNivel, 0, totalBloques); // Para que el no se salga de rango 0 y 9
            bloques.forEach((bloque, i) => 
            {
                bloque.setFillStyle(i < nivelActual ? 0x00A3E0 : 0x3A3A3A); // Azul si esta por debajo y gris si no
            });
            onChange(nivelActual / totalBloques); //Para que phaser entienda en que volumen estamos 
        };

        for (let i = 0; i < totalBloques; i++) {
            const bloqueX = primerBloqueX + i * (tamanoBloque + espacio) + tamanoBloque / 2;
            //tamanoBloque / 2 significa que el bloque se dibuja desde el centro, no desde la esquina superior izquierda
            const colorInicial = i < nivelActual ? 0x00A3E0 : 0x3A3A3A;

            const bloque = this.add.rectangle(bloqueX, y, tamanoBloque, tamanoBloque, colorInicial)
                .setInteractive({ useHandCursor: true }); //Por cada cuadrado

            bloque.on('pointerdown', () => {
                let nuevoNivel; 
                
                if (i == 0 && nivelActual == 1) {
                    nuevoNivel = 0;
                } else {
                    nuevoNivel = i + 1;
                }
                actualizarVisual(nuevoNivel);
            });

            bloques.push(bloque); // Añadimos el bloque 
        }

        const finBarraX = primerBloqueX + totalBloques * (tamanoBloque + espacio);
        this.add.text(finBarraX, y, ' ]', {
            fontSize: '24px',
            color: '#ffffff',
            fontFamily: 'PixelFont'
        }).setOrigin(0, 0.5);

        return { //En vez de devolver la barra, devolvemos un objeto con dos funciones para subir y bajar el volumen
            subir: () => actualizarVisual(nivelActual + 1),
            bajar: () => actualizarVisual(nivelActual - 1)
        };
    }
}