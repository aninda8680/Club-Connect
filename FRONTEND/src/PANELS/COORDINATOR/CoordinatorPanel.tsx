import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CoordinatorPanel() {
  console.log("CoordinatorPanel rendered");
  console.log("userId from localStorage:", localStorage.getItem("userId"));
  console.log("username from localStorage:", localStorage.getItem("username"));
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [clubName, setClubName] = useState("");


  useEffect(() => {
  const fetchClub = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return console.warn("No userId in localStorage");

    try {
      const res = await axios.get(`https://club-connect-xcq2.onrender.com/api/coordinator/myclub/${userId}`);
      if (res.data.clubName) setClubName(res.data.clubName);
    } catch (err) {
      console.error("Error fetching club", err);
    }
  };

  fetchClub();
}, []);


  const handleLogout = () => {
    navigate("/"); // redirect to landing page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-900 text-white space-y-6">
      <h1 className="text-3xl font-bold">
        Welcome Coordinator, {username} 🌍
      </h1>

      {clubName ? (
        <p className="text-lg">
          You are managing the <span className="font-semibold">{clubName}</span> club 🎉
        </p>
      ) : (
        <p className="text-lg text-gray-300">You are not assigned to any club yet.</p>
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
