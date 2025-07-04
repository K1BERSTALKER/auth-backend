import mongoose from "mongoose";
import envalid from "@/lib/envalid";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(envalid.MONGO_URI as string);
    console.log(`MongoDB Connected ${connect.connection.host}`);
  } catch (error) {
    console.error("Error connecting MongoDB", error);
    process.exit(1);
  }
};
export default connectDB;
