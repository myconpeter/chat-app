import express from "express";

const authRouter = express.Router();
import { checkAuth, signIn, signUp, updateProfile } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.js";

authRouter.post("/register", signUp);
authRouter.post("/login", signIn);
authRouter.post("/profile", protect, updateProfile);
authRouter.get("/profile", protect, checkAuth);

export default authRouter;
