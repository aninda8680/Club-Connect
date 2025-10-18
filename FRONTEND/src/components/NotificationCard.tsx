import React from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";

// The data structure the card expects after grouping in the page component.
interface GroupedNotificationData {
    id: string; // Unique key for the grouped item
    type: "like" | "comment";
    postId: string;
    post?: { _id: string; content: string; image?: string };
    // We only need username and _id for display/tracking
    senders: Array<{ _id: string; username: string }>; 
    latestTime: string;
    message?: string; // Original message, mainly for single comments
    read: boolean;
    notificationIds: string[]; // List of IDs to mark as read
}

interface NotificationCardProps extends GroupedNotificationData {
    onClick: () => void;
    API_BASE: string; // Passed from the page for image resolution
}

const NotificationCard: React.FC<NotificationCardProps> = ({
    type,
    post,
    senders,
    latestTime,
    read,
    onClick,
    API_BASE,
}) => {
    // 💬 Helper function to generate the notification text (Instagram style)
    const renderNotificationText = () => {
        // Use a Set to ensure only unique usernames are counted/displayed
        // This is a safety measure in case grouping logic missed a duplicate sender.
        const uniqueSenders = Array.from(new Set(senders.map(s => s.username)));
        const count = uniqueSenders.length;
        
        if (type === "like") {
            const baseText = "liked your post";
            if (count === 1) {
                return (
                    <>
                        <span className="font-semibold text-white">{uniqueSenders[0]}</span> {baseText}
                    </>
                );
            } else if (count === 2) {
                return (
                    <>
                        <span className="font-semibold text-white">{uniqueSenders[0]}</span> and{" "}
                        <span className="font-semibold text-white">{uniqueSenders[1]}</span> {baseText}
                    </>
                );
            } else if (count > 2) {
                return (
                    <>
                        <span className="font-semibold text-white">{uniqueSenders[0]}</span>,{" "}
                        <span className="font-semibold text-white">{uniqueSenders[1]}</span> and{" "}
                        <span className="font-semibold text-white">{count - 2} others</span> {baseText}
                    </>
                );
            }
            return "Someone liked your post"; // Fallback
            
        } else { // type === "comment" (individual)
            const commentSender = senders[0]?.username || "A user";
            // Show commenter and a snippet of the post's content for context
            const postSnippet = post?.content.substring(0, 30).trim();
            
            return (
                <>
                    <span className="font-semibold text-white">{commentSender}</span> commented:{" "}
                    <span className="text-gray-400 italic">
                        "{postSnippet ? postSnippet + "..." : "on your post"}"
                    </span>
                </>
            );
        }
    };
    
    // ⏱️ Helper function for time formatting
    const timeAgo = (dateStr: string) => {
        const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
        return `${Math.floor(diff / 604800)}w ago`;
    };

    const icon =
        type === "like" ? (
            <Heart className="text-red-500 w-5 h-5" fill="currentColor" />
        ) : (
            <MessageCircle className="text-blue-400 w-5 h-5" />
        );

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            onClick={onClick}
            // Background changes based on read status
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                read ? "bg-gray-900 hover:bg-gray-800" : "bg-gray-800 hover:bg-gray-700"
            }`}
        >
            {/* Icon Container */}
            <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    type === "like" ? "bg-red-500/20" : "bg-blue-500/20"
                }`}
            >
                {icon}
            </div>
            
            {/* Content Text */}
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200 leading-relaxed">
                    {renderNotificationText()}
                </p>
                <p className="text-xs text-gray-500 mt-1">{timeAgo(latestTime)}</p>
            </div>

            {/* Post Image Thumbnail */}
            {post?.image && (
                <div className="flex-shrink-0">
                    <img
                        src={
                            post.image.startsWith("http")
                                ? post.image
                                : `${API_BASE}${post.image}`
                        }
                        alt="Post"
                        className="w-14 h-14 rounded-md object-cover border border-gray-700"
                        onError={(e) => {
                            e.currentTarget.src = "/placeholder.png"; // Fallback
                        }}
                    />
                </div>
            )}

            {/* Unread indicator */}
            {!read && (
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500" />
            )}
        </motion.div>
    );
};

export default NotificationCard;