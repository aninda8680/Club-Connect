// pages/FeedPage.glass.tsx
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { Loader2, RefreshCw, Rss, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import api from "@/api";

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

export default function FeedPageGlass() {
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

      const url = tag === "all" ? "/posts" : `/posts/tag/${tag}`;

      const res = await api.get<Post[]>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts(res.data);

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

  const handleRefresh = () => fetchPosts(selectedTag, true);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allHashtagOptions = Array.from(
    new Set([...defaultHashtagOptions, ...dynamicTags])
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black/90 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 animate-spin text-cyan-300 mx-auto mb-4" />
          <p className="text-gray-300 text-lg">Weaving your threads...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/95 text-white py-30 px-4">
      {/* subtle glow backgrounds */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-20 -top-28 w-[360px] h-[360px] rounded-full bg-cyan-600/6 blur-3xl" />
        <div className="absolute right-8 bottom-12 w-[260px] h-[260px] rounded-full bg-purple-600/6 blur-2xl" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="space-y-6">
          {/* Header (glass) */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-4 rounded-2xl border border-white/6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300">
                  Threads
                </h1>
                <p className="text-sm text-gray-300 mt-1">Latest from your world</p>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-2 rounded-full bg-white/6 border border-white/6 text-cyan-300 hover:bg-white/8"
                >
                  <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Filter (glass) */}
          <div className="glass-panel flex items-center justify-between p-3 rounded-2xl border border-white/6">
            <div className="flex items-center gap-2 text-gray-300">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filter by hashtag</span>
            </div>

            <select
              value={selectedTag}
              onChange={(e) => {
                setSelectedTag(e.target.value);
                fetchPosts(e.target.value);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-transparent border border-white/8 text-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none"
            >
              {allHashtagOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "all" ? "All Posts" : `#${option}`}
                </option>
              ))}
            </select>
          </div>

          {/* Post list or empty state */}
          <AnimatePresence>
            {posts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-white/6 shadow-lg p-12 text-center glass-panel"
              >
                <Rss className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-100 mb-2">Quiet in the feed</h3>
                <p className="text-gray-300">
                  No posts found for this hashtag. Try another one or start a conversation!
                </p>
              </motion.div>
            ) : (
              <div className="divide-y divide-white/6">
                {posts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="py-5"
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
