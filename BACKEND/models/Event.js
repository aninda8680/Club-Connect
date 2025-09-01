// models/Event.js
import mongoose from "mongoose";
const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  venue: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
}, { timestamps: true });

export default mongoose.model("Event", EventSchema);
