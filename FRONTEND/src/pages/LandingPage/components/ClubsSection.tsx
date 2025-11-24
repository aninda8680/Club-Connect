import React from "react";
import { motion } from "framer-motion";
import { FiStar, FiUsers, FiPlus, FiCheck, FiLogIn } from "react-icons/fi";
import type { Club, ClubCounts } from "../types/club";

interface Props {
  clubs: Club[];
  clubCounts: Map<string, ClubCounts>;
  joinedClubs: Set<string>;
  isAuthenticated: () => boolean;
  handleJoin: (clubId: string) => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const ClubsSection: React.FC<Props> = ({
  clubs,
  clubCounts,
  joinedClubs,
  isAuthenticated,
  handleJoin,
}) => {
  return (
    <section
      id="clubs-section"
      className="min-h-screen py-20 px-4 md:px-6 relative z-10"
    >
      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
            <FiStar className="text-blue-400" size={16} />
            <span className="text-sm font-semibold text-blue-400">
              EXPLORE COMMUNITIES
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Featured <span className="text-blue-500">Clubs</span>
          </h2>

          <motion.p
            className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            Dive into vibrant communities where passion meets purpose. Find your
            tribe and start creating together.
          </motion.p>
        </motion.div>

        {/* Clubs Grid */}
        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {clubs.length === 0 ? (
            /* No Clubs Yet */
            <motion.div className="col-span-full text-center py-20" variants={fadeUp}>
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                <FiUsers className="text-blue-400" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                No Clubs Yet
              </h3>
              <p className="text-gray-400 text-lg mb-6">
                Be the first to start something amazing!
              </p>
              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl font-semibold hover:from-blue-500 hover:to-blue-600 transition-all duration-300 transform hover:-translate-y-1">
                Create First Club
              </button>
            </motion.div>
          ) : (
            clubs.map((club) => (
              <motion.div
                key={club._id}
                className="group relative"
                variants={fadeUp}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
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
                          {club.name.charAt(0)}
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                            {club.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full border border-gray-700">
                              #{club.category || "Tech Society"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Member Count */}
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <FiUsers size={14} />
                          <span className="font-semibold text-white">
                            {clubCounts.get(club._id)?.memberCount ||
                              club.members.length}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">members</div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 leading-relaxed mb-6 line-clamp-3 group-hover:text-gray-200 transition-colors">
                      {club.description ||
                        "Join this amazing community and be part of something special!"}
                    </p>

                    {/* Coordinator & Pending Requests */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
                          {club.coordinator?.username?.charAt(0) || "C"}
                        </div>

                        <div>
                          <div className="text-xs text-gray-400">Coordinator</div>
                          <div className="text-sm font-semibold text-white">
                            {club.coordinator?.username || "Unknown"}
                          </div>
                        </div>
                      </div>

                      {club.joinRequests.length > 0 && (
                        <motion.div
                          className="flex items-center gap-2 px-3 py-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30"
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                          <span className="text-xs font-semibold text-yellow-400">
                            {club.joinRequests.length} pending
                          </span>
                        </motion.div>
                      )}
                    </div>

                    {/* Join Button */}
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoin(club._id);
                      }}
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group ${
                        joinedClubs.has(club._id)
                          ? "bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white shadow-lg hover:shadow-blue-500/25"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={joinedClubs.has(club._id)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition duration-1000"></div>

                      {isAuthenticated() ? (
                        joinedClubs.has(club._id) ? (
                          <>
                            <FiCheck className="relative z-10" size={18} />
                            <span className="relative z-10">Request Sent</span>
                          </>
                        ) : (
                          <>
                            <FiPlus className="relative z-10" size={18} />
                            <span className="relative z-10">Join Community</span>
                          </>
                        )
                      ) : (
                        <>
                          <FiLogIn className="relative z-10" size={18} />
                          <span className="relative z-10">Login to Join</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ClubsSection;
