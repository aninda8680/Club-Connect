//models/Post.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true }, // text content
  image: { type: String }, // image URL/path
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // later for likes
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

export default mongoose.model("Post", postSchema);
