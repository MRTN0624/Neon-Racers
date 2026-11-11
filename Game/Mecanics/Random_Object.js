// Gestión de aparición de objetos aleatorios

let RandomObjects = [];

function RandomObjectGenerator(scene) {

    if (scene.gameOverTriggered) return;

    const randomX = Phaser.Math.Between(115, 685);
    const randomY = Phaser.Math.Between(80, 520);
    const objectType = Phaser.Math.Between(1, 5);

    let randomObject;

    switch (objectType) {
        case 1:
            randomObject = createObject(scene, randomX, randomY, 'objeto_eliminador');
            break;
        case 2:
            randomObject = createObject(scene, randomX, randomY, 'objeto_congelar');
            break;
        case 3:
            randomObject = createObject(scene, randomX, randomY, 'objeto_inmortalidad');
            break;
        case 4:
            randomObject = createObject(scene, randomX, randomY, 'objeto_traza');
            break;
        case 5:
            randomObject = createObject(scene, randomX, randomY, 'objeto_velocidad');
            break;
    }
    RandomObjects.push(randomObject);

    if (RandomObjects.length > 3) {
        destroyObject(RandomObjects[0], 0);
    }
}

function destroyObject(object, index) {
    object.destroy();
    RandomObjects.splice(index, 1);
}


function createObject(scene, x, y, key) {
    let object = scene.physics.add.image(x, y, key);
    object.setScale(0.18);

    object.x = x;
    object.y = y;
    object.type = key;

    scene.physics.add.overlap(scene.players[0], object, (j1, j2, o) => {
        j1 = scene.players[0];
        j2 = scene.players[1];
        o = object;

        powerUpType(j1, j2, o, scene);

        object.destroy();

        for (let j = 0; j < RandomObjects.length; j++) {
            if (RandomObjects[j] === null) {
                RandomObjects.splice(j, 1);
            }
        }


    });

    scene.physics.add.overlap(scene.players[1], object, (j1, j2, o) => {
        j1 = scene.players[1];
        j2 = scene.players[0];
        o = object;

        powerUpType(j1, j2, o, scene);

        object.destroy();

        for (let j = 0; j < RandomObjects.length; j++) {
            if (RandomObjects[j] == null) {
                RandomObjects.splice(j, 1);
            }
        }

    });

    return object;
}

function powerUpType(j1, j2, o, scene) {
    switch (o.type) {
        case 'objeto_eliminador':
            eliminatePowerUp(j2);
            scene.time.addEvent({
                delay: 0,
                callback: () => stopPowerUp(j2, o),
                loop: false
            });
            break;
        case 'objeto_congelar':
            freezePowerUp(j2);
            scene.time.addEvent({
                delay: 3000,
                callback: () => stopPowerUp(j2, o),
                loop: false
            });
            break;
        case 'objeto_inmortalidad':
            inmortalPowerUp(j1);
            scene.time.addEvent({
                delay: 3000,
                callback: () => stopPowerUp(j1, o),
                loop: false
            });
            break;
        case 'objeto_traza':
            trailPowerUp(j1);
            scene.time.addEvent({
                delay: 3000,
                callback: () => stopPowerUp(j1, o),
                loop: false
            });
            break;
        case 'objeto_velocidad':
            speedPowerUp(j1);
            scene.time.addEvent({
                delay: 3000,
                callback: () => stopPowerUp(j1, o),
                loop: false
            });
    }
}

function eliminatePowerUp(player) {
    player.trail.length = 0;
}

function freezePowerUp(player) {
    player.speed = 0;
    player.fullNitro = true;
}

function inmortalPowerUp(player) {
    player.inmortal = true;
}

function trailPowerUp(player) {
    player.trailMaxSize = 75;
}

function speedPowerUp(player) {
    player.speed = 600;
    player.fullNitro = true;
}

function stopPowerUp(player, object) {

    if (object.type === 'objeto_congelar' || object.type === 'objeto_velocidad') {
        player.speed = 300;
        player.fullNitro = false;
    }

    else if (object.type === 'objeto_inmortalidad') {
        player.inmortal = false;
    }

    else if (object.type === 'objeto_traza') {
        player.trailMaxSize = 50;
        while (player.trail.length > player.trailMaxSize) {
            player.trail.shift();
        }
    }

}