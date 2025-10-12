import { generateToken } from "../libs/utils.js";
import User from "../model/User.js";
import cloudinary from "../libs/cloudinary.js";

export const signUp = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password || !bio) {
      return res.json({ success: false, message: "Missing credentials" }).status(400);
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "Email is already Taken" });
    }

    const newUser = await User.create({ fullName, email, password, bio });

    const token = generateToken(newUser._id);
    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: "Account created successfully", newUser, token });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.json({ success: false, message: "Missing credentials" }).status(400);
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = generateToken(user._id);
    res.status(200).json({ success: true, message: "Login successful", user, token });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

// controller for user profile update
export const updateProfile = async (req, res) => {
  const { fullName, bio, profilePic } = req.body;

  try {
    const userId = req.user._id;
    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(userId, { bio, fullName }, { new: true });
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName, profilePic: upload.secure_url },
        { new: true }
      );
    }

    res
      .status(200)
      .json({ success: true, message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
