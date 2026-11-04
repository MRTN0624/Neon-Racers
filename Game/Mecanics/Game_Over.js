//AQUI GESTIONAMOS VICTORY y GAME OVER

//3 SITUACIONES

// Jugador 1    Jugador 2    Resultado
// false        false        Empate
// false        true         Gana jugador 2
// true         false        Gana jugador 1


// Determina el resultado de la partida
function showGameOver(scene, player1, player2) {

    // Reproducimos la música de victoria
    scene.gameOverMusic.setVolume(0.5);
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
    scene.add.text(400, 300, result, {
        fontSize: '32px',
        color: '#ffffff',
        fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(20);

    // Instrucción para volver al menú
    scene.add.text(
        800 / 2,
        600 - 60,
        'PULSA ESC PARA VOLVER',
        {
            fontSize: '16px',
            color: '#00ffff'
        }
    ).setOrigin(0.5);

    // Volver al menú principal al pulsar ESC
    scene.input.keyboard.once('keydown-ESC', () => {

        // Desvanecemos la música de victoria antes de cambiar de escena
        fadeOutVictoryMusic(scene, () => {
            scene.scene.start('MainMenu');
        });

    });
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