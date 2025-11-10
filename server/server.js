import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import connectDB from "./config/db.js";
import authRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// implement socket.io
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// store online users
export const userSocketMap = {};

// socket connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("New client connected", socket.id);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // EMIT ALL online users

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

dotenv.config();

const corsOptions = {
  origin: "http://localhost:5173",

  credentials: true,

  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json({ limit: "30mb" }));

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

await connectDB();

if (process.env.NODE_ENV !== "production") {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default server; 
