// EventCard.tsx
import React, { useState } from "react";
import axios from "axios";

export interface EventCardProps {
  _id: string; // needed for like/interested API
  title: string;
  description: string;
  date: string;
  venue: string;
  poster?: string;
  status?: string;
  clubName?: string;
  clubLogo?: string;
  // Optional action handlers for admin workflows
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

  const handleLike = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("Please login first");
    try {
      const res = await axios.post(`http://localhost:5000/api/events/${_id}/like`, { userId });
      setLikes(res.data.likes);
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
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="border p-4 rounded-xl shadow-md mb-4 bg-white hover:shadow-lg transition-shadow duration-300">
      {/* Club Info */}
      {clubLogo && (
        <div className="flex items-center mb-3 gap-3">
          <img
            src={clubLogo}
            alt={clubName}
            className="w-12 h-12 rounded-full object-cover"
          />
          {clubName && <p className="font-semibold text-gray-700">{clubName}</p>}
        </div>
      )}

      {/* Event Info */}
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-700 mt-1">{description}</p>
      <p className="text-sm text-gray-500 mt-1">📅 {new Date(date).toDateString()}</p>
      <p className="text-sm text-gray-500">📍 {venue}</p>

      {/* Poster */}
      {poster && (
        <img
          src={`http://localhost:5000${poster}`}
          alt="Poster"
          className="mt-2 rounded-md max-h-60 object-cover"
        />
      )}

      {/* Like & Interested */}
      <div className="flex gap-3 mt-3">
        <button
          onClick={handleLike}
          className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          👍 Like ({likes})
        </button>
        <button
          onClick={handleInterested}
          className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
        >
          ⭐ Interested ({interested})
        </button>
      </div>

      {/* Event Status */}
      {status && (
        <p className="mt-2 font-semibold text-sm text-gray-600">Status: {status}</p>
      )}

      {/* Admin Actions */}
      {(onApprove || onReject) && (
        <div className="mt-4 flex gap-2">
          {onApprove && (
            <button
              type="button"
              onClick={onApprove}
              className="px-3 py-1.5 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Approve
            </button>
          )}
          {onReject && (
            <button
              type="button"
              onClick={onReject}
              className="px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Reject
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EventCard;
