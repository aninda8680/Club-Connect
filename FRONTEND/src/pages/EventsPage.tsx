// src/pages/EventsPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2, Calendar as CalendarIcon, Star } from "lucide-react";
import { toast } from "react-hot-toast";
import EventCard from "../components/EventCard";
import type { EventCardProps } from "../components/EventCard";

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gray-950 text-white py-16 px-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-center gap-3 mb-12"
      >
        <div className="p-2 bg-purple-400/10 rounded-lg">
          <CalendarIcon className="w-6 h-6 text-purple-400" />
        </div>
        <h1 className="text-4xl font-bold font-mono">FEATURED_EVENTS</h1>
      </motion.div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin w-10 h-10 text-purple-500" />
        </div>
      ) : events.length === 0 ? (
        // Empty State
        <motion.div
          className="text-center text-gray-400 py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Star className="w-12 h-12 mx-auto text-gray-600 mb-4" />
          <p className="text-xl font-mono">NO_EVENTS_AVAILABLE</p>
          <p className="text-sm mt-2 font-mono">CHECK_BACK_LATER</p>
        </motion.div>
      ) : (
        // Events Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <EventCard {...event} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
