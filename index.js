const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { startBot } = require("./controllers/whatsapp");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("start-session", async ({ number }) => {
    const formattedNumber = number.startsWith("+") ? number : `+${number}`;
    await startBot(socket, formattedNumber);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
