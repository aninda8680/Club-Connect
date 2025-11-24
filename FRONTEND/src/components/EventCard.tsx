// EventCard.tsx
import React, { useState } from "react";
import api from "@/api";
import { getBaseUrl } from "../utils/getBaseUrl";
import { motion } from "framer-motion";
import { FiHeart, FiStar, FiCalendar, FiMapPin, FiCheck, FiX } from "react-icons/fi";

export interface EventCardProps {
  _id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  poster?: string;
  status?: string;
   category?: string;
  clubName?: string;
  clubLogo?: string;
  onApprove?: () => void | Promise<void>;
  onReject?: () => void | Promise<void>;

  // NEW OPTIONAL UI PROPS
  showActions?: boolean;     // Like + Interested
  showAdmin?: boolean;       // Approve / Reject
  clickable?: boolean;       // Full card is clickable
  showDescription?: boolean; // Full description
}

const categoryColors: Record<string, string> = {
  hackathon: "bg-red-500/20 text-red-300 border-red-500/40",
  tech: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  workshop: "bg-green-500/20 text-green-300 border-green-500/40",
  esports: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  cultural: "bg-pink-500/20 text-pink-300 border-pink-500/40",
  seminar: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  competition: "bg-orange-500/20 text-orange-300 border-orange-500/40",
  other: "bg-gray-500/20 text-gray-300 border-gray-500/40",
};


const EventCard: React.FC<EventCardProps> = ({
  _id,
  title,
  description,
  date,
  venue,
  poster,
  status,
  category,
  clubName,
  clubLogo,
  onApprove,
  onReject,

  // UI props with sensible defaults
  showActions = true,
  showAdmin = false,
  clickable = false,
  showDescription = true,
}) => {
  const [likes, setLikes] = useState(0);
  const [interested, setInterested] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isInterested, setIsInterested] = useState(false);

  const isLoggedIn = Boolean(localStorage.getItem("userId"));

  const handleLike = async () => {
    if (!isLoggedIn) return alert("Please login first");
    try {
      const res = await api.post(`/events/${_id}/like`, { userId: localStorage.getItem("userId") });
      setLikes(res.data.likes);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInterested = async () => {
    if (!isLoggedIn) return alert("Please login first");
    try {
      const res = await api.post(`/events/${_id}/interested`, { userId: localStorage.getItem("userId") });
      setInterested(res.data.interested);
      setIsInterested(!isInterested);
    } catch (err) {
      console.error(err);
    }
  };

  const eventDate = new Date(date);
  const isUpcoming = eventDate > new Date();
  const isToday = eventDate.toDateString() === new Date().toDateString();

  return (
    <motion.div
      className={`group relative ${clickable ? "cursor-pointer" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      // onClick={clickable ? () => window.location.href = `/events/${_id}` : undefined}
    >
      {/* Gradient Border */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>

      <div className="relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 group-hover:border-red-500/50 transition-all duration-500 backdrop-blur-sm">

        {/* Poster */}
        {poster ? (
          <div className="relative h-48 overflow-hidden">
            <img
              src={`${getBaseUrl()}${poster}`}
              alt="Event Poster"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent"></div>

            {(clubLogo || clubName) && (
              <div className="absolute top-4 left-4 flex items-center gap-2">
                {clubLogo && (
                  <img src={clubLogo} alt={clubName} className="w-8 h-8 rounded-full border-2 border-white/20" />
                )}
                {clubName && (
                  <span className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white border border-white/10">
                    {clubName}
                  </span>
                )}
              </div>
            )}

            {status && (
              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border ${
                    status === "approved"
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : status === "pending"
                      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-red-500/20 to-purple-500/20 flex items-center justify-center">
            <FiCalendar className="text-red-400 mb-2" size={32} />
            <h3 className="text-white font-bold text-lg">{title}</h3>
          </div>
        )}

        {/* Content */}
        <div className="p-6">

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors line-clamp-2">
            {title}
          </h3>

{/* Category Badge */}
{category && (
  <span className={`inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold border 
    ${categoryColors[category] || categoryColors.other}`}
  >
    {category.toUpperCase()}
  </span>
)}



          {/* Description */}
          {showDescription && (
            <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
              {description}
            </p>
          )}

          {/* Venue */}
          <div className="mt-3 flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
              <FiMapPin className="text-red-400" size={14} />
            </div>
            <span className="text-gray-300">{venue}</span>
          </div>

          {/* Date */}
          <div className="mt-3 flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <FiCalendar className="text-purple-400" size={14} />
            </div>
            <div className="text-gray-300">
              <div>
                {eventDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-5 flex items-center justify-between">

            {/* User actions */}
            {showActions && (
              <div className="flex gap-3">

                {/* Like */}
                <motion.button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    isLiked
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiHeart className={isLiked ? "fill-red-400" : ""} size={16} />
                  <span>{likes}</span>
                </motion.button>

                {/* Interested */}
                <motion.button
                  onClick={handleInterested}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    isInterested
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      : "bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:bg-yellow-500/20 hover:text-yellow-400 hover:border-yellow-500/30"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiStar className={isInterested ? "fill-yellow-400" : ""} size={16} />
                  <span>{interested}</span>
                </motion.button>
              </div>
            )}

            {/* Admin actions */}
            {showAdmin && (onApprove || onReject) && (
              <div className="flex gap-2">
                {onApprove && (
                  <motion.button
                    onClick={onApprove}
                    className="px-4 py-2 bg-green-500/20 text-green-400 rounded-xl border border-green-500/30 hover:bg-green-500/30"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiCheck size={16} /> Approve
                  </motion.button>
                )}
                {onReject && (
                  <motion.button
                    onClick={onReject}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 hover:bg-red-500/30"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiX size={16} /> Reject
                  </motion.button>
                )}
              </div>
            )}
          </div>

          {/* Upcoming Badge */}
          {isUpcoming && !isToday && (
            <div className="mt-4 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 rounded-xl border border-blue-500/30">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-blue-400 text-sm font-semibold">Upcoming Event</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
