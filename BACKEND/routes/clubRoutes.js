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

// ✅ Get club by ID (with coordinator info)
router.get("/:id", async (req, res) => {
  try {
    const club = await Club.findById(req.params.id).populate("coordinator", "username email");
    if (!club) return res.status(404).json({ message: "Club not found" });
    res.json(club);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all members of a club
router.get("/:id/members", async (req, res) => {
  try {
    const clubId = req.params.id;

    // Find users who belong to this club
    const members = await User.find({ club: clubId, role: "member" })
      .select("username email stream course year semester");

    res.json(members);
  } catch (err) {
    console.error("Error fetching members:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:clubId/counts", async (req, res) => {
  try {
    const { clubId } = req.params;
    const club = await Club.findById(clubId);

    if (!club) {
      return res.status(404).json({ success: false, message: "Club not found" });
    }

    // ✅ Count members from User collection
    const memberCount = await User.countDocuments({ club: clubId, role: "member" });



    res.json({
      success: true,
      memberCount,

    });
  } catch (err) {
    console.error("Error fetching counts:", err.message);
    res.status(500).json({ success: false, message: "Error fetching counts" });
  }
});



// Remove a member from a club
router.delete("/:clubId/members/:userId", async (req, res) => {
  try {
    const { clubId, userId } = req.params;

    // Set user's club to null and role back to visitor
    await User.findByIdAndUpdate(userId, { club: null, role: "visitor" });

    res.json({ message: "Member removed from club" });
  } catch (err) {
    console.error("Error removing member:", err);
    res.status(500).json({ message: "Server error" });
  }
});



export default router;  // ✅ keep only this
