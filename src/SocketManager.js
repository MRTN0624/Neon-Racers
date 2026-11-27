class SocketManager {
  static connection = null;

  static getInstance() {
    if (SocketManager.connection === null) {
      SocketManager.connection = new WebSocket("ws://localhost:8080/playersData");

      SocketManager.connection.onopen = function () {
        console.log("¡Conectado al servidor!");
      };
    }

    return SocketManager.connection;
  }
}

export default SocketManager;
