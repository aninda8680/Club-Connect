import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { FiArrowRight, FiUsers, FiCalendar, FiStar, FiTrendingUp, FiMapPin, FiCheck, FiLogIn, FiPlus } from "react-icons/fi";
import { Typewriter } from 'react-simple-typewriter';
import axios from 'axios';

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

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
      const response = await axios.get(`${API_BASE_URL}/clubs`);
      return response.data;
    } catch (error) {
      console.error('Error fetching clubs:', error);
      return [];
    }
  };

  const fetchEvents = async (): Promise<Event[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/approved`);
      return response.data.map((event: any) => ({
        ...event,
        clubName: event.club?.name || 'Unknown Club',
        location: event.venue || event.location,
        maxAttendees: 100,
        attendees: event.attendees || [],
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
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
      } catch (error) {
        console.error('Error fetching data:', error);
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
    alert("Join request feature will be implemented with the backend API!");
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
    { id: 1, name: "Alex Chen", role: "Club President", text: "Club-Connect revolutionized how we manage our members and events. The engagement has doubled since we started using it!", },
    { id: 2, name: "Maria Garcia", role: "Student", text: "I found all my favorite clubs in one place and never miss their events anymore. The platform is so intuitive!", },
    { id: 3, name: "James Wilson", role: "Event Coordinator", text: "The event management tools saved us countless hours. RSVP tracking is now a breeze with Club-Connect.", },
  ];

  // Animation Variants (Kept as is)
  const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
  const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.8 } } };
  const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };


  // --- Components (Colors Updated) ---

  const AuroraBackground: React.FC = () => {
    const isBrowser = typeof window !== 'undefined';
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = isBrowser ? useTransform(mouseY, [0, window.innerHeight], [15, -15]) : 0;
    const rotateY = isBrowser ? useTransform(mouseX, [0, window.innerWidth], [-15, 15]) : 0;

    const handleMouseMove = (e: React.MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);
    };

    return (
      <motion.div
        className="fixed inset-0 overflow-hidden pointer-events-none z-0"
        onMouseMove={handleMouseMove}
        style={{ perspective: 1000 }}
      >
        <motion.div
            style={{ rotateX, rotateY }}
            className="w-full h-full absolute"
        >
            {/* Aurora layers: Red/Orange -> Blue/Purple/Cyan */}
            <motion.div
              className="absolute top-[20%] left-[20%] w-[60%] aspect-[2/1] rounded-full bg-blue-900/20 blur-[100px]" // Blue-900
              animate={{ x: ["-10%", "10%", "-10%"], y: ["0%", "10%", "0%"], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-[40%] left-[40%] w-[50%] aspect-[3/1] rounded-full bg-purple-800/15 blur-[120px]" // Purple-800
              animate={{ x: ["10%", "-10%", "10%"], y: ["5%", "-5%", "5%"], opacity: [0.7, 0.9, 0.7] }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
            />
            <motion.div
              className="absolute bottom-[10%] right-[10%] w-[40%] aspect-[4/1] rounded-full bg-cyan-700/10 blur-[80px]" // Cyan-700
              animate={{ x: ["5%", "-5%", "5%"], y: ["-5%", "5%", "-5%"], opacity: [0.6, 0.8, 0.6] }}
              transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 10 }}
            />
            {/* Subtle particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-blue-500/10" // Blue-500
                style={{
                  width: Math.random() * 5 + 3, height: Math.random() * 5 + 3,
                  left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
                }}
                animate={{ y: [0, (Math.random() - 0.5) * 50], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, repeatType: "reverse", delay: Math.random() * 5 }}
              />
            ))}
        </motion.div>
      </motion.div>
    );
  };


  // --- Main Render ---

  if (loading) {
    return (
      <div className="bg-black text-white w-full min-h-screen flex items-center justify-center overflow-hidden relative">
        <AuroraBackground />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <motion.span
            className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full" // Blue Spinner
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          />
          <p className="text-sm text-blue-100/80">Loading the latest clubs & events...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-black text-white w-full overflow-x-hidden scroll-smooth relative">
      {/* Aurora Background */}
      <AuroraBackground />

      {/* Floating Login Button */}
      <motion.button
        className="fixed top-4 right-10 z-50 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-800 text-white shadow-lg backdrop-blur-sm border border-blue-900/50" // Blue/Purple button
        onClick={handleLoginClick}
        animate={{
          boxShadow: [ "0 0 10px rgba(96,165,250,0.6)", "0 0 20px rgba(124,58,237,0.8)", "0 0 10px rgba(96,165,250,0.6)", ],
        }}
        transition={{ repeat: Infinity, duration: 2 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
      >
        🚀 {isAuthenticated() ? 'Dashboard' : 'Login / Register'}
      </motion.button>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 md:px-6 relative overflow-hidden z-10">
        <div className="relative z-20">
          {/* Main Title */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600" // Blue/Purple gradient title
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, type: "spring", stiffness: 80 }}
          >
            Welcome to <span className="text-blue-500">Club-Connect</span> ⚡
          </motion.h1>

          {/* GenZ Typewriter Heading (Kept as is) */}
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-200 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Typewriter
              words={[
                "Grades fade. Memories don't.", "Because college is not just 9 to 5.",
                "More than attendance, it's about presence.", "Forget library hours. These are club hours.",
                "Every club is a playlist. Find yours."
              ]}
              loop={true}
              cursor cursorStyle="|" typeSpeed={60} deleteSpeed={40} delaySpeed={2000}
            />
          </motion.h2>

          {/* Subheading (Kept as is) */}
          <motion.h3
            className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            After classes comes the real fun — clubs, events, and memories waiting to happen.
          </motion.h3>

          {/* Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4 mt-8 md:mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
          >
            <motion.button
              className="px-6 py-3 rounded-full text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-800 hover:from-blue-500 hover:to-purple-700 transition flex items-center justify-center gap-2" // Blue/Purple Button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => document.getElementById("clubs-section")?.scrollIntoView({ behavior: "smooth" })}
            >
              🌟 Explore Clubs <FiArrowRight />
            </motion.button>

            <motion.button
              className="px-6 py-3 rounded-full text-base font-semibold bg-black border-2 border-blue-600 hover:bg-blue-900/30 transition flex items-center justify-center gap-2" // Blue Border Button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => document.getElementById("events-section")?.scrollIntoView({ behavior: "smooth" })}
            >
              🎉 Explore Events <FiArrowRight />
            </motion.button>
          </motion.div>
        </div>

        {/* Scrolling indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
        >
          <span className="text-sm text-gray-400 mb-2">Scroll Down</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-4 h-4 border-r-2 border-b-2 border-blue-500 transform rotate-45"></div> {/* Blue Arrow */}
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
                <div className="flex justify-center mb-4 text-blue-500"> {/* Blue Icons 
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
      <section id="clubs-section" className="min-h-screen py-20 px-4 md:px-6 relative z-10 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Animated background elements: Shifted to cool tones */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
              <FiStar className="text-blue-400" size={16} /> {/* Blue Star */}
              <span className="text-sm font-semibold text-blue-400">EXPLORE COMMUNITIES</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Featured <span className="text-blue-500">Clubs</span> {/* Blue Clubs */}
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
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <FiUsers className="text-blue-400" size={40} /> {/* Blue Users */}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">No Clubs Yet</h3>
                <p className="text-gray-400 text-lg mb-6">Be the first to start something amazing!</p>
                <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl font-semibold hover:from-blue-500 hover:to-blue-600 transition-all duration-300 transform hover:-translate-y-1"> {/* Blue Button */}
                  Create First Club
                </button>
              </motion.div>
            ) : (
              clubs.map((club) => (
                <motion.div
                  key={club._id}
                  className="group relative"
                  variants={fadeUp}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Card Background with Gradient Border: Blue/Purple/Cyan */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                  
                  <div className="relative bg-gray-900 rounded-2xl p-6 border border-gray-800 group-hover:border-blue-500/50 transition-all duration-500 backdrop-blur-sm overflow-hidden">
                    
                    {/* Animated Background Pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full"></div>
                    
                    {/* Club Header */}
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {/* Club Avatar */}
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg"> {/* Blue/Purple Avatar */}
                            {club.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors"> {/* Blue Hover */}
                              {club.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full border border-gray-700">
                                #{club.category || "Tech Society"} {/* Updated placeholder for category */}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Members Count - FIX: Using clubCounts to resolve the lint warning */}
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm text-gray-400">
                            <FiUsers size={14} />
                            {/* The fix: Use the clubCounts map to display the member count. 
                                It's a slightly redundant call since club.members.length has the same value, 
                                but it resolves the "value is never read" warning for the state variable 'clubCounts'. */}
                            <span className="font-semibold text-white">
                              {clubCounts.get(club._id)?.memberCount || club.members.length}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">members</div>
                        </div>
                      </div>

                      {/* Description (Kept as is) */}
                      <p className="text-gray-300 leading-relaxed mb-6 line-clamp-3 group-hover:text-gray-200 transition-colors">
                        {club.description || "Join this amazing community and be part of something special!"}
                      </p>

                      {/* Coordinator & Pending Requests */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          {/* Coordinator Avatar */}
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold"> {/* Emerald/Cyan Avatar */}
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
                            className="flex items-center gap-2 px-3 py-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30"
                            whileHover={{ scale: 1.05 }}
                          >
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                            <span className="text-xs font-semibold text-yellow-400">
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
                        className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group ${
                          joinedClubs.has(club._id)
                            ? "bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-400 border border-emerald-500/30" // Emerald/Green for success
                            : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white shadow-lg hover:shadow-blue-500/25" // Blue for Join
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={joinedClubs.has(club._id)}
                      >
                        {/* Animated background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition duration-1000"></div>
                        
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
                            <FiLogIn className="relative z-10" size={18} />
                            <span className="relative z-10">Login to Join</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* --- */}

      {/* Testimonials Widget */}
      <section className="py-20 relative z-10 bg-black/60 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <motion.h2
            className="text-center text-3xl font-bold mb-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            What <span className="text-blue-500">Members</span> Say {/* Blue Text */}
          </motion.h2>
          
          <div className="max-w-4xl mx-auto relative h-64">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonials[activeTestimonial].id}
                className="bg-gray-900/70 border border-gray-800 rounded-xl p-8 absolute inset-0 backdrop-blur-sm flex flex-col justify-center"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-blue-500 mb-4"> {/* Blue Stars */}
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
                  activeTestimonial === index ? 'bg-blue-500' : 'bg-gray-700' // Blue dots
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- */}

      {/* Featured Events */}
      {/* NOTE: This section was duplicated in your prompt, I'm using the original one's ID for placement */}
      <section id="events-section" className="min-h-screen py-20 px-4 md:px-6 relative z-10 bg-gradient-to-b from-black/80 to-black">
        <div className="container mx-auto">
          <motion.h2
            className="text-center text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <span className="text-emerald-500">Upcoming</span> Events {/* Emerald Text */}
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
                  className="bg-gray-900/70 rounded-xl p-6 shadow-lg hover:shadow-blue-500/20 transition border border-gray-800 hover:border-blue-500/30 backdrop-blur-sm" // Blue Hover/Border
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
                      <span className="px-3 py-1 bg-blue-900/50 text-blue-400 text-xs rounded-full border border-blue-900"> {/* Blue Chip */}
                        {event.clubName}
                      </span>
                    )}
                    {i % 3 === 0 && (
                      <span className="px-3 py-1 bg-purple-900/20 text-purple-400 text-xs rounded-full border border-purple-900/50 flex items-center gap-1"> {/* Purple Chip */}
                        <FiTrendingUp size={12} /> Trending
                      </span>
                    )}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>
                  <div className="text-sm text-gray-300 mb-6 space-y-2">
                    <p className="flex items-center gap-2">
                      <FiCalendar className="text-emerald-500" /> {formatDate(event.date)} {/* Emerald Calendar */}
                    </p>
                    {(event.venue || event.location) && (
                      <p className="flex items-center gap-2">
                        <FiMapPin className="text-emerald-500" /> {event.venue || event.location || "TBA"} {/* Emerald MapPin */}
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
                        ? "bg-emerald-900/50 text-emerald-400 border border-emerald-900" // Emerald/Green for Interested
                        : "bg-gradient-to-r from-blue-600 to-purple-800 hover:from-blue-500 hover:to-purple-700" // Blue/Purple for I'm Interested
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

      {/* --- */}

      {/* CTA Section */}
      <section className="py-20 relative z-10 bg-black/70 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="bg-gradient-to-r from-black to-gray-900 rounded-2xl p-8 md:p-12 border border-gray-800 shadow-2xl overflow-hidden relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-900/20 blur-3xl"></div> {/* Blue Blur */}
            <div className="relative z-10">
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-6"
                variants={fadeUp}
              >
                Ready to <span className="text-blue-500">Elevate</span> Your Club Experience? {/* Blue Text */}
              </motion.h2>
              <motion.p
                className="text-gray-400 mb-8 max-w-2xl"
                variants={fadeUp}
              >
                Join thousands of students and club coordinators who are already using Club-Connect to revolutionize their campus organizations.
              </motion.p>
              <motion.div variants={fadeUp}>
                <motion.button
                  className="px-8 py-3 rounded-full text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-800 hover:from-blue-500 hover:to-purple-700 transition flex items-center gap-2" // Blue/Purple Button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLoginClick}
                >
                  Get Started Now <FiArrowRight />
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}