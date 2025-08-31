import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  _id: string;
  username: string;
  email: string;
}

interface Club {
  _id: string;
  name: string;
  description: string;
  coordinator: {
    _id: string;
    username: string;
    email: string;
  };
}

export default function ManageClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [coordinators, setCoordinators] = useState<User[]>([]);
  const [clubName, setClubName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCoordinator, setSelectedCoordinator] = useState("");

  // Fetch coordinators
  useEffect(() => {
    axios.get("/api/admin/users")
      .then(res => {
        const coordinatorsOnly = res.data.filter((u: any) => u.role === "coordinator");
        setCoordinators(coordinatorsOnly);
      })
      .catch(err => console.error("Error fetching coordinators:", err));
  }, []);

  // Fetch existing clubs
  useEffect(() => {
    axios.get("/api/clubs")
      .then(res => setClubs(res.data))
      .catch(err => console.error("Error fetching clubs:", err));
  }, []);

  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubName || !selectedCoordinator) {
      alert("Club name and coordinator are required!");
      return;
    }

    try {
      const res = await axios.post("/api/clubs", {
        name: clubName,
        description,
        coordinatorId: selectedCoordinator,
      });

      setClubs([...clubs, res.data]);
      setClubName("");
      setDescription("");
      setSelectedCoordinator("");
    } catch (err: any) {
      console.error("Error creating club:", err);
      alert(err.response?.data?.error || "Error creating club");
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Manage Clubs</h2>

      {/* Create Club Form */}
      <form onSubmit={handleCreateClub} className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Club Name"
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600"
        />
        <select
          value={selectedCoordinator}
          onChange={(e) => setSelectedCoordinator(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600"
        >
          <option value="">Select Coordinator</option>
          {coordinators.map((coord) => (
            <option key={coord._id} value={coord._id}>
              {coord.username} ({coord.email})
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
        >
          Create Club
        </button>
      </form>

      {/* Club List */}
      <h3 className="text-xl font-semibold mb-2">Existing Clubs</h3>
      {clubs.length === 0 ? (
        <p>No clubs created yet.</p>
      ) : (
        <ul className="space-y-2">
          {clubs.map((club) => (
            <li key={club._id} className="p-3 bg-gray-800 rounded">
              <p className="font-bold">{club.name}</p>
              <p className="text-sm text-gray-300">{club.description}</p>
              <p className="text-sm">
                Coordinator:{" "}
                <span className="text-green-400">
                  {club.coordinator?.username} ({club.coordinator?.email})
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
