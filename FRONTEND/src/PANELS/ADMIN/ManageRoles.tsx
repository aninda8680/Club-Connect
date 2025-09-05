import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

export default function ManageRoles() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [changedRoles, setChangedRoles] = useState<Record<string, string>>({}); // store role changes

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle local change only
  const handleRoleChange = (id: string, role: string) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, role } : u))
    );
    setChangedRoles((prev) => ({ ...prev, [id]: role }));
  };

  // Send changes to backend when update button is clicked
  const applyChanges = async () => {
    try {
      const updates = Object.entries(changedRoles);

      for (const [id, role] of updates) {
        await axios.put(`http://localhost:5000/api/admin/users/${id}/role`, { role });
      }

      setChangedRoles({}); // reset after update
      alert("Roles updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating roles");
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Users & Roles</h2>
        {Object.keys(changedRoles).length > 0 && (
          <button
            onClick={applyChanges}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update
          </button>
        )}
      </div>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Username</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-center">
                <td className="p-2 border text-white">{user.username}</td>
                <td className="p-2 border text-white">{user.email}</td>
                <td className="p-2 border text-white">{user.role}</td>
                <td className="p-2 border text-white">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="border rounded text-white p-1"
                  >
                    <option value="admin">Admin</option>
                    <option value="coordinator">Coordinator</option>
                    <option value="leader">Leader</option>
                    <option value="visitor">Visitor</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
