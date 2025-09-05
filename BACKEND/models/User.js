//models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dob: { type: Date },
  gender: { type: String },
  stream: { type: String },
  phone: { type: String },
  course: { type: String },
  isProfileComplete: { type: Boolean, default: false },
  role: { type: String, default: "visitor" },  // 👈 always starts as visitor
}, { timestamps: true });

export default mongoose.model("User", userSchema);
