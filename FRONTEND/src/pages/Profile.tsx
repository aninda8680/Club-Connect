import React, { useEffect, useState } from "react";
import api from "@/api";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { User, Phone, Mail, Calendar, BookOpen, GraduationCap } from "lucide-react";

interface UserProfile {
  username: string;
  email: string;
  dob?: string;
  gender?: string;
  stream?: string;
  phone?: string;
  course?: string;
  year?: string;
  semester?: string;
  role?: string;
  profilePic?: string; // optional field for profile pic
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login first!");
          return;
        }

        const res = await api.get("/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.user);
      } catch (err: any) {
        // console.error(err);
        toast.error(err.response?.data?.msg || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white text-lg"
        >
          Loading profile...
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400 text-lg">No profile data found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl bg-gray-900/80 border border-gray-700 rounded-2xl shadow-2xl p-8 backdrop-blur-md"
      >
        <div className="flex flex-col items-center">
          {/* Profile Picture */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg"
          >
            <img
              src={
                user.profilePic ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </motion.div>

          <h2 className="text-3xl font-bold text-white mt-4">
            {user.username}
          </h2>
          <p className="text-gray-400">{user.role?.toUpperCase() || "USER"}</p>
        </div>

        {/* Info Section */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
          {/* Email */}
          <div className="flex items-center gap-3">
            <Mail className="text-purple-400" size={22} />
            <span>{user.email}</span>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3">
            <Phone className="text-purple-400" size={22} />
            <span>{user.phone || "Not provided"}</span>
          </div>

          {/* DOB */}
          <div className="flex items-center gap-3">
            <Calendar className="text-purple-400" size={22} />
            <span>
              {user.dob
                ? new Date(user.dob).toLocaleDateString()
                : "Not provided"}
            </span>
          </div>

          {/* Gender */}
          <div className="flex items-center gap-3">
            <User className="text-purple-400" size={22} />
            <span>{user.gender || "Not provided"}</span>
          </div>

          {/* Stream */}
          <div className="flex items-center gap-3">
            <BookOpen className="text-purple-400" size={22} />
            <span>{user.stream || "Not provided"}</span>
          </div>

          {/* Course, Year, Semester */}
          <div className="flex items-center gap-3">
            <GraduationCap className="text-purple-400" size={22} />
            <span>
              {user.course
                ? `${user.course} • ${user.year || ""} • Sem ${
                    user.semester || "-"
                  }`
                : "Not provided"}
            </span>
          </div>
        </div>

        {/* Edit Profile Button (future enhancement)
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 w-full py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:from-purple-500 hover:to-blue-400 transition-all"
          onClick={() => toast("Edit feature coming soon ✨")}
        >
          Edit Profile
        </motion.button> */}
      </motion.div>
    </div>
  );
};

export default Profile;
