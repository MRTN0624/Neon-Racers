class SocketManager {
  static connection = null;
  static role = 1; // Rol de jugador

  static getInstance() {
    if (SocketManager.connection === null) {
      SocketManager.connection = new WebSocket(`ws://${window.location.host}`);

      SocketManager.connection.onopen = function () {
        console.log("¡Conectado al servidor!");
      };

      SocketManager.connection.onmessage = function (event) {
        const data = JSON.parse(event.data);
        if (data.type === 'ASSIGN_ROLE') {
          SocketManager.role = data.role;
          console.log("Rol asignado por el servidor:", data.role);
        }
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