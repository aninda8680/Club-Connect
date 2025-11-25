// components/ClubCard.tsx
import { useState, useEffect } from "react";
import { Users, UserPlus, Loader2, Check, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "@/api";

interface ClubCardProps {
  _id: string;
  name: string;
  description: string;
  category?: string;
  coordinator?: {
    _id: string;
    username: string;
    email: string;
  };
  members?: string[];
  joinRequests?: string[];
  
  // UI Control Props
  showJoinButton?: boolean;      // Show/hide join button (default: true)
  isAuthenticated?: boolean;     // Is user logged in? (default: check localStorage)
  alreadyJoined?: boolean;       // Has user already joined/requested? (default: false)
  onJoinSuccess?: () => void;    // Callback after successful join request
}

export default function ClubCard({
  _id,
  name,
  description,
  category,
  coordinator,
  members = [],
  joinRequests = [],
  showJoinButton = true,
  isAuthenticated,
  alreadyJoined = false,
  onJoinSuccess,
}: ClubCardProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [memberCount, setMemberCount] = useState(members.length);
  const [requestCount, setRequestCount] = useState(joinRequests.length);
  const [hasJoined, setHasJoined] = useState(alreadyJoined);

  // Check if user is authenticated (if not provided as prop)
  const userIsAuthenticated = isAuthenticated ?? !!(localStorage.getItem("token") && localStorage.getItem("userId"));

  // 🔹 Fetch live member + request counts from backend
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await api.get(`/clubs/${_id}/counts`);
        const data = res.data;
        if (data.success) {
          setMemberCount(data.counts.members);
          setRequestCount(data.requestCount || requestCount);
        } else {
          console.warn("Failed to fetch counts:", data.message);
        }
      } catch (err) {
        console.error("Error fetching counts:", err);
      }
    };
    fetchCounts();
  }, [_id]);

  // 🔹 Handle Join Request
  const handleJoin = async () => {
    // If not authenticated, redirect to auth page
    if (!userIsAuthenticated) {
      navigate("/auth");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setMessage("⚠️ Please login first");
      navigate("/auth");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/join/request", { userId, clubId: _id });
      const data = res.data;

      if (data.success) {
        setRequestCount((prev) => prev + 1);
        setHasJoined(true);
        setMessage(data.message || "Request sent!");
        
        // Call the success callback if provided
        if (onJoinSuccess) {
          onJoinSuccess();
        }
      } else {
        setMessage(data.message || "Request failed");
      }
    } catch (err: any) {
      console.error("Join request error:", err);
      setMessage(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group relative">
      {/* Outer Gradient Border */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>

      <div className="relative bg-gray-900 rounded-2xl p-6 border border-gray-800 group-hover:border-blue-500/50 transition-all duration-500 backdrop-blur-sm overflow-hidden">
        {/* Soft Background Shape */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full"></div>

        {/* Club Header */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {name.charAt(0)}
              </div>

              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full border border-gray-700">
                    #{category || "Tech Society"}
                  </span>
                </div>
              </div>
            </div>

            {/* Member Count */}
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Users size={14} />
                <span className="font-semibold text-white">
                  {memberCount}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">members</div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-300 leading-relaxed mb-6 line-clamp-3 group-hover:text-gray-200 transition-colors">
            {description ||
              "Join this amazing community and be part of something special!"}
          </p>

          {/* Coordinator & Pending Requests */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
                {coordinator?.username?.charAt(0) || "C"}
              </div>

              <div>
                <div className="text-xs text-gray-400">Coordinator</div>
                <div className="text-sm font-semibold text-white">
                  {coordinator?.username || "Unknown"}
                </div>
              </div>
            </div>

            {requestCount > 0 && (
              <motion.div
                className="flex items-center gap-2 px-3 py-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-yellow-400">
                  {requestCount} pending
                </span>
              </motion.div>
            )}
          </div>

          {/* Join Button */}
          {showJoinButton && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                handleJoin();
              }}
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group ${
                hasJoined
                  ? "bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white shadow-lg hover:shadow-blue-500/25"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading || hasJoined}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition duration-1000"></div>

              {loading ? (
                <>
                  <Loader2 className="relative z-10 animate-spin" size={18} />
                  <span className="relative z-10">Sending...</span>
                </>
              ) : userIsAuthenticated ? (
                hasJoined ? (
                  <>
                    <Check className="relative z-10" size={18} />
                    <span className="relative z-10">Request Sent</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="relative z-10" size={18} />
                    <span className="relative z-10">Join Community</span>
                  </>
                )
              ) : (
                <>
                  <LogIn className="relative z-10" size={18} />
                  <span className="relative z-10">Login to Join</span>
                </>
              )}
            </motion.button>
          )}

          {/* Message */}
          {message && (
            <p className={`text-sm mt-3 text-center ${
              message.includes("⚠️") || message.includes("failed") || message.includes("wrong")
                ? "text-red-400"
                : "text-green-400"
            }`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
