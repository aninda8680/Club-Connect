// src/pages/AuthPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Terminal, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import api from "../api";
import { toast } from "react-hot-toast";

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
        const res = await api.post(`/auth/login`, { email, password });


        const { _id, username, role, isProfileComplete, clubId } = res.data;

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", username);
        localStorage.setItem("userId", res.data._id);
        localStorage.setItem("userId", _id);
        localStorage.setItem("role", role);
        localStorage.setItem("isProfileComplete", isProfileComplete.toString());
        localStorage.setItem("Stream", res.data.Stream || "");
        localStorage.setItem("Course", res.data.Course || "");
        localStorage.setItem("Year", res.data.Year || "");
        localStorage.setItem("Semester", res.data.Semester || "");

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
        await api.post(`/auth/register`, {
          username,
          email,
          password,
        });
        toast.success("Registration successful! Please login.");
        setIsLogin(true);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#0A0A0A] text-gray-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dark Textured Background */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Base dark layer */}
        <div className="absolute inset-0 bg-[#0A0A0A]" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #111111 2px, transparent 2px)`,
          backgroundSize: '24px 24px',
          opacity: 0.4
        }}></div>

        {/* Subtle vertical lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(44, 90, 160, 0.03) 25%, rgba(44, 90, 160, 0.03) 26%, transparent 27%, transparent 74%, rgba(44, 90, 160, 0.03) 75%, rgba(44, 90, 160, 0.03) 76%, transparent 77%, transparent)`,
          backgroundSize: '60px 60px'
        }}></div>

        {/* Very subtle animated glow */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${25 + (i * 25)}%`,
                top: '50%',
                width: '1px',
                height: '70%',
                background: 'linear-gradient(0deg, transparent, rgba(44, 90, 160, 0.1), transparent)',
                transform: 'translateY(-50%)',
                animation: `pulse 4s infinite ${i * 1}s`
              }}
            />
          ))}
        </div>
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
              <div className="p-2 bg-[#2C5AA0] border-b-4 border-[#1D3B6F] hover:border-b-2 hover:mt-0.5 transition-all">
                <Terminal className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-[#5B8DD9] minecraft-text" style={{ textShadow: '2px 2px #1D3B6F' }}>
                Club-Connect
              </h1>
            </div>
            <h2 className="text-2xl font-bold text-[#5B8DD9] mb-4" style={{ textShadow: '2px 2px #1D3B6F' }}>
              Developer Portal
            </h2>
            <p className="text-[#8BA8D9] mb-6 leading-relaxed border-l-4 border-[#2C5AA0] pl-4">
              Secure access to the Adamas university's club management system.
              Built for developers, by developers.
            </p>

            <button
              onClick={() => navigate("/")}
              className="px-5 py-2 mt-4 bg-[#2C5AA0] text-white font-bold border-b-4 border-[#1D3B6F] hover:border-b-2 hover:mt-0.5 transition-all"
              style={{ imageRendering: 'pixelated' }}
            >
              ⬅️ Back to Home
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
          className="bg-[#1D3B6F]/90 backdrop-blur-sm border-4 border-[#2C5AA0] p-8"
          style={{ 
            boxShadow: '8px 8px 0 rgba(0,0,0,0.2)',
            imageRendering: 'pixelated'
          }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-[#5B8DD9] mb-2" style={{ textShadow: '2px 2px #1D3B6F' }}>
              {isLogin ? "🏰 Login to Continue" : "📝 Register a New Account"}
            </h3>
            <p className="text-[#8BA8D9]">
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
                autoComplete="username"
                autoCapitalize="off"
                spellCheck="false"
                className="w-full bg-[#2C5AA0]/80 border-b-4 border-[#1D3B6F] text-white p-3 font-bold placeholder:text-[#8BA8D9] focus:outline-none focus:border-b-2 focus:mt-0.5 transition-all"
                style={{ imageRendering: 'pixelated' }}
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete={isLogin ? "email" : "new-email"}
              autoCapitalize="off"
              spellCheck="false"
              className="w-full bg-[#2C5AA0]/80 border-b-4 border-[#1D3B6F] text-white p-3 font-bold placeholder:text-[#8BA8D9] focus:outline-none focus:border-b-2 focus:mt-0.5 transition-all"
              style={{ imageRendering: 'pixelated' }}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isLogin ? "current-password" : "new-password"}
              autoCapitalize="off"
              spellCheck="false"
              className="w-full bg-[#2C5AA0]/80 border-b-4 border-[#1D3B6F] text-white p-3 font-bold placeholder:text-[#8BA8D9] focus:outline-none focus:border-b-2 focus:mt-0.5 transition-all"
              style={{ imageRendering: 'pixelated' }}
            />

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ y: 2, borderBottomWidth: '2px', marginTop: '2px' }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2C5AA0] text-white font-bold py-3 px-6 border-b-4 border-[#1D3B6F] hover:border-b-2 hover:mt-0.5 transition-all"
              style={{ imageRendering: 'pixelated' }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-pulse">⏳</span> Mining...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {isLogin ? "⚡ Login" : "📝 Register"}
                </span>
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-[#8BA8D9]">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#5B8DD9] hover:text-white font-bold px-2 py-1 border-b-2 border-[#2C5AA0] hover:border-b-1 hover:mt-0.5 transition-all"
              style={{ imageRendering: 'pixelated' }}
            >
              {isLogin ? "Register here" : "Login here"}
            </button>
          </p>

          <div className="mt-8 pt-6 border-t-4 border-[#2C5AA0] text-center">
            <p className="text-[#8BA8D9] text-xs">
              Need help? Contact your system administrator 🛠️
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
