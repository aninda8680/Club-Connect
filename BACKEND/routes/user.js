// routes/user.js
import express from "express";
import User from "../models/User.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Profile completion endpoint
router.put("/complete-profile", verifyToken, async (req, res) => {
  try {
    const { dob, gender, stream, phone, course, year, semester } = req.body; // 👈 added semester

    if (!dob || !gender || !stream || !phone || !course || !year || !semester) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Use req.userId (from verifyToken middleware)
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { dob, gender, stream, phone, course, year, semester, isProfileComplete: true }, // 👈 save semester
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


// Get logged-in user profile
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
