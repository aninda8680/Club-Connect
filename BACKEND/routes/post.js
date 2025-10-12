import express from "express";
import Post from "../models/Post.js";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Create a post
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { content, tag } = req.body;
    if (!content) return res.status(400).json({ msg: "Content is required" });

    // Extract hashtags from content using regox
    const extractedTags = content.match(/#\w+/g)?.map(t => t.substring(1).toLowerCase()) || [];
    
    // ✅ Merge manual tag (from dropdown)
    const finalTags = tag 
    ? [...new Set([...extractedTags, tag.toLowerCase()])] 
    : extractedTags;

    const newPost = new Post({
      user: req.userId,
      content,
      image: req.file ? `/postuploads/${req.file.filename}` : null, // ✅ updated path
      tags: finalTags,
    });

    await newPost.save();
    res.json({ msg: "Post created successfully", post: newPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get posts by hashtag
router.get("/tag/:tag", verifyToken, async (req, res) => {
  try {
    const tag = req.params.tag.toLowerCase();
    const posts = await Post.find({ tags: tag })
      .populate("user", "username email")
      .populate("comments.user", "username email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});



// Get posts
router.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username email")
      .populate("comments.user", "username email") // ✅ Add this
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


// Toggle like
router.put("/:id/like", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const alreadyLiked = post.likes.includes(req.userId);

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter((id) => id.toString() !== req.userId);
    } else {
      // Like
      post.likes.push(req.userId);
    }

    await post.save();
    res.json({ msg: "Post updated", likes: post.likes.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Add comment
router.post("/:id/comment", verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: "Comment text is required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const newComment = {
      user: req.userId,
      text,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    // Populate user info in response
    const populatedPost = await post.populate("comments.user", "username email");

    res.json({
      msg: "Comment added",
      comments: populatedPost.comments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get posts by logged-in user
router.get("/my-posts", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId })
      .populate("user", "username email")
      .populate("comments.user", "username email") // ✅ Add this
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


// Delete post
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    // Ensure only owner can delete
    if (post.user.toString() !== req.userId) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    await post.deleteOne();
    res.json({ msg: "Post deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete a comment (allowed for post owner or comment owner)
router.delete("/:postId/comment/:commentId", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    // Only post owner or comment owner can delete
    if (
      comment.user.toString() !== req.userId &&
      post.user.toString() !== req.userId
    ) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    comment.deleteOne();
    await post.save();

    const populatedPost = await post.populate("comments.user", "username email");
    res.json({ msg: "Comment deleted", comments: populatedPost.comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


export default router;
