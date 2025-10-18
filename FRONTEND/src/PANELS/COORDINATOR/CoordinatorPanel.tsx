import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api";
import { motion } from "framer-motion";
import { 
  Terminal, 
  Calendar, 
  Users, 
  UserPlus, 
  LogOut,
  Sparkles,
  Club,
  MessageCircle
} from "lucide-react";

interface Announcement {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
}

export default function CoordinatorPanel() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");
  const [clubName, setClubName] = useState("");
  const [clubId, setClubId] = useState("");
  const [loadingClub, setLoadingClub] = useState(true);

  // Announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const fetchClub = async () => {
      if (!userId) return console.warn("No userId in localStorage");
      try {
        const res = await api.get(`/coordinator/myclub/${userId}`);
        console.log("Fetched club data:", res.data);
        if (res.data.clubName) {
          setClubName(res.data.clubName);
          setClubId(res.data.clubId || "");
        }
      } catch (err) {
        console.error("Error fetching club", err);
      } finally {
        setLoadingClub(false);
      }
    };
    fetchClub();
  }, [userId]);

  // Fetch announcements
  useEffect(() => {
    if (!clubId) return;
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get(`/announcements?clubId=${clubId}`);
        setAnnouncements(res.data);
      } catch (err) {
        console.error("Failed to fetch announcements", err);
      }
    };
    fetchAnnouncements();
  }, [clubId]);

  const handleLogout = () => navigate("/");

  const postAnnouncement = async () => {
    if (!newTitle || !newMessage) return;
    setPosting(true);
    try {
      const res = await api.post("/announcements", {
        title: newTitle,
        message: newMessage,
        clubId
      });
      setAnnouncements(prev => [res.data, ...prev]);
      setNewTitle("");
      setNewMessage("");
    } catch (err) {
      console.error("Failed to post announcement", err);
    } finally {
      setPosting(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loadingClub) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading club info...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-25">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8"
        >
          <div className="flex flex-wrap items-center gap-10 mb-4">
            <motion.div 
              whileHover={{ rotate: 5 }}
              className="p-3 bg-gradient-to-br from-blue-900/70 to-purple-900/70 rounded-xl border border-blue-700/50"
            >
              <Club className="w-8 h-8 text-blue-400" />
            </motion.div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Coordinator Console
              </h1>
              <p className="text-slate-400 text-sm">
                <span className="text-green-400">$</span> Manage your club ecosystem
              </p>
              <div className="mt-2">
                {clubName ? (
                  <p className="text-slate-300 text-sm">
                    Managing: <span className="font-semibold text-blue-300">{clubName}</span>
                  </p>
                ) : (
                  <p className="text-slate-500 text-sm">Not assigned to any club yet</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-blue-200 hidden sm:block">Welcome, {username}</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-4 py-2 bg-red-900/30 hover:bg-red-800/50 text-red-400 rounded-lg border border-red-800/50 transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl p-6 mb-8"
        >
          <div className="flex flex-col space-y-1 mb-6">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Quick Actions
              </h3>
            </div>
            <p className="text-sm text-slate-400 pl-8">Manage your club activities and members</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Dashboard Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -5 }}
              className="rounded-xl p-5 cursor-pointer bg-gradient-to-br from-blue-900/50 to-blue-900/30 border border-blue-800/30 hover:from-blue-800/50 hover:to-blue-800/30 transition-all duration-200 h-full"
              onClick={() => navigate("/coordinatorpanel")}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <Terminal className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold">Dashboard</h3>
              </div>
              <p className="text-slate-300 text-sm mb-2">Overview of your club activities</p>
            </motion.div>

            {/* Events Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -5 }}
              className="rounded-xl p-5 cursor-pointer bg-gradient-to-br from-emerald-900/50 to-emerald-900/30 border border-emerald-800/30 hover:from-emerald-800/50 hover:to-emerald-800/30 transition-all duration-200 h-full"
              onClick={() => navigate("/eventcreate")}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <Calendar className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold">Events</h3>
              </div>
              <p className="text-slate-300 text-sm mb-2">Create and manage events</p>
            </motion.div>

            {/* Requests Card */}
            {clubId ? (
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -5 }}
                className="rounded-xl p-5 cursor-pointer bg-gradient-to-br from-amber-900/50 to-amber-900/30 border border-amber-800/30 hover:from-amber-800/50 hover:to-amber-800/30 transition-all duration-200 h-full"
                onClick={() => navigate(`/requests/${clubId}`)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <UserPlus className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-bold">Requests</h3>
                </div>
                <p className="text-slate-300 text-sm mb-2">Manage membership requests</p>
              </motion.div>
            ) : (
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -5 }}
                className="rounded-xl p-5 opacity-50 cursor-not-allowed bg-gradient-to-br from-amber-900/50 to-amber-900/30 border border-amber-800/30 transition-all duration-200 h-full"
                title="You need to be assigned to a club first"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <UserPlus className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-bold">Requests</h3>
                </div>
                <p className="text-slate-300 text-sm mb-2">Assign club access required</p>
              </motion.div>
            )}

            {/* Members Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -5 }}
              className="rounded-xl p-5 cursor-pointer bg-gradient-to-br from-purple-900/50 to-purple-900/30 border border-purple-800/30 hover:from-purple-800/50 hover:to-purple-800/30 transition-all duration-200 h-full"
              onClick={() => navigate("/coordinator/members")}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold">Members</h3>
              </div>
              <p className="text-slate-300 text-sm mb-2">View and manage club members</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Announcements Section */}
        {clubId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Announcements
              </h3>
            </div>

            {/* New Announcement Form */}
            <div className="mb-6 space-y-2">
              <input
                type="text"
                placeholder="Title"
                className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
              />
              <textarea
                placeholder="Message"
                className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
              />
              <button
                onClick={postAnnouncement}
                disabled={posting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
              >
                {posting ? "Posting..." : "Post Announcement"}
              </button>
            </div>

            {/* Announcements List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {announcements.length === 0 ? (
                <p className="text-gray-400">No announcements yet.</p>
              ) : (
                announcements.map(a => (
                  <div
                    key={a._id}
                    className="p-3 bg-gray-800 rounded border border-gray-700"
                  >
                    <h4 className="font-semibold text-blue-300">{a.title}</h4>
                    <p className="text-gray-300">{a.message}</p>
                    <span className="text-gray-500 text-xs">{new Date(a.createdAt).toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
