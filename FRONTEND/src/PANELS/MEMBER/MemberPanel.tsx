import api from "@/api";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { 
  User, 
  Users, 
  Mail, 
  Bell, 
  Calendar,
  Loader2,
  MessageCircle,
  Crown
} from "lucide-react";
// import { toast } from "react-hot-toast";

interface Club {
  name: string;
  coordinator: { username: string; email: string };
}

interface Announcement {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
}

export default function MemberPanel() {
  const username = localStorage.getItem("username");
  const clubId = localStorage.getItem("clubId");

  const [club, setClub] = useState<Club | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [loadingClub, setLoadingClub] = useState(true);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  const cardVariants: Variants = {
    initial: { scale: 1 },
    hover: { scale: 1.02, transition: { duration: 0.3, ease: "easeInOut" as const } }
  };

  // Fetch club info
  useEffect(() => {
    if (!clubId) return;

    const fetchClub = async () => {
      setLoadingClub(true);
      try {
        const res = await api.get(`/clubs/${clubId}`);
        setClub(res.data);
      } catch (err: any) {
        // Error fetching club details
        // toast.error(err?.response?.data?.message || "Failed to fetch club details");
        setClub(null);
      } finally {
        setLoadingClub(false);
      }
    };
    fetchClub();
  }, [clubId]);

  // Fetch club announcements
  useEffect(() => {
    if (!clubId) return;

    const fetchAnnouncements = async () => {
      setLoadingAnnouncements(true);
      try {
        const res = await api.get(`/announcements?clubId=${clubId}`);
        setAnnouncements(res.data);
      } catch (err: any) {
        // Failed to fetch announcements
        // toast.error(err?.response?.data?.message || "Failed to fetch announcements");
        setAnnouncements([]);
      } finally {
        setLoadingAnnouncements(false);
      }
    };
    fetchAnnouncements();
  }, [clubId]);

  return (
    <div className="min-h-screen bg-black text-white py-25">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto space-y-8"
      >
        {/* Dashboard Header */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between px-6 mb-8"
            >
              {/* Left: Icon + Title */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex items-center gap-4"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-blue-600 to-cyan-600 p-4 rounded-2xl shadow-2xl">
                    <User className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
                  Member Dashboard
                </h1>
              </motion.div>

              {/* Right: Welcome Text */}
              <motion.p
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-lg md:text-xl text-gray-300"
              >
                Welcome back,{" "}
                <span className="font-bold text-cyan-300">{username || "Guest"}</span>
              </motion.p>
            </motion.div>



        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700/50 text-center">
            <div className="text-2xl font-bold text-cyan-400 mb-2">
              {announcements.length}
            </div>
            <div className="text-gray-400 text-sm">Total Announcements</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700/50 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-2">
              {club ? 'Active' : '---'}
            </div>
            <div className="text-gray-400 text-sm">Club Status</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700/50 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-2">
              Member
            </div>
            <div className="text-gray-400 text-sm">Your Role</div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Club Info Card */}
          <motion.div
            variants={cardVariants}
            initial="initial"
            whileHover="hover"
            className="group"
          >
            <div className="bg-gradient-to-br from-slate-900/90 to-blue-950/70 backdrop-blur-lg rounded-2xl p-8 border border-blue-800/30 shadow-2xl h-full">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="p-3 bg-blue-600/20 rounded-xl group-hover:bg-blue-600/30 transition-colors duration-300">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Your Club</h2>
              </motion.div>

              {loadingClub ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center py-8"
                >
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                </motion.div>
              ) : club ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  <motion.div
                    variants={itemVariants}
                    className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Crown className="w-5 h-5 text-yellow-400" />
                      <span className="text-gray-400 text-sm font-medium">Club Name</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{club.name}</p>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <User className="w-5 h-5 text-green-400" />
                      <span className="text-gray-400 text-sm font-medium">Coordinator</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-white flex items-center gap-2">
                        {club.coordinator.username}
                      </p>
                      <p className="text-cyan-400 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {club.coordinator.email}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-400 text-center py-8"
                >
                  {clubId ? 'Loading club details...' : 'Club ID not found.'}
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Announcements Card */}
          {clubId && (
            <motion.div
              variants={cardVariants}
              initial="initial"
              whileHover="hover"
              className="group"
            >
              <div className="bg-gradient-to-br from-slate-900/90 to-purple-950/70 backdrop-blur-lg rounded-2xl p-8 border border-purple-800/30 shadow-2xl h-full flex flex-col">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="flex items-center gap-3 mb-6"
                >
                  <div className="p-3 bg-purple-600/20 rounded-xl group-hover:bg-purple-600/30 transition-colors duration-300">
                    <Bell className="w-6 h-6 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Announcements</h2>
                </motion.div>

                <div className="flex-1 overflow-hidden">
                  {loadingAnnouncements ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center py-12"
                    >
                      <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                    </motion.div>
                  ) : announcements.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg mb-2">No announcements yet</p>
                      <p className="text-gray-500 text-sm">Check back later for updates</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar"
                    >
                      <AnimatePresence>
                        {announcements.map((a, index) => (
                          <motion.div
                            key={a._id}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 group"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="font-bold text-white text-lg group-hover:text-purple-300 transition-colors duration-300">
                                {a.title}
                              </h3>
                              <motion.span
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-1 text-xs text-gray-400 bg-slate-700/50 px-2 py-1 rounded-full"
                              >
                                <Calendar className="w-3 h-3" />
                                {new Date(a.createdAt).toLocaleDateString()}
                              </motion.span>
                            </div>
                            <p className="text-gray-300 leading-relaxed mb-3">
                              {a.message}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="text-cyan-400 font-medium">
                                Club Announcement
                              </span>
                              <span>
                                {new Date(a.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        
      </motion.div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}