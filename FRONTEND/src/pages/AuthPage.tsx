// src/pages/AuthPage.tsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Terminal, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // login
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email,
          password,
        });

        const { _id, username, role, isProfileComplete, clubId } = res.data;

          localStorage.setItem("token", res.data.token);
          localStorage.setItem("username", username);
          localStorage.setItem("userId", res.data._id);
          localStorage.setItem("userId", _id);
          localStorage.setItem("role", role);
          localStorage.setItem("isProfileComplete", isProfileComplete.toString());

          // ✅ Save clubId if coordinator or member
        if ((role === "coordinator" || role === "member") && clubId) {
          localStorage.setItem("clubId", clubId);
        }

        if (!isProfileComplete) {
          navigate("/complete-profile");
        } else {
          if (role === "admin") navigate("/adminpanel");
          else if (role === "coordinator") navigate("/coordinatorpanel");
          else if (role === "leader") navigate("/leaderpanel");
          else if (role === "member") navigate("/memberpanel");
          else navigate("/publicpanel");
        }

      } else {
        // Register
        await axios.post("http://localhost:5000/api/auth/register", {
          username,
          email,
          password,
        });
        alert("Registration successful! Please login.");
        setIsLogin(true);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-black text-gray-200 font-mono flex items-center justify-center p-4">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-purple-600 rounded-full filter blur-3xl"></div>
        <div className="absolute top-2/3 right-1/4 w-28 h-28 bg-cyan-500 rounded-full filter blur-3xl"></div>
      </div>

      {/* Binary rain */}
      <div className="fixed inset-0 overflow-hidden opacity-5 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute text-xs text-green-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
              transform: `scale(${Math.random() * 0.5 + 0.5})`,
            }}
          >
            {Math.random() > 0.5 ? "1" : "0"}
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left panel - Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center"
        >
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-900 to-blue-800 border border-blue-700 rounded-lg">
                <Terminal className="w-8 h-8 text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Club-Connect
              </h1>
            </div>
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">
              Developer Portal
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Secure access to the Adamas university's club management system.
              Built for developers, by developers.
            </p>

            <button
              onClick={() => navigate("/")}
              className="px-5 py-2 mt-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium rounded-lg shadow-lg hover:opacity-90 transition"
            >
              Home-Page
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <span></span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </motion.div>

        {/* Right panel - Auth Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              {isLogin ? "Login to Continue" : "Register a New Account"}
            </h3>
            <p className="text-gray-400">
              Use your credentials to access the system
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 text-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 text-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:opacity-90 transition"
            >
              {isLoading
                ? "Please wait..."
                : isLogin
                ? "Login"
                : "Register"}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {isLogin ? "Register here" : "Login here"}
            </button>
          </p>

          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-xs">
              Need help? Contact your system administrator
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
