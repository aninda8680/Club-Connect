//routes/clubRoutes.js
import express from "express";
import Club from "../models/Club.js";
import User from "../models/User.js";

const router = express.Router();

// Create a new club
router.post("/", async (req, res) => {
  try {
    const { name, description, coordinatorId } = req.body;

    // Create the club
    const club = new Club({ name, description, coordinator: coordinatorId });
    await club.save();

    // Update coordinator's record
    await User.findByIdAndUpdate(coordinatorId, { club: club._id });

    res.status(201).json({ message: "Club created successfully", club });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all clubs (with coordinator info)
router.get("/", async (req, res) => {
  try {
    const clubs = await Club.find().populate("coordinator", "username email");
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
