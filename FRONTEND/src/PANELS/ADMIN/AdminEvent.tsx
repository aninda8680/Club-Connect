import { useEffect, useState } from "react";
import api from "@/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  AlertCircle,
  Terminal,
  Sparkles,
} from "lucide-react";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  status: string;
  createdAt?: string;
  submittedBy?: string;
  poster?: string;
}

export default function AdminEvent() {
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
  const [approvedEvents, setApprovedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch both pending and approved events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const [pendingRes, approvedRes] = await Promise.all([
        api.get("/events/pending"),
        api.get("/events/approved"),
      ]);
      setPendingEvents(pendingRes.data);
      setApprovedEvents(approvedRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    try {
      await api.put(`/events/${id}`, { status });
      setPendingEvents(pendingEvents.filter((e) => e._id !== id));
      if (status === "approved") {
        // instantly move to approved list for better UX
        const moved = pendingEvents.find((e) => e._id === id);
        if (moved) setApprovedEvents((prev) => [...prev, { ...moved, status }]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      setApprovedEvents(approvedEvents.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);


  return (
    <div className="min-h-screen bg-black text-white py-25">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="p-3 bg-gradient-to-br from-emerald-900/70 to-green-900/70 rounded-xl border border-emerald-700/50">
            <Terminal className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              Event Management
            </h1>
            <p className="text-slate-400 text-sm">
              <span className="text-green-400">$</span> Review, approve, and
              manage event proposals
            </p>
          </div>
        </motion.div>

        {/* Pending Events Section */}
        <Section
          title="Pending Event Proposals"
          icon={<Sparkles className="w-5 h-5 text-emerald-400" />}
          events={pendingEvents}
          loading={loading}
          emptyMessage="No pending events"
          actionButtons={(event) => (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAction(event._id, "approved")}
                className="px-4 py-2 bg-emerald-900/30 hover:bg-emerald-800/50 text-emerald-400 rounded-lg border border-emerald-800/50 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAction(event._id, "rejected")}
                className="px-4 py-2 bg-rose-900/30 hover:bg-rose-800/50 text-rose-400 rounded-lg border border-rose-800/50 transition-colors flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </motion.button>
            </>
          )}
        />

        {/* Approved Events Section */}
        <Section
          title="Approved Events"
          icon={<CheckCircle className="w-5 h-5 text-blue-400" />}
          events={approvedEvents}
          loading={loading}
          emptyMessage="No approved events"
          actionButtons={(event) => (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDelete(event._id)}
              className="px-4 py-2 bg-rose-900/30 hover:bg-rose-800/50 text-rose-400 rounded-lg border border-rose-800/50 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </motion.button>
          )}
        />
      </div>
    </div>
  );
}

// ✅ Reusable Section Component
function Section({
  title,
  icon,
  events,
  loading,
  emptyMessage,
  actionButtons,
}: {
  title: string;
  icon: React.ReactNode;
  events: Event[];
  loading: boolean;
  emptyMessage: string;
  actionButtons: (event: Event) => React.ReactNode;
}) {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl p-6 mb-8"
    >
      <div className="flex items-center gap-2 mb-6">
        {icon}
        <h2 className="text-lg font-semibold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
          {title}
        </h2>
      </div>

      {loading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-slate-800/40 animate-pulse h-40 rounded-lg mb-4"
          />
        ))
      ) : events.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-400">{emptyMessage}</p>
        </div>
      ) : (
        <AnimatePresence>
          {events.map((event, i) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 mb-4"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {event.title}
                  </h3>
                  <p className="text-slate-300 mb-3 line-clamp-2">
                    {event.description}
                  </p>

                  {event.poster && (
                    <img
                      src={`http://localhost:5000${event.poster}`}
                      alt="Poster"
                      className="w-64 h-40 object-cover rounded mb-4"
                    />
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-400" />
                      <span>{event.venue}</span>
                    </div>
                    {event.createdAt && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span>
                          Submitted {new Date(event.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 md:flex-col">
                  {actionButtons(event)}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </motion.div>
  );
}
