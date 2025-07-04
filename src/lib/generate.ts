import jwt from "jsonwebtoken";
import validEnv from "@/lib/envalid";
export const generateToken = (id: string) => {
  return jwt.sign({ id }, validEnv.JWT_SECRET as string, { expiresIn: "1d" });
};

export const generateOTP = () =>
  Math.floor(100000 + Math.random() * 600000).toString();
