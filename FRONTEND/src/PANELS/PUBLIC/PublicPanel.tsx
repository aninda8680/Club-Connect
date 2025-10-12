// PublicPanel.tsx
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Star, Calendar, ChevronDown, Code, Cpu, Zap, Sparkles } from "lucide-react";
import ClubCard from "../../components/ClubCard";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import EventCard from "../../components/EventCard";
import Navbar from "../../components/Navbar";

export default function PublicPanel() {
  const [clubs, setClubs] = useState<any[]>([]);
  const [, setHoveredClub] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState(0);
  
  const sectionRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null)
  ];

  // Handle scroll snapping and active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      sectionRefs.forEach((ref, index) => {
        if (ref.current) {
          const sectionTop = ref.current.offsetTop;
          const sectionHeight = ref.current.offsetHeight;
          
          if (scrollPosition >= sectionTop - windowHeight/3 && 
              scrollPosition < sectionTop + sectionHeight - windowHeight/3) {
            setActiveSection(index);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/clubs");
        setClubs(res.data);
      } catch (err) {
        console.error("Error fetching clubs", err);
        toast.error("Failed to fetch clubs");
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/events/approved");
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events", err);
        toast.error("Failed to fetch events");
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mb-4"></div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-cyan-400 font-mono"
          >
            Loading Club-Connect v1.0
          </motion.p>
        </div>
      </div>
    );
  }

  // Scroll to section function
  const scrollToSection = (index: number) => {
    sectionRefs[index].current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="h-screen w-screen overflow-y-scroll overflow-x-hidden bg-black text-white scroll-smooth">
      {/* Navigation Dots */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 flex flex-col gap-3">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeSection === index 
                ? 'bg-cyan-400 scale-125' 
                : 'bg-gray-600 hover:bg-gray-400'
            }`}
            aria-label={`Scroll to section ${index + 1}`}
          />
        ))}
      </div>

      {/* Section 1: Hero Intro */}
      <Navbar />
      <section 
        ref={sectionRefs[0]}
        className="h-screen w-full flex flex-col items-center justify-center px-4 md:px-8 text-center space-y-6 relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-400 rounded-full filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-fuchsia-500 rounded-full filter blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>
        
        {/* Binary rain effect */}
        <div className="absolute inset-0 z-0 opacity-10 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.span
              key={i}
              className="text-green-400 font-mono absolute top-0"
              style={{ left: `${Math.random() * 100}%` }}
              initial={{ y: -100, opacity: 0 }}
              animate={{ 
                y: window.innerHeight + 100, 
                opacity: [0, 0.7, 0] 
              }}
              transition={{ 
                duration: 5 + Math.random() * 10, 
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            >
              {Math.random() > 0.5 ? '1' : '0'}
            </motion.span>
          ))}
        </div>

        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-transparent bg-clip-text font-mono mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            CLUB_CONNECT<span className="text-cyan-400">⚡</span>
          </motion.h1>
          <motion.div 
            className="h-1 w-24 bg-cyan-400 mx-auto mb-6"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          />
          <motion.p
            className="text-gray-400 text-lg max-w-2xl font-mono tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {"<coder-first club management platform />"}
          </motion.p>
        </motion.div>

        <motion.div
          className="absolute bottom-10 animate-bounce"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <ChevronDown className="w-8 h-8 text-cyan-400" />
        </motion.div>
      </section>

      {/* Section 2: Club Listing */}
      <section 
        ref={sectionRefs[1]}
        className="min-h-screen w-full flex items-center justify-center px-4 md:px-8 py-20"
      >
        <div className="w-full max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="p-2 bg-cyan-400/10 rounded-lg">
              <Star className="w-6 h-6 text-cyan-400" />
            </div>
            <h2 className="text-3xl font-bold text-white font-mono">
              FEATURED_CLUBS
            </h2>
          </motion.div>

          {clubs.length === 0 ? (
            <motion.div 
              className="text-center text-gray-400 py-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Code className="w-12 h-12 mx-auto text-gray-600 mb-4" />
              <p className="text-xl font-mono">NO_CLUBS_AVAILABLE</p>
              <p className="text-sm mt-2 font-mono">CHECK_BACK_LATER</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubs.map((club, index) => (
                <motion.div
                  key={club._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onMouseEnter={() => setHoveredClub(club._id)}
                  onMouseLeave={() => setHoveredClub(null)}
                  whileHover={{ y: -5 }}
                >
                  <ClubCard
                    _id={club._id}
                    name={club.name}
                    description={club.description}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 3: Approved Events */}
      <section 
        ref={sectionRefs[2]}
        className="min-h-screen w-full flex items-center justify-center px-4 md:px-8 py-20"
      >
        <div className="w-full max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="p-2 bg-purple-400/10 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-3xl font-bold text-white font-mono">
              UPCOMING_EVENTS
            </h2>
          </motion.div>

          {events.length === 0 ? (
            <motion.div 
              className="text-center text-gray-400 py-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Cpu className="w-12 h-12 mx-auto text-gray-600 mb-4" />
              <p className="text-xl font-mono">NO_EVENTS_SCHEDULED</p>
              <p className="text-sm mt-2 font-mono">STAY_TUNED</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <EventCard
                    key={event._id}
                    _id={event._id}
                    title={event.title}
                    description={event.description}
                    date={event.date}
                    venue={event.venue}
                    poster={event.poster}
                    status={event.status}
                    clubName={event.club?.name}
                    clubLogo={event.club?.logo}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 4: Why Join Clubs */}
      <section 
        ref={sectionRefs[3]}
        className="min-h-screen w-full flex flex-col items-center justify-center px-4 md:px-8 py-20 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text font-mono mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            WHY_JOIN_CLUBS?
          </motion.h2>
          
          <motion.div 
            className="h-1 w-16 bg-green-400 mx-auto mb-10"
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
          />
          
          <motion.p
            className="text-gray-400 max-w-xl mx-auto mb-16 font-mono"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Clubs help you grow beyond academics — improve leadership, communication, and real-world project skills.
          </motion.p>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            {[
              { icon: "🤝", text: "Network with peers" },
              { icon: "🚀", text: "Boost your portfolio" },
              { icon: "🎯", text: "Learn Leadership" },
              { icon: "💡", text: "Build cool things" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-[#1a1a2e] p-6 rounded-xl border border-[#2d2d3d] hover:border-cyan-400 transition-all duration-300 group"
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(34, 211, 238, 0.1)"
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                  {item.text}
                </h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section 5: Testimonials */}
      <section 
        ref={sectionRefs[4]}
        className="min-h-screen w-full flex flex-col items-center justify-center px-4 md:px-8 py-20 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text font-mono mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            USER_TESTIMONIALS
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-[#1a1a2e] p-8 rounded-xl border border-[#2d2d3d] text-left"
            >
              <div className="flex items-start mb-4">
                <div className="bg-cyan-400/10 p-2 rounded-lg mr-4">
                  <Zap className="w-5 h-5 text-cyan-400" />
                </div>
                <p className="text-gray-300 italic">
                  "Being in the Robotics Club changed how I approach tech — real teamwork, real impact."
                </p>
              </div>
              <p className="text-sm text-cyan-400 font-mono">
                — Arjun, 2nd Year ECE
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-[#1a1a2e] p-8 rounded-xl border border-[#2d2d3d] text-left"
            >
              <div className="flex items-start mb-4">
                <div className="bg-purple-400/10 p-2 rounded-lg mr-4">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-gray-300 italic">
                  "Club-Connect made it so easy to find and join clubs that match my interests!"
                </p>
              </div>
              <p className="text-sm text-purple-400 font-mono">
                — Priya, 3rd Year CSE
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 6: Call to Action */}
      <section 
        ref={sectionRefs[5]}
        className="min-h-screen w-full flex flex-col items-center justify-center px-4 md:px-8 text-center relative overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-cyan-400 rounded-full filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.h2
            className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 text-transparent bg-clip-text font-mono mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            READY_TO_GET_STARTED?
          </motion.h2>
          
          <motion.p
            className="text-gray-400 mb-10 font-mono"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Browse through our amazing clubs and find your perfect match. Your journey starts here!
          </motion.p>
          
          <motion.button
            className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-white px-8 py-4 rounded-full font-semibold font-mono tracking-wide hover:shadow-lg hover:shadow-cyan-400/20 transition-all duration-300 relative overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            onClick={() => scrollToSection(1)}
          >
            <span className="relative z-10">EXPLORE_CLUBS</span>
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>
        </div>
        
        <motion.div 
          className="mt-20 text-gray-500 text-sm font-mono"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
        >
          CLUB_CONNECT v1.0 • DEVELOPER_PLATFORM
        </motion.div>
      </section>
    </div>
  );
}