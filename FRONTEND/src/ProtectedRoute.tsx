// src/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import type { ReactNode } from "react";

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
        const res = await axios.get("https://club-connect-xcq2.onrender.com/api/auth/me", {
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
    return <p>Loading...</p>;
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
