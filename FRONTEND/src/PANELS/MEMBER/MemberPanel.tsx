//MEMBER/MemberPanel.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Club {
  name: string;
  coordinator: { username: string; email: string };
}

export default function MemberPanel() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const clubId = localStorage.getItem("clubId");

  const [club, setClub] = useState<Club | null>(null);

  useEffect(() => {
    if (clubId) {
      fetch(`http://localhost:5000/api/clubs/${clubId}`)
        .then((res) => res.json())
        .then((data) => setClub(data))
        .catch(() => setClub(null));
    }
  }, [clubId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/"); // redirect to landing page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white space-y-6">
      <h1 className="text-3xl font-bold">
        Welcome Member, {username} 🌍
      </h1>

      {club ? (
        <div className="text-center space-y-2">
          <p className="text-lg">
            You are a member of <span className="font-semibold">{club.name}</span>
          </p>
          <p className="text-md text-gray-200">
            Coordinator:{" "}
            <span className="font-medium">{club.coordinator.username}</span>{" "}
            ({club.coordinator.email})
          </p>
        </div>
      ) : (
        <p className="text-gray-300">Fetching club details...</p>
      )}

      <button
        onClick={handleLogout}
        className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow-lg transition"
      >
        Logout
      </button>
    </div>
  );
}
