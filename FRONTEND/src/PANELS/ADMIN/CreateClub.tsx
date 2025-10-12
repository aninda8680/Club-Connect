import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Users, BookOpen, UserCheck, Terminal } from "lucide-react";

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

        // console.log("Raw response from backend:", res.data);

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
    <div className="min-h-screen bg-black text-white py-25">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="p-3 bg-gradient-to-br from-blue-900/70 to-purple-900/70 rounded-xl border border-blue-700/50">
            <Terminal className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Create New Club
            </h1>
            <p className="text-slate-400 text-sm">
              <span className="text-green-400">$</span> Initialize a new club instance
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Club Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                Club Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="Enter club name"
              />
            </motion.div>

            {/* Club Description */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="Describe the club's purpose and activities"
              />
            </motion.div>

            {/* Coordinator Dropdown */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                Select Coordinator
              </label>
              <select
                value={coordinatorId}
                onChange={(e) => setCoordinatorId(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
              >
                <option value="">-- Select Coordinator --</option>
                {coordinators.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.username} ({user.email})
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pt-4"
            >
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 py-3 rounded-lg text-white font-semibold disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5" />
                    Create Club
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mt-6 p-3 rounded-lg text-center text-sm ${
                message.includes("✅") 
                  ? "bg-emerald-900/30 text-emerald-400 border border-emerald-800/50" 
                  : "bg-rose-900/30 text-rose-400 border border-rose-800/50"
              }`}
            >
              {message}
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-slate-500 text-sm"
        >
          <p>Use this form to initialize new club instances in the system</p>
          <code className="bg-slate-900/50 px-2 py-1 rounded text-xs mt-2 inline-block">
            $ admin create --club
          </code>
        </motion.div>
      </div>
    </div>
  );
}