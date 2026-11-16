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
    if (object && object.active) { //compruebo que el objeto existe 
        object.destroy();
    }
    if (index > -1) { //Solo lo saco del array si realmente existe en él
        RandomObjects.splice(index, 1);
    }
}


function createObject(scene, x, y, key) {
    let object = scene.physics.add.image(x, y, key);
    object.setScale(0.18);
    object.type = key;

    const recogerObjeto = (j1, j2) => { //En vez de hacerlo por separado lo hacemos para los dos.
        if (!object.active) return; //Si el objeto ya ha sido recogido, no hacemos nada
        const tipoGuardado = object.type;
        destroyObject(object, RandomObjects.indexOf(object));
        powerUpType(j1, j2, tipoGuardado, scene);
    };

    scene.physics.add.overlap(scene.players[0], object, () => {
        recogerObjeto(scene.players[0], scene.players[1]);
    });

    scene.physics.add.overlap(scene.players[1], object, () => {
        recogerObjeto(scene.players[1], scene.players[0]);
    });

    return object;
}

function powerUpType(j1, j2, type, scene) {
    switch (type) {
        case 'objeto_eliminador':
            eliminatePowerUp(j2);
            break;
        case 'objeto_congelar':
            freezePowerUp(j2);
            scene.time.addEvent({
                delay: 3000,
                callback: () => stopPowerUp(j2, type),
                loop: false
            });
            break;
        case 'objeto_inmortalidad':
            inmortalPowerUp(j1);
            scene.time.addEvent({
                delay: 3000,
                callback: () => stopPowerUp(j1, type),
                loop: false
            });
            break;
        case 'objeto_traza':
            const baseTrail = j1.trailMaxSize;
            trailPowerUp(j1, baseTrail);
            scene.time.addEvent({
                delay: 3000,
                callback: () => stopPowerUp(j1, type, baseTrail),
                loop: false
            });
            break;
        case 'objeto_velocidad':
            speedPowerUp(j1);
            scene.time.addEvent({
                delay: 3000,
                callback: () => stopPowerUp(j1, type),
                loop: false
            });
            break;
    }
}

function eliminatePowerUp(player) {
    player.trail.length = 0;
}

function freezePowerUp(player) {
    player.speed = 0;
    //player.fullNitro = true; No existe el nitro como mecanica es un powerup
}

function inmortalPowerUp(player) {
    player.inmortal = true;
}

function trailPowerUp(player, baseTrail) {
    player.trailMaxSize = Math.round(baseTrail * 1.5); //Para que sea variable dependiendo del tamaño que le hayas dado
}

function speedPowerUp(player) {
    player.speed = 600;
    //player.fullNitro = true;
}

function stopPowerUp(player, type, baseTrail = 50) {
    if (!player || !player.alive) return;

    if (type === 'objeto_congelar' || type === 'objeto_velocidad') {
        player.speed = 300;
        //player.fullNitro = false;
    }
    else if (type === 'objeto_inmortalidad') {
        player.inmortal = false;
    }
    else if (type === 'objeto_traza') {
        player.trailMaxSize = baseTrail;
        while (player.trail.length > player.trailMaxSize) {
            player.trail.shift();
        }
    }
}