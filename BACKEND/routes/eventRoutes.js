// routes/eventRoutes.js
import express from "express";
import Event from "../models/Event.js";
import User from "../models/User.js";   // <-- import User model
import Club from "../models/Club.js";   // <-- import Club model

const router = express.Router();

// Coordinator: create event proposal
router.post("/create", async (req, res) => {
  try {
    const { title, description, date, venue, createdBy } = req.body;

    if (!title || !date || !createdBy) {
      return res.status(400).json({ message: "Title, date, and createdBy are required" });
    }

    // Check coordinator exists
    const coordinator = await User.findById(createdBy);
    if (!coordinator) {
      return res.status(400).json({ message: "Coordinator not found" });
    }

    // Get club automatically
    const club = await Club.findOne({ coordinator: createdBy });
    if (!club) {
      return res.status(400).json({ message: "No club found for this coordinator" });
    }

    const newEvent = new Event({
      title,
      description,
      date,
      venue,
      createdBy,
      club: club._id,
    });

    await newEvent.save();
    res.status(201).json(newEvent);

  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Admin: get all pending events
router.get("/pending", async (req, res) => {
  try {
    const events = await Event.find({ status: "pending" })
      .populate("club")
      .populate("createdBy", "name email"); // populate coordinator details
    res.json(events);
  } catch (err) {
    console.error("Error fetching pending events:", err);
    res.status(500).json({ message: "Error fetching events", error: err.message });
  }
});

// Admin: approve/reject event
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body; // "approved" or "rejected"
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Error updating event", error: err.message });
  }
});

// Coordinator: get approved events for their club
router.get("/approved/:coordinatorId", async (req, res) => {
  try {
    const { coordinatorId } = req.params;

    // Find club of this coordinator
    const club = await Club.findOne({ coordinator: coordinatorId });
    if (!club) {
      return res.status(404).json({ message: "No club found for this coordinator" });
    }

    // Find approved events for this club
    const events = await Event.find({ club: club._id, status: "approved" })
      .populate("club", "name")
      .populate("createdBy", "name email");

    res.json(events);
  } catch (err) {
    console.error("Error fetching approved events:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
