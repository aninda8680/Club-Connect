// backend/models/JoinRequest.js
import mongoose from "mongoose";

const joinRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  club: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("JoinRequest", joinRequestSchema);

