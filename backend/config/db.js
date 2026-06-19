import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URL;
  if (!uri) {
    throw new Error("MONGODB_URL is not set in environment variables.");
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("DB connected successfully");
  } catch (err) {
    console.error("DB ERROR:", err.message || err);
    throw err;
  }
};

export default connectDB;
