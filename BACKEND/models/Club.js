// backend/models/Club.js
import mongoose from "mongoose";

const clubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    coordinator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // links to User model
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const Club = mongoose.model("Club", clubSchema);
export default Club;
