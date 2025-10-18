import express from "express";
import Club from "../models/Club.js";
import User from "../models/User.js";

const router = express.Router();

/* -----------------------------------------------------------
   CREATE NEW CLUB
----------------------------------------------------------- */
router.post("/", async (req, res) => {
  try {
    const { name, description, coordinatorId } = req.body;

    if (!name || !description || !coordinatorId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const club = new Club({ name, description, coordinator: coordinatorId });
    await club.save();

    await User.findByIdAndUpdate(coordinatorId, { club: club._id });

    res.status(201).json({ message: "Club created successfully", club });
  } catch (err) {
    console.error("Error creating club:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* -----------------------------------------------------------
   GET ALL CLUBS
----------------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate("coordinator", "username email role")
      .sort({ createdAt: -1 });
    res.json(clubs);
  } catch (err) {
    console.error("Error fetching clubs:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* -----------------------------------------------------------
   GET CLUB BY ID
----------------------------------------------------------- */
router.get("/:id", async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate("coordinator", "username email role");
    if (!club) return res.status(404).json({ message: "Club not found" });
    res.json(club);
  } catch (err) {
    console.error("Error fetching club:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* -----------------------------------------------------------
   GET CLUB MEMBERS (all roles)
----------------------------------------------------------- */
router.get("/:id/members", async (req, res) => {
  try {
    const members = await User.find({ club: req.params.id })
      .select("username email role stream course year semester");
    res.json(members);
  } catch (err) {
    console.error("Error fetching members:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* -----------------------------------------------------------
   GET CLUB ROLE COUNTS
----------------------------------------------------------- */
router.get("/:clubId/counts", async (req, res) => {
  try {
    const { clubId } = req.params;
    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ success: false, message: "Club not found" });

    const memberCount = await User.countDocuments({ club: clubId, role: "member" });
    const leaderCount = await User.countDocuments({ club: clubId, role: "leader" });
    const coordinatorCount = await User.countDocuments({ club: clubId, role: "coordinator" });

    res.json({
      success: true,
      counts: { members: memberCount, leaders: leaderCount, coordinators: coordinatorCount },
    });
  } catch (err) {
    console.error("Error fetching counts:", err.message);
    res.status(500).json({ success: false, message: "Error fetching counts" });
  }
});

/* -----------------------------------------------------------
   UPDATE CLUB COORDINATOR
----------------------------------------------------------- */
router.put("/:id/coordinator", async (req, res) => {
  try {
    const { coordinatorId } = req.body;
    if (!coordinatorId) return res.status(400).json({ error: "Coordinator ID is required" });

    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ error: "Club not found" });

    // Remove old coordinator's club reference
    if (club.coordinator) {
      await User.findByIdAndUpdate(club.coordinator, { club: null });
    }

    // Assign new coordinator
    club.coordinator = coordinatorId;
    await club.save();

    await User.findByIdAndUpdate(coordinatorId, { club: club._id });

    const updatedClub = await Club.findById(req.params.id)
      .populate("coordinator", "username email role");

    res.json({ message: "Coordinator updated successfully", club: updatedClub });
  } catch (err) {
    console.error("Error updating coordinator:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* -----------------------------------------------------------
   REMOVE MEMBER FROM CLUB
----------------------------------------------------------- */
router.delete("/:clubId/members/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndUpdate(userId, { club: null, role: "visitor" });
    res.json({ message: "Member removed from club" });
  } catch (err) {
    console.error("Error removing member:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* -----------------------------------------------------------
   🗑️ DELETE A CLUB
----------------------------------------------------------- */
router.delete("/:clubId", async (req, res) => {
  try {
    const { clubId } = req.params;

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ error: "Club not found" });
    }

    // Remove the club reference from all users
    await User.updateMany(
      { club: clubId },
      { $set: { club: null, role: "visitor" } }
    );

    // Delete the club itself
    await Club.findByIdAndDelete(clubId);

    res.json({ message: "Club deleted successfully" });
  } catch (err) {
    console.error("Error deleting club:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Change coordinator of a club
router.put("/:clubId/coordinator", async (req, res) => {
  try {
    const { clubId } = req.params;
    const { coordinatorId } = req.body;

    const club = await Club.findByIdAndUpdate(
      clubId,
      { coordinator: coordinatorId },
      { new: true }
    ).populate("coordinator", "username email");

    if (!club) return res.status(404).json({ message: "Club not found" });

    await User.findByIdAndUpdate(coordinatorId, { club: clubId });

    res.json({ success: true, message: "Coordinator updated successfully", club });
  } catch (err) {
    console.error("Error updating coordinator:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
