import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Post owner
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },    // Liker or commenter
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  type: { type: String, enum: ["like", "comment"], required: true },
  message: { type: String },
  read: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);
