import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  const URI = process.env.MONGO_URI;
  
  if (!URI) {
    throw new Error("MONGO_URI is not defined in envfile");
  }

  try {
    await mongoose.connect(URI, {
      dbName: "ChatApp",
    });
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error("Failed to connect to MongoDB", e);
    process.exit(1);
  }
};

export default connectDB;
