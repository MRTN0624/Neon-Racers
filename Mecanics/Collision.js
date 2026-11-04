
// Gestión de colisión entre los dos jugadores

function handlePlayerOverlap(player1, player2) {
    console.log("¡OVERLAP ENTRE JUGADORES!");

    if (this.gameOverTriggered) return; //Se entiende que esta colision ya ha sido resuelta pq el game over fue disparado

    console.log("Entrando en resolveCollision");

    resolveCollision(this, player1, player2, 'player-player');
}


//---------------------------------------------------------------
//Para las otras 2 opciones (2,3)
function checkTrailCollisions(scene, player1, player2) {

    // Si la partida ya ha terminado, no comprobamos más colisiones
    if (scene.gameOverTriggered) return;

    // 1. Moto 1 contra estela de moto 2
    if (checkPlayerTrailOverlap(player1, player2)) {

        resolveCollision(scene, player1, player2, 'player1-trail2');
        return;
    }

    // 2. Moto 2 contra estela de moto 1
    if (checkPlayerTrailOverlap(player2, player1)) {

        resolveCollision(scene, player1, player2, 'player2-trail1');
        return;
    }
}


function checkPlayerTrailOverlap(player, otherPlayer) {

    const trail = otherPlayer.trail;

    // Si todavía no hay suficientes puntos, no podemos comprobar segmentos
    if (trail.length < 2) return false;

    // Radio aproximado de la moto más la mitad del grosor de la estela
    const radius = Math.max(
        player.body.width,
        player.body.height
    ) / 2 + 5;

    // Recorremos los segmentos de la estela
    for (let i = 1; i < trail.length; i++) {

        const start = trail[i - 1];
        const end = trail[i];

        if (distanceToSegment(player.x, player.y, start, end) <= radius) {
            return true;
        }
    }

    return false;
}


// Calcula la distancia entre un punto y un segmento
function distanceToSegment(px, py, start, end) {

    const dx = end.x - start.x;
    const dy = end.y - start.y;

    const lengthSquared = dx * dx + dy * dy;

    if (lengthSquared === 0) {
        return Phaser.Math.Distance.Between(px, py, start.x, start.y);
    }

    // Proyección del punto sobre el segmento
    let t = ((px - start.x) * dx + (py - start.y) * dy) / lengthSquared;

    t = Phaser.Math.Clamp(t, 0, 1);

    const closestX = start.x + t * dx;
    const closestY = start.y + t * dy;

    return Phaser.Math.Distance.Between(px, py, closestX, closestY);
}


//---------------------------------------------------------------


function resolveCollision(scene, player1, player2, collisionType) {

    // Hay que considerar 3 escenarios posibles:
    // 1. Chocan ambas motos: ambas son destruidas y salta Game Over para los dos.
    // 2. Choca la moto 1 con la estela de la moto 2: muere únicamente el jugador 1.
    // 3. Choca la moto 2 con la estela de la moto 1: muere únicamente el jugador 2.


    // 1. Moto contra moto
    // Mueren ambos jugadores
    if (collisionType === 'player-player') {

        player1.alive = false;
        player2.alive = false;


        createExplosion(scene, player1);
        createExplosion(scene, player2);

        player1.destroy(); // Se destruye la moto 1
        player2.destroy(); // Se destruye la moto 2

        console.log("Ambas motos han sido destruidas");
    }

    // 2. Moto 1 contra estela de moto 2
    // Muere únicamente moto 1
    else if (collisionType === 'player1-trail2') {

        player1.alive = false;
        createExplosion(scene, player1);
        player1.destroy(); // Se destruye la moto 1

        console.log("Jugador 2 ha ganado");
    }

    // 3. Moto 2 contra estela de moto 1
    // Muere únicamente moto 2
    else if (collisionType === 'player2-trail1') {

        player2.alive = false;
         createExplosion(scene, player2);
        player2.destroy(); // Se destruye la moto 2

        console.log("Jugador 1 ha ganado");
    }

    // Si no reconocemos el tipo de colisión, salimos de la función
    else {
        return;
    }

    // Destruimos las estelas de ambos jugadores
    // Las estelas son objetos Graphics independientes de las motos
    player1.trailGraphics.destroy();
    player2.trailGraphics.destroy();

    // En cualquier caso, finaliza la partida.
    // Consultando la propiedad alive podremos determinar el resultado.
    scene.gameOverTriggered = true;

    // Aquí conectaremos el Game Over correspondiente.
    fadeOutMusic(scene); //Paramos la game music
    showGameOver(scene, player1, player2);
}



// Efecto de explosión de una moto
function createExplosion(scene, player) {

    // Aquí obtenemos la posición de la moto
    const x = player.x;
    const y = player.y;

    // Colores de la estela del jugador
    const color = player.trailColor;
    const glowColor = player.trailGlowColor;

    // Número de cuadraditos de la explosión
    const particleCount = 18;

    for (let i = 0; i < particleCount; i++) {

        // Tamaño aleatorio del cuadradito
        const size = Phaser.Math.Between(4, 9);

        // Cuánto se desplazará el cuadradito
        const distance = Phaser.Math.Between(35, 90);

        // Dirección aleatoria de desplazamiento
        const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);

        const targetX = x + Math.cos(angle) * distance;
        const targetY = y + Math.sin(angle) * distance;

        // Cuadrado exterior para simular el brillo
        const glow = scene.add.rectangle(
            0, 0,
            size + 4, size + 4,
            glowColor,
            0.4
        );

        // Cuadrado interior con el color principal
        const square = scene.add.rectangle(
            0, 0,
            size, size,
            color
        );

        // Agrupamos ambos cuadrados en un único objeto
        const particle = scene.add.container(x, y, [glow, square]);

        particle.setDepth(10);

        // Animamos el desplazamiento y la desaparición
        scene.tweens.add({
            targets: particle,
            x: targetX,
            y: targetY,
            alpha: 0,
            scaleX: 0,
            scaleY: 0,
            angle: Phaser.Math.Between(-180, 180),
            duration: Phaser.Math.Between(400, 700),
            ease: 'Cubic.easeOut',

            // Eliminamos el cuadradito al terminar la animación
            onComplete: () => {
                particle.destroy();
            }
        });
    }
}