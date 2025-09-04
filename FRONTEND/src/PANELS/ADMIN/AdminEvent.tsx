import { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "../../components/EventCard";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  status: string;
}

export default function AdminEvent() {
  const [events, setEvents] = useState<Event[]>([]);

  const fetchPendingEvents = async () => {
    try {
      const res = await axios.get("https://club-connect-xcq2.onrender.com/api/events/pending");
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    try {
      await axios.put(`https://club-connect-xcq2.onrender.com/api/events/${id}`, { status });
      fetchPendingEvents();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Pending Event Proposals</h1>
      {events.map((event) => (
        <EventCard
          key={event._id}
          title={event.title}
          description={event.description}
          date={event.date}
          venue={event.venue}
          status={event.status}
          onApprove={() => handleAction(event._id, "approved")}
          onReject={() => handleAction(event._id, "rejected")}
        />
      ))}
    </div>
  );
}
