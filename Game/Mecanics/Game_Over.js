//AQUI GESTIONAMOS VICTORY y GAME OVER

//3 SITUACIONES

// Jugador 1    Jugador 2    Resultado
// false        false        Empate
// false        true         Gana jugador 2
// true         false        Gana jugador 1


// Determina el resultado de la partida
function showGameOver(scene, player1, player2) {

    // Reproducimos la música de victoria
    scene.gameOverMusic.play();

    let result;

    if (!player1.alive && !player2.alive) {
        result = "¡EMPATE!";
    }
    else if (!player1.alive) {
        result = "¡JUGADOR 2 HA GANADO!";
    }
    else if (!player2.alive) {
        result = "¡JUGADOR 1 HA GANADO!";
    }

    // Mostramos el resultado
    scene.add.text(400, 260, result, {
        fontSize: '32px',
        color: '#ffffff',
        fontFamily: 'PixelFont',
    }).setOrigin(0.5).setDepth(20);

    let transitioning = false;

    const reiniciarPartida = () => {
        if (transitioning) return;
        transitioning = true;
        fadeOutVictoryMusic(scene, () => scene.scene.restart());
    };

    const volverAlMenu = () => {
        if (transitioning) return;
        transitioning = true;
        fadeOutVictoryMusic(scene, () => scene.scene.start('MainMenu'));
    };

    
    const btnRestart = scene.add.text(400, 600 - 120, 'VOLVER A JUGAR (ENTER)', {
        fontSize: '20px',
        color: '#F5C518',
        fontFamily: 'PixelFont',
    }).setOrigin(0.5).setDepth(20).setInteractive({ useHandCursor: true });

    btnRestart.on('pointerover', () => {
        btnRestart.setColor('#ffffff');
        btnRestart.setScale(1.05);
    });
    btnRestart.on('pointerout', () => {
        btnRestart.setColor('#F5C518');
        btnRestart.setScale(1);
    });
    btnRestart.on('pointerdown', reiniciarPartida);

    // Instrucción para volver al menú
    const btnMenu = scene.add.text(800 / 2, 600 - 60, 'VOLVER AL MENÚ (ESC)', {
        fontSize: '16px',
        color: '#00A3E0',
        fontFamily: 'PixelFont',
    }).setOrigin(0.5).setDepth(20).setInteractive({ useHandCursor: true });

    btnMenu.on('pointerover', () => {
        btnMenu.setColor('#ffffff');
        btnMenu.setScale(1.05);
    });
    btnMenu.on('pointerout', () => {
        btnMenu.setColor('#00A3E0');
        btnMenu.setScale(1);
    });
    btnMenu.on('pointerdown', volverAlMenu);

    // Volver al menú principal al pulsar ESC y reiniciar la partida al pulsar ENTER
    scene.input.keyboard.once('keydown-ENTER', reiniciarPartida);
    scene.input.keyboard.once('keydown-ESC', volverAlMenu);
}


// Transición suave para detener la música de victoria
function fadeOutVictoryMusic(scene, callback) {

    scene.tweens.add({
        targets: scene.gameOverMusic,
        volume: 0,
        duration: 1500,
        ease: 'Linear',

        // Cuando termina la transición, detenemos la música
        onComplete: () => {
            scene.gameOverMusic.stop();
            scene.sound.stopByKey('musicMenu');
            // Ejecutamos el cambio de escena
            callback();
        }
    });

}