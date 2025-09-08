import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  UserCog, 
  Save, 
  RefreshCw, 
  Terminal,
  Shield,
  UserCheck,
  User,
  Eye,
  Search,
  X
} from "lucide-react";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

export default function ManageRoles() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [changedRoles, setChangedRoles] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/users");
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (id: string, role: string) => {
    setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
    setFilteredUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
    setChangedRoles((prev) => ({ ...prev, [id]: role }));
  };

  const applyChanges = async () => {
    try {
      setSaving(true);
      const updates = Object.entries(changedRoles);

      for (const [id, role] of updates) {
        await axios.put(`http://localhost:5000/api/admin/users/${id}/role`, { role });
      }

      setChangedRoles({});
      // Show success feedback
    } catch (err) {
      console.error(err);
      // Show error feedback
    } finally {
      setSaving(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return <Shield className="w-4 h-4 text-red-400" />;
      case "coordinator": return <UserCheck className="w-4 h-4 text-blue-400" />;
      case "leader": return <User className="w-4 h-4 text-green-400" />;
      case "visitor": return <Eye className="w-4 h-4 text-purple-400" />;
      default: return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "text-red-400";
      case "coordinator": return "text-blue-400";
      case "leader": return "text-green-400";
      case "visitor": return "text-purple-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="p-3 bg-gradient-to-br from-purple-900/70 to-pink-900/70 rounded-xl border border-purple-700/50">
            <Terminal className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Manage User Roles
            </h1>
            <p className="text-slate-400 text-sm">
              <span className="text-green-400">$</span> Configure user permissions and access levels
            </p>
          </div>
        </motion.div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <UserCog className="w-5 h-5 text-purple-400" />
              <span className="text-slate-300">
                {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} 
                {searchTerm && ` found for "${searchTerm}"`}
                {searchTerm && filteredUsers.length === 0 && ' - no matches'}
              </span>
            </div>
            
            <div className="flex gap-3 flex-col sm:flex-row w-full sm:w-auto">
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={fetchUsers}
                  className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 rounded-lg border border-slate-700/50 transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </motion.button>
                
                {Object.keys(changedRoles).length > 0 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={applyChanges}
                    disabled={saving}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {saving ? "Saving..." : "Apply Changes"}
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden"
        >
          {loading ? (
            // Loading Skeleton
            <div className="p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
                  className="h-16 bg-slate-800/50 rounded-lg border border-slate-700/50"
                />
              ))}
            </div>
          ) : users.length === 0 ? (
            // No users state
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-400 mb-2">No users found</h3>
              <p className="text-slate-500">There are no users in the system</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            // No search results state
            <div className="p-12 text-center">
              <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-400 mb-2">No users found</h3>
              <p className="text-slate-500">No users match your search criteria</p>
              <button
                onClick={clearSearch}
                className="mt-4 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 rounded-lg border border-slate-700/50 transition-colors"
              >
                Clear Search
              </button>
            </div>
          ) : (
            // Users table
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="p-4 text-left text-slate-400 font-semibold">User</th>
                    <th className="p-4 text-left text-slate-400 font-semibold">Email</th>
                    <th className="p-4 text-left text-slate-400 font-semibold">Current Role</th>
                    <th className="p-4 text-left text-slate-400 font-semibold">Change Role</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-slate-400" />
                            </div>
                            <span className="font-medium">{user.username}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-300">{user.email}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {getRoleIcon(user.role)}
                            <span className={getRoleColor(user.role)}>{user.role}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            className="w-full max-w-xs p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                          >
                            <option value="admin" className="bg-slate-800">Admin</option>
                            <option value="coordinator" className="bg-slate-800">Coordinator</option>
                            <option value="leader" className="bg-slate-800">Leader</option>
                            <option value="visitor" className="bg-slate-800">Visitor</option>
                          </select>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-slate-500 text-sm"
        >
          <p>Configure user roles and permissions across the platform</p>
          <code className="bg-slate-900/50 px-2 py-1 rounded text-xs mt-2 inline-block">
            $ admin config --Coordinators
          </code>
        </motion.div>
      </div>
    </div>
  );
}