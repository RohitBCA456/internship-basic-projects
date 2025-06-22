import { Message } from "../models/messageModel.js";

export const setupSocketHandlers = (io) => {
  const userSockets = new Map();

  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    socket.on("register", (userId) => {
      userSockets.set(userId, socket.id);
      console.log("🔐 Registered user:", userId);
    });

    socket.on("join-room", async (roomId) => {
      socket.join(roomId);
      console.log(`🚪 ${socket.id} joined room: ${roomId}`);

      try {
        const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
        const formattedMessages = messages.map((msg) => ({
          ...msg._doc,
          sender: msg.sender.toString(), // ✅ Force string
        }));
        socket.emit("load-messages", formattedMessages);
      } catch (err) {
        console.error("❌ Error loading messages:", err);
      }
    });

    socket.on("send-message", async (data) => {
      const { username, roomId, message } = data;

      if (!username || !roomId || !message) {
        console.warn("⚠️ Incomplete message data received");
        return;
      }

      try {
        const newMessage = new Message({
          roomId,
          sender: username,
          content: message,
        });

        await newMessage.save();

        io.to(roomId).emit("receive-message", {
          sender: username.toString(),
          message,
          timestamp: newMessage.timestamp,
        });

        io.to(roomId).emit("message-updated");
      } catch (err) {
        console.error("❌ Error saving message:", err);
      }
    });

    socket.on("mark_read", async ({ roomId, username }) => {
      try {
        await Message.updateMany(
          { roomId, sender: { $ne: username }, read: false },
          { $set: { read: true } }
        );
      } catch (err) {
        console.error("❌ Error marking messages as read:", err);
      }
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          console.log(`❎ User ${userId} disconnected`);
          break;
        }
      }
    });
  });

  return userSockets;
};
