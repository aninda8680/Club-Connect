// EventCard.tsx
import React from "react";

export interface EventCardProps {
  title: string;
  description: string;
  date: string;
  venue: string;
  status?: string;
  clubName?: string;
  clubLogo?: string;
  // Optional action handlers for admin workflows
  onApprove?: () => void | Promise<void>;
  onReject?: () => void | Promise<void>;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  description,
  date,
  venue,
  status,
  clubName,
  clubLogo,
  onApprove,
  onReject,
}) => {
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