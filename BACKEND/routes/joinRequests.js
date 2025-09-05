// backend/routes/joinRequests.js
import express from "express";
import JoinRequest from "../models/JoinRequest.js";
import User from "../models/User.js";

const router = express.Router();

// Send join request
router.post("/:clubId", async (req, res) => {
  try {
    const { userId } = req.body; // frontend sends logged-in userId
    const { clubId } = req.params;

    // prevent duplicate request
    const existing = await JoinRequest.findOne({
      club: clubId,
      user: userId,
      status: "pending",
    });
    if (existing)
      return res.status(400).json({ message: "Request already sent" });

    const request = await JoinRequest.create({ club: clubId, user: userId });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all requests for a club (coordinator only)
router.get("/club/:clubId", async (req, res) => {
  try {
    const { clubId } = req.params;
    console.log("Fetching requests for club:", clubId);

    const requests = await JoinRequest.find({ club: clubId, status: "pending" })
      .populate("user", "username email");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Accept/Reject request
router.put("/decision/:requestId", async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body; // "accepted" | "rejected"

    const request = await JoinRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (status === "accepted") {
      request.status = "accepted";
      await request.save();

      // update user role to "member"
      await User.findByIdAndUpdate(request.user, { role: "member" });
    } else if (status === "rejected") {
      request.status = "rejected";
      await request.save();
    }

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
