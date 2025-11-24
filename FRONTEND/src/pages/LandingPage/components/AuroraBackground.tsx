import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const AuroraBackground: React.FC = () => {
  const isBrowser = typeof window !== "undefined";
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = isBrowser
    ? useTransform(mouseY, [0, window.innerHeight], [15, -15])
    : 0;
  const rotateY = isBrowser
    ? useTransform(mouseX, [0, window.innerWidth], [-15, 15])
    : 0;

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    mouseX.set(clientX);
    mouseY.set(clientY);
  };

  return (
    <motion.div
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      onMouseMove={handleMouseMove}
      style={{ perspective: 1000 }}
    >
      <motion.div style={{ rotateX, rotateY }} className="w-full h-full absolute">
        {/* Aurora Layer 1 */}
        <motion.div
          className="absolute top-[20%] left-[20%] w-[60%] aspect-[2/1] rounded-full bg-blue-900/20 blur-[100px]"
          animate={{
            x: ["-10%", "10%", "-10%"],
            y: ["0%", "10%", "0%"],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Aurora Layer 2 */}
        <motion.div
          className="absolute top-[40%] left-[40%] w-[50%] aspect-[3/1] rounded-full bg-purple-800/15 blur-[120px]"
          animate={{
            x: ["10%", "-10%", "10%"],
            y: ["5%", "-5%", "5%"],
            opacity: [0.7, 0.9, 0.7],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />

        {/* Aurora Layer 3 */}
        <motion.div
          className="absolute bottom-[10%] right-[10%] w-[40%] aspect-[4/1] rounded-full bg-cyan-700/10 blur-[80px]"
          animate={{
            x: ["5%", "-5%", "5%"],
            y: ["-5%", "5%", "-5%"],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 10,
          }}
        />

        {/* Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/10"
            style={{
              width: Math.random() * 5 + 3,
              height: Math.random() * 5 + 3,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, (Math.random() - 0.5) * 50],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default AuroraBackground;
