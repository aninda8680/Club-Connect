import React, { useState, useEffect } from "react";
import axios from "axios";
import EventCard from "../../components/EventCard"; // Assuming you have an EventCard component

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  status: string;
}

export default function EventCreate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [approvedEvents, setApprovedEvents] = useState<Event[]>([]);

  const coordinatorId = localStorage.getItem("userId"); 
  const clubId = localStorage.getItem("clubId");

  // Submit event proposal
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/events/create", {
        title,
        description,
        date,
        venue,
        createdBy: coordinatorId,
        club: clubId,
      });

      alert("Event proposal submitted!");
      setTitle(""); 
      setDescription(""); 
      setDate(""); 
      setVenue("");
      fetchApprovedEvents(); // refresh approved events after submission
    } catch (err) {
      console.error(err);
      alert("Error submitting event");
    }
  };

  // Fetch approved events for this coordinator
  const fetchApprovedEvents = async () => {
    if (!coordinatorId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/events/approved/${coordinatorId}`);
      setApprovedEvents(res.data);
    } catch (err) {
      console.error("Error fetching approved events:", err);
    }
  };

  useEffect(() => {
    fetchApprovedEvents();
  }, [coordinatorId]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow p-6 rounded-xl mb-6">
        <h1 className="text-2xl font-bold mb-4">Create Event Proposal</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Submit Proposal
          </button>
        </form>
      </div>

      <h2 className="text-xl font-bold mb-3">Your Approved Events</h2>
      {approvedEvents.length === 0 ? (
        <p>No approved events yet.</p>
      ) : (
        approvedEvents.map((event) => (
          <EventCard
            key={event._id}
            title={event.title}
            description={event.description}
            date={event.date}
            venue={event.venue}
            status={event.status}
          />
        ))
      )}
    </div>
  );
}
