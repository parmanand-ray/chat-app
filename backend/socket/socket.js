import { Server } from "socket.io";
import express from "express";
import http from "http";

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

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUesrs", Object.keys(userSocketMap));
  });
});
export { server, app, io };
