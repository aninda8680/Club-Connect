// src/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import api from "./api";
import Loader from "./components/Loader";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: string | string[]; // ✅ allow single or multiple roles
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

  if (loading) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader />
    </div>
  );
}

  if (!authorized) {
    return <Navigate to="/" replace />;
  }

  if (isProfileComplete === false) {
    return <Navigate to="/complete-profile" replace />;
  }

  // ✅ Handle single or multiple allowed roles
  if (role) {
    const allowedRoles = Array.isArray(role) ? role : [role];
    if (!allowedRoles.includes(userRole || "")) {
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
  }

  return <>{children}</>;
}
