import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  getAllUsers,
  getMessages,
  markAsSeen,
  sendMessage,
} from "../controllers/messages.controller.js";

const messageRouter = express.Router();

messageRouter.get("/users", protect, getAllUsers);
messageRouter.get("/:receiverId", protect, getMessages);
messageRouter.put("/mark/:id", protect, markAsSeen);
messageRouter.post("/send/:id", protect, sendMessage);

export default messageRouter;
