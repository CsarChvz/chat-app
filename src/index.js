const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

require("dotenv").config();

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.emit("message", "Welcome!");

  // Enviar un mensaje a todos los usuarios menos al que se acaba de conectar
  socket.broadcast.emit("message", "A new user has joined!");

  // Recepcion de mensaje de un cliente y envio a todos los clientes
  socket.on("sendMessage", (message, callback) => {
    io.emit("message", message);
    callback();
  });

  // Recepcion de ubicacion de un cliente y envio a todos los clientes

  //  - Se escucha al event "sendLocation" del cliente
  socket.on("sendLocation", (coords, callback) => {
    // Se envia el mensaje a todos los clientes
    io.emit(
      "message",
      `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
    );
    callback();
  });

  // Evento de desconexiób
  socket.on("disconnect", () => {
    // Como ya el socket se desconectó, no podemos usar el socket.emit, sino que usamos io.emit
    // Para enviar el mensaje a todos los usuarios que la persona se desconecto
    io.emit("message", "A user has left!");
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
