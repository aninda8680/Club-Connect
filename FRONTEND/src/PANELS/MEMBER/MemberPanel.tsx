// MemberPanel.Glass.tsx
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

export default function MemberPanelGlass() {
  const username = localStorage.getItem("username");
  const clubId = localStorage.getItem("clubId");

  const [club, setClub] = useState<Club | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [loadingClub, setLoadingClub] = useState(true);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  useEffect(() => {
    if (!clubId) return;
    const fetchClub = async () => {
      setLoadingClub(true);
      try {
        const res = await api.get(`/clubs/${clubId}`);
        setClub(res.data);
      } catch (err: any) {
        setClub(null);
      } finally {
        setLoadingClub(false);
      }
    };
    fetchClub();
  }, [clubId]);

  useEffect(() => {
    if (!clubId) return;
    const fetchAnnouncements = async () => {
      setLoadingAnnouncements(true);
      try {
        const res = await api.get(`/announcements?clubId=${clubId}`);
        setAnnouncements(res.data);
      } catch (err: any) {
        setAnnouncements([]);
      } finally {
        setLoadingAnnouncements(false);
      }
    };
    fetchAnnouncements();
  }, [clubId]);

  return (
    <div className="min-h-screen bg-black text-white py-20">
      {/* subtle radial background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-20 -top-24 w-96 h-96 bg-gradient-to-tr from-blue-700/20 via-cyan-600/12 to-transparent rounded-full blur-3xl" />
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-gradient-to-bl from-purple-700/10 via-indigo-700/6 to-transparent rounded-full blur-2xl" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto space-y-8 relative z-10 px-4"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-white/5 backdrop-blur-md border border-white/6" />
              <div className="relative p-3 rounded-2xl">
                <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-3 rounded-xl shadow-lg">
                  <User className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300">
                Member Dashboard
              </h1>
              <p className="text-sm text-gray-300 mt-1">
                Welcome back, <span className="font-semibold text-cyan-300">{username || "Guest"}</span>
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <div className="text-xs text-gray-400">Role</div>
            <div className="px-3 py-2 rounded-xl bg-white/3 border border-white/6">
              <span className="text-sm font-semibold text-cyan-200">Member</span>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white/4 backdrop-blur-md border border-white/6">
            <div className="text-sm text-gray-300">Announcements</div>
            <div className="mt-2 text-2xl font-bold text-cyan-300">{announcements.length}</div>
            <div className="mt-1 text-xs text-gray-400">Total posted in your club</div>
          </div>

          <div className="p-5 rounded-2xl bg-white/4 backdrop-blur-md border border-white/6 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-300">Club Status</div>
              <div className="mt-2 text-2xl font-bold text-white">{club ? "Active" : "---"}</div>
              <div className="mt-1 text-xs text-gray-400">Connected club</div>
            </div>
            <Users className="w-8 h-8 text-blue-300" />
          </div>

          <div className="p-5 rounded-2xl bg-white/4 backdrop-blur-md border border-white/6">
            <div className="text-sm text-gray-300">Your Role</div>
            <div className="mt-2 text-2xl font-bold text-purple-300">Member</div>
            <div className="mt-1 text-xs text-gray-400">Access level</div>
          </div>
        </motion.div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Club Info */}
          <motion.div variants={itemVariants} className="rounded-2xl overflow-hidden">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-blue-950/70 border border-blue-800/30 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/6">
                    <Users className="w-5 h-5 text-cyan-300" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Your Club</div>
                    <div className="text-xl font-semibold text-white">
                      {loadingClub ? "Loading..." : club?.name ?? "No club"}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-400">{club ? "Connected" : "Disconnected"}</div>
              </div>

              {loadingClub ? (
                <div className="py-8 flex items-center justify-center">
                  <Loader2 className="w-7 h-7 animate-spin text-cyan-300" />
                </div>
              ) : club ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/3 border border-white/6">
                    <div className="flex items-center gap-3">
                      <Crown className="w-4 h-4 text-yellow-400" />
                      <div className="text-xs text-gray-400">Club Name</div>
                    </div>
                    <div className="mt-2 font-bold text-white text-lg">{club.name}</div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/3 border border-white/6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-green-300" />
                          <div className="text-xs text-gray-400">Coordinator</div>
                        </div>
                        <div className="mt-2 text-sm font-semibold text-white">{club.coordinator.username}</div>
                        <div className="mt-1 text-sm text-cyan-300 flex items-center gap-2">
                          <Mail className="w-3 h-3" /> {club.coordinator.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 py-6">Club ID not found.</p>
              )}
            </div>
          </motion.div>

          {/* Announcements */}
          <motion.div variants={itemVariants} className="rounded-2xl overflow-hidden">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-purple-950/60 border border-purple-800/30 shadow-xl flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/6">
                    <Bell className="w-5 h-5 text-purple-300" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Announcements</div>
                    <div className="text-lg font-semibold text-white">Latest updates</div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                {loadingAnnouncements ? (
                  <div className="py-12 flex items-center justify-center">
                    <Loader2 className="w-7 h-7 animate-spin text-purple-300" />
                  </div>
                ) : announcements.length === 0 ? (
                  <div className="py-12 text-center text-gray-400">
                    <MessageCircle className="w-14 h-14 mx-auto mb-3 text-gray-500" />
                    <div className="text-lg">No announcements yet</div>
                    <div className="text-sm text-gray-500">Check back later for updates</div>
                  </div>
                ) : (
                  <motion.div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    <AnimatePresence>
                      {announcements.map((a, idx) => (
                        <motion.div
                          key={a._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -40 }}
                          transition={{ duration: 0.35, delay: idx * 0.05 }}
                          className="p-4 rounded-xl bg-white/3 border border-white/6"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="text-sm font-semibold text-white">{a.title}</div>
                              <div className="text-xs text-gray-400">{a.message.substring(0, 120)}{a.message.length>120 ? "..." : ""}</div>
                            </div>
                            <div className="text-xs text-gray-400 flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              {new Date(a.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-xs text-gray-300 flex items-center justify-between">
                            <span className="text-cyan-300 font-medium">Club Announcement</span>
                            <span>{new Date(a.createdAt).toLocaleTimeString()}</span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.45); border-radius: 10px; }
      `}</style>
    </div>
  );
}
