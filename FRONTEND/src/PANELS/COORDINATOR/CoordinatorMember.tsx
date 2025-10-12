import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Mail,
  BookOpen,
  Terminal,
  Trash2,
  AlertCircle,
  UserCheck,
  Search
} from "lucide-react";

interface Member {
  _id: string;
  username: string;
  email: string;
  course?: string;
  stream?: string;
  year?: string;
  semester?: string;
}

export default function CoordinatorMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  // 🔎 search + filter states
  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterStream, setFilterStream] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterSemester, setFilterSemester] = useState("");

  const clubId = localStorage.getItem("clubId");

  useEffect(() => {
    if (!clubId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/clubs/${clubId}/members`)
      .then((res) => setMembers(res.data))
      .catch((err) => console.error("Error fetching members:", err))
      .finally(() => setLoading(false));
  }, [clubId]);

  const handleRemove = async (userId: string) => {
    if (!clubId) return;
    
    setRemoving(userId);
    try {
      await axios.delete(`http://localhost:5000/api/clubs/${clubId}/members/${userId}`);
      setMembers((prev) => prev.filter((m) => m._id !== userId));
    } catch (err) {
      console.error("Error removing member:", err);
    } finally {
      setRemoving(null);
    }
  };

  const getMemberDetails = (member: Member) => {
    const details = [
      member.course,
      member.stream,
      member.year ? `${member.year} Year` : undefined,
      member.semester ? `Sem ${member.semester}` : undefined
    ].filter(Boolean);
    
    return details.length > 0 ? details.join(" • ") : "No academic details";
  };

  // 🔎 filtering logic
  const filteredMembers = members.filter((m) => {
    const matchesSearch = m.username.toLowerCase().includes(search.toLowerCase());
    const matchesCourse = filterCourse ? m.course === filterCourse : true;
    const matchesStream = filterStream ? m.stream === filterStream : true;
    const matchesYear = filterYear ? m.year === filterYear : true;
    const matchesSemester = filterSemester ? m.semester === filterSemester : true;
    return matchesSearch && matchesCourse && matchesStream && matchesYear && matchesSemester;
  });

  // unique filter values
  const courses = [...new Set(members.map((m) => m.course).filter(Boolean))];
  const streams = [...new Set(members.map((m) => m.stream).filter(Boolean))];
  const years = [...new Set(members.map((m) => m.year).filter(Boolean))];
  const semesters = [...new Set(members.map((m) => m.semester).filter(Boolean))];

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
          <div className="p-3 bg-gradient-to-br from-purple-900/70 to-pink-900/70 rounded-xl border border-purple-700/50">
            <Terminal className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Club Members
            </h1>
            <p className="text-slate-400 text-sm">
              <span className="text-green-400">$</span> Manage your club members and permissions
            </p>
          </div>
        </motion.div>

        {/* 🔎 Search + Filters */}
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 mb-6 grid md:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="flex items-center bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>

          <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)} className="bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700 text-sm">
            <option value="">All Courses</option>
            {courses.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select value={filterStream} onChange={(e) => setFilterStream(e.target.value)} className="bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700 text-sm">
            <option value="">All Streams</option>
            {streams.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700 text-sm">
            <option value="">All Years</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>

          <select value={filterSemester} onChange={(e) => setFilterSemester(e.target.value)} className="bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700 text-sm">
            <option value="">All Semesters</option>
            {semesters.map((sem) => <option key={sem} value={sem}>{sem}</option>)}
          </select>
        </div>

        {/* Members List */}
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
              {Array.from({ length: 5 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
                  className="h-20 bg-slate-800/50 rounded-lg border border-slate-700/50"
                />
              ))}
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-400 mb-2">No Matching Members</h3>
              <p className="text-slate-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredMembers.map((member, index) => (
                  <motion.div
                    key={member._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="p-5 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600/70 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                            <UserCheck className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{member.username}</h3>
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                              <Mail className="w-4 h-4" />
                              <span>{member.email}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-slate-300 text-sm">
                          <BookOpen className="w-4 h-4 text-blue-400" />
                          <span>{getMemberDetails(member)}</span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: removing === member._id ? 1 : 1.05 }}
                        whileTap={{ scale: removing === member._id ? 1 : 0.95 }}
                        onClick={() => handleRemove(member._id)}
                        disabled={removing === member._id}
                        className="px-4 py-2 bg-rose-900/30 hover:bg-rose-800/50 text-rose-400 rounded-lg border border-rose-800/50 transition-colors flex items-center gap-2 disabled:opacity-50 self-start"
                        title="Remove from club"
                      >
                        {removing === member._id ? (
                          <div className="w-4 h-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        {removing === member._id ? "Removing..." : "Remove"}
                      </motion.button>
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
          <p>Manage your club members and their access permissions</p>
          <code className="bg-slate-900/50 px-2 py-1 rounded text-xs mt-2 inline-block">
            $ coordinator manage --members
          </code>
        </motion.div>
      </div>
    </div>
  );
}
