import jwt from "jsonwebtoken";
import User from "../model/User.js";

export const protect = (req, res, next) => {
  // Dummy middleware for authentication
  // In a real application, you would verify JWT tokens or session here

  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.jwtSecret);

    const user = User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }
    next();

    req.user = user;
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, user not found" });
  }
};

// to check if user is authenticated
