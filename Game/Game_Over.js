//AQUI GESTIONAMOS VICTORY y GAME OVER

//3 SITUACIONES

// Jugador 1	Jugador 2	Resultado
// false	false	Empate
// false	true	Gana jugador 2
// true	false	Gana jugador 1

// Determina el resultado de la partida
function showGameOver(scene, player1, player2) {

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
}