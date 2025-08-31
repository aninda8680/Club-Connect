import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Get all users (Admin only)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "username email role profileComplete");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Update user role
router.put("/users/:id/role", async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error updating role" });
  }
});

export default router;
