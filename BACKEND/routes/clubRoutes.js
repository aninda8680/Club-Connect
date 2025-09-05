//routes/clubRoutes.js
import express from "express";
import Club from "../models/Club.js";
import User from "../models/User.js";

const router = express.Router();

// Create a new club
router.post("/create", async (req, res) => {
  try {
    const { name, description, coordinatorId } = req.body;

    const club = await Club.create({
      name,
      description,
      coordinator: coordinatorId,
    });

    // update coordinator's user doc
    await User.findByIdAndUpdate(coordinatorId, { club: club._id });

    res.status(201).json(club);
  } catch (error) {
    res.status(500).json({ message: "Error creating club" });
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
