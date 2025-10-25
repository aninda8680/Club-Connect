import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiUsers, FiCalendar, FiStar, FiTrendingUp, FiMapPin, FiCheck, FiLogIn, FiPlus } from "react-icons/fi";
import { Typewriter } from 'react-simple-typewriter';
import api from "../api";
import Loader from "@/components/Loader";
import { ParticleText } from "@/components/ParticleText";
import { BackgroundPaths } from "@/components/BackgroundPaths";
import { AnimatedGradient } from "@/components/AnimatedGradient";
import { Mail, Phone, MapPin, Instagram, Linkedin, Github } from "lucide-react";
import { toast } from "react-hot-toast";


// --- Types (Kept as is) ---
interface Club {
  _id: string;
  name: string;
  description: string;
  category?: string;
  coordinator: {
    _id: string;
    username: string;
    email: string;
  };
  members: string[];
  joinRequests: string[];
  createdAt: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  venue?: string;
  location?: string;
  club?: {
    name: string;
    _id: string;
  };
  clubName?: string;
  maxAttendees?: number;
  attendees?: string[];
  poster?: string;
}

interface ClubCounts {
  memberCount: number;
}
// --- End Types ---


export default function LandingPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [joinedClubs, setJoinedClubs] = useState<Set<string>>(new Set());
  const [interestedEvents, setInterestedEvents] = useState<Set<string>>(new Set());
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [loading, setLoading] = useState(true);
  // The clubCounts state is now used in the JSX below
  const [clubCounts, setClubCounts] = useState<Map<string, ClubCounts>>(new Map());
  const navigate = useNavigate();

  // --- Utility Functions (Kept as is) ---

  const isAuthenticated = () => {
    return !!(localStorage.getItem("token") && localStorage.getItem("role"));
  };

  const getCurrentUser = () => {
    return {
      id: localStorage.getItem("userId"),
      role: localStorage.getItem("role"),
      token: localStorage.getItem("token")
    };
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Date TBD";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
      });
    } catch (error) {
      return "Date TBD";
    }
  };

  const handleLoginClick = () => {
    const role = localStorage.getItem("role");
    if (isAuthenticated()) {
      if (role === "admin") navigate("/adminpanel");
      else if (role === "coordinator") navigate("/coordinatorpanel");
      else if (role === "leader") navigate("/leaderpanel");
      else if (role === "member") navigate("/memberpanel");
      else navigate("/publicpanel");
    } else {
      navigate("/auth");
    }
  };

  // --- API Functions (Kept as is, using your axios calls) ---

  const fetchClubs = async (): Promise<Club[]> => {
    try {
      const response = await api.get("/clubs");
      return response.data;
    } catch (error:any) {
      toast.error(error);
      toast.error(error.response?.data?.message || "Error fetching clubs");
      return [];
    }
  };

  const fetchEvents = async (): Promise<Event[]> => {
    try {
      const response = await api.get("/events/approved");
      return response.data.map((event: any) => ({
        ...event,
        clubName: event.club?.name || 'Unknown Club',
        location: event.venue || event.location,
        maxAttendees: 100,
        attendees: event.attendees || [],
      }));
    } catch (err: any) {
      // console.error(err);
      toast.error(err.response?.data?.message || "Error Fetching Events");
      return [];
    }
  };

  const fetchUserClubStatus = (allClubs: Club[]) => {
    const currentUser = getCurrentUser();
    if (!currentUser.id) return;

    const clubStatusIds = new Set<string>();
    for (const club of allClubs) {
      if (club.joinRequests.includes(currentUser.id!) ||
        club.members.includes(currentUser.id!)) {
        clubStatusIds.add(club._id);
      }
    }
    setJoinedClubs(clubStatusIds);
  };
  
  const fetchClubCounts = (clubsData: Club[]) => {
      const countsMap = new Map<string, ClubCounts>();
      clubsData.forEach(club => {
          countsMap.set(club._id, { memberCount: club.members.length });
      });
      return countsMap;
  };


  // --- Hooks and Handlers (Simplified/Kept as is) ---

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [clubsData, eventsData] = await Promise.all([
          fetchClubs(),
          fetchEvents()
        ]);

        const typedClubs: Club[] = clubsData;
        const typedEvents: Event[] = eventsData;

        setClubs(typedClubs);
        setEvents(typedEvents);

        const countsMap = fetchClubCounts(typedClubs);
        setClubCounts(countsMap); // clubCounts is set here

        if (isAuthenticated()) {
          fetchUserClubStatus(typedClubs);
        }
      } catch (error: any) {
        // console.error(error);
        toast.error(error.response?.data?.message || "Error Fetching Data");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();

    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);


  const handleJoin = async (clubId: string) => {
  if (!isAuthenticated()) {
    navigate("/auth");
    return;
  }

  toast("Join request feature will be implemented with the backend API!", { icon: "ℹ️",});
  setJoinedClubs(prev => new Set([...prev, clubId]));
};


  const handleInterested = async (eventId: string) => {
    if (!isAuthenticated()) {
      navigate("/auth");
      return;
    }
    setInterestedEvents(prev => {
      const updated = new Set(prev);
      updated.has(eventId) ? updated.delete(eventId) : updated.add(eventId);
      return updated;
    });
  };


  // --- Data & Constants (Colors Updated to Blue/Purple/Emerald) ---

  const testimonials = [
    { id: 1, name: "-------", role: "----", text: "--------- ----- ------ ----- -------- -- ---------", },
    { id: 2, name: "-------", role: "----", text: "--------- ----- ------ ----- -------- -- ---------", },
    { id: 3, name: "-------", role: "----", text: "--------- ----- ------ ----- -------- -- ---------", },
  ];

  // Animation Variants (Kept as is)
  const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
  const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.8 } } };
  const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };


  // --- Components (Colors Updated) ---

  useEffect(() => {
  // Check if user is logged in
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token && role) {
    switch (role) {
      case "admin":
        navigate("/adminpanel", { replace: true });
        break;
      case "coordinator":
        navigate("/coordinatorpanel", { replace: true });
        break;
      case "leader":
        navigate("/leaderpanel", { replace: true });
        break;
      case "member":
        navigate("/memberpanel", { replace: true });
        break;
      default:
        navigate("/publicpanel", { replace: true });
    }
  }
}, []);


  // --- Main Render ---

  if (loading) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="profile-loader">
        <Loader />
      </div>
    </div>
  );
}



  return (
    <div className="bg-black text-white w-full overflow-x-hidden scroll-smooth relative">
      {/* Floating Paths Animation above Navbar */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <BackgroundPaths />
      </div>

      {/* Minecraft-themed Login Button - Updated to monochrome */}
      <motion.button
        className="fixed top-4 right-10 z-50 py-2 px-4 text-sm font-bold text-white bg-white shadow-lg border-2 border-gray-300 hover:bg-gray-200 transition-colors"
        onClick={handleLoginClick}
        whileHover={{ scale: 1.05, y: -1 }}
        whileTap={{ scale: 0.95, y: 2 }}
      >
        {isAuthenticated() ? '⚡ Dashboard' : '🎮 Login / Register'}
      </motion.button>

      {/* Hero Section with Particle Text */}
      <section id="hero-section" className="relative overflow-hidden min-h-screen flex flex-col justify-between">
        {/* Particle Text Background */}
        <div className="flex-1 flex items-start justify-center pt-20">
          <ParticleText words={["CLUB-CONNECT", "CONNECT", "COMMUNITY", "EVENTS"]} />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto text-center relative z-10 pb-8 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              className="text-2xl md:text-3xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Typewriter
                words={[
                  "Grades fade. Memories don't.",
                  "Because college is not just 9 to 5.",
                  "More than attendance, it's about presence.",
                  "Forget library hours. These are club hours.",
                  "Every club is a playlist. Find yours."
                ]}
                loop={true}
                cursor
                cursorStyle="|"
                typeSpeed={60}
                deleteSpeed={40}
                delaySpeed={2000}
              />
            </motion.h2>

            <motion.p
              className="text-base text-gray-400 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              After classes comes the real fun — clubs, events, and memories waiting to happen.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <motion.button
                className="px-6 py-3 bg-white text-white font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById("clubs-section")?.scrollIntoView({ behavior: "smooth" })}
              >
                🌟 Explore Clubs <FiArrowRight />
              </motion.button>

              <motion.button
                className="px-6 py-3 bg-transparent border border-white text-white hover:bg-white/10 font-semibold transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById("events-section")?.scrollIntoView({ behavior: "smooth" })}
              >
                🎉 Explore Events <FiArrowRight />
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Scrolling indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-sm text-gray-400 mb-2">Scroll Down</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-4 h-4 border-r-2 border-b-2 border-white transform rotate-45"></div>
          </motion.div>
        </motion.div>
      </section>


      {/* <section className="py-20 relative z-10 bg-black/50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={fadeUp}
              >
                <div className="flex justify-center mb-4 text-white"> {/* Blue Icons 
                  {/* {stat.icon}
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section> */} 

      {/* --- */}

      {/* Featured Clubs */}
      <section id="clubs-section" className="min-h-screen py-20 px-4 md:px-6 relative z-10 bg-black">
        <div className="container mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <FiStar className="text-white" size={16} />
              <span className="text-sm font-semibold text-white">EXPLORE COMMUNITIES</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Featured <span className="text-gray-400">Clubs</span>
            </h2>
            <motion.p
              className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              Dive into vibrant communities where passion meets purpose. Find your tribe and start creating together.
            </motion.p>
          </motion.div>
          
          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {clubs.length === 0 ? (
              <motion.div
                className="col-span-full text-center py-20"
                variants={fadeUp}
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <FiUsers className="text-white" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">No Clubs Yet</h3>
                <p className="text-gray-400 text-lg mb-6">Be the first to start something amazing!</p>
                <button className="px-8 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 transform hover:-translate-y-1">
                  Create First Club
                </button>
              </motion.div>
            ) : (
              clubs.map((club) => (
                <motion.div
                  key={club._id}
                  className="group relative overflow-hidden h-full bg-black rounded-lg border border-white/10"
                  variants={fadeUp}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{ filter: "url(#noise)" }}
                >
                  {/* Animated Gradient Background */}
                  <AnimatedGradient 
                    colors={["#1a1a1a", "#2a2a2a", "#1f1f1f"]} 
                    speed={0.05} 
                    blur="medium" 
                  />

                  {/* Noise Texture */}
                  <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        backgroundSize: "256px 256px",
                        mixBlendMode: "overlay",
                      }}
                    />
                  </div>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 opacity-80 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:animate-[shine_4s_ease-in-out_infinite] w-[200%]" />
                  </div>
                  
                  <div className="relative z-10 p-6 h-full flex flex-col">
                    {/* Club Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {/* Club Avatar */}
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white to-gray-400 flex items-center justify-center text-black font-bold text-sm shadow-lg">
                          {club.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-gray-300 transition-colors">
                            {club.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full border border-white/10">
                              #{club.category || "Community"}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Members Count */}
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <FiUsers size={14} />
                          <span className="font-semibold text-white">
                            {clubCounts.get(club._id)?.memberCount || club.members.length}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">members</div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 leading-relaxed mb-6 line-clamp-3 group-hover:text-gray-200 transition-colors flex-grow">
                      {club.description || "Join this amazing community and be part of something special!"}
                    </p>

                    {/* Coordinator & Pending Requests */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        {/* Coordinator Avatar */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-200 to-gray-400 flex items-center justify-center text-black text-xs font-bold">
                          {club.coordinator?.username?.charAt(0) || "C"}
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Coordinator</div>
                          <div className="text-sm font-semibold text-white">
                            {club.coordinator?.username || "Unknown"}
                          </div>
                        </div>
                      </div>
                      
                      {club.joinRequests.length > 0 && (
                        <motion.div 
                          className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg border border-white/20"
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <span className="text-xs font-semibold text-white">
                            {club.joinRequests.length} pending
                          </span>
                        </motion.div>
                      )}
                    </div>

                    {/* Join Button */}
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoin(club._id);
                      }}
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group/btn ${
                        joinedClubs.has(club._id)
                          ? "bg-white/20 text-white border border-white/30"
                          : "bg-white text-black hover:bg-gray-200 shadow-lg"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={joinedClubs.has(club._id)}
                    >
                      {/* Animated background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition duration-1000"></div>
                      
                      {isAuthenticated() ? (
                        <>
                          {joinedClubs.has(club._id) ? (
                            <>
                              <FiCheck className="relative z-10" size={18} />
                              <span className="relative z-10">Request Sent</span>
                            </>
                          ) : (
                            <>
                              <FiPlus className="relative z-10" size={18} />
                              <span className="relative z-10">Join Community</span>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <FiLogIn className="relative z-10 text-white" size={18} />
                          <span className="relative z-10 text-white">Login to Join</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* --- */}

      {/* --- */}

      {/* Featured Events */}
      <section id="events-section" className="min-h-screen py-20 px-4 md:px-6 relative z-10 bg-black">
        <div className="container mx-auto">
          <motion.h2
            className="text-center text-4xl md:text-5xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <span className="text-gray-400">Upcoming</span> Events
          </motion.h2>
          <motion.p
            className="text-center text-gray-400 max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            Don't miss these exciting events and activities
          </motion.p>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.length === 0 ? (
              <motion.div
                className="col-span-full text-center py-12"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-gray-400 text-lg">No events available right now.</p>
                <p className="text-gray-500 text-sm mt-2">Stay tuned for exciting upcoming events!</p>
              </motion.div>
            ) : (
              events.map((event, i) => (
                <motion.div
                  key={event._id}
                  className="bg-gray-900/70 rounded-xl p-6 shadow-lg hover:shadow-white/10 transition border border-gray-800 hover:border-white/20 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <motion.div
                    className="flex items-center gap-2 mb-4"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 120, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    {event.clubName && (
                      <span className="px-3 py-1 bg-white/10 text-white text-xs rounded-full border border-white/20">
                        {event.clubName}
                      </span>
                    )}
                    {i % 3 === 0 && (
                      <span className="px-3 py-1 bg-gray-800 text-gray-400 text-xs rounded-full border border-gray-700 flex items-center gap-1">
                        <FiTrendingUp size={12} /> Trending
                      </span>
                    )}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-white">{event.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>
                  <div className="text-sm text-gray-300 mb-6 space-y-2">
                    <p className="flex items-center gap-2">
                      <FiCalendar className="text-white" /> {formatDate(event.date)}
                    </p>
                    {(event.venue || event.location) && (
                      <p className="flex items-center gap-2">
                        <FiMapPin className="text-white" /> {event.venue || event.location || "TBA"}
                      </p>
                    )}
                    {event.maxAttendees && (
                      <p className="text-xs text-gray-500">
                        {event.attendees?.length || 0}/{event.maxAttendees} attendees
                      </p>
                    )}
                  </div>
                  <motion.button
                    onClick={() => handleInterested(event._id)}
                    className={`w-full px-4 py-2 rounded-lg transition flex items-center justify-center gap-2 ${
                      interestedEvents.has(event._id)
                        ? "bg-white/20 text-white border border-white/30"
                        : "bg-white text-black hover:bg-gray-200"
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {isAuthenticated()
                      ? interestedEvents.has(event._id)
                        ? "✅ Interested"
                        : "🎯 I'm Interested"
                      : "🔑 Mark Interest"}
                  </motion.button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

     {/* CTA Section */}
<section id="cta-section" className="py-20 relative z-10">
  <svg width="0" height="0" className="absolute">
    <defs>
      <filter id="noise-cta" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence baseFrequency="0.4" numOctaves="2" result="noise" seed="2" type="fractalNoise" />
        <feColorMatrix in="noise" type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="discrete" tableValues="0.02 0.04 0.06" />
        </feComponentTransfer>
        <feComposite operator="over" in2="SourceGraphic" />
      </filter>
    </defs>
  </svg>
  <div className="container mx-auto px-4 md:px-6">
    <motion.div
      className="relative overflow-hidden bg-black rounded-2xl border border-white/10 p-8 md:p-12 text-center group"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeIn}
      style={{ filter: "url(#noise-cta)" }}
    >
      {/* Animated Gradient Background */}
      <AnimatedGradient 
        colors={["#1a1a1a", "#2a2a2a", "#1f1f1f"]} 
        speed={0.05} 
        blur="medium" 
      />

      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: "256px 256px",
            mixBlendMode: "overlay",
          }}
        />
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 opacity-80 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:animate-[shine_4s_ease-in-out_infinite] w-[200%]" />
      </div>

      <div className="relative z-10">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6 text-white"
          variants={fadeUp}
        >
          Want to <span className="text-gray-300">Start</span> Your Own Club?
        </motion.h2>

        <motion.p
          className="text-gray-400 mb-8 max-w-2xl mx-auto"
          variants={fadeUp}
        >
                    Turn your passion into a movement! Submit your idea and we'll help you set up your own club on <span className="text-white font-semibold">Club-Connect</span>. 
          Share your vision, choose your members, and make an impact on campus.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <motion.button
            className="px-8 py-3 rounded-full text-lg font-semibold bg-white text-white hover:bg-gray-200 transition flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLoginClick}
          >
            Create My Club <FiArrowRight />
          </motion.button>

          <motion.button
            className="px-8 py-3 rounded-full text-lg font-semibold bg-transparent border border-white text-white hover:bg-white/10 transition flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLoginClick}
          >
            Join Existing Clubs
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  </div>
</section>


{/* FAQ Section with Animated Bento Cards */}
<section id="faq-section" className="py-20 px-4 bg-black relative z-10">
  <svg width="0" height="0" className="absolute">
    <defs>
      <filter id="noise" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence baseFrequency="0.4" numOctaves="2" result="noise" seed="2" type="fractalNoise" />
        <feColorMatrix in="noise" type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="discrete" tableValues="0.02 0.04 0.06" />
        </feComponentTransfer>
        <feComposite operator="over" in2="SourceGraphic" />
      </filter>
    </defs>
  </svg>

  <div className="container mx-auto max-w-6xl">
    <div className="text-center mb-16">
      <motion.h2
        className="text-4xl font-bold text-white mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Frequently Asked <span className="text-gray-400">Questions</span>
      </motion.h2>
      <motion.p
        className="text-xl text-gray-400 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Everything you need to know about Club-Connect. Can't find what you're looking for? Contact us.
      </motion.p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        {
          question: "What is Club-Connect?",
          answer: "Club-Connect is a platform that brings together students, clubs, and events in one unified space. Join communities, discover events, and stay connected with what matters.",
          colors: ["#1a1a1a", "#2a2a2a", "#1f1f1f"],
          delay: 0.2
        },
        {
          question: "How do I join a club?",
          answer: "Browse our clubs section, find one that interests you, and click 'Join Community'. Your request will be sent to the club coordinator for approval.",
          colors: ["#151515", "#252525", "#1d1d1d"],
          delay: 0.3
        },
        {
          question: "Can I create my own club?",
          answer: "Yes! Click the 'Create My Club' button in the CTA section. Submit your club details and our team will review your application.",
          colors: ["#1c1c1c", "#2c2c2c", "#181818"],
          delay: 0.4
        },
        {
          question: "How do I register for events?",
          answer: "Navigate to the Events section, find an event you like, and click 'I'm Interested'. You'll receive updates about the event directly.",
          colors: ["#171717", "#272727", "#1b1b1b"],
          delay: 0.5
        },
        {
          question: "Is Club-Connect free to use?",
          answer: "Yes! Club-Connect is completely free for all students. Join clubs, attend events, and connect with your community at no cost.",
          colors: ["#131313", "#232323", "#191919"],
          delay: 0.6
        },
        {
          question: "How do I contact support?",
          answer: "You can reach us via email at the address in our footer, or through our social media channels. We're here to help!",
          colors: ["#1a1a1a", "#2a2a2a", "#1f1f1f"],
          delay: 0.7
        }
      ].map((faq, index) => (
        <motion.div
          key={index}
          className="relative overflow-hidden h-full bg-black rounded-lg border border-white/10 group"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: faq.delay }}
          viewport={{ once: true }}
          style={{ filter: "url(#noise)" }}
        >
          {/* Animated Gradient Background */}
          <AnimatedGradient 
            colors={faq.colors} 
            speed={0.05} 
            blur="medium" 
          />

          {/* Noise Texture */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundSize: "256px 256px",
                mixBlendMode: "overlay",
              }}
            />
          </div>

          {/* Shine Effect */}
          <div className="absolute inset-0 opacity-80 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:animate-[shine_4s_ease-in-out_infinite] w-[200%]" />
          </div>

          <div className="relative z-10 p-6 text-white backdrop-blur-sm h-full flex flex-col justify-center">
            <h3 className="text-lg font-bold mb-3">{faq.question}</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{faq.answer}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

{/* Testimonials Widget */}
      <section id = "testimonials-section" className="py-20 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <motion.h2
            className="text-center text-3xl font-bold mb-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            What <span className="text-white">Members</span> Say
          </motion.h2>
          
          <div className="max-w-4xl mx-auto relative h-64">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonials[activeTestimonial].id}
                className="bg-black border border-gray-800 rounded-xl p-8 absolute inset-0 backdrop-blur-sm flex flex-col justify-center"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-white mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="inline mr-1" />
                  ))}
                </div>
                <p className="text-lg italic mb-6 line-clamp-3">"{testimonials[activeTestimonial].text}"</p>
                <div>
                  <p className="font-bold">{testimonials[activeTestimonial].name}</p>
                  <p className="text-gray-400 text-sm">{testimonials[activeTestimonial].role}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition ${
                  activeTestimonial === index ? 'bg-white' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      </section>


      {/* --- */}

 

      
      <section
  id="footer-section"
  className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-300 py-16 mt-0 overflow-hidden relative z-10 border-t border-white/10"
>
  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
    {/* Column 1: Logo + About */}
    <div className="flex flex-col space-y-6">
      <motion.img
        src="/logo.png"
        alt="Club Logo"
        className="w-32"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      />
      <p className="text-sm leading-relaxed text-gray-400 border-l-2 border-white pl-4">
        Empowering students through collaboration, innovation, and hands-on learning. 
        We foster a community where creativity meets technology to build the future.
      </p>
    </div>

    {/* Column 2: Quick Links */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-col items-center md:items-start"
    >
      <h2 className="text-white text-lg font-semibold mb-6 pb-2 border-b border-white/10 w-full text-center md:text-left">
        Quick Links
      </h2>
      <ul className="space-y-3 text-sm w-full">
        {[
          { label: "Home", id: "hero-section" },
          { label: "Clubs", id: "clubs-section" },
          { label: "Events", id: "events-section" },
          // { label: "Gallery", id: "gallery-section" },
          { label: "Contact", id: "footer-section" },
        ].map(({ label, id }) => (
          <li key={id} className="group">
            <span
              onClick={() => {
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="cursor-pointer text-gray-400 group-hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {label}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>

    {/* Column 3: Contact */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col items-center md:items-start"
    >
      <h2 className="text-white text-lg font-semibold mb-6 pb-2 border-b border-white/10 w-full text-center md:text-left">
        Contact Us
      </h2>
      <ul className="space-y-4 text-sm text-gray-400 w-full">
        <li className="flex items-center gap-3 hover:text-white transition-all duration-300 group">
          <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors duration-300">
            <Mail size={16} className="text-white group-hover:text-white" />
          </div>
          anindadebta8680@gmail.com
        </li>
        <li className="flex items-center gap-3 hover:text-white transition-all duration-300 group">
          <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors duration-300">
            <Phone size={16} className="text-white group-hover:text-white" />
          </div>
          +91 82828 87603
        </li>
        <li className="flex items-center gap-3 hover:text-white transition-all duration-300 group">
          <div className="p-2 bg-white/10 rounded-lg group-hover:bg-red-600 transition-colors duration-300">
            <MapPin size={16} className="text-red-400 group-hover:text-white" />
          </div>
          Adamas University, Barasat
        </li>
      </ul>

      {/* Social icons */}
      <div className="flex gap-3 mt-6 pt-4 border-t border-white/10 w-full justify-center md:justify-start">
        {[
          { icon: Instagram, href: "#", color: "hover:text-pink-400" },
          { icon: Linkedin, href: "#", color: "hover:text-white" },
          { icon: Github, href: "#", color: "hover:text-gray-100" },
        ].map(({ icon: Icon, href, color }) => (
          <a
            key={href}
            href={href}
            className={`p-3 bg-white/10 rounded-lg transition-all duration-300 hover:bg-white/20 hover:scale-110 ${color}`}
          >
            <Icon size={18} />
          </a>
        ))}
      </div>
    </motion.div>
  </div>

  {/* Divider */}
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="border-t border-gray-800 mt-12 pt-6 text-center text-sm text-gray-500 space-y-2"
  >
    <p>
      © {new Date().getFullYear()}{" "}
      <span className="text-gray-400 font-medium">Club</span>. All rights reserved.
    </p>
    <p className="text-gray-500">
      Developed by{" "}
      <a
        href="https://aninda-hi.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:text-gray-300 font-medium transition-colors duration-300 hover:underline"
      >
        Aninda Debta
      </a>
    </p>
  </motion.div>
</section>



    </div>
  );
}
