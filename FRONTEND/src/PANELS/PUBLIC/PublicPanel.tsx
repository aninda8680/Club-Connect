//PublicPanel.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Star, Calendar } from "lucide-react";
import ClubCard from "../../components/ClubCard";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast"; // Uncomment if you have react-hot-toast installed
import EventCard from "../../components/EventCard"; // Add this

export default function PublicPanel() {
  const [clubs, setClubs] = useState<any[]>([]);
  const [, setHoveredClub] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/clubs");
        setClubs(res.data);
      } catch (err) {
        console.error("Error fetching clubs", err);
        toast.error("Failed to fetch clubs"); // Uncomment if using toast
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

  const handleViewClub = (id: string) => {
    console.log("View club:", id);
    // Add your club viewing logic here
    toast.success("Opening club details..."); // Uncomment if using toast
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="snap-y snap-proximity h-screen w-screen overflow-y-scroll overflow-x-hidden bg-black text-white scroll-smooth">
      {/* Section 1: Hero Intro */}
      <section className="snap-start snap-always h-screen w-full flex flex-col items-center justify-center px-4 md:px-8 text-center space-y-4">
        <motion.h1
          className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-transparent bg-clip-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Welcome to Club-Connect ⚡
        </motion.h1>
        <motion.p
          className="text-gray-400 text-lg max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          A coder-first club management platform. Join, build, collaborate.
        </motion.p>
      </section>

      {/* Section 2: Club Listing */}
      <section className="snap-start snap-always h-screen w-full flex items-center justify-center px-4 md:px-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="text-yellow-400 font-semibold">Featured Clubs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <motion.div
                key={club._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                onMouseEnter={() => setHoveredClub(club._id)}
                onMouseLeave={() => setHoveredClub(null)}
              >
                <ClubCard
                  _id={club._id}
                  name={club.name}
                  description={club.description}
                  // coordinator={club.coordinator?.username}
                  // logo={club.logo}
                  // onView={handleViewClub}
                />
              </motion.div>
            ))}
          </div>

          {clubs.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              <p className="text-xl">No clubs available at the moment.</p>
              <p className="text-sm mt-2">Check back later for exciting opportunities!</p>
            </div>
          )}
        </div>
      </section>

      {/* Section 3: Approved Events */}
      <section className="snap-start snap-always h-screen w-full flex items-center justify-center px-4 md:px-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-purple-400 fill-current" />
            <span className="text-purple-400 font-semibold">Upcoming Events</span>
          </div>

          {events.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <p className="text-xl">No approved events at the moment.</p>
              <p className="text-sm mt-2">Stay tuned for exciting upcoming events!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <EventCard
                    title={event.title}
                    description={event.description}
                    date={event.date}
                    venue={event.venue}
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
      <section className="snap-start snap-always h-screen w-full flex flex-col items-center justify-center text-center px-4 md:px-8 space-y-6">
        <motion.h2
          className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Why Join a Club?
        </motion.h2>
        <motion.p
          className="text-gray-400 max-w-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Clubs help you grow beyond academics — improve leadership, communication, and real-world project skills.
        </motion.p>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mt-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-[#1e1e2e] p-6 rounded-xl border border-[#2d2d3d] hover:border-cyan-400 transition-colors duration-300">
            🤝 Network with peers
          </div>
          <div className="bg-[#1e1e2e] p-6 rounded-xl border border-[#2d2d3d] hover:border-cyan-400 transition-colors duration-300">
            🚀 Boost your portfolio
          </div>
          <div className="bg-[#1e1e2e] p-6 rounded-xl border border-[#2d2d3d] hover:border-cyan-400 transition-colors duration-300">
            🎯 Learn Leadership
          </div>
          <div className="bg-[#1e1e2e] p-6 rounded-xl border border-[#2d2d3d] hover:border-cyan-400 transition-colors duration-300">
            💡 Build cool things
          </div>
        </motion.div>
      </section>

      {/* Section 5: Testimonials */}
      <section className="snap-start snap-always h-screen w-full flex flex-col items-center justify-center text-center px-4 md:px-8 space-y-4">
        <motion.h2
          className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          What Members Say
        </motion.h2>
        <motion.blockquote
          className="text-gray-300 italic max-w-xl text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          "Being in the Robotics Club changed how I approach tech — real teamwork, real impact."
        </motion.blockquote>
        <motion.p
          className="text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          — Arjun, 2nd Year ECE
        </motion.p>

        {/* Additional testimonials could be added here */}
        <motion.div
          className="mt-8 space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <blockquote className="text-gray-300 italic max-w-xl">
            "Club-Connect made it so easy to find and join clubs that match my interests!"
          </blockquote>
          <p className="text-sm text-gray-500">— Priya, 3rd Year CSE</p>
        </motion.div>
      </section>

      {/* Section 6: Call to Action */}
      <section className="snap-start snap-always h-screen w-full flex flex-col items-center justify-center text-center px-4 md:px-8 space-y-6">
        <motion.h2
          className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 text-transparent bg-clip-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Ready to Get Started?
        </motion.h2>
        <motion.p
          className="text-gray-400 max-w-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Browse through our amazing clubs and find your perfect match. Your journey starts here!
        </motion.p>
        <motion.button
          className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => {
            // Scroll to clubs section
            document.querySelector('section:nth-child(2)')?.scrollIntoView({ 
              behavior: 'smooth' 
            });
          }}
        >
          Explore Clubs
        </motion.button>
      </section>
    </div>
  );
}