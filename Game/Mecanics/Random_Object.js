// Gestión de aparición de objetos aleatorios

let RandomObjects = [];

function RandomObjectGenerator(scene){
    
    const randomX = Phaser.Math.Between(115, 685);
    const randomY = Phaser.Math.Between(520, 80);
    const objectType = Phaser.Math.Between(1, 5);

    const object = scene.add.rectangle(randomX, randomY, 50, 50, 0x0000ff);

    RandomObjects.push(object);

    if (RandomObjects.length > 3){
        RandomObjects[0].destroy();
        RandomObjects.splice(0,1);
    }
}
