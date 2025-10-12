// EventCard.tsx
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiHeart, FiStar, FiCalendar, FiMapPin, FiUsers, FiCheck, FiX } from "react-icons/fi";

export interface EventCardProps {
  _id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  poster?: string;
  status?: string;
  clubName?: string;
  clubLogo?: string;
  onApprove?: () => void | Promise<void>;
  onReject?: () => void | Promise<void>;
}

const EventCard: React.FC<EventCardProps> = ({
  _id,
  title,
  description,
  date,
  venue,
  poster,
  status,
  clubName,
  clubLogo,
  onApprove,
  onReject,
}) => {
  const [likes, setLikes] = useState(0);
  const [interested, setInterested] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isInterested, setIsInterested] = useState(false);

  const handleLike = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("Please login first");
    try {
      const res = await axios.post(`http://localhost:5000/api/events/${_id}/like`, { userId });
      setLikes(res.data.likes);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInterested = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("Please login first");
    try {
      const res = await axios.post(`http://localhost:5000/api/events/${_id}/interested`, { userId });
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
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
      
      <div className="relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 group-hover:border-red-500/50 transition-all duration-500 backdrop-blur-sm">
        
        {/* Event Poster */}
        {poster ? (
          <div className="relative h-48 overflow-hidden">
            <img
              src={`http://localhost:5000${poster}`}
              alt="Event Poster"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent"></div>
            
            {/* Club Info Overlay */}
            {(clubLogo || clubName) && (
              <div className="absolute top-4 left-4 flex items-center gap-2">
                {clubLogo && (
                  <img
                    src={clubLogo}
                    alt={clubName}
                    className="w-8 h-8 rounded-full border-2 border-white/20"
                  />
                )}
                {clubName && (
                  <span className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white border border-white/10">
                    {clubName}
                  </span>
                )}
              </div>
            )}
            
            {/* Status Badge */}
            {status && (
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border ${
                  status === 'approved' 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : status === 'pending'
                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                }`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
            )}
            
            {/* Date Badge */}
            <div className="absolute bottom-4 left-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-black/60 backdrop-blur-sm rounded-xl border border-white/10">
                <FiCalendar className="text-red-400" size={14} />
                <div className="text-white text-sm">
                  <div className="font-bold">{eventDate.toLocaleDateString('en-US', { day: 'numeric' })}</div>
                  <div className="text-xs opacity-80">{eventDate.toLocaleDateString('en-US', { month: 'short' })}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          
          <div className="h-48 bg-gradient-to-br from-red-500/20 to-purple-500/20 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <FiCalendar className="text-red-400 mx-auto mb-2" size={32} />
                <h3 className="text-white font-bold text-lg">{title}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Event Content */}
        <div className="p-6">
          {/* Event Title & Description */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors line-clamp-2">
              {title}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
              {description}
            </p>
          </div>

          {/* Event Details */}
          <div className="space-y-3 mb-6">
            {/* Venue */}
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                <FiMapPin className="text-red-400" size={14} />
              </div>
              <span className="text-gray-300">{venue}</span>
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <FiCalendar className="text-purple-400" size={14} />
              </div>
              <div className="text-gray-300">
                <div>{eventDate.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</div>
                <div className="text-xs text-gray-400">
                  {eventDate.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>

            {/* Time Status */}
            {isToday && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30 w-fit">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs font-semibold">Happening Today!</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            {/* Like & Interested Buttons */}
            <div className="flex gap-3">
              <motion.button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  isLiked
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiHeart className={isLiked ? 'fill-red-400' : ''} size={16} />
                <span>{likes}</span>
              </motion.button>

              <motion.button
                onClick={handleInterested}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  isInterested
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:bg-yellow-500/20 hover:text-yellow-400 hover:border-yellow-500/30'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiStar className={isInterested ? 'fill-yellow-400' : ''} size={16} />
                <span>{interested}</span>
              </motion.button>
            </div>

            {/* Admin Actions */}
            {(onApprove || onReject) && (
              <div className="flex gap-2">
                {onApprove && (
                  <motion.button
                    onClick={onApprove}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-xl border border-green-500/30 hover:bg-green-500/30 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiCheck size={16} />
                    Approve
                  </motion.button>
                )}
                {onReject && (
                  <motion.button
                    onClick={onReject}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 hover:bg-red-500/30 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiX size={16} />
                    Reject
                  </motion.button>
                )}
              </div>
            )}
          </div>

          {/* Upcoming Indicator */}
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