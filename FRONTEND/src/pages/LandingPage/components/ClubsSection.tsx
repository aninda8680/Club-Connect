import React from "react";
import { motion } from "framer-motion";
import { FiStar, FiUsers } from "react-icons/fi";
import ClubCard from "@/components/ClubCard";
import type { Club, ClubCounts } from "../../../components/types/club";
import { UsersRound } from "lucide-react";


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
  clubCounts: _clubCounts,
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
  <UsersRound className="text-blue-400" size={16} />
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
                variants={fadeUp}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <ClubCard
                  _id={club._id}
                  name={club.name}
                  description={club.description}
                  category={club.category}
                  coordinator={club.coordinator}
                  members={club.members}
                  joinRequests={club.joinRequests}
                  isAuthenticated={isAuthenticated()}
                  alreadyJoined={joinedClubs.has(club._id)}
                  onJoinSuccess={() => handleJoin(club._id)}
                />
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ClubsSection;
