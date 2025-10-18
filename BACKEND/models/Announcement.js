// models/Announcement.js
import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  clubId: { type: String, required: true }, // club-specific
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Announcement", announcementSchema);
