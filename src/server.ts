import "dotenv/config";
import envalid from "@/lib/envalid";
import cookieParser from "cookie-parser";
import connectDB from "@/lib/connectDB";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";

const app = express();

connectDB();

app.use(express.json());

app.use(cookieParser());

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/auth", authRoutes);

app.listen(envalid.PORT, () => {
  console.log(`Server running on port ${envalid.PORT}`);
});
