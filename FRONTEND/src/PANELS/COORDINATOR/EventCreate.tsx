import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  FileText, 
  Plus,
  CheckCircle,
  Clock,
  Terminal,
  Sparkles,
  Image as ImageIcon,
  Heart,
  Star
} from "lucide-react";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  status: string;
  createdAt?: string;
  poster?: string;
  likes?: string[];
  interested?: string[];
}

export default function EventCreate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [poster, setPoster] = useState<File | null>(null);
  const [approvedEvents, setApprovedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const coordinatorId = localStorage.getItem("userId"); 
  const clubId = localStorage.getItem("clubId");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("date", date);
      formData.append("venue", venue);
      formData.append("createdBy", coordinatorId!);
      formData.append("club", clubId!);
      if (poster) formData.append("poster", poster);

      await axios.post("http://localhost:5000/api/events/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Reset form
      setTitle(""); 
      setDescription(""); 
      setDate(""); 
      setVenue("");
      setPoster(null);
      
      fetchApprovedEvents(); // refresh approved events after submission
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchApprovedEvents = async () => {
    if (!coordinatorId) return;
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/events/approved/${coordinatorId}`);
      setApprovedEvents(res.data);
    } catch (err) {
      console.error("Error fetching approved events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedEvents();
  }, [coordinatorId]);

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
              Create Event Proposal
            </h1>
            <p className="text-slate-400 text-sm">
              <span className="text-green-400">$</span> Submit new event proposals for approval
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Event Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                New Event Proposal
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className=" text-sm font-medium text-slate-300 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  Event Title
                </label>
                <input
                  type="text"
                  placeholder="Enter event title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className=" text-sm font-medium text-slate-300 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  Description
                </label>
                <textarea
                  placeholder="Describe your event"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className=" text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className=" text-sm font-medium text-slate-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-400" />
                    Venue
                  </label>
                  <input
                    type="text"
                    placeholder="Event location"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Poster Upload */}
              <div className="space-y-2">
                <label className=" text-sm font-medium text-slate-300 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-pink-400" />
                  Upload Poster
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPoster(e.target.files?.[0] || null)}
                  className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4
                             file:rounded-lg file:border-0
                             file:text-sm file:font-semibold
                             file:bg-emerald-600 file:text-white
                             hover:file:bg-emerald-500"
                />
              </div>

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 py-3 rounded-lg text-white font-semibold disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-6"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Submit Proposal
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Approved Events */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <h2 className="text-lg font-semibold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Approved Events
              </h2>
            </div>

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-20 bg-slate-800/50 rounded-lg border border-slate-700/50 animate-pulse"
                  />
                ))}
              </div>
            ) : approvedEvents.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 mb-2">No approved events yet</p>
                <p className="text-slate-500 text-sm">Your submitted events will appear here once approved</p>
              </div>
            ) : (
              <div className="space-y-4">
                {approvedEvents.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600/70 transition-colors"
                  >
                    <h3 className="font-semibold text-white mb-2">{event.title}</h3>
                    <p className="text-slate-300 text-sm mb-3 line-clamp-2">{event.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-blue-400" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      {event.venue && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-red-400" />
                          <span>{event.venue}</span>
                        </div>
                      )}
                    </div>

                    {/* Likes + Interested counts */}
                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-pink-400" />
                        <span>Likes: {event.likes?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400" />
                        <span>Interested: {event.interested?.length || 0}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <span className="px-2 py-1 bg-emerald-900/30 text-emerald-400 rounded border border-emerald-800/50">
                        Approved
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-slate-500 text-sm"
        >
          <p>Event proposals require admin approval before being published</p>
          <code className="bg-slate-900/50 px-2 py-1 rounded text-xs mt-2 inline-block">
            $ coordinator create --event
          </code>
        </motion.div>
      </div>
    </div>
  );
}
