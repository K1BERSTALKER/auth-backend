import validEnv from "@/lib/envalid";
import { CookieOptions } from "express";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: validEnv.NODE_ENV === "production",
  sameSite: validEnv.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000,
};

export default cookieOptions;
