//routes/joinRequests.js
import express from "express";
import JoinRequest from "../models/JoinRequest.js";
import User from "../models/User.js";

const router = express.Router();

// Send join request
router.post("/request", async (req, res) => {
  try {
    const { userId, clubId } = req.body;

    // prevent duplicate pending request
    const existing = await JoinRequest.findOne({ user: userId, club: clubId, status: "pending" });
    if (existing) return res.status(400).json({ message: "Request already sent" });

    const newReq = new JoinRequest({ user: userId, club: clubId });
    await newReq.save();

    res.json(newReq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all pending requests for a club (coordinator only)
router.get("/club/:clubId", async (req, res) => {
  try {
    const { clubId } = req.params;
    const requests = await JoinRequest.find({ club: clubId, status: "pending" }).populate("user");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Accept / Reject request
router.put("/:requestId", async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action } = req.body; // "accept" or "reject"

    const request = await JoinRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (action === "accept") {
      request.status = "accepted";
      await request.save();

      await User.findByIdAndUpdate(request.user, {
        role: "member",
        club: request.club
      });
    } else {
      request.status = "rejected";
      await request.save();
    }

    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
