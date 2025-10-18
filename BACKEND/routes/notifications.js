//routes/notifications.js
import express from "express";
import Notification from "../models/Notification.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Get notifications for logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.userId })
      .populate("sender", "username email")
      .populate("post", "content image")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Mark notification as read
router.put("/:id/read", verifyToken, async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.userId },
      { read: true },
      { new: true }
    );
    res.json(notif);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;