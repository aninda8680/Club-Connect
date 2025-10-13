// components/ClubCard.tsx
import { useState, useEffect } from "react";
import { Users, UserPlus, Loader2 } from "lucide-react";
import api from "@/api"; // ✅ Use your centralized axios instance

interface ClubCardProps {
  _id: string;
  name: string;
  description: string;
  members?: string[];
  joinRequests?: string[];
}

export default function ClubCard({
  _id,
  name,
  description,
  members = [],
  joinRequests = [],
}: ClubCardProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [memberCount, setMemberCount] = useState(members.length);
  const [requestCount, setRequestCount] = useState(joinRequests.length);

  // 🔹 Fetch live member + request counts from backend
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await api.get(`/clubs/${_id}/counts`); // ✅ use api
        const data = res.data;
        if (data.success) {
          setMemberCount(data.memberCount);
          setRequestCount(data.requestCount || requestCount); // optional
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
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setMessage("⚠️ Please login first");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/join/request", { userId, clubId: _id }); // ✅ use api.post
      const data = res.data;

      if (data.success) {
        setRequestCount((prev) => prev + 1); // Optimistic UI update
      }
      setMessage(data.message || "Request sent!");
    } catch (err) {
      console.error("Join request error:", err);
      setMessage("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-300">
      {/* Club Name */}
      <h2 className="text-2xl font-bold text-white">{name}</h2>
      <p className="text-gray-400 mt-2">{description}</p>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-300 mt-4">
        <span className="flex items-center gap-1">
          <Users size={16} /> {memberCount} Members
        </span>
        <span className="flex items-center gap-1">
          <UserPlus size={16} /> {requestCount} Join Requests
        </span>
      </div>

      {/* Join Button */}
      <button
        onClick={handleJoin}
        disabled={loading}
        className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-70 transition-all"
      >
        {loading ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
        {loading ? "Sending..." : "Join Club"}
      </button>

      {/* Message */}
      {message && (
        <p className="text-sm text-green-400 mt-3 text-center">{message}</p>
      )}
    </div>
  );
}
