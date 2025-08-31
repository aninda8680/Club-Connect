import { useEffect, useState } from "react";
import axios from "axios";

export default function CreateClub() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coordinatorId, setCoordinatorId] = useState("");
  const [coordinators, setCoordinators] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  

  // Fetch all users & filter coordinators
  useEffect(() => {
    const fetchCoordinators = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/users");

        console.log("Raw response from backend:", res.data);

        // If backend returns { users: [...] }
        const usersArray = Array.isArray(res.data) ? res.data : res.data.users || [];
        const filtered = usersArray.filter((u: any) => u.role === "coordinator");
        setCoordinators(filtered);

      } catch (err) {
        console.error("Error fetching coordinators", err);
      }
    };
    fetchCoordinators();
  }, []);

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !coordinatorId) {
      setMessage("All fields are required");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await axios.post("http://localhost:5000/api/clubs", {
        name,
        description,
        coordinatorId,
      });
      setMessage("✅ Club created successfully!");
      setName("");
      setDescription("");
      setCoordinatorId("");
    } catch (err: any) {
      setMessage("❌ Error creating club: " + err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create New Club</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Club Name */}
        <div>
          <label className="block text-sm mb-1">Club Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none"
          />
        </div>

        {/* Club Description */}
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none"
          />
        </div>

        {/* Coordinator Dropdown */}
        <div>
          <label className="block text-sm mb-1">Select Coordinator</label>
          <select
            value={coordinatorId}
            onChange={(e) => setCoordinatorId(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none"
          >
            <option value="">-- Select Coordinator --</option>
            {coordinators.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username} ({user.email})
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded text-white font-semibold disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Club"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm">{message}</p>
      )}
    </div>
  );
}
