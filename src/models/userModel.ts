import mongoose, { Schema, Document } from "mongoose";

// Define the interface for the User document
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  verifyOtp?: string;
  verifyOtpExpires?: number;
  isVerified?: boolean;
  resetOtp?: string;
  resetOtpExpires?: number;
}

// Define the schema
const UserSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verifyOtp: { type: String, default: "" },
    verifyOtpExpires: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: "" },
    resetOtpExpires: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Create and export the model
const User = mongoose.model<IUser>("User", UserSchema);
export default User;
