// services/socketService.js
import { Server } from "socket.io";
import { Message } from "../model/message.model.js";
export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://127.0.0.1:5500",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("join-room", async (roomId) => {
      socket.join(roomId);

      // Fetch previous messages and send them to the user
      const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
      socket.emit("load-messages", messages);
    });

    socket.on("send-message", async (data) => {
      const { username, roomId, message } = data;

    // Save to DB
    const newMessage = new Message({ roomId, sender: username, content: message });
    await newMessage.save();

    // Send to everyone in the room
    io.to(roomId).emit("receive-message", {
      username,
      message,
      timestamp: newMessage.timestamp,
    });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
  return io;
};
