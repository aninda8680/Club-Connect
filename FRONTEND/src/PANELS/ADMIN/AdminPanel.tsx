import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ScrollFadeWrapper from "./../../components/ScrollFadeWrapper"; // Adjust path as needed

import { 
  FiUsers, 
  FiPlus, 
  FiCheck, 
  FiBell, 
} from "react-icons/fi";
import {
  Sparkles,
  Terminal,
  Server,
  CheckCircle,
  Cpu,
  Database,
  Code,
  AlertTriangle
} from "lucide-react";

export default function AdminPanel() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    navigate("/");
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const cards = [
    {
      title: "Create Club",
      description: "Initialize new club instance",
      command: "$ admin create --club",
      path: "/createclub",
      color: "from-blue-900/50 to-blue-900/30 hover:from-blue-800/50 hover:to-blue-800/30",
      borderColor: "border-blue-800/30",
      hoverColor: "from-blue-800/50 to-blue-800/30",
      icon: <FiPlus className="w-5 h-5 text-blue-400" />,
    },
    {
      title: "Review Events",
      description: "Approve pending submissions",
      command: "$ admin review --events",
      path: "/adminevent",
      color: "from-emerald-900/50 to-emerald-900/30 hover:from-emerald-800/50 hover:to-emerald-800/30",
      borderColor: "border-emerald-800/30",
      hoverColor: "from-emerald-800/50 to-emerald-800/30",
      icon: <FiCheck className="w-5 h-5 text-emerald-400" />,
    },
    {
      title: "Manage Roles",
      description: "Configure roles",
      command: "$ admin config --roles",
      path: "/manageroles",
      color: "from-purple-900/50 to-purple-900/30 hover:from-purple-800/50 hover:to-purple-800/30",
      borderColor: "border-purple-800/30",
      hoverColor: "from-purple-800/50 to-purple-800/30",
      icon: <FiUsers className="w-5 h-5 text-purple-400" />,
    },
    {
      title: "Pending Proposals",
      description: "View all pending proposals",
      command: "view all+",
      path: "/pending-proposals",
      color: "from-amber-900/50 to-amber-900/30",
      borderColor: "border-amber-800/30",
      hoverColor: "from-amber-800/50 to-amber-800/30",
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    },
  ];

  // Mock data for system status
  const systemStats = [
    { label: "Active Clubs", value: 12, icon: <Terminal className="w-4 h-4 text-blue-400" /> },
    { label: "Coordinators Assigned", value: 8, icon: <Code className="w-4 h-4 text-purple-400" /> },
    { label: "Pending Reviews", value: 5, icon: <Cpu className="w-4 h-4 text-amber-400" /> },
    { label: "Total Events", value: 24, icon: <Database className="w-4 h-4 text-emerald-400" /> }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-25">
      <div className="container mx-auto max-w-6xl">
        {/* Wrap entire content with ScrollFadeWrapper */}
        <ScrollFadeWrapper fadeStart={100} fadeDistance={200} fadeTo={0.5}>
          
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center py-6 mb-8"
          >
            <div className="flex flex-wrap items-center gap-10 mb-4">
              <motion.div 
                whileHover={{ rotate: 5, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-gradient-to-br from-blue-900/70 to-purple-900/70 rounded-xl border border-blue-700/50 shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
              >
                <Terminal className="w-8 h-8 text-blue-400" />
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Admin Console
                </h1>
                <p className="text-slate-400 text-sm md:text-lg mt-1">
                  <span className="text-green-400">$</span> Manage your digital ecosystem...!!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <motion.span 
                className="text-blue-200 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20"
                whileHover={{ scale: 1.05 }}
              >
                Welcome, {username}
              </motion.span>
              <motion.button
                onClick={handleLogout}
                className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg shadow-lg transition-all duration-300 border border-red-500/30"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
            </div>
          </motion.header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-12 bg-slate-900/70 backdrop-blur-sm rounded-xl p-7 border border-slate-800 shadow-2xl"
              >
                <div className="flex flex-col space-y-1 mb-6">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    </motion.div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Quick Commands
                    </h3>
                  </div>
                  <p className="text-sm text-slate-400 pl-8">Execute common administrative tasks</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {cards.map((card, index) => (
                    <motion.div
                      key={index}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ 
                        y: -8,
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                      className={`rounded-xl p-4 cursor-pointer bg-gradient-to-br ${card.color} border ${card.borderColor} hover:${card.hoverColor} transition-all duration-300 h-full shadow-lg hover:shadow-xl backdrop-blur-sm`}
                      onClick={() => navigate(card.path)}
                    >
                      <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700/50 w-fit mb-3 shadow-inner">
                        {card.icon}
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-white">{card.title}</h3>
                      <p className="text-slate-300 text-sm mb-4">{card.description}</p>
                      <code className="bg-black/40 px-3 py-2 rounded text-sm font-mono text-blue-300 border border-slate-700/50">
                        {card.command}
                      </code>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.section
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl p-6 mb-8 shadow-2xl"
              >
                <div className="flex items-center gap-2 mb-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Server className="w-5 h-5 text-emerald-400" />
                  </motion.div>
                  <h2 className="text-lg font-semibold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                    System Status
                  </h2>
                </div>
                
                <motion.div 
                  whileHover={{ scale: 1.02, y: -1 }}
                  className="flex items-center justify-between p-3 bg-emerald-900/10 border border-emerald-800/30 rounded-lg mb-6 shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    </motion.div>
                    <span className="text-emerald-400 font-medium">All Systems Operational</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-emerald-400 mr-2">100%</span>
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
                  </div>
                </motion.div>
                
                <div className="space-y-3 text-sm">
                  {systemStats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ 
                        x: 5,
                        backgroundColor: "rgba(30, 41, 59, 0.5)",
                        transition: { duration: 0.2 }
                      }}
                      className="flex justify-between items-center p-2 hover:bg-slate-800/30 rounded-lg transition-all duration-300 border border-transparent hover:border-slate-700/30"
                    >
                      <div className="flex items-center gap-2 text-slate-400">
                        {stat.icon}
                        <span>{stat.label}</span>
                      </div>
                      <span className="font-semibold font-mono text-white">{stat.value}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl p-6 shadow-2xl"
              >
                <div className="flex items-center gap-2 mb-4">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiBell className="w-5 h-5 text-blue-400" />
                  </motion.div>
                  <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Recent Activity
                  </h2>
                </div>
                
                <div className="space-y-4">
                  {[
                    { text: "New event created", time: "2 minutes ago", color: "bg-green-500" },
                    { text: "User role updated", time: "15 minutes ago", color: "bg-blue-500" },
                    { text: "Club settings modified", time: "1 hour ago", color: "bg-purple-500" }
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex items-start group"
                    >
                      <motion.div 
                        className={`${activity.color} rounded-full h-2 w-2 mt-2 mr-3 shadow-lg`}
                        whileHover={{ scale: 1.5 }}
                      />
                      <div className="flex-1">
                        <p className="text-sm text-white group-hover:text-blue-200 transition-colors">{activity.text}</p>
                        <p className="text-slate-400 text-xs group-hover:text-slate-300 transition-colors">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div 
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 text-center px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-slate-400 cursor-pointer hover:text-white hover:border-slate-600/50 transition-all duration-300"
                >
                  View all activity
                </motion.div>
              </motion.section>
            </div>
          </div>

        </ScrollFadeWrapper>
      </div>
    </div>
  );
}