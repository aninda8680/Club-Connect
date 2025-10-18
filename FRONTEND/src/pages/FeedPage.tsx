// pages/FeedPage.tsx
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { Loader2, RefreshCw, Rss, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import api from "@/api";
import Loader from "@/components/Loader";

interface User {
  _id: string;
  username: string;
  email: string;
}

interface Post {
  _id: string;
  content: string;
  image?: string | null;
  createdAt: string;
  user: User;
  likes?: string[];
  comments?: any[];
  tags?: string[];
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTag, setSelectedTag] = useState("all");
  const [dynamicTags, setDynamicTags] = useState<string[]>([]);

  const token = localStorage.getItem("token");

  const defaultHashtagOptions = [
    "all",
    "project",
    "project-idea",
    "update",
    "prototype",
    "open-source",
    "question",
    "discussion",
    "help",
    "collaboration",
    "team-up",
    "achievement",
    "milestone",
    "success",
    "event",
    "announcement",
    "workshop",
    "competition",
    "recruitment",
    "learning",
    "tips",
    "resources",
    "tutorial",
    "study-group",
    "general",
    "fun",
    "random",
  ];

  const fetchPosts = async (tag: string = "all", showRefresh = false) => {
  try {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    const url =
      tag === "all"
        ? "/posts"
        : `/posts/tag/${tag}`;

    const res = await api.get<Post[]>(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setPosts(res.data);

    // ✅ Collect unique hashtags safely
    const allTags: string[] = res.data
      .flatMap((post) => post.tags || [])
      .filter((t): t is string => typeof t === "string");

    const uniqueTags = Array.from(new Set(allTags));
    setDynamicTags(uniqueTags);
  } catch (err) {
    console.error("Error fetching posts", err);
    toast.error("Failed to fetch posts");
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  const handleRefresh = () => {
    fetchPosts(selectedTag, true);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    fetchPosts(tag);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePostDeleted = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const allHashtagOptions = Array.from(
    new Set([...defaultHashtagOptions, ...dynamicTags])
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Weaving your threads...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white py-16 px-1">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col gap-6">
          {/* Feed Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 mb-2"
          >
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-extrabold text-white">Threads</h1>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 text-blue-400 p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <RefreshCw
                  className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
                />
              </motion.button>
            </div>
            <p className="text-gray-500 text-sm mt-1">Latest from your world</p>
          </motion.div>

          {/* Hashtag Filter Dropdown */}
          <div className="flex items-center justify-between bg-gray-900 px-4 py-3 rounded-xl border border-gray-800">
            <div className="flex items-center gap-2 text-gray-400">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filter by hashtag:</span>
            </div>
            <select
              value={selectedTag}
              onChange={(e) => {
                setSelectedTag(e.target.value);
                fetchPosts(e.target.value);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {allHashtagOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "all" ? "All Posts" : `#${option}`}
                </option>
              ))}
            </select>
          </div>

          {/* Posts */}
          <AnimatePresence>
            {posts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-gray-800 shadow-lg p-12 text-center mt-8 bg-gray-900"
              >
                <Rss className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-200 mb-2">
                  Quiet in the feed
                </h3>
                <p className="text-gray-500 mb-6">
                  No posts found for this hashtag. Try another one or start a
                  conversation!
                </p>
              </motion.div>
            ) : (
              <div className="divide-y divide-gray-800">
                {posts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="py-6"
                  >
                    <PostCard
                      {...post}
                      onDeletePost={handlePostDeleted}
                      onTagClick={handleTagClick}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
