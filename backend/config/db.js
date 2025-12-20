import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected");
  console.log(`DB Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
};

export default connectDB;
