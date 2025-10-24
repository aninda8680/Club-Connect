import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api";
import { motion } from "framer-motion";
import NotificationCard from "./../components/NotificationCard"; 
import { toast } from "react-hot-toast";

// Interface for a single raw notification (from the API)
interface Notification {
  _id: string;
  sender: { _id: string; username: string; email: string };
  post?: { _id: string; content: string; image?: string };
  type: "like" | "comment";
  message: string;
  createdAt: string;
  read: boolean;
}

// Interface for the grouped structure (passed to NotificationCard)
interface GroupedNotification {
  id: string; 
  type: "like" | "comment";
  postId: string;
  post?: { _id: string; content: string; image?: string };
  senders: Array<{ _id: string; username: string; email: string }>; 
  latestTime: string;
  message?: string;
  read: boolean;
  notificationIds: string[]; 
}

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isLocal = window.location.hostname === "localhost";
  const API_BASE = isLocal
    ? "http://localhost:5000"
    : "https://club-connect-p2o2.onrender.com"; // Use the actual deployed URL

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err: any) {
      // console.error(err);
      toast.error(err.response?.data?.message || "Error fetching notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationIds: string[]) => {
    try {
      const token = localStorage.getItem("token");
      // Use Promise.all to concurrently mark all relevant notifications as read
      await Promise.all(
        notificationIds.map((id) =>
          api.put(`/notifications/${id}/read`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
    } catch (err) {
      console.error("Error marking as read", err);
    }
  };

  const handleNotificationClick = async (grouped: GroupedNotification) => {
    // 1. Mark group as read if it contains any unread item
    if (!grouped.read) {
      await markAsRead(grouped.notificationIds);
      
      // Update local state to reflect the change immediately
      // This is crucial for UI responsiveness
      setNotifications((prev) =>
        prev.map((n) =>
          grouped.notificationIds.includes(n._id) ? { ...n, read: true } : n
        )
      );
    }

    // 2. Navigate to post
    if (grouped.postId) {
      navigate(`/post/${grouped.postId}`);
    }
  };

  // 💡 CORE GROUPING LOGIC
  const groupNotifications = (): GroupedNotification[] => {
    const grouped: Record<string, GroupedNotification> = {};

    notifications.forEach((notif) => {
      const postId = notif.post?._id || "";
      
      if (notif.type === "like") {
        const key = `like-${postId}`;
        
        if (!grouped[key]) {
          grouped[key] = {
            id: key,
            type: "like",
            postId,
            post: notif.post,
            senders: [],
            latestTime: notif.createdAt,
            read: true, // Optimistically start as read, then check items
            notificationIds: [],
          };
        }
        
        // Ensure unique senders in the group (based on sender _id)
        const isDuplicateSender = grouped[key].senders.some(s => s._id === notif.sender._id);
        if (!isDuplicateSender) {
            grouped[key].senders.push(notif.sender);
        }
        
        grouped[key].notificationIds.push(notif._id);
        
        if (new Date(notif.createdAt) > new Date(grouped[key].latestTime)) {
          grouped[key].latestTime = notif.createdAt;
        }
        
        // A group is UNREAD if *any* notification in it is unread
        if (!notif.read) {
          grouped[key].read = false;
        }
      } else {
        // Comments are NOT grouped
        const key = `comment-${notif._id}`;
        grouped[key] = {
          id: key,
          type: "comment",
          postId,
          post: notif.post,
          senders: [notif.sender],
          latestTime: notif.createdAt,
          message: notif.message,
          read: notif.read,
          notificationIds: [notif._id],
        };
      }
    });
    
    // Filter out groups with no senders (e.g., if all likes were removed)
    const validGroups = Object.values(grouped).filter(g => g.senders.length > 0);

    // Sort by latest action time (most recent first)
    return validGroups.sort(
      (a, b) =>
        new Date(b.latestTime).getTime() - new Date(a.latestTime).getTime()
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="text-gray-400">Loading notifications...</div>
      </div>
    );
  }

  const groupedNotifications = groupNotifications();

  return (
    <div className="min-h-screen bg-black text-white py-25">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>

        {groupedNotifications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {groupedNotifications.map((grouped) => (
              <motion.div
                key={grouped.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <NotificationCard
                  {...grouped}
                  // Pass the full grouped object's properties
                  onClick={() => handleNotificationClick(grouped)}
                  API_BASE={API_BASE} 
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;