import { Server } from "socket.io";
import express from "express";
import http from "http";
import Message from "../models/message.model.js";
const app = express();
const server = http.createServer(app);
const frontendOrigin = process.env.FRONTEND_URL;
const io = new Server(server, {
  cors: {
    origin: frontendOrigin,
    credentials: true,
  },
});
export const userSocketMap = {};
export const getReceiverSocketId = (receiver) => userSocketMap[receiver];
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId != "undefined") {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUesrs", Object.keys(userSocketMap));

  socket.on("markMessagesAsRead", async ({ senderId, receiverId }) => {
    try {
      if (!senderId || !receiverId) return;

      await Message.updateMany(
        {
          sender: senderId,
          receiver: receiverId,
          isRead: false,
        },
        {
          $set: {
            isRead: true,
            readAt: new Date(),
          },
        },
      );

      const senderSocketId = getReceiverSocketId(senderId);

      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesRead", {
          userId: receiverId,
        });
      }
    } catch (error) {
      console.log("markMessagesAsRead error:", error.message);
    }
  });

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUesrs", Object.keys(userSocketMap));
  });
});
export { server, app, io };
