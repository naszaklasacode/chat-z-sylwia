const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
    socket.room = room;
    socket.emit("message", `You joined room: ${room}`);
    socket.to(room).emit("message", `A new user has joined the room`);
  });

  socket.on("chatMessage", (msg) => {
    if (socket.room) {
      io.to(socket.room).emit("message", msg);
    }
  });

  socket.on("disconnect", () => {
    if (socket.room) {
      socket.to(socket.room).emit("message", "A user left the room");
    }
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
