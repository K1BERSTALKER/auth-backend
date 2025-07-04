import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import envalid from "@/lib/envalid";

export const isAuthenticated: RequestHandler = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    // ✅ Add return
    res.status(401).json({ success: false, message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, envalid.JWT_SECRET);
    (req as any).user = decoded; // optionally type this better
    next(); // ✅ OK
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
    return;
  }
};
