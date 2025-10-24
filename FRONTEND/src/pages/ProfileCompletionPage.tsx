// src/pages/ProfileCompletionPage.tsx
import { useState } from "react";
import api from "@/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { motion, AnimatePresence } from "framer-motion";
  import { toast } from "react-hot-toast";
import { FiUser, FiCalendar, FiPhone, FiChevronDown, FiArrowLeft } from "react-icons/fi";

export default function ProfileCompletionPage() {
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [stream, setStream] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const token = localStorage.getItem("token");

  const semestersByYear: Record<string, string[]> = {
    "1st": ["1", "2"],
    "2nd": ["3", "4"],
    "3rd": ["5", "6"],
    "4th": ["7", "8"],
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
    const { data } = await api.put(
      "/user/complete-profile",
      { dob, gender, stream, phone, course, year, semester },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Login user
    login(data.user, token!);

    // Show success toast
    toast.success("Profile completed successfully!");

    // Navigate based on role
    const role = data.user?.role;
    if (role === "admin") navigate("/adminpanel");
    else if (role === "coordinator") navigate("/coordinatorpanel");
    else navigate("/publicpanel");
  } catch (err: any) {
    // Show error toast instead of setError
    const message =
      err?.response?.data?.message || err?.message || "Something went wrong";
    toast.error(message);
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-black via-slate-900 to-blue-900 p-4 overflow-hidden">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <motion.form
            onSubmit={handleSubmit}
            className="bg-gray-900 p-6 rounded-2xl shadow-2xl w-full border border-gray-800 relative overflow-hidden"
            style={{ maxHeight: "90vh" }}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Back Button */}
            <motion.button
              type="button"
              onClick={() => navigate("/")}
              className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 text-xs rounded-md bg-gray-800/80 border border-gray-700 text-gray-200 hover:bg-gray-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 z-20"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FiArrowLeft className="text-sm" />
              <span>Back</span>
            </motion.button>

            {/* Decorative glowing orbs */}
            {["-top-20 -right-20", "-top-10 -left-10", "-bottom-10 -right-10", "-bottom-10 -left-10"].map(
              (pos, i) => (
                <motion.div
                  key={i}
                  className={`absolute ${pos} w-40 h-40 bg-blue-500 rounded-full opacity-10 blur-2xl`}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 6 + i, repeat: Infinity, repeatType: "reverse" }}
                />
              )
            )}

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-4"
            >
              <div className="flex justify-center mb-2">
                <motion.div
                  className="w-14 h-14 rounded-full bg-black flex items-center justify-center border-2 border-blue-500 shadow-md shadow-blue-500/20"
                  whileHover={{ scale: 1.05 }}
                >
                  <FiUser className="text-xl text-blue-400" />
                </motion.div>
              </div>
              <h2 className="text-xl font-bold text-slate-100 mb-1">
                Complete Your Profile
              </h2>
              <p className="text-gray-400 text-xs">
                Just a few more details to get started
              </p>
            </motion.div>

            {/* Inputs Section */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              <style>{`
                div::-webkit-scrollbar {
                  width: 4px;
                }
                div::-webkit-scrollbar-thumb {
                  background: #2563eb;
                  border-radius: 2px;
                }
              `}</style>

              {/* Phone */}
              <div>
                <label className="block mb-1 text-xs text-gray-300">Phone *</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      let value = e.target.value;
                      if (!value.startsWith("+91 "))
                        value = "+91 " + value.replace(/^\+91\s?/, "");
                      setPhone(value);
                    }}
                    onKeyDown={(e) => {
                      const input = e.target as HTMLInputElement;
                      if (
                        phone.startsWith("+91 ") &&
                        input.selectionStart !== null &&
                        input.selectionStart <= 4 &&
                        (e.key === "Backspace" || e.key === "Delete")
                      )
                        e.preventDefault();
                    }}
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition"
                  />
                </div>
              </div>

              {/* DOB */}
              <div>
                <label className="block mb-1 text-xs text-gray-300">Date of Birth *</label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="date"
                    lang="en-GB"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 appearance-none transition"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block mb-1 text-xs text-gray-300">Gender *</label>
                <div className="relative">
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    className="w-full pl-3 pr-8 py-2 text-sm rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 appearance-none transition"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="other">Other</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                </div>
              </div>

              {/* Stream */}
              <div>
                <label className="block mb-1 text-xs text-gray-300">Stream *</label>
                <div className="relative">
                  <select
                    value={stream}
                    onChange={(e) => setStream(e.target.value)}
                    required
                    className="w-full pl-3 pr-8 py-2 text-sm rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 appearance-none transition"
                  >
                    <option value="">Select Stream</option>
                    <option value="CSE">Computer Science & Engineering</option>
                    <option value="ECE">Electronics & Communication</option>
                    <option value="Mech">Mechanical Engineering</option>
                    <option value="Civil">Civil Engineering</option>
                    <option value="Electrical">Electrical Engineering</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                </div>
              </div>

              {/* Course */}
              <div>
                <label className="block mb-1 text-xs text-gray-300">Course *</label>
                <div className="relative">
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    required
                    className="w-full pl-3 pr-8 py-2 text-sm rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 appearance-none transition"
                  >
                    <option value="">Select Course</option>
                    <option value="BTech">B.Tech</option>
                    <option value="MTech">M.Tech</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                    <option value="Diploma">Diploma</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                </div>
              </div>

              {/* Year & Semester */}
              <div>
                <label className="block mb-1 text-xs text-gray-300">Year *</label>
                <div className="relative">
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                    className="w-full pl-3 pr-8 py-2 text-sm rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 appearance-none transition"
                  >
                    <option value="">Select Year</option>
                    <option value="1st">1st Year</option>
                    <option value="2nd">2nd Year</option>
                    <option value="3rd">3rd Year</option>
                    <option value="4th">4th Year</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                </div>
              </div>

              {year && (
                <div>
                  <label className="block mb-1 text-xs text-gray-300">Semester *</label>
                  <div className="relative">
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      required
                      className="w-full pl-3 pr-8 py-2 text-sm rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 appearance-none transition"
                    >
                      <option value="">Select Semester</option>
                      {semestersByYear[year].map((sem) => (
                        <option key={sem} value={sem}>
                          {sem}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <motion.button
                type="submit"
                className="w-full py-2 px-4 text-sm rounded-lg bg-gradient-to-r from-blue-600 to-indigo-800 text-white font-medium hover:from-indigo-800 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
              >
                <span className="relative z-10">
                  {isSubmitting ? "Saving..." : "Save & Continue"}
                </span>
                {isSubmitting && (
                  <motion.span
                    className="absolute inset-0 bg-blue-700/70 z-0"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>
            </div>
          </motion.form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
