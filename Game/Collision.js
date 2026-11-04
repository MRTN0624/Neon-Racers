// Detección de colisión entre los dos jugadores
this.physics.add.overlap(
    this.players[0],
    this.players[1],
    handlePlayerOverlap,
    null,
    this
);


function handlePlayerOverlap(player1, player2) {

    // Evitar procesar la misma colisión repetidamente
    if (this.collisionHandled) return;
    
    this.collisionHandled = true;

    console.log("¡Colisión entre los dos jugadores!");

}

