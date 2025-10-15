import React from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";
import { getBaseUrl } from "@/utils/getBaseUrl";

interface NotificationProps {
  _id: string;
  sender: { username: string; email: string };
  post?: { _id: string; content: string; image?: string };
  type: "like" | "comment";
  message: string;
  createdAt: string;
  read: boolean;
  onClick?: () => void;
}

const NotificationCard: React.FC<NotificationProps> = ({
  sender,
  post,
  type,
  message,
  createdAt,
  read,
  onClick,
}) => {
  const icon =
    type === "like" ? (
      <Heart className="text-red-500 w-5 h-5" fill="currentColor" />
    ) : (
      <MessageCircle className="text-blue-400 w-5 h-5" />
    );

  const timeAgo = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`flex items-center justify-between p-3 rounded-xl border border-gray-800 cursor-pointer ${
        read ? "bg-gray-900" : "bg-gray-800"
      } hover:bg-gray-700 transition`}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-900 rounded-full">{icon}</div>
        <div>
          <p className="text-sm text-gray-200">
            <span className="font-semibold text-white">
              {sender.username}
            </span>{" "}
            {message}
          </p>
          <p className="text-xs text-gray-500">{timeAgo(createdAt)}</p>
        </div>
      </div>

      {post?.image && (
        <img
          src={`${getBaseUrl()}${post.image}`}
          alt="Post thumbnail"
          className="w-12 h-12 rounded-md object-cover border border-gray-700"
        />
      )}
    </motion.div>
  );
};

export default NotificationCard;