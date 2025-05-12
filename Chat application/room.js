document.addEventListener("DOMContentLoaded", () => {
  const userData = localStorage.getItem("user");
  if (!userData) return alert("User not found");

  const user = JSON.parse(userData);
  const { username, roomId, isOwner } = user;

  // Show appropriate button
  document.getElementById(
    isOwner ? "delete-room-btn" : "leave-room-btn"
  ).style.display = "inline-block";

  // Set UI values
  document.getElementById("room-id").textContent = roomId;
  document.getElementById("username").textContent = username;

  const socket = io("http://localhost:5000");

  socket.on("connect", () => console.log("Connected to server!"));
  socket.emit("join-room", roomId);

  socket.on("message-updated", () => {
    location.reload(); // Reload the page when message is edited, deleted, or sent
  });

  socket.on("receive-message", ({ username, message, timestamp, _id }) => {
    displayMessage(username, message, timestamp, _id);
  });

  socket.on("load-messages", (messages) => {
    messages.forEach(({ sender, content, timestamp, _id }) => {
      displayMessage(sender, content, timestamp, _id);
    });
  });

  window.sendMessage = function () {
    const input = document.getElementById("message");
    const message = input.value.trim();
    if (!message) return;
    socket.emit("send-message", { roomId, username, message });
    input.value = "";
  };
});

function linkify(text) {
  return text.replace(
    /(https?:\/\/[^\s]+)/g,
    (url) => `<a href="${url}" target="_blank">${url}</a>`
  );
}

function displayMessage(user, text, timestamp = null, messageId = null) {
  const chat = document.getElementById("chat");
  const messageEl = document.createElement("div");
  messageEl.className = `message ${
    user === document.getElementById("username").textContent ? "mine" : "other"
  }`;
  if (messageId) messageEl.dataset.id = messageId;

  const time = new Date(timestamp || Date.now()).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const content = document.createElement("div");
  content.className = "message-content";
  content.innerHTML = `<p><strong>${user}:</strong> <span>${linkify(
    text
  )}</span></p>`;

  const ts = document.createElement("div");
  ts.className = "timestamp";
  ts.textContent = time;

  // Create Edit, Delete, and Pin buttons directly inside the message content
  const actionBtns = document.createElement("div");
  actionBtns.className = "action-buttons";

  if (user === document.getElementById("username").textContent) {
    actionBtns.innerHTML += `
      <button onclick="editMessage('${text.replace(
        /'/g,
        "\\'"
      )}', this)" class="pop-up-btn">Edit</button>
      <button onclick="deleteMessage(this)" class="pop-up-btn">Delete</button>
    `;
  }

  const isPinned = messageEl.classList.contains("pinned");
  actionBtns.innerHTML += `<button onclick="togglePin(this)" class="pop-up-btn">${
    isPinned ? "Unpin" : "Pin"
  }</button>`;

  content.appendChild(actionBtns); // Append buttons inline with content

  messageEl.append(content, ts);

  messageEl.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  chat.appendChild(messageEl);
  messageEl.scrollIntoView({ behavior: "smooth" });
}

window.editMessage = function (oldText, btn) {
  const messageCard = btn.closest(".message");
  const messageId = messageCard.dataset.id;

  const span = messageCard.querySelector(".message-content span");

  const input = document.createElement("input");
  input.type = "text";
  input.value = oldText.trim(); // Trim to remove unwanted leading/trailing spaces
  input.className = "edit-input";

  // Prevent the extra space by listening to the input field
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const newText = input.value.trim();
      if (!newText || newText === oldText) return cancelEdit();

      fetch("http://localhost:5000/message/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: messageId, newText }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "Message edited.") {
            span.innerHTML = linkify(newText); // Update message with new text
            cancelEdit();
          }
        })
        .catch(console.error);
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  });

  span.replaceWith(input);
  input.focus();

  function cancelEdit() {
    input.replaceWith(span);
    document.querySelectorAll(".message-popup").forEach((p) => p.remove());
  }
};

window.deleteMessage = function (btn) {
  const messageCard = btn.closest(".message");
  const messageId = messageCard.dataset.id;

  if (!messageId) return console.error("Message ID not found");

  messageCard.querySelector(".message-popup")?.remove();

  fetch("http://localhost:5000/message/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: messageId }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.message === "Message deleted.") {
        messageCard.remove();
      } else {
        console.error("Error deleting message:", data.message);
      }
    })
    .catch(console.error);
};

window.deleteRoom = function () {
  if (!confirm("Are you sure you want to delete the room?")) return;

  // const user = JSON.parse(localStorage.getItem("user"));
  // if (!user?.roomId) return console.error("Room ID not found in localStorage.");

  fetch("http://localhost:5000/room/deleteroom", {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.message === "Room deleted.") {
        localStorage.removeItem("user");
        window.location.href = "mainPage.html";
        fetchRooms();
      } else {
        console.error("Error deleting room:", data.message);
      }
    })
    .catch(console.error);
};

window.leaveRoom = function () {
  if (confirm("Are you sure you want to leave the room?")) {
    const user = JSON.parse(localStorage.getItem("user"));
    // if (!user?.roomId)
    //   return console.error("Room ID not found in localStorage.");
    // fetch("http://localhost:5000/room/leaveroom", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ username: user.username }),
    // });
    localStorage.removeItem("user");
    window.location.href = "mainPage.html";
  }
};

window.togglePin = function (btn) {
  const messageCard = btn.closest(".message");
  const isPinned = messageCard.classList.toggle("pinned");
  btn.textContent = isPinned ? "Unpin" : "Pin";
  messageCard.querySelector(".message-popup")?.remove();
};

// Hide popups when clicking outside
document.addEventListener("click", (e) => {
  const isInsidePopup = e.target.closest(".message-popup");
  const isInsideMessage = e.target.closest(".message");
  if (!isInsidePopup && !isInsideMessage) {
    document.querySelectorAll(".message-popup").forEach((p) => p.remove());
  }
});
