import React, { useEffect, useState } from "react";
import NotificationCard from "@/components/NotificationCard";
import api from "@/api";

interface Notification {
  _id: string;
  sender: { username: string; email: string };
  post?: { _id: string; content: string; image?: string };
  type: "like" | "comment";
  message: string;
  createdAt: string;
  read: boolean;
}

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        Loading...
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-4 text-white">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-400 text-sm">No notifications yet</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <NotificationCard key={n._id} {...n} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPage;