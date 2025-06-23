# 💬 Chat Application - Frontend

This is the **frontend part** of a real-time chat application built using **HTML, CSS, and JavaScript**. It allows users to create chat rooms, join them using a username, and interact in real time. This project works with a WebSocket backend (e.g., [Chat Application Backend](https://github.com/RohitBCA456/internship-basic-projects/tree/main/Chat%20application%20backend)).

---

## 📂 Project Structure

```
Chat application frontend/
│
├── index.html         # Entry page
├── mainPage.html      # Lobby for users to join or create chat rooms
├── room.html          # Real-time chat room
│
├── mainPage.js        # Logic for room joining/creation
├── register.js        # User registration and localStorage handling
├── room.js            # WebSocket logic and chat interactions
├── readme.md          # This file
```

---

## ✨ Features

- ✅ Username registration with `localStorage`
- ✅ Create or join chat rooms dynamically
- ✅ Real-time chat interface (via WebSocket backend)
- ✅ Message features:
  - Edit messages
  - Delete messages
  - Pin important messages
- ✅ Room deletion logic with cleanup
- ✅ Simple and responsive UI

---

## 🚀 How to Use

1. **Clone the Repository:**

```bash
git clone https://github.com/RohitBCA456/internship-basic-projects.git
cd "Chat application frontend"
```

2. **Run the Frontend:**

> You can open the frontend directly using a browser (no server needed for frontend-only view).

```bash
# Option 1: Open index.html directly
open index.html  # or right-click > "Open with browser"

# Option 2: Use Live Server (VS Code extension recommended)
```

3. **Make sure the backend is running at** `http://localhost:3000`  
   You can find the backend here:  
   [Chat Application Backend](https://github.com/RohitBCA456/internship-basic-projects/tree/main/Chat%20application%20backend)

---

## 🧠 Folder Flow

- `index.html`: Loads `register.js`, where user enters a name.
- `mainPage.html`: Lists and joins rooms using `mainPage.js`
- `room.html`: The active chat window powered by `room.js`

---

## 📦 Dependencies

- HTML/CSS/JavaScript only
- Communicates with backend via **Socket.IO**

---

## 🧑‍💻 Developer

- **Name:** Rohit Yadav  
- **GitHub:** [RohitBCA456](https://github.com/RohitBCA456)

---

## 📌 Notes

- For best use, run the backend and frontend together.
- Message functionality (edit/delete/pin) works on message cards using JavaScript event handling.

---

## 📸 Screenshots

![Screenshot 2025-06-23 152444](https://github.com/user-attachments/assets/64d55b51-6f2b-4f4d-9fd0-bbf6c98584cc)




---

## 📜 License

This project is part of a 3-month internship (May–July 2025).  
Feel free to use or modify with credit.

---
