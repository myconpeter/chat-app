// get all users except the logged in user
import Message from "../model/Message.js";
import User from "../model/User.js";
import cloudinary from "../libs/cloudinary.js";
import { io, userSocketMap } from "../server.js";

export const getAllUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const allUsers = await User.find({ _id: { $ne: userId } }).select("-password");

    const unseenMessages = {};

    const promises = allUsers.map(async (user) => {
      const messages = await Message.find({ senderId: user._id, receiverId: userId, seen: false });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });

    await Promise.all(promises);

    res.status(200).json({ users: allUsers, unseenMessages, success: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// get all messages between two users
export const getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId },
        { senderId: receiverId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    // mark all messages as seen
    await Message.updateMany(
      { senderId: receiverId, receiverId: userId, seen: false },
      { $set: { seen: true } }
    );

    res.status(200).json({ messages, success: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// mark message as seen
export const markAsSeen = async (req, res) => {
  try {
    const { receiverId } = req.params;

    await Message.findByIdAndUpdate(receiverId, { seen: true });

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// send message from one user to another

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.id;
    const { text, image } = req.body;

    // console.log("Received message:", { text, image });

    if (!text && !image) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    let imageUrl;
    if (image) {
      // upload image to cloudinary
      const uploadedImage = await cloudinary.uploader.upload(image);
      imageUrl = uploadedImage.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    // emit the message to the receiver if online
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({ message: newMessage, success: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};
