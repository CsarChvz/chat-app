const express = require("express");
const socketio = require("socket.io");
const app = express();
require("dotenv").config();

const port = process.env.PORT;
const path = require("path");

const publicPath = path.join(__dirname, "../public");

const http = require("http");
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(publicPath));

io.on("connection", (socket) => {
  console.log("New WebSocket connection");
});

server.listen(port, () => {
  console.log("Server is running on port 3000");
});
