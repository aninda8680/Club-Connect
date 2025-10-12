import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, ImagePlus, X, Smile, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PostCard from "../components/PostCard";
import api from "@/api";

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

// ✅ Hashtag categories (used for suggestions)
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

  // 💡 For tag input & suggestions
  const [tagInput, setTagInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const token = localStorage.getItem("token");
  const currentUserEmail = localStorage.getItem("email");
  const profileColor = getProfileColor(currentUserEmail || "");

  // ✅ Flatten hashtag list
  const allHashtags = Object.values(hashtagCategories).flat();

  const handleTagInputChange = (value: string) => {
    setTagInput(value);
    setSelectedTag(value);
    if (value.trim() === "") {
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

  const fetchMyPosts = async () => {
    try {
      setLoadingPosts(true);
      const res = await api.get("/posts/my-posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts", err);
    } finally {
      setLoadingPosts(false);
    }
  };

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
      alert(err.response?.data?.msg || "Error creating post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyPosts(myPosts.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Error deleting post", err);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white py-20 px-6 flex justify-center gap-6">
      {/* LEFT SIDEBAR — HASHTAG INPUT */}
      <div className="hidden lg:block w-64 bg-gray-900 border border-gray-800 rounded-2xl p-4 h-[50vh]">
        <h3 className="text-lg font-semibold mb-4 text-blue-400">
          Hashtags
        </h3>

        {/* Tag Input Box */}
        <div className="relative">
          <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2 border border-gray-700">
            <Hash className="w-4 h-4 text-gray-500 mr-2" />
            <input
              type="text"
              value={tagInput}
              onChange={(e) => handleTagInputChange(e.target.value)}
              placeholder="Type a hashtag..."
              className="bg-transparent flex-1 outline-none text-sm text-gray-200 placeholder-gray-500"
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            />
          </div>

          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute z-10 mt-2 bg-gray-900 border border-gray-800 rounded-xl w-full max-h-48 overflow-y-auto"
              >
                {suggestions.map((sug) => (
                  <li
                    key={sug}
                    onClick={() => handleSuggestionClick(sug)}
                    className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 cursor-pointer"
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
            Selected:{" "}
            <span className="text-blue-400 font-medium">#{selectedTag}</span>
          </p>
        )}
      </div>

      {/* CENTER — CREATE + MY POSTS */}
      <div className="w-full max-w-2xl">
        {/* Tabs */}
        <div className="bg-gray-900 rounded-xl shadow-lg mb-8 p-1 flex space-x-1 border border-gray-700">
          <button
            onClick={() => setActiveTab("create")}
            className={`flex-1 py-3 px-4 rounded-lg text-center font-medium transition-all text-sm ${
              activeTab === "create"
                ? "bg-gray-800 text-white shadow-inner"
                : "text-gray-400 hover:bg-gray-800"
            }`}
          >
            Create Thread
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 py-3 px-4 rounded-lg text-center font-medium transition-all text-sm ${
              activeTab === "posts"
                ? "bg-gray-800 text-white shadow-inner"
                : "text-gray-400 hover:bg-gray-800"
            }`}
          >
            My Threads ({myPosts.length})
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "create" && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Create Thread Box */}
              <form
                onSubmit={handleSubmit}
                className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800"
              >
                <h2 className="text-xl font-bold text-white mb-6">
                  Start a new thread
                </h2>

                <div className="flex items-start space-x-4">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-r ${profileColor} flex items-center justify-center font-bold`}
                  >
                    {currentUserEmail?.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 space-y-4">
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Start a thread..."
                      className="w-full bg-transparent border-0 text-lg resize-none focus:ring-0 focus:outline-none placeholder-gray-500 min-h-[160px] text-gray-200"
                    />

                    {/* Image Preview */}
                    {imagePreview && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative rounded-xl overflow-hidden border border-gray-700 max-w-sm"
                      >
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-auto max-h-48 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleImageSelect(null)}
                          className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-1 rounded-full hover:bg-opacity-90"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <div className="flex items-center space-x-3">
                        <label className="cursor-pointer text-gray-500 hover:text-blue-400">
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
                          className="text-gray-500 hover:text-blue-400"
                        >
                          <Smile className="w-6 h-6" />
                        </button>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading || (!content.trim() && !image)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:bg-blue-500"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          "Post"
                        )}
                      </motion.button>
                    </div>

                    {selectedTag && (
                      <p className="text-sm text-gray-400">
                        Selected hashtag:{" "}
                        <span className="text-blue-400 font-medium">
                          #{selectedTag}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === "posts" && (
            <motion.div
              key="posts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-6 text-white">
                  Your Threads
                </h3>
                {loadingPosts ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  </div>
                ) : myPosts.length === 0 ? (
                  <p className="text-center text-gray-500 py-12">
                    No threads yet.
                  </p>
                ) : (
                  <div className="divide-y divide-gray-800">
                    {myPosts.map((post, index) => (
                      <motion.div
                        key={post._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="py-6"
                      >
                        <PostCard {...post} onDeletePost={handleDeletePost} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT SIDEBAR (Mirrors Left Input) */}
      <div className="hidden lg:block w-64 bg-gray-900 border border-gray-800 rounded-2xl p-4 h-[50vh]">
        <h3 className="text-lg font-semibold mb-4 text-blue-400">
          Categories
        </h3>
        <div className="text-sm text-gray-400">
          Type or choose a hashtag on the left to label your thread.
        </div>
      </div>
    </div>
  );
}
