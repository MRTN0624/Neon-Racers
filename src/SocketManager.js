class SocketManager {
  static connection = null;

  static getInstance() {
    if (SocketManager.connection === null) {
      SocketManager.connection = new WebSocket("ws://localhost:8080");


      //Deben de estar dentro, porque aunque sea eventListeners, javascript es imperativo y estructurado 
      //y puede dar un fallo.
      SocketManager.connection.onopen = function () {
        console.log("¡Conectado al servidor!");
      };

      SocketManager.connection.onclose = function (event) {
        console.warn("Desconectado del servidor!");
        console.log("Código de cierre:", event.code);
        alert("Se ha perdido la conexión con el servidor");
      };
    }

    return SocketManager.connection;
  }
}

export default SocketManager; // Para poder importar la clase
