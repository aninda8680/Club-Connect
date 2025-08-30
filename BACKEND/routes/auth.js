// BACKEND/routes/auth.js

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// ================== Helper: Get Redirect Path ==================
const getRedirectPath = (role, isProfileComplete) => {
  if (!isProfileComplete) return "/complete-profile";
  switch (role) {
    case "admin":
      return "/adminpanel";
    case "coordinator":
      return "/coordinatorpanel";
    case "leader":
      return "/leaderpanel";
    default:
      return "/public"; // fallback
  }
};

// ================== Register ==================
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "visitor", // default role
      isProfileComplete: false,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      redirectPath: "/complete-profile",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================== Login ==================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const redirectPath = getRedirectPath(user.role, user.isProfileComplete);

    res.json({
      token,
      username: user.username,
      role: user.role,
      isProfileComplete: user.isProfileComplete,
      redirectPath,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================== Get current logged-in user ==================
// ✅ GET /api/auth/me
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "username email role phone dob gender stream course isProfileComplete"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
