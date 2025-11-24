import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { Typewriter } from "react-simple-typewriter";



interface Props {
  handleScrollToClubs: () => void;
  handleScrollToEvents: () => void;
}

const Hero: React.FC<Props> = ({
  handleScrollToClubs,
  handleScrollToEvents,
}) => {
  return (
    <section
      id="hero-section"
      className="min-h-screen flex flex-col justify-center items-center text-center px-4 md:px-6 relative overflow-hidden z-10"
    >
      {/* <GridBeam className="absolute inset-0 z-0">
  <div className="w-full h-full" />
</GridBeam> */}
      <div className="relative z-20">
        {/* Main Title */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, type: "spring", stiffness: 80 }}
        >
          Welcome to <span className="text-blue-500">Club-Connect</span> ⚡
        </motion.h1>

        {/* Typewriter Text */}
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-200 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Typewriter
            words={[
              "Grades fade. Memories don't.",
              "Because college is not just 9 to 5.",
              "More than attendance, it's about presence.",
              "Forget library hours. These are club hours.",
              "Every club is a playlist. Find yours.",
            ]}
            loop
            cursor
            cursorStyle="|"
            typeSpeed={60}
            deleteSpeed={40}
            delaySpeed={2000}
          />
        </motion.h2>

        {/* Subheading */}
        <motion.h3
          className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          After classes comes the real fun — clubs, events, and memories waiting
          to happen.
        </motion.h3>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4 mt-8 md:mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          {/* Explore Clubs */}
          <motion.button
            className="px-6 py-3 rounded-none text-base font-bold border-2 flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #3D5AA6 0%, #8B5FBF 100%)",
              borderTopColor: "#4A6BC6",
              borderLeftColor: "#4A6BC6",
              borderRightColor: "#2D4080",
              borderBottomColor: "#2D4080",
              color: "white",
              textShadow: "2px 2px #2D4080",
              fontFamily: "'Minecraft', monospace",
            }}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{
              scale: 0.95,
              y: 2,
              borderTopColor: "#2D4080",
              borderLeftColor: "#2D4080",
              borderRightColor: "#4A6BC6",
              borderBottomColor: "#4A6BC6",
            }}
            onClick={handleScrollToClubs}
          >
            🌟 Explore Clubs <FiArrowRight />
          </motion.button>

          {/* Explore Events */}
          <motion.button
            className="px-6 py-3 rounded-none text-base font-bold border-2 flex items-center justify-center gap-2"
            style={{
              background: "transparent",
              borderTopColor: "#4A6BC6",
              borderLeftColor: "#4A6BC6",
              borderRightColor: "#2D4080",
              borderBottomColor: "#2D4080",
              color: "white",
              textShadow: "2px 2px #2D4080",
              fontFamily: "'Minecraft', monospace",
              backgroundColor: "rgba(45, 64, 128, 0.3)",
            }}
            whileHover={{
              scale: 1.05,
              y: -1,
              backgroundColor: "rgba(74, 107, 198, 0.4)",
            }}
            whileTap={{
              scale: 0.95,
              y: 2,
              borderTopColor: "#2D4080",
              borderLeftColor: "#2D4080",
              borderRightColor: "#4A6BC6",
              borderBottomColor: "#4A6BC6",
            }}
            onClick={handleScrollToEvents}
          >
            🎉 Explore Events <FiArrowRight />
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5 }}
      >
        <span className="text-sm text-gray-400 mb-2">Scroll Down</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-4 h-4 border-r-2 border-b-2 border-blue-500 transform rotate-45"></div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
