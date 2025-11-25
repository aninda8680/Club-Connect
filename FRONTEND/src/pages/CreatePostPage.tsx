import { useState, useEffect } from "react";
import { Loader2, ImagePlus, X, Smile, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PostCard from "../components/PostCard";
import api from "@/api";
import { toast } from "react-hot-toast";

// ---------------------------------------------------
// PROFILE COLOR — GRADIENT FOR THE USER AVATAR
// ---------------------------------------------------
const getProfileColor = (username: string) => {
  const charCode = username.charCodeAt(0);
  const colors = [
    "from-red-400/80 to-pink-500/80",
    "from-blue-400/80 to-cyan-500/80",
    "from-green-400/80 to-lime-500/80",
    "from-yellow-400/80 to-orange-500/80",
    "from-purple-400/80 to-indigo-500/80",
  ];
  return colors[charCode % colors.length];
};

// ---------------------------------------------------
// HASHTAG categories (flattened for suggestions)
// ---------------------------------------------------
const hashtagCategories = {
  "🚀 Projects": ["project", "project-idea", "update", "prototype", "open-source"],
  "💬 Discussion": ["question", "discussion", "help"],
  "🎯 Collaboration": ["collaboration", "team-up"],
  "🏆 Showcase": ["achievement", "milestone", "success"],
  "📅 Events": ["event", "announcement", "workshop", "competition", "recruitment"],
  "📚 Learning": ["learning", "tips", "resources", "tutorial", "study-group"],
  "🌍 General": ["general", "fun", "random"],
};

export default function CreatePostPage() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [activeTab, setActiveTab] = useState("create");
  const [selectedTag, setSelectedTag] = useState("");

  // hashtag suggestions
  const [tagInput, setTagInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const token = localStorage.getItem("token");
  const currentUserEmail = localStorage.getItem("email");
  const profileColor = getProfileColor(currentUserEmail || "");

  const allHashtags = Object.values(hashtagCategories).flat();

  // ---------------------------------------------------
  // HASHTAG INPUT HANDLING
  // ---------------------------------------------------
  const handleTagInputChange = (value: string) => {
    setTagInput(value);
    setSelectedTag(value);

    if (!value.trim()) {
      setShowSuggestions(false);
      setSuggestions([]);
      return;
    }

    const filtered = allHashtags.filter((tag) =>
      tag.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (tag: string) => {
    setTagInput(tag);
    setSelectedTag(tag);
    setShowSuggestions(false);
  };

  // ---------------------------------------------------
  // IMAGE handling
  // ---------------------------------------------------
  const handleImageSelect = (file: File | null) => {
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // ---------------------------------------------------
  // FETCH POSTS
  // ---------------------------------------------------
  const fetchMyPosts = async () => {
    try {
      setLoadingPosts(true);
      const res = await api.get("/posts/my-posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyPosts(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "❌ Error fetching posts");
    } finally {
      setLoadingPosts(false);
    }
  };

  // ---------------------------------------------------
  // SUBMIT THREAD
  // ---------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (image) formData.append("image", image);
      if (selectedTag) formData.append("tag", selectedTag);

      await api.post("/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setContent("");
      setImage(null);
      setImagePreview(null);
      setSelectedTag("");
      setTagInput("");

      await fetchMyPosts();
      setActiveTab("posts");
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Error creating post");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------
  // DELETE POST
  // ---------------------------------------------------
  const handleDeletePost = async (postId: string) => {
    try {
      await api.delete(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyPosts(myPosts.filter((p) => p._id !== postId));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error deleting post");
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  return (
    <div className="min-h-screen bg-black/95 text-white py-40 px-6 flex justify-center gap-10 relative">

      {/* LIGHT GLASS GLOW EFFECT */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-20 w-[380px] h-[380px] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-[260px] h-[260px] rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      {/* ------------------------------ LEFT SIDEBAR ------------------------------ */}
      <div className="hidden lg:block w-64 glass-panel backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl rounded-2xl p-5 h-[52vh]">
        <h3 className="text-lg font-semibold mb-4 text-cyan-300">Hashtags</h3>

        {/* TAG INPUT */}
        <div className="relative">
          <div className="flex items-center bg-white/5 rounded-xl px-3 py-2 border border-white/10 backdrop-blur-md">
            <Hash className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              value={tagInput}
              onChange={(e) => handleTagInputChange(e.target.value)}
              placeholder="Search tags..."
              className="bg-transparent flex-1 outline-none text-sm text-gray-200"
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
            />
          </div>

          {/* SUGGESTIONS DROPDOWN */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute mt-2 w-full bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl max-h-48 overflow-y-auto z-20"
              >
                {suggestions.map((sug) => (
                  <li
                    key={sug}
                    onClick={() => handleSuggestionClick(sug)}
                    className="px-4 py-2 text-sm text-gray-200 hover:bg-white/10 cursor-pointer transition"
                  >
                    #{sug}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {selectedTag && (
          <p className="text-xs text-gray-400 mt-4">
            Selected: <span className="text-cyan-300 font-semibold">#{selectedTag}</span>
          </p>
        )}
      </div>

      {/* ------------------------------ CENTER PANEL ------------------------------ */}
      <div className="w-full max-w-2xl">

        {/* TABS */}
        <div className="glass-panel bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-lg p-1 flex space-x-1 mb-10">
          <button
            onClick={() => setActiveTab("create")}
            className={`flex-1 py-3 rounded-xl text-center text-sm font-semibold transition ${
              activeTab === "create"
                ? "bg-white/20 text-white shadow-lg border border-white/10"
                : "text-gray-300 hover:bg-white/10"
            }`}
          >
            Create Thread
          </button>

          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 py-3 rounded-xl text-center text-sm font-semibold transition ${
              activeTab === "posts"
                ? "bg-white/20 text-white shadow-lg border border-white/10"
                : "text-gray-300 hover:bg-white/10"
            }`}
          >
            My Threads ({myPosts.length})
          </button>
        </div>

        {/* ---------------------- CREATE THREAD ---------------------- */}
        <AnimatePresence mode="wait">
          {activeTab === "create" && (
            <motion.div
              key="create-tab"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.35 }}
              className="glass-panel bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-white">Start a new thread</h2>

              <div className="flex items-start gap-4">
                {/* PROFILE AVATAR */}
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${profileColor} flex items-center justify-center text-lg font-bold shadow-lg`}
                >
                  {currentUserEmail?.charAt(0).toUpperCase()}
                </div>

                {/* TEXT + IMAGE */}
                <div className="flex-1 space-y-5">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full bg-transparent text-lg min-h-[150px] outline-none text-gray-200 placeholder-gray-400 resize-none"
                  />

                  {/* PREVIEW */}
                  {imagePreview && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative max-w-sm rounded-xl overflow-hidden border border-white/10 shadow-xl"
                    >
                      <img src={imagePreview} className="w-full h-auto object-cover" />
                      <button
                        type="button"
                        onClick={() => handleImageSelect(null)}
                        className="absolute top-2 right-2 bg-black/60 backdrop-blur-md p-1 rounded-full"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </motion.div>
                  )}

                  {/* ACTION BAR */}
                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    {/* LEFT ICONS */}
                    <div className="flex items-center gap-4 text-gray-400">
                      <label className="cursor-pointer hover:text-cyan-300 transition">
                        <ImagePlus className="w-6 h-6" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageSelect(e.target.files?.[0] || null)
                          }
                        />
                      </label>

                      <button
                        type="button"
                        className="hover:text-cyan-300 transition"
                      >
                        <Smile className="w-6 h-6" />
                      </button>
                    </div>

                    {/* POST BUTTON */}
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={isLoading || (!content.trim() && !image)}
                      className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleSubmit}
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "Post"
                      )}
                    </motion.button>
                  </div>

                  {selectedTag && (
                    <p className="text-sm text-gray-300">
                      Hashtag:{" "}
                      <span className="text-cyan-300 font-semibold">#{selectedTag}</span>
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ---------------------- MY POSTS ---------------------- */}
          {activeTab === "posts" && (
            <motion.div
              key="posts-tab"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.35 }}
              className="glass-panel bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-8">
                Your Threads
              </h3>

              {loadingPosts ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-cyan-300" />
                </div>
              ) : myPosts.length === 0 ? (
                <p className="text-center text-gray-400 py-14">
                  You haven't posted anything yet.
                </p>
              ) : (
                <div className="space-y-6">
                  {myPosts.map((post, index) => (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <PostCard {...post} onDeletePost={handleDeletePost} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ------------------------------ RIGHT SIDEBAR ------------------------------ */}
      <div className="hidden lg:block w-64 glass-panel backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl rounded-2xl p-5 h-[52vh]">
        <h3 className="text-lg font-semibold mb-4 text-cyan-300">
          Categories
        </h3>
        <p className="text-sm text-gray-300">
          Select or type a hashtag to label your thread.
        </p>
      </div>
    </div>
  );
}
