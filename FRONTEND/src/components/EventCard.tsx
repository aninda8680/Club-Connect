import React from "react";

interface EventCardProps {
  title: string;
  description: string;
  date: string;
  venue: string;
  status?: string;
  onApprove?: () => void;
  onReject?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  description,
  date,
  venue,
  status,
  onApprove,
  onReject,
}) => {
  return (
    <div className="border p-4 rounded-xl shadow-md mb-4 bg-white">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-700">{description}</p>
      <p className="text-sm text-gray-500">📅 {new Date(date).toDateString()}</p>
      <p className="text-sm text-gray-500">📍 {venue}</p>
      {status && <p className="mt-2 font-semibold">Status: {status}</p>}

      {(onApprove || onReject) && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={onApprove}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Approve
          </button>
          <button
            onClick={onReject}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default EventCard;
