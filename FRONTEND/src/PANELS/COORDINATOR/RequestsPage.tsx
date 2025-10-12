import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Mail,
  BookOpen,
  GraduationCap,
  // Calendar,
  Terminal,
  Sparkles,
  AlertCircle
} from "lucide-react";

interface Request {
  _id: string;
  user: { 
    username: string; 
    email: string;
    course: string;
    stream: string;
    year: string;
    semester: string;
  }
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const clubId = localStorage.getItem("clubId");
  const course = localStorage.getItem("Course") || "";
  const stream = localStorage.getItem("Stream") || "";
  const year = localStorage.getItem("Year") || "";
  const semester = localStorage.getItem("Semester") || "";

  useEffect(() => {
    if (!clubId) {
      console.warn("⚠️ No clubId found in localStorage");
      setLoading(false);
      return;
    }

    console.log("Fetching requests for clubId:", clubId);
    setLoading(true);

    fetch(`http://localhost:5000/api/join/club/${clubId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched requests:", data);
        const updatedRequests = data.map((req: Request) => ({
          ...req,
          course,
          stream,
          year,
          semester,
        }));
        setRequests(updatedRequests);
      })
      .catch((err) => {
        console.error("Error fetching join requests:", err);
        setRequests([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [clubId, course, stream, year, semester]);

  const handleAction = async (id: string, action: string) => {
    setProcessing(id);
    try {
      await fetch(`http://localhost:5000/api/join/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error processing request:", err);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-25">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="p-3 bg-gradient-to-br from-amber-900/70 to-orange-900/70 rounded-xl border border-amber-700/50">
            <Terminal className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Membership Requests
            </h1>
            <p className="text-slate-400 text-sm">
              <span className="text-green-400">$</span> Manage club membership requests
            </p>
          </div>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Request Queue
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 text-center">
              <div className="text-2xl font-bold text-amber-400">{requests.length}</div>
              <div className="text-slate-400 text-sm">Pending</div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 text-center">
              <div className="text-2xl font-bold text-blue-400">0</div>
              <div className="text-slate-400 text-sm">Approved</div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 text-center">
              <div className="text-2xl font-bold text-green-400">0</div>
              <div className="text-slate-400 text-sm">Total Members</div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 text-center">
              <div className="text-2xl font-bold text-purple-400">0</div>
              <div className="text-slate-400 text-sm">Capacity</div>
            </div>
          </div>
        </motion.div>

        {/* Requests List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl p-6"
        >
          {!clubId ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-400 mb-2">Club Access Required</h3>
              <p className="text-slate-400">Please log in as a coordinator with club assignment</p>
            </div>
          ) : loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
                  className="h-32 bg-slate-800/50 rounded-lg border border-slate-700/50"
                />
              ))}
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-400 mb-2">No Pending Requests</h3>
              <p className="text-slate-500">All membership requests have been processed</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {requests.map((req, index) => (
                  <motion.div
                    key={req._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="p-5 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600/70 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{req.user?.username}</h3>
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                              <Mail className="w-4 h-4" />
                              <span>{req.user?.email}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          {req.user?.course && req.user?.stream && (
                            <div className="flex items-center gap-2 text-slate-300">
                              <BookOpen className="w-4 h-4 text-blue-400" />
                              <span>{req.user.course} - {req.user.stream}</span>
                            </div>
                          )}
                          {(req.user?.year || req.user?.semester) && (
                            <div className="flex items-center gap-2 text-slate-300">
                              <GraduationCap className="w-4 h-4 text-green-400" />
                              <span>Year {req.user.year}, Sem {req.user.semester}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: processing === req._id ? 1 : 1.05 }}
                          whileTap={{ scale: processing === req._id ? 1 : 0.95 }}
                          onClick={() => handleAction(req._id, "accept")}
                          disabled={processing === req._id}
                          className="px-4 py-2 bg-emerald-900/30 hover:bg-emerald-800/50 text-emerald-400 rounded-lg border border-emerald-800/50 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                          {processing === req._id ? (
                            <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                          {processing === req._id ? "Processing..." : "Accept"}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: processing === req._id ? 1 : 1.05 }}
                          whileTap={{ scale: processing === req._id ? 1 : 0.95 }}
                          onClick={() => handleAction(req._id, "reject")}
                          disabled={processing === req._id}
                          className="px-4 py-2 bg-rose-900/30 hover:bg-rose-800/50 text-rose-400 rounded-lg border border-rose-800/50 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                          {processing === req._id ? (
                            <div className="w-4 h-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <UserX className="w-4 h-4" />
                          )}
                          {processing === req._id ? "Processing..." : "Reject"}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
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
          <p>Review and manage membership requests for your club</p>
          <code className="bg-slate-900/50 px-2 py-1 rounded text-xs mt-2 inline-block">
            $ coordinator manage --requests
          </code>
        </motion.div>
      </div>
    </div>
  );
}