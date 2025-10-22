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
  MessageCircle,
  Plus,
  Send,
  Loader2,
  Clock
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-gradient-to-br from-slate-900/90 via-blue-950/50 to-slate-900/90 backdrop-blur-lg border border-blue-800/30 rounded-2xl p-6 mb-8 shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Club Announcements
                  </h3>
                </div>

                {/* New Announcement Form */}
                <div className="mb-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-blue-400" />
                    New Announcement
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Announcement Title"
                        className="w-full p-3 rounded-xl border border-slate-600 bg-slate-900/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <textarea
                        placeholder="Announcement Message"
                        rows={3}
                        className="w-full p-3 rounded-xl border border-slate-600 bg-slate-900/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                      />
                    </div>
                    <button
                      onClick={postAnnouncement}
                      disabled={posting}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                    >
                      {posting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Post Announcement
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Announcements List */}
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {announcements.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 text-lg">No announcements yet.</p>
                      <p className="text-gray-500 text-sm">Be the first to post an announcement!</p>
                    </div>
                  ) : (
                    announcements.map(a => (
                      <motion.div
                        key={a._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 bg-gradient-to-r from-slate-800/80 to-slate-900/80 rounded-xl border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                            {a.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            {new Date(a.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <p className="text-gray-300 leading-relaxed">{a.message}</p>
                        
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

      </div>
    </div>
  );
}
