// components/PostCard.tsx
import React, { useState } from "react";
import { Heart, MessageSquare, Repeat2, Send, Trash2, MoreHorizontal } from "lucide-react"; // Changed ThumbsUp to Heart
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

interface Comment {
  _id?: string;
  text: string;
  createdAt: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
}

interface PostCardProps {
  _id: string;
  content: string;
  image?: string | null;
  createdAt: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
  likes?: string[];
  comments?: Comment[];
  // New prop to trigger a re-fetch in the parent component (FeedPage) after deletion
  onDeletePost?: (postId: string) => void; 
}

// Helper to get a profile color based on the username's first letter
const getProfileColor = (username: string) => {
  const charCode = username.charCodeAt(0);
  const colors = [
    "from-red-400 to-pink-500",
    "from-blue-400 to-cyan-500",
    "from-green-400 to-lime-500",
    "from-yellow-400 to-orange-500",
    "from-purple-400 to-indigo-500",
  ];
  return colors[charCode % colors.length];
};

const PostCard: React.FC<PostCardProps> = ({
  _id,
  content,
  image,
  createdAt,
  user,
  likes = [],
  comments = [],
  onDeletePost, // Destructure new prop
}) => {
  const [likeCount, setLikeCount] = useState(likes.length);
  const [liked, setLiked] = useState(
    likes.includes(localStorage.getItem("userId") || "")
  );
  const [loadingLike, setLoadingLike] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentList, setCommentList] = useState<Comment[]>(comments);
  const [newComment, setNewComment] = useState("");
  const [loadingComment, setLoadingComment] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const currentUserId = localStorage.getItem("userId");
  const profileColor = getProfileColor(user.username);
  const currentUserEmail = localStorage.getItem("email");
  const isPostOwner = user._id === currentUserId;


  // Like handler with animation
  const handleLike = async () => {
    try {
      setLoadingLike(true);
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/posts/${_id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLikeCount(res.data.likes);
      setLiked(!liked);
    } catch (err) {
      console.error("Error liking post", err);
    } finally {
      setLoadingLike(false);
    }
  };

  // Add comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setLoadingComment(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/posts/${_id}/comment`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Comment adding is successful, update local state with populated data
      setCommentList(res.data.comments);
      setNewComment("");
      // Ensure comments section is visible
      setShowComments(true); 
    } catch (err) {
      console.error("Error adding comment", err);
    } finally {
      setLoadingComment(false);
    }
  };
  
  // Delete post (only for post owner)
  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/posts/${_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Call parent handler to remove post from feed/list
      if (onDeletePost) {
        onDeletePost(_id);
      }
    } catch (err) {
      console.error("Error deleting post", err);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `http://localhost:5000/api/posts/${_id}/comment/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCommentList(res.data.comments);
    } catch (err) {
      console.error("Error deleting comment", err);
    }
  };


  // Threads-style relative time
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInDays < 7) return `${diffInDays}d`;
    
    return past.toLocaleDateString();
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gray-950 p-4 w-full text-white" // Removed white background
    >
      <div className="flex relative">
        {/* Left Column: Avatar and Vertical Line */}
        <div className="flex flex-col items-center flex-shrink-0 mr-3">
          {/* User Avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`w-10 h-10 rounded-full bg-gradient-to-r ${profileColor} text-white flex items-center justify-center font-bold text-sm shadow-md cursor-pointer`}
          >
            {user.username.charAt(0).toUpperCase()}
          </motion.div>
          {/* Vertical Connector Line */}
          {(commentList.length > 0 || image) && (
            <div className="w-0.5 bg-gray-700 flex-grow mt-1 mb-1"></div>
          )}
          {/* Comment Avatars Preview */}
          {commentList.length > 0 && (
            <div className="flex -space-x-1">
              {commentList.slice(0, 2).map((c, index) => (
                <div 
                  key={index}
                  className={`w-4 h-4 rounded-full border-2 border-gray-950 text-xs flex items-center justify-center ${getProfileColor(c.user.username)}`}
                >
                  {c.user.username.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Content and Actions */}
        <div className="flex-1 min-w-0">
          {/* User Info & Options */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-100 truncate">
              {user.username}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <p className="text-xs">
                {formatTimeAgo(createdAt)}
              </p>
               {/* More/Delete Options */}
              <div className="relative">
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="p-1 rounded-full hover:bg-gray-800 transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                </button>
                
                <AnimatePresence>
                  {showOptions && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 top-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-10 min-w-[120px]"
                    >
                      {isPostOwner && (
                        <button 
                          onClick={handleDeletePost} 
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 text-red-400 flex items-center space-x-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete Post</span>
                        </button>
                      )}
                      {!isPostOwner && (
                        <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 text-gray-300 flex items-center space-x-2">
                          <Trash2 className="w-4 h-4" />
                          <span>Report</span>
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Post Content and Image */}
          <p className="text-gray-300 mb-3 leading-relaxed break-words">{content}</p>

          {image && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl overflow-hidden mb-4 border border-gray-700"
            >
              <img
                src={`http://localhost:5000${image}`}
                alt="Post"
                className="w-full h-auto max-h-96 object-cover cursor-pointer"
              />
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-5 text-gray-400 mb-3">
            {/* Like */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              disabled={loadingLike}
              className={`flex items-center transition-colors ${
                liked 
                  ? "text-red-500" 
                  : "hover:text-red-400"
              }`}
            >
              <Heart className="w-5 h-5" fill={liked ? "currentColor" : "none"} />
            </motion.button>

            {/* Comment */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowComments(!showComments)}
              className="hover:text-blue-400 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
            </motion.button>

            {/* Repost (Placeholder) */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="hover:text-green-400 transition-colors"
            >
              <Repeat2 className="w-5 h-5" />
            </motion.button>
            
            {/* Share (Placeholder) */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="hover:text-purple-400 transition-colors"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
          
          {/* Stats/Replies Preview */}
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            {commentList.length > 0 && (
              <span 
                className="hover:underline cursor-pointer" 
                onClick={() => setShowComments(true)}
              >
                {commentList.length} replies
              </span>
            )}
            {likeCount > 0 && <span>•</span>}
            {likeCount > 0 && <span className="hover:underline cursor-pointer">{likeCount} likes</span>}
          </div>

          {/* Comments Section */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-4 overflow-hidden"
              >
                {/* Comment input */}
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getProfileColor(currentUserEmail || "")} text-white flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                    {currentUserEmail?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 flex items-center space-x-2 bg-gray-800 rounded-full px-4 py-2 border border-gray-700">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Reply to this thread..."
                      className="flex-1 bg-transparent border-none outline-none text-sm text-gray-200 placeholder-gray-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddComment}
                      disabled={loadingComment || !newComment.trim()}
                      className={`p-1 rounded-full transition-colors ${
                        newComment.trim() 
                          ? "text-blue-500 hover:text-blue-400" 
                          : "text-gray-600"
                      }`}
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* List of comments */}
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  {commentList.map((c, index) => (
                    <motion.div
                      key={c._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start space-x-3 group"
                    >
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getProfileColor(c.user.username)} text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1`}>
                        {c.user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 bg-gray-900 px-4 py-3 rounded-xl border border-gray-800 relative">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-gray-100">
                            {c.user.username}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatTimeAgo(c.createdAt)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-300 break-words">{c.text}</p>

                        {/* Delete button */}
                        {(c.user._id === currentUserId || user._id === currentUserId) && (
                          <motion.button
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            onClick={() => handleDeleteComment(c._id!)}
                            className="absolute -top-2 -right-2 bg-gray-950 rounded-full p-1 shadow-lg text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity border border-gray-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;