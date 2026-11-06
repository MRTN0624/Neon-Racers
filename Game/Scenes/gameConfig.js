//CONFIGURACION GENERAL DE JUEGO, AQUI DEFINIREMOS PARAMETROS IMPORTANTES
//-----------------------------------------------------------------------
// Configuración del motor
const config = {
    type: Phaser.CANVAS, // Elige WebGL si está disponible, si no Canvas
    width: 800,
    height: 600,
    // Vinculas directamente la etiqueta HTML que ya creaste
    canvas: document.getElementById('gameCanvas'),
    


    // scene: {  //todo lo que vive en esa pantalla va colgado de esa escena
    //     preload: preload,
    //     create: create,
    //     update: update,

        physics:{  //No todas las escenas tienen fisicas, pero physics es global y no se puede asignar a cada escena individual
 
    default: 'arcade',
    arcade:{
     gravity: { y: 0 },  // Gravedad en píxeles, 0 para que las motos no caigan
            debug: false          // Mostrar contornos físicos
}

        },
    scene: [LoadingScreen,MainMenu,Core,Settings,Credits] //Unicamente definimos las escenas que tendrá
    //que arrancar el motor de juego y cada escena heredará de Phaser.Scene para tener las propiedades típicas
    //Javascript permite sobreescribir métodos heredados
   
};
//--------------------------------------------------------------------------------

//--------------------------------------------------------------------------------

// Inicialización del juego
const game = new Phaser.Game(config);

console.log("Juego Phaser creado");