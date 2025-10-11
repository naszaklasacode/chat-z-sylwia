const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serwujemy pliki statyczne z głównego folderu (bo masz wszystkie pliki w jednym)
app.use(express.static(__dirname)); 

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Obsługa dołączenia do pokoju
  socket.on("joinRoom", ({ room, username }) => {
    socket.join(room);
    socket.room = room;
    socket.username = username;

    // Powitanie dla użytkownika, który dołączył
    socket.emit("message", `Witaj ${username}, dołączyłeś do pokoju: ${room}`);

    // Powiadomienie dla innych użytkowników w pokoju
    socket.to(room).emit("message", `${username} dołączył do pokoju`);
  });

  // Obsługa wiadomości
  socket.on("chatMessage", (msg) => {
    if (socket.room && socket.username) {
      io.to(socket.room).emit("message", `${socket.username}: ${msg}`);
    }
  });

  // Obsługa rozłączenia
  socket.on("disconnect", () => {
    if (socket.room && socket.username) {
      socket.to(socket.room).emit("message", `${socket.username} opuścił pokój`);
    }
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
