// src/pages/EventsPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import type { Variants, Easing } from "framer-motion";
import { FiCalendar, FiStar, FiUsers, FiMapPin, FiClock } from "react-icons/fi";
import { toast } from "react-hot-toast";
import EventCard from "../components/EventCard";
import type { EventCardProps } from "../components/EventCard";

// Create the skeleton component locally
const EventCardSkeleton: React.FC = () => {
  return (
    <div className="group relative">
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-2xl blur opacity-30"></div>
      
      <div className="relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 backdrop-blur-sm">
        {/* Poster Skeleton */}
        <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-700 relative animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent"></div>
        </div>

        {/* Content Skeleton */}
        <div className="p-6">
          {/* Title Skeleton */}
          <div className="mb-4">
            <div className="h-6 bg-gray-700 rounded-lg mb-2 w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded-lg w-full animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded-lg w-2/3 mt-1 animate-pulse"></div>
          </div>

          {/* Details Skeleton */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-700 animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded-lg w-32 animate-pulse"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-700 animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded-lg w-40 animate-pulse"></div>
            </div>
          </div>

          {/* Buttons Skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <div className="w-20 h-10 bg-gray-700 rounded-xl animate-pulse"></div>
              <div className="w-20 h-10 bg-gray-700 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, upcoming, past

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/events/approved");
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events", err);
        toast.error("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on selection
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const now = new Date();
    
    switch (filter) {
      case "upcoming":
        return eventDate >= now;
      case "past":
        return eventDate < now;
      default:
        return true;
    }
  });

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as Easing
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-20 px-4 md:px-6 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Page Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-red-500/20 border border-purple-500/30">
            <FiCalendar className="text-purple-400" size={16} />
            <span className="text-sm font-semibold text-purple-400">EXPLORE EVENTS</span>
          </div> */}
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Featured <span className="text-purple-500">Events</span>
          </h1>
          
          <motion.p
            className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Discover amazing events, connect with communities, and create unforgettable experiences
          </motion.p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex gap-2 p-1 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
            {[
              { key: "all", label: "All Events", icon: FiUsers },
              { key: "upcoming", label: "Upcoming", icon: FiClock },
              { key: "past", label: "Past Events", icon: FiCalendar }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  filter === key
                    ? "bg-gradient-to-r from-purple-600 to-red-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Events Grid */}
        {loading ? (
          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {[...Array(6)].map((_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          </motion.div>
        ) : filteredEvents.length === 0 ? (
          // Empty State
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500/20 to-red-500/20 flex items-center justify-center">
              <FiCalendar className="text-purple-400" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No Events Found</h3>
            <p className="text-gray-400 text-lg mb-6 max-w-md mx-auto">
              {filter === "all" 
                ? "There are no events available at the moment. Check back soon for exciting new events!"
                : filter === "upcoming"
                ? "No upcoming events scheduled. Stay tuned for future announcements!"
                : "No past events to display."
              }
            </p>
            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-red-600 rounded-xl font-semibold hover:from-purple-500 hover:to-red-500 transition-all duration-300 transform hover:-translate-y-1"
              >
                View All Events
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event._id}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <EventCard {...event} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Stats Bar */}
        {!loading && events.length > 0 && (
          <motion.div
            className="mt-16 p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-white mb-2">{events.length}</div>
                <div className="text-gray-400 flex items-center justify-center gap-2">
                  <FiCalendar className="text-purple-400" />
                  Total Events
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-2">
                  {events.filter(e => new Date(e.date) >= new Date()).length}
                </div>
                <div className="text-gray-400 flex items-center justify-center gap-2">
                  <FiClock className="text-green-400" />
                  Upcoming
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-2">
                  {events.filter(e => new Date(e.date) < new Date()).length}
                </div>
                <div className="text-gray-400 flex items-center justify-center gap-2">
                  <FiStar className="text-yellow-400" />
                  Completed
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
// Remove this line: export { EventCardSkeleton };