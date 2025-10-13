// src/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import api from "./api";
import { motion } from "framer-motion";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: string; // required role (optional)
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { role, isProfileComplete } = res.data;

        setUserRole(role);
        setIsProfileComplete(isProfileComplete);
        setAuthorized(true);

        // sync with localStorage
        localStorage.setItem("role", role);
        localStorage.setItem("isProfileComplete", String(isProfileComplete));
      } catch (err) {
        console.error("Auth check failed:", err);
        setAuthorized(false);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("isProfileComplete");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // While verifying
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ 
            scale: 1,
            opacity: 1,
            rotate: [0, 360]
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            rotate: {
              repeat: Infinity,
              duration: 2
            }
          }}
          className="relative"
        >
          <div className="w-20 h-20 border-t-4 border-blue-500 border-solid rounded-full animate-spin" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-blue-400 mt-4 font-medium text-lg"
        >
          Loading...
        </motion.p>
      </div>
    );
  }

  // No token or request failed
  if (!authorized) {
    return <Navigate to="/" replace />;
  }

  // If profile incomplete → force complete-profile page
  if (isProfileComplete === false) {
    return <Navigate to="/complete-profile" replace />;
  }

  // If route requires a role, but user doesn't match
  if (role && userRole !== role) {
    switch (userRole) {
      case "admin":
        return <Navigate to="/adminpanel" replace />;
      case "coordinator":
        return <Navigate to="/coordinatorpanel" replace />;
      case "leader":
        return <Navigate to="/leaderpanel" replace />;
      case "visitor":
        return <Navigate to="/publicpanel" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // ✅ Authorized & matches conditions → render children
  return <>{children}</>;
}
