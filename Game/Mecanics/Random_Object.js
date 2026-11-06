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
    const object = scene.add.image(x, y, key);
    object.setScale(0.18);

    object.x = x;
    object.y = y;
    object.type = key;

    return object;
}

function collisionPlayerObject(scene, playersArray) {

    if (playersArray.length === 2 && RandomObjects.length != 0) {

        const radius = Math.max(
            playersArray[0].body.width,
            playersArray[0].body.height
        ) / 2 + 5;

        let distancia = 0;
        for (let i = 0; i < playersArray.length; i++) {
            for (let j = 0; j < RandomObjects.length; j++) {
                distance = Phaser.Math.Distance.Between(playersArray[i].x, playersArray[i].y, RandomObjects[j].x, RandomObjects[j].y);
                if (distance < radius) {

                    if (i === 0) powerUp(scene, RandomObjects[j].type, playersArray[i], playersArray[i + 1]);
                    else if (i === 1) powerUp(scene, RandomObjects[j].type, playersArray[i], playersArray[i - 1]);

                    destroyObject(RandomObjects[j], j);
                    j--;
                }
            }
        }
    }

}

function powerUp(scene, type, playerGet, playerOther) {

    let objectTime = 0;
    let player = playerGet;
    switch (type) {
        case 'objeto_eliminador':
            player = playerOther;
            eliminatePowerUp(player);
            objectTime = 0;
            break;
        case 'objeto_congelar':
            player = playerOther;
            freezePowerUp(player);
            objectTime = 3000;
            break;
        case 'objeto_inmortalidad':
            player = playerGet;
            inmortalPowerUp(player);
            objectTime = 3000;
            break;
        case 'objeto_traza':
            player = playerGet;
            trailPowerUp(player);
            objectTime = 3000;
            break;
        case 'objeto_velocidad':
            player = playerGet;
            speedPowerUp(player);
            objectTime = 3000;
            break;
    }

    if (objectTime != 0) {
        scene.time.addEvent({
            delay: objectTime,
            callback: () => stopPowerUp(player, type),
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

function stopPowerUp(player, type) {

    if (type === 'objeto_congelar' || type === 'objeto_velocidad') {
        player.speed = 300;
        player.fullNitro = false;
    }

    else if (type === 'objeto_inmortalidad') {
        player.inmortal = false;
    }

    else if (type === 'objeto_traza') {
        player.trailMaxSize = 50;
        while (player.trail.length > player.trailMaxSize) {
            player.trail.shift();
        }
    }


}