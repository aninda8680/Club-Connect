// routes/announcementRoutes.js
import express from "express";
import Announcement from "../models/Announcement.js";

const router = express.Router();

// POST /api/announcements - Create announcement (admin/coordinator)
router.post("/", async (req, res) => {
  try {
    const { title, message, clubId } = req.body;
    if (!clubId) return res.status(400).json({ error: "clubId is required" });

    const newAnnouncement = new Announcement({ title, message, clubId });
    await newAnnouncement.save();

    res.status(201).json(newAnnouncement);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create announcement" });
  }
});

// GET /api/announcements?clubId=xxx - Get announcements for a club
router.get("/", async (req, res) => {
  try {
    const { clubId } = req.query;
    if (!clubId) return res.status(400).json({ error: "clubId is required" });

    const announcements = await Announcement.find({ clubId }).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
});

export default router;
