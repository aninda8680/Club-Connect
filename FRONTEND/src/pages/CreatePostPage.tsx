// pages/CreatePostPage.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, ImagePlus, X, Smile, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PostCard from "../components/PostCard"; // Use the updated PostCard for consistency

// Helper to get a profile color
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

export default function CreatePostPage() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [activeTab, setActiveTab] = useState("create");

  const token = localStorage.getItem("token");
  const currentUserEmail = localStorage.getItem("email");
  const profileColor = getProfileColor(currentUserEmail || "");


  // Handle image selection
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

  // Fetch user's posts
  const fetchMyPosts = async () => {
    try {
      setLoadingPosts(true);
      const res = await axios.get("http://localhost:5000/api/posts/my-posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts", err);
    } finally {
      setLoadingPosts(false);
    }
  };

  // Handle new post submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (image) formData.append("image", image);

      await axios.post("http://localhost:5000/api/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setContent("");
      setImage(null);
      setImagePreview(null);
      await fetchMyPosts();
      setActiveTab("posts");
    } catch (err: any) {
      alert(err.response?.data?.msg || "Error creating post");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete post - Passed to PostCard
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
    <div className="min-h-screen bg-gray-950 text-white py-16 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header Tabs - Updated for Dark Mode */}
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
              {/* Create Post Form - Threads Style */}
              <form
                onSubmit={handleSubmit}
                className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800"
              >
                <h2 className="text-xl font-bold text-white mb-6">
                  Start a new thread
                </h2>

                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${profileColor} text-white flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                    {currentUserEmail?.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Start a thread..."
                      className="w-full bg-transparent border-0 text-lg resize-none focus:ring-0 focus:outline-none placeholder-gray-500 min-h-[80px] text-gray-200"
                      rows={3}
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
                          className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-1 rounded-full hover:bg-opacity-90 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <div className="flex items-center space-x-3">
                        <label className="cursor-pointer text-gray-500 hover:text-blue-400 transition-colors">
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
                          className="text-gray-500 hover:text-blue-400 transition-colors"
                        >
                          <Smile className="w-6 h-6" />
                        </button>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading || (!content.trim() && !image)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:bg-blue-500 transition-colors"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          "Post"
                        )}
                      </motion.button>
                    </div>
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
              {/* My Posts Section - Using PostCard */}
              <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-6">
                  Your Threads
                </h3>

                {loadingPosts ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  </div>
                ) : myPosts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 text-gray-500"
                  >
                    <p className="text-lg mb-2">No threads yet</p>
                    <p className="text-sm">Post a new thread to see it here!</p>
                  </motion.div>
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
                        {/* Note: In a production app, you might create a simpler "MyPostCard" 
                            for the profile view to save on overhead, but PostCard works fine. */}
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
    </div>
  );
}