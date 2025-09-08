import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Terminal,
  Sparkles
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
}

export default function AdminEvent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/events/pending");
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    try {
      await axios.put(`http://localhost:5000/api/events/${id}`, { status });
      // Remove the event from the list immediately for better UX
      setEvents(events.filter(event => event._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
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
              Pending Event Proposals
            </h1>
            <p className="text-slate-400 text-sm">
              <span className="text-green-400">$</span> Review and approve pending event submissions
            </p>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              Review Queue
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
              <div className="text-2xl font-bold text-emerald-400">{events.length}</div>
              <div className="text-slate-400 text-sm">Pending Events</div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
              <div className="text-2xl font-bold text-blue-400">{events.filter(e => e.status === 'pending').length}</div>
              <div className="text-slate-400 text-sm">Awaiting Review</div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
              <div className="text-2xl font-bold text-amber-400">{events.length > 0 ? Math.floor(events.length / 2) : 0}</div>
              <div className="text-slate-400 text-sm">Avg. Response Time (hrs)</div>
            </div>
          </div>
        </motion.div>

        {/* Events List */}
        <div className="space-y-6">
          {loading ? (
            // Loading Skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 0.8 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
                className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl p-6 h-40"
              />
            ))
          ) : events.length === 0 ? (
            // No events state
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl"
            >
              <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-400 mb-2">No pending events</h3>
              <p className="text-slate-500">All event proposals have been reviewed</p>
            </motion.div>
          ) : (
            // Events list
            <AnimatePresence>
              {events.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>
                      <p className="text-slate-300 mb-4 line-clamp-2">{event.description}</p>
                      
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
                            <span>Submitted {new Date(event.createdAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {event.submittedBy && (
                        <div className="mt-3 text-xs text-slate-500">
                          Submitted by: {event.submittedBy}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 md:flex-col">
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
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-slate-500 text-sm"
        >
          <p>Review all pending event proposals and take appropriate action</p>
          <code className="bg-slate-900/50 px-2 py-1 rounded text-xs mt-2 inline-block">
            $ admin review --events
          </code>
        </motion.div>
      </div>
    </div>
  );
}