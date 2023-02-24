const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const {
  addUser,
  getUser,
  getUsersInRoom,
  removeUser,
} = require("./utils/users");
require("dotenv").config();

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

const { generateMessage, generateLocationMessage } = require("./utils/message");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.emit("message", generateMessage("Welcome!"));

  // Enviar un mensaje a todos los usuarios menos al que se acaba de conectar
  socket.broadcast.emit("message", generateMessage("A new user has joined!"));

  // Recepcion de mensaje de un cliente y envio a todos los clientes
  socket.on("sendMessage", (message, callback) => {
    io.emit("message", generateMessage(message));
    callback();
  });

  // Recepcion de ubicacion de un cliente y envio a todos los clientes

  // client(sendLocation) -> server -> client(locationMessage)

  //  - Se escucha al event "sendLocation" del cliente
  socket.on("sendLocation", (coords, callback) => {
    // Se envia el mensaje a todos los clientes
    io.emit(
      "locationMessage",
      generateLocationMessage(
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );
    callback();
  });

  socket.on("join", ({ username, room }, callback) => {
    // El socket.join se usa para unir al usuario a una sala
    const { error, user } = addUser({ id: socket.id, username, room });
    if (error) {
      return callback(error);
    }

    socket.join(room);

    // lOS METODOS EMIT Y BROADCAST SE PUEDEN USER SIMILARMENTE PARA LAS SALAS
    // Solo tenemos que colocar a que sala queremos enviar el mensaje
    // socket.emit.to(room).emit("message", generateMessage("Welcome!")
    socket.to(room).emit("message", generateMessage("Welcome!"));

    socket.broadcast
      .to(room)
      .emit("message", generateMessage(`${username} has joined!`));

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
