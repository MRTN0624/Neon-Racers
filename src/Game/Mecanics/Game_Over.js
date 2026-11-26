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
        fadeOutVictoryMusic(scene, () => {
            scene.scene.restart({
                score1: scene.score1,
                score2: scene.score2
            });
        });
    };

    const volverAlMenu = async () => {
        if (transitioning) return;
        transitioning = true;

        // Obtenemos los nombres guardados en el registry (o usamos nombres por defecto)
        const nombreP1 = scene.registry.get('player1Name') || 'Jugador 1';
        const nombreP2 = scene.registry.get('player2Name') || 'Jugador 2';

        // Enviamos las puntuaciones de ambos jugadores antes de salir al menú
        if (scene.score1 > 0) {
            await guardarPuntuacion(nombreP1, scene.score1);
        }
        if (scene.score2 > 0) {
            await guardarPuntuacion(nombreP2, scene.score2);
        }

        fadeOutVictoryMusic(scene, () => scene.scene.start('MainMenu'));
    };
    //Donde verdaderamente se suman los puntos es en core, podriamos
    //haberlo gestionado de aqui siendo más sencillo, pero dejarlo en core
    //permitirá modularidad


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

//-----------------------------------------------------------------
//-----------------------------------------------------------------
async function guardarPuntuacion(nombreJugador, puntuacion) {
    try {
        // 1. (Opcional) Comprobamos si el jugador ya existe en el servidor
        const response = await fetch('http://localhost:8080/rankings');
        const rankings = await response.json(); //Guardamos la base de datos de rankings
        const jugadorExistente = rankings.find(r => r.name === nombreJugador); //Accedemos al jugador
        //Ya hemos guardado el jugador

        if (jugadorExistente != null) {
            // Si ya existe, actualizamos con PUT 
            const nuevaPuntuacion =  puntuacion; 

            const resPut = await fetch(`http://localhost:8080/rankings/${jugadorExistente.id}`, {
                //Busca en la lista de rankings el jugador y actualiza
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: nombreJugador,
                    score: nuevaPuntuacion
                })
            });

            if (resPut.ok) {
                console.log('Puntuación actualizada en el ranking');
            }

            //Hasta el momento hemos obtenido el jugador y utilizado su id para actualizarlo con put
        } else {
            // 2. Si no existe (o si siempre quieres crear un registro nuevo), usamos POST
            const resPost = await fetch('http://localhost:8080/rankings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: nombreJugador,
                    score: puntuacion
                })
            });

            if (resPost.ok) {
                const creado = await resPost.json();
                console.log('Nuevo ranking guardado en:', resPost.headers.get('Location'), creado);
            }
        }
    } catch (error) {
        console.error('Error al enviar la puntuación al servidor:', error);
    }
}

//Al try & catch lo uso para evitar duplicar código de gestión de errores http