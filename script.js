const socket = io();

const joinBtn = document.getElementById("join-btn");
const roomInput = document.getElementById("room-input");
const chatContainer = document.querySelector(".chat-container");
const messages = document.getElementById("messages");
const sendBtn = document.getElementById("send-btn");
const messageInput = document.getElementById("message-input");

joinBtn.addEventListener("click", () => {
  const room = roomInput.value.trim();
  if (room) {
    socket.emit("joinRoom", room);
    chatContainer.style.display = "block";
    document.querySelector(".room-selection").style.display = "none";
  }
});

sendBtn.addEventListener("click", () => {
  const msg = messageInput.value.trim();
  if (msg) {
    socket.emit("chatMessage", msg);
    messageInput.value = "";
  }
});

socket.on("message", (msg) => {
  const div = document.createElement("div");
  div.textContent = msg;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
});
