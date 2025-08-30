// routes/user.js
import express from "express";
import User from "../models/User.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Profile completion endpoint
router.put("/complete-profile", verifyToken, async (req, res) => {
  try {
    const { dob, gender, stream, phone, course } = req.body;

    if (!dob || !gender || !stream || !phone || !course) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Use req.userId (from verifyToken middleware)
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { dob, gender, stream, phone, course, isProfileComplete: true },
      { new: true }
    ).select("-password"); // exclude password from response

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "Profile completed successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
