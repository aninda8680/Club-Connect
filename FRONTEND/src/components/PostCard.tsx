// components/PostCard.glass.tsx
import React, { useState } from "react";
import {
  Heart,
  MessageSquare,
  Repeat2,
  Send,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import api from "@/api";
import { getBaseUrl } from "@/utils/getBaseUrl";
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
  tag?: string;
  onDeletePost?: (postId: string) => void;
  onTagClick?: (tag: string) => void;
}

// Helper to get gradient color
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
  tag,
  onDeletePost,
  onTagClick,
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
  const currentUserEmail = localStorage.getItem("email");
  const profileColor = getProfileColor(user.username);
  const isPostOwner = user._id === currentUserId;

  const hashtags = [
    ...(tag ? [tag] : []),
    ...Array.from(new Set((content.match(/#\w+/g) || []).map((t) => t.slice(1)))),
  ];

  const handleLike = async () => {
    try {
      setLoadingLike(true);
      const token = localStorage.getItem("token");
      const res = await api.put(
        `/posts/${_id}/like`,
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

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      setLoadingComment(true);
      const token = localStorage.getItem("token");
      const res = await api.post(
        `/posts/${_id}/comment`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentList(res.data.comments);
      setNewComment("");
      setShowComments(true);
    } catch (err) {
      console.error("Error adding comment", err);
    } finally {
      setLoadingComment(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/posts/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (onDeletePost) onDeletePost(_id);
    } catch (err) {
      console.error("Error deleting post", err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.delete(
        `/posts/${_id}/comment/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentList(res.data.comments);
    } catch (err) {
      console.error("Error deleting comment", err);
    }
  };

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
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
      className="glass-panel p-4 rounded-2xl border border-white/6 shadow-sm"
    >
      <div className="flex gap-4">
        {/* avatar */}
        <div className="flex-shrink-0">
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-r ${profileColor} flex items-center justify-center text-white font-semibold shadow-md`}
            title={user.username}
          >
            {user.username.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-white truncate">{user.username}</h3>
              <p className="text-xs text-gray-300">{formatTimeAgo(createdAt)}</p>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="p-1 rounded-full hover:bg-white/6 text-gray-300"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {showOptions && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="absolute right-0 top-8 bg-black/70 glass-panel p-2 rounded-lg border border-white/6 z-20 min-w-[140px]"
                  >
                    {isPostOwner ? (
                      <button
                        onClick={handleDeletePost}
                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-white/4 rounded"
                      >
                        <div className="flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</div>
                      </button>
                    ) : (
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-white/4 rounded">
                        <div className="flex items-center gap-2"><Trash2 className="w-4 h-4" /> Report</div>
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="text-gray-200 mb-3 leading-relaxed break-words">
            {content.split(/(\#[a-zA-Z0-9_]+)/g).map((part, i) =>
              part.startsWith("#") ? (
                <span
                  key={i}
                  onClick={() => onTagClick?.(part.slice(1))}
                  className="text-cyan-300 font-medium cursor-pointer hover:underline"
                >
                  {part}
                </span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </div>

          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {hashtags.map((t) => (
                <motion.span
                  key={t}
                  whileHover={{ scale: 1.03 }}
                  className="text-sm text-cyan-300 cursor-pointer hover:underline"
                  onClick={() => onTagClick?.(t)}
                >
                  #{t}
                </motion.span>
              ))}
            </div>
          )}

          {image && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl overflow-hidden mb-3 border border-white/6"
            >
              <img
                src={`${getBaseUrl()}${image}`}
                alt="Post"
                className="w-full h-auto max-h-[520px] object-cover"
              />
            </motion.div>
          )}

          {/* actions */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4 text-gray-300">
              <button
                onClick={handleLike}
                disabled={loadingLike}
                className={`flex items-center gap-2 hover:text-red-400 transition-colors ${liked ? "text-red-400" : ""}`}
              >
                <Heart className="w-5 h-5" />
                <span className="text-sm">{likeCount > 0 ? likeCount : ""}</span>
              </button>

              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-2 hover:text-cyan-300 transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="text-sm">{commentList.length > 0 ? commentList.length : ""}</span>
              </button>

              <button className="hover:text-green-300">
                <Repeat2 className="w-5 h-5" />
              </button>

              <button className="hover:text-purple-300">
                <Send className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-gray-400">
              {likeCount > 0 && <span>{likeCount} likes</span>}
            </div>
          </div>

          {/* comments */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-r ${getProfileColor(
                      currentUserEmail || ""
                    )} text-white flex items-center justify-center text-xs font-bold`}
                  >
                    {currentUserEmail?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 flex items-center gap-2 bg-black/60 glass-panel rounded-full px-3 py-2 border border-white/6">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Reply to this thread..."
                      className="flex-1 bg-transparent border-none outline-none text-sm text-gray-200 placeholder-gray-400"
                      onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={loadingComment || !newComment.trim()}
                      className={`p-2 rounded-full ${newComment.trim() ? "text-cyan-300" : "text-gray-500"}`}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {commentList.map((c, idx) => (
                    <motion.div
                      key={c._id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="flex items-start gap-3"
                    >
                      <div
                        className={`w-8 h-8 rounded-full bg-gradient-to-r ${getProfileColor(
                          c.user.username
                        )} text-white flex items-center justify-center text-xs font-bold mt-1`}
                      >
                        {c.user.username.charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-1 bg-black/60 glass-panel rounded-xl px-3 py-2 border border-white/6 relative">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-white">{c.user.username}</p>
                          <p className="text-xs text-gray-300">{formatTimeAgo(c.createdAt)}</p>
                        </div>
                        <p className="text-sm text-gray-200">{c.text}</p>

                        {(c.user._id === currentUserId || user._id === currentUserId) && (
                          <button
                            onClick={() => handleDeleteComment(c._id!)}
                            className="absolute -top-2 -right-2 bg-black/70 p-1 rounded-full text-red-400 hover:text-red-300 border border-white/6"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
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
    </motion.article>
  );
};

export default PostCard;
