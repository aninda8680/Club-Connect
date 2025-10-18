//routes/coordinator.js
import express from "express";
import mongoose from "mongoose";
import Club from "../models/Club.js";

const router = express.Router();

router.get("/myclub/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    // Find the club where this user is the coordinator
    const club = await Club.findOne({ coordinator: new mongoose.Types.ObjectId(userId) });

    console.log("Club found:", club); // debugging

    if (!club) {
      return res.json({ message: "No club assigned" });
    }

    // Send clubName and clubId
    res.json({
      clubName: club.name,
      clubId: club._id.toString(), // <-- add this line
    });
  } catch (err) {
    console.error("Error in /myclub:", err);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;
