import { Server as SocketIOServer } from "socket.io";

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log(`User disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        console.log(`Removed user ${userId} from socket map`);
        break; // Exit loop after finding the matching socket
      }
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    } else {
      console.log("User ID not provided in handshake query");
    }

    socket.on("disconnect", () => disconnect(socket));
  });
  io.on("error", (error) => {
    console.error("Socket.IO error:", error);
  });
};

export default setupSocket;
