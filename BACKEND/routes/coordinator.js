import express from "express";
import mongoose from "mongoose";
import Club from "../models/Club.js";

const router = express.Router();

router.get("/myclub/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Make sure userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const club = await Club.findOne({ coordinator: new mongoose.Types.ObjectId(userId) });

    console.log("Club found:", club); // for debugging

    if (!club) {
      return res.json({ message: "No club assigned" });
    }

    res.json({ clubName: club.name });
  } catch (err) {
    console.error("Error in /myclub:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
