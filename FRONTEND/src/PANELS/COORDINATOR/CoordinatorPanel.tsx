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
  Club
} from "lucide-react";

export default function CoordinatorPanel() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");
  const [clubName, setClubName] = useState("");
  const [clubId, setClubId] = useState("");

  useEffect(() => {
    const fetchClub = async () => {
      if (!userId) return console.warn("No userId in localStorage");

      try {
        const res = await api.get(`/coordinator/myclub/${userId}`);
        if (res.data.clubName) {
          setClubName(res.data.clubName);
          setClubId(res.data.clubId || "");
        }
      } catch (err) {
        console.error("Error fetching club", err);
      }
    };

    fetchClub();
  }, [userId]);

  const handleLogout = () => {
    navigate("/");
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const cards = [
    {
      title: "Dashboard",
      description: "Overview of your club activities",
      icon: <Terminal className="w-6 h-6 text-blue-400" />,
      path: "/coordinatorpanel",
      color: "from-blue-900/50 to-blue-900/30",
      borderColor: "border-blue-800/30",
      hoverColor: "from-blue-800/50 to-blue-800/30",
    },
    {
      title: "Events",
      description: "Create and manage events",
      icon: <Calendar className="w-6 h-6 text-emerald-400" />,
      path: "/eventcreate",
      color: "from-emerald-900/50 to-emerald-900/30",
      borderColor: "border-emerald-800/30",
      hoverColor: "from-emerald-800/50 to-emerald-800/30",
    },
    {
      title: "Requests",
      description: "Manage membership requests",
      icon: <UserPlus className="w-6 h-6 text-amber-400" />,
      path: `/requests/${clubId}`,
      color: "from-amber-900/50 to-amber-900/30",
      borderColor: "border-amber-800/30",
      hoverColor: "from-amber-800/50 to-amber-800/30",
      disabled: !clubId
    },
    {
      title: "Members",
      description: "View and manage club members",
      icon: <Users className="w-6 h-6 text-purple-400" />,
      path: "/coordinator/members",
      color: "from-purple-900/50 to-purple-900/30",
      borderColor: "border-purple-800/30",
      hoverColor: "from-purple-800/50 to-purple-800/30",
    }
  ];

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
            {cards.map((card, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`rounded-xl p-5 cursor-pointer bg-gradient-to-br ${card.color} border ${card.borderColor} hover:${card.hoverColor} transition-all duration-200 h-full ${card.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !card.disabled && navigate(card.path)}
                title={card.disabled ? "You need to be assigned to a club first" : ""}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    {card.icon}
                  </div>
                  <h3 className="text-lg font-bold">{card.title}</h3>
                </div>
                <p className="text-slate-300 text-sm mb-2">{card.description}</p>
                {card.disabled && (
                  <p className="text-amber-500 text-xs mt-2">Assign club access required</p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Club Status */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl p-6 mb-8"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Club className="w-5 h-5 text-blue-400" />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Club Status
            </span>
          </h3>
          
          {clubName ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-900/10 border border-blue-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Club className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-medium">Active Club</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-blue-400 mr-2">Assigned</span>
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                  <div className="text-lg font-bold text-emerald-400">12</div>
                  <div className="text-slate-400">Total Members</div>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                  <div className="text-lg font-bold text-blue-400">5</div>
                  <div className="text-slate-400">Upcoming Events</div>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                  <div className="text-lg font-bold text-amber-400">3</div>
                  <div className="text-slate-400">Pending Requests</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Club className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h4 className="text-slate-400 font-medium mb-2">No Club Assigned</h4>
              <p className="text-slate-500 text-sm">You haven't been assigned to manage any club yet</p>
              <p className="text-slate-600 text-xs mt-2">Contact an administrator for club assignment</p>
            </div>
          )}
        </motion.div>

        {/* Recent Activity Placeholder */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Recent Activity
            </span>
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="bg-green-500 rounded-full h-2 w-2 mt-2 mr-3"></div>
              <div>
                <p className="text-sm">New member joined</p>
                <p className="text-slate-400 text-xs">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-500 rounded-full h-2 w-2 mt-2 mr-3"></div>
              <div>
                <p className="text-sm">Event created</p>
                <p className="text-slate-400 text-xs">1 day ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-purple-500 rounded-full h-2 w-2 mt-2 mr-3"></div>
              <div>
                <p className="text-sm">Membership request received</p>
                <p className="text-slate-400 text-xs">2 days ago</p>
              </div>
            </div>
          </div>
        </motion.div>  */}
      </div>
    </div>
  );
}