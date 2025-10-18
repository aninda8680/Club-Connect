// routes/eventRoutes.js
import express from "express";
import multer from "multer";
import Event from "../models/Event.js";
import User from "../models/User.js";
import Club from "../models/Club.js";

const router = express.Router();

// ⚡ Multer setup for poster upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // save in /uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ---------------------------
// Coordinator: create event proposal (with poster)
// ---------------------------
router.post("/create", upload.single("poster"), async (req, res) => {
  try {
    const { title, description, date, venue, createdBy } = req.body;

    if (!title || !date || !createdBy) {
      return res
        .status(400)
        .json({ message: "Title, date, and createdBy are required" });
    }

    // Check coordinator exists
    const coordinator = await User.findById(createdBy);
    if (!coordinator) {
      return res.status(400).json({ message: "Coordinator not found" });
    }

    // Get club automatically
    const club = await Club.findOne({ coordinator: createdBy });
    if (!club) {
      return res
        .status(400)
        .json({ message: "No club found for this coordinator" });
    }

    const newEvent = new Event({
      title,
      description,
      date,
      venue,
      createdBy,
      club: club._id,
      poster: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

// ---------------------------
// Admin: get all pending events
// ---------------------------
router.get("/pending", async (req, res) => {
  try {
    const events = await Event.find({ status: "pending" })
      .populate("club")
      .populate("createdBy", "name email");
    res.json(events);
  } catch (err) {
    console.error("Error fetching pending events:", err);
    res
      .status(500)
      .json({ message: "Error fetching events", error: err.message });
  }
});

// ---------------------------
// Admin: approve/reject event
// ---------------------------
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
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
    res
      .status(500)
      .json({ message: "Error updating event", error: err.message });
  }
});

// ---------------------------
// Coordinator: get approved events for their club
// ---------------------------
router.get("/approved/:coordinatorId", async (req, res) => {
  try {
    const { coordinatorId } = req.params;

    const club = await Club.findOne({ coordinator: coordinatorId });
    if (!club) {
      return res.status(404).json({ message: "No club found for this coordinator" });
    }

    const events = await Event.find({ club: club._id, status: "approved" })
      .populate("club", "name")
      .populate("createdBy", "name email");

    res.json(events);
  } catch (err) {
    console.error("Error fetching approved events:", err);
    res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

// ---------------------------
// Public: get all approved events
// ---------------------------
router.get("/approved", async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" })
      .populate("club", "name logo")
      .populate("createdBy", "name email");

    res.json(events);
  } catch (err) {
    console.error("Error fetching approved events:", err);
    res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

// ---------------------------
// Like Event
// ---------------------------
router.post("/:id/like", async (req, res) => {
  try {
    const { userId } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.likes.includes(userId)) {
      event.likes.pull(userId); // unlike
    } else {
      event.likes.push(userId);
    }
    await event.save();

    res.json({ likes: event.likes.length });
  } catch (err) {
    res.status(500).json({ message: "Error liking event", error: err.message });
  }
});

// ---------------------------
// Interested Event
// ---------------------------
router.post("/:id/interested", async (req, res) => {
  try {
    const { userId } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.interested.includes(userId)) {
      event.interested.pull(userId);
    } else {
      event.interested.push(userId);
    }
    await event.save();

    res.json({ interested: event.interested.length });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating interest", error: err.message });
  }
});
// ---------------------------
// Get single event with likes & interested counts
// ---------------------------
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("club", "name logo")
      .populate("createdBy", "name email");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({
      _id: event._id,
      title: event.title,
      description: event.description,
      date: event.date,
      venue: event.venue,
      poster: event.poster,
      status: event.status,
      club: event.club,
      likes: event.likes,          // full array
      interested: event.interested // full array
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching event", error: err.message });
  }
});

// ---------------------------
// Admin: delete event
// ---------------------------
router.delete("/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



export default router;
