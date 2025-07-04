import {
  getCurrentUser,
  login,
  logout,
  register,
} from "@/controllers/authController";
import { isAuthenticated } from "@/middleware/isAuthenticated";
import express from "express";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.get("/me", isAuthenticated, getCurrentUser);

export default authRoutes;
