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

function collisionPlayerObject(playersArray) {

    const radius = Math.max(
        playersArray[0].body.width,
        playersArray[0].body.height
    ) / 2 + 5;

    let distancia = 0;
    for (let i = 0; i < playersArray.length; i++) {
        for (let j = 0; j < RandomObjects.length; j++) {
            distance = Phaser.Math.Distance.Between(playersArray[i].x, playersArray[i].y, RandomObjects[j].x, RandomObjects[j].y);
            if (distance < radius) {
                destroyObject(RandomObjects[j], j);
                //powerUp(RandomObjects[j].type);
            }
        }
    }

}

function powerUp(type){

    switch (type) {
        case 'objeto_eliminador':
            eliminatePowerUp();
            break;
        case 'objeto_congelar':
            freezePowerUp();
            break;
        case 'objeto_inmortalidad':
            inmortalPowerUp();
            break;
        case 'objeto_traza':
            trailsPowerUp();
            break;
        case 'objeto_velocidad':
            speedPowerUp();
            break;
    }

}

function eliminatePowerUp(){

}

function freezePowerUp(){

}

function inmortalPowerUp(){

}

function trailsPowerUp(){

}

function speedPowerUp(){

}
