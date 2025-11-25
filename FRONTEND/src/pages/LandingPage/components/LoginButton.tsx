import React from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, LogIn } from "lucide-react";


interface Props {
  isAuthenticated: boolean;
  onClick: () => void;
}

const LoginButton: React.FC<Props> = ({ isAuthenticated, onClick }) => {
  return (
    <motion.button
  className="fixed top-4 right-10 z-50 py-2 px-4 rounded-none text-sm font-bold text-white shadow-lg border-2"
  style={{
    background: "#4eab2e",
    borderTopColor: "#8FAC87",
    borderLeftColor: "#8FAC87",
    borderRightColor: "#5A6C55",
    borderBottomColor: "#5A6C55",
    textShadow: "2px 2px #4A5C45",
    fontFamily: "'Minecraft', monospace",
  }}
  onClick={onClick}
  animate={{
    boxShadow: [
      "4px 4px 0px rgba(90,108,85,0.8)",
      "2px 2px 0px rgba(90,108,85,0.9)",
      "4px 4px 0px rgba(90,108,85,0.8)",
    ],
  }}
  transition={{ repeat: Infinity, duration: 1.5 }}
  whileHover={{
    scale: 1.05,
    y: -1,
    transition: { duration: 0.1 },
  }}
  whileTap={{
    scale: 0.95,
    y: 2,
    borderTopColor: "#5A6C55",
    borderLeftColor: "#5A6C55",
    borderRightColor: "#8FAC87",
    borderBottomColor: "#8FAC87",
  }}
>
  {isAuthenticated ? (
    <span className="flex items-center gap-2">
      <LayoutDashboard size={16} /> Dashboard
    </span>
  ) : (
    <span className="flex items-center gap-2">
      <LogIn size={16} /> Login / Register
    </span>
  )}
</motion.button>
  );
};

export default LoginButton;
