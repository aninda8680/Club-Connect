import api from "@/api";
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// Defines the structure for a Club object
interface Club {
  name: string;
  coordinator: { username: string; email: string };
}

interface Announcement {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
}

export default function MemberPanel() {
  // const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const clubId = localStorage.getItem("clubId");

  const [club, setClub] = useState<Club | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

  // Fetch club info
  useEffect(() => {
    if (!clubId) return;
    const fetchClub = async () => {
      try {
        const res = await api.get(`/clubs/${clubId}`);
        setClub(res.data);
      } catch (error) {
        console.error("Error fetching club details:", error);
        setClub(null);
      }
    };
    fetchClub();
  }, [clubId]);

  // Fetch club announcements
  useEffect(() => {
    if (!clubId) return;
    const fetchAnnouncements = async () => {
      setLoadingAnnouncements(true);
      try {
        const res = await api.get(`/announcements?clubId=${clubId}`);
        setAnnouncements(res.data);
      } catch (err) {
        console.error("Failed to fetch announcements", err);
        setAnnouncements([]);
      } finally {
        setLoadingAnnouncements(false);
      }
    };
    fetchAnnouncements();
  }, [clubId]);

  // const handleLogout = () => {
  //   localStorage.clear();
  //   navigate("/");
  // };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-950 text-white pt-25 px-4 py-8 space-y-8">

      {/* Dashboard Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-blue-400 tracking-tight">
          Member Dashboard
        </h1>
        <p className="text-xl text-gray-300">
          Welcome, <span className="font-semibold text-blue-300">{username || 'Guest'}</span>
        </p>
      </div>

      {/* Club Info Box */}
      <div className="w-full max-w-lg bg-slate-900/70 p-6 rounded-xl shadow-2xl border border-gray-700 space-y-4">
        <h2 className="text-2xl font-bold text-blue-400 border-b border-gray-600 pb-2">
          Your Club
        </h2>
        {club ? (
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
        ) : (
          <p className="text-gray-400 font-medium">{clubId ? 'Loading club details...' : 'Club ID not found.'}</p>
        )}
      </div>

      {/* Announcements Box */}
      {clubId && (
        <div className="w-full max-w-lg bg-slate-900/70 p-6 rounded-xl shadow-inner space-y-4 max-h-96 overflow-y-auto">
          <h2 className="text-2xl font-bold text-blue-400 border-b border-gray-600 pb-2">
            Announcements
          </h2>
          {loadingAnnouncements ? (
            <p className="text-gray-400">Loading announcements...</p>
          ) : announcements.length === 0 ? (
            <p className="text-gray-400">No announcements yet.</p>
          ) : (
            announcements.map(a => (
              <div key={a._id} className="p-3 bg-gray-800 rounded border border-gray-600">
                <h3 className="font-semibold text-white">{a.title}</h3>
                <p className="text-gray-300">{a.message}</p>
                <span className="text-gray-500 text-xs">{new Date(a.createdAt).toLocaleString()}</span>
              </div>
            ))
          )}
        </div>
      )}

      
    </div>
  );
}
