// pages/FeedPage.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";
import { Loader2, RefreshCw, Rss } from "lucide-react"; // Changed Users/TrendingUp
import { motion, AnimatePresence } from "framer-motion";

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
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchPosts(true);
  };
  
  // Handler for when a post is deleted from a PostCard
  const handlePostDeleted = (postId: string) => {
    setPosts(prevPosts => prevPosts.filter(p => p._id !== postId));
  };


  useEffect(() => {
    fetchPosts();
  }, []);

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
      <div className="max-w-2xl mx-auto"> {/* Max width for single column */}
        <div className="flex flex-col gap-6"> 
          {/* Feed Header - Minimalist */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 mb-4"
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
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>
            <p className="text-gray-500 text-sm mt-1">Latest from your world</p>
          </motion.div>

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
                  It looks like nobody has posted yet. Time to start a conversation!
                </p>
              </motion.div>
            ) : (
              <div className="divide-y divide-gray-800"> {/* Threads-like divider */}
                {posts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="py-6"
                  >
                    <PostCard {...post} onDeletePost={handlePostDeleted} />
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