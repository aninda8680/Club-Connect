import React from "react";
import { motion } from "framer-motion";
import EventCard from "../../../components/EventCard"; // <-- Adjust path if needed
import type { Event } from "../../../components/types/event";

interface Props {
  events: Event[];
  interestedEvents: Set<string>;
  isAuthenticated: () => boolean;
  handleInterested: (eventId: string) => void;
  formatDate: (dateString: string) => string;
}

const EventsSection: React.FC<Props> = ({ 
  events, 
  interestedEvents: _interestedEvents, 
  isAuthenticated: _isAuthenticated, 
  handleInterested: _handleInterested, 
  formatDate: _formatDate 
}) => {
  return (
    <section
      id="events-section"
      className="min-h-screen py-20 px-4 md:px-6 relative z-10"
    >
      <div className="container mx-auto">
        {/* Header */}
        <motion.h2
          className="text-center text-3xl font-bold mb-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <span className="text-emerald-500">Upcoming</span> Events
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

        {/* Events Grid */}
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
              <p className="text-gray-400 text-lg">
                No events available right now.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Stay tuned for exciting upcoming events!
              </p>
            </motion.div>
          ) : (
            events.map((event, i) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <EventCard
  _id={event._id}
  title={event.title}
  description={event.description}
  date={event.date}
  venue={event.venue || event.location || "TBA"}   // ⭐ you want venue required, so we ensure a fallback
  poster={event.poster}
  status={event.status}
  category={event.category || "other"}             // ⭐ category REQUIRED → fallback for safety
  clubName={event.club?.name}

  // Landing page settings
  showActions={false}   // ❌ hide like/interested
  showAdmin={false}     // ❌ no admin buttons
  clickable={true}      // ✔ card clickable
  showDescription={true}
/>


              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
