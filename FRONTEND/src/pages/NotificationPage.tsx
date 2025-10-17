import React, { useEffect, useState } from "react";
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

  // ✅ Use the same logic as your api.ts for image URLs
  const isLocal = window.location.hostname === "localhost";
  const API_BASE = isLocal
    ? "http://localhost:5000"
    : "https://club-connect-p2o2.onrender.com";

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setNotifications(res.data);

        // Optionally mark unread notifications as read
        res.data.forEach(async (notif: Notification) => {
          if (!notif.read) {
            try {
              await api.put(`/notifications/${notif._id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` },
              });
            } catch (err) {
              console.error("Error marking notification as read", err);
            }
          }
        });
      } catch (err) {
        console.error("Error fetching notifications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // 🧩 Helper: render Instagram-style like notifications
  const renderLikeNotification = (group: Notification[]) => {
    const usernames = group.map((n) => n.sender.username);
    const othersCount = usernames.length - 2;

    if (usernames.length === 1) return `${usernames[0]} liked your post.`;
    if (usernames.length === 2) return `${usernames[0]} and ${usernames[1]} liked your post.`;
    return `${usernames[0]}, ${usernames[1]} and ${othersCount} others liked your post.`;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        Loading...
      </div>
    );

  // 🧠 Group likes by post
  const groupedLikes: Record<string, Notification[]> = {};
  notifications
    .filter((n) => n.type === "like")
    .forEach((n) => {
      const postId = n.post?._id || n._id;
      if (!groupedLikes[postId]) groupedLikes[postId] = [];
      groupedLikes[postId].push(n);
    });

  const otherNotifications = notifications.filter((n) => n.type !== "like");

  return (
    <div className="max-w-2xl mx-auto p-4 text-white py-25">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>

      {notifications.length === 0 ? (
        <p className="text-gray-400 text-sm">No notifications yet</p>
      ) : (
        <div className="space-y-3">
          {/* ❤️ Grouped Likes */}
          {Object.values(groupedLikes).map((group) => (
            <div
              key={group[0]._id}
              className={`p-3 bg-gray-800 rounded-md flex items-center justify-between ${
                group[0].read ? "" : "bg-gray-700"
              }`}
            >
              <span>{renderLikeNotification(group)}</span>

              {group[0].post?.image && (
                <img
                  src={
                    group[0].post.image.startsWith("http")
                      ? group[0].post.image
                      : `${API_BASE}${group[0].post.image}`
                  }
                  alt="Post"
                  className="w-16 h-16 object-cover rounded ml-4"
                  onError={(e) => ((e.currentTarget.src = "/placeholder.png"))}
                />
              )}
            </div>
          ))}

          {/* 💬 Comments */}
          {otherNotifications.map((n) => (
            <div
              key={n._id}
              className={`p-3 bg-gray-800 rounded-md flex items-center justify-between ${
                n.read ? "" : "bg-gray-700"
              }`}
            >
              <span>
                <strong>{n.sender.username}</strong> commented: {n.message}
              </span>

              {n.post?.image && (
                <img
                  src={
                    n.post.image.startsWith("http")
                      ? n.post.image
                      : `${API_BASE}${n.post.image}`
                  }
                  alt="Post"
                  className="w-16 h-16 object-cover rounded ml-4"
                  onError={(e) => ((e.currentTarget.src = "/placeholder.png"))}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
