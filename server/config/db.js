import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const Mongo_URI = process.env.MONGO_URI;
const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to DB");
    });
    await mongoose.connect(Mongo_URI);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
