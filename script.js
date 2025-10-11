const socket = io();

const joinBtn = document.getElementById("join-btn");
const usernameInput = document.getElementById("username-input"); // nowe pole dla imienia
const roomInput = document.getElementById("room-input");
const chatContainer = document.querySelector(".chat-container");
const messages = document.getElementById("messages");
const sendBtn = document.getElementById("send-btn");
const messageInput = document.getElementById("message-input");

joinBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const room = roomInput.value.trim();

  if (!username) {
    alert("Podaj swoje imię!");
    return;
  }

  if (!room) {
    alert("Podaj nazwę pokoju!");
    return;
  }

  // Przechowujemy imię w zmiennej socket
  socket.username = username;

  // Wysyłamy do serwera imię i pokój
  socket.emit("joinRoom", { room, username });

  chatContainer.style.display = "block";
  document.querySelector(".room-selection").style.display = "none";
});

sendBtn.addEventListener("click", () => {
  const msg = messageInput.value.trim();
  if (msg) {
    // Wysyłamy wiadomość na serwer
    socket.emit("chatMessage", msg);
    messageInput.value = "";
  }
});

// Odbieramy wiadomości z serwera
socket.on("message", (msg) => {
  const div = document.createElement("div");
  div.textContent = msg;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
});
