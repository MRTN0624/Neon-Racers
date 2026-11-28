class SocketManager {
  static connection = null;
  static role = 1; //Rol de jugador.
  static getInstance() {
    if (SocketManager.connection === null) {
      SocketManager.connection = new WebSocket(`ws://${window.location.host}`);


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


