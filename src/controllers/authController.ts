import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import HTTP_STATUS from "@/lib/httpStatus";
import { loginSchema, registerSchema } from "@/lib/userValidator";
import User from "@/models/userModel";
import { generateOTP, generateToken } from "@/lib/generate";
import cookieOptions from "@/lib/cookieOptions";
import envalid from "@/lib/envalid";
import jwt from "jsonwebtoken";
import { mailTrapClient, sender } from "@/emails/mailTrap.config";

// Register User
export const register: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, errors });
      return;
    }

    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: "User already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = Date.now() + 15 * 60 * 1000;

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      verifyOtp: otp,
      verifyOtpExpires: otpExpires,
      isVerified: false,
    });
    await newUser.save();

    await mailTrapClient.send({
      from: sender,
      to: [{ email, name: username }],
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", otp),
    });

    const token = generateToken(newUser._id as string);
    res.cookie("token", token, cookieOptions);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login User
export const login: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, errors });
      return;
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ success: false, message: "Invalid email or password" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ success: false, message: "Invalid email or password" });
      return;
    }

    const token = generateToken(user._id as string);
    res.cookie("token", token, cookieOptions);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "User successfully logged in",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Logout User
export const logout: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ success: false, message: "No user logged in" });
      return;
    }

    const decoded = jwt.verify(token, envalid.JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id);
    if (!user) {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ success: false, message: "User not found" });
      return;
    }

    res.clearCookie("token", cookieOptions);

    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// Send Password Reset Email

// Get Current User
export const getCurrentUser: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const decoded = jwt.verify(token, envalid.JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id).select("username email");

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
