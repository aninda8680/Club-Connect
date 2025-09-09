//components/ClubCard.tsx
import { useState } from "react";

interface ClubCardProps {
  _id: string;
  name: string;
  description: string;
}

export default function ClubCard({ _id, name, description }: ClubCardProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleJoin = async () => {
    const userId = localStorage.getItem("userId"); // saved at login
    if (!userId) {
      setMessage("Please login first");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/join/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, clubId: _id }),
      });
      const data = await res.json();
      setMessage(data.message || "Request sent!");
    } catch (err) {
      setMessage("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold text-white">{name}</h2>
      <p className="text-gray-400">{description}</p>
      <button
        onClick={handleJoin}
        disabled={loading}
        className="mt-2 bg-blue-500 px-3 py-1 rounded text-white"
      >
        {loading ? "Sending..." : "Join Club"}
      </button>
      {message && <p className="text-sm text-green-400 mt-1">{message}</p>}
    </div>
  );
}
