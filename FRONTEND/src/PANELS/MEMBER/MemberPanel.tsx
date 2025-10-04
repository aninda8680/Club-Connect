//MEMBER/MemberPanel.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Defines the structure for a Club object
interface Club {
  name: string;
  coordinator: { username: string; email: string };
}

export default function MemberPanel() {
  const navigate = useNavigate();
  // Retrieve user-specific data from local storage
  const username = localStorage.getItem("username");
  const clubId = localStorage.getItem("clubId");

  // State to store the fetched club details
  const [club, setClub] = useState<Club | null>(null);

  // useEffect hook to fetch club details when the component mounts or clubId changes
  useEffect(() => {
    if (clubId) {
      // API call to fetch club data
      fetch(`http://localhost:5000/api/clubs/${clubId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then((data) => setClub(data))
        .catch((error) => {
          console.error("Error fetching club details:", error);
          setClub(null); // Set to null on error to handle the display state
        });
    }
  }, [clubId]);

  // Handler for user logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/"); // redirect to landing page
  };

  return (
    // Main container: full screen, black background, centered content
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">

      {/* Panel container for a clean, contained look */}
      <div className="w-full max-w-lg p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-2 border-b border-gray-700 pb-6">
          <h1 className="text-4xl font-extrabold text-blue-400 tracking-tight">
            Member Dashboard
          </h1>
          <p className="text-xl text-gray-300">
            Welcome, <span className="font-semibold text-blue-300">{username || 'Guest'}</span>
          </p>
        </div>

        {/* Club Details Section */}
        <div className="space-y-6">
          {club ? (
            <div className="bg-gray-700 p-6 rounded-lg shadow-inner">
              <h2 className="text-2xl font-bold mb-3 text-blue-400 border-b border-gray-600 pb-2">
                Your Club:
              </h2>
              <div className="space-y-3">
                <p className="text-lg flex justify-between items-center">
                  <span className="text-gray-300">Name:</span>
                  <span className="font-bold text-xl text-white">{club.name}</span>
                </p>
                <div className="pt-2 border-t border-gray-600">
                  <h3 className="text-md font-semibold text-gray-300 mb-1">
                    Coordinator Details:
                  </h3>
                  <p className="text-md pl-4">
                    <span className="font-medium text-gray-200">{club.coordinator.username}</span> 
                    <span className="text-gray-400"> • {club.coordinator.email}</span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-700 rounded-lg">
              <p className="text-gray-400 font-medium">
                {clubId ? 'Loading club details...' : 'Club ID not found.'}
              </p>
            </div>
          )}
        </div>

        {/* Action Section */}
        <div className="pt-4">
          <button
            onClick={handleLogout}
            className="w-full px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold text-lg rounded-xl shadow-lg transition duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            aria-label="Logout and clear session"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}