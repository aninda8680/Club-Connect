import { useEffect, useState } from "react";
import axios from "axios";

export default function CoordinatorMembers() {
  const [members, setMembers] = useState([]);
  const clubId = localStorage.getItem("clubId"); // make sure this is stored when coordinator logs in

  useEffect(() => {
    if (!clubId) return;
    axios
      .get(`http://localhost:5000/api/clubs/${clubId}/members`)
      .then((res) => setMembers(res.data))
      .catch((err) => console.error("Error fetching members:", err));
  }, [clubId]);

  const handleRemove = async (userId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/clubs/${clubId}/members/${userId}`);
      setMembers((prev) => prev.filter((m: any) => m._id !== userId));
    } catch (err) {
      console.error("Error removing member:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Club Members</h2>
      {members.length === 0 ? (
        <p>No members yet</p>
      ) : (
        <ul className="space-y-3">
          {members.map((m: any) => (
            <li
              key={m._id}
              className="flex items-center justify-between bg-gray-100 p-3 rounded"
            >
              <span>{m.username} ({m.email})</span>
              <button
                onClick={() => handleRemove(m._id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
