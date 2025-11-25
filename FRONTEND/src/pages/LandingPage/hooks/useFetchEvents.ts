import { useEffect, useState } from "react";
import api from "@/api";
import type { Event } from "../../../components/types/event";
import { toast } from "react-hot-toast";

export default function useFetchEvents() {
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async (): Promise<Event[]> => {
    try {
      const response = await api.get("/events/approved");
      return response.data.map((event: any) => ({
        ...event,
        clubName: event.club?.name || "Unknown Club",
        location: event.venue || event.location,
        maxAttendees: 100,
        attendees: event.attendees || [],
      }));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error Fetching Events");
      return [];
    }
  };

  useEffect(() => {
    const load = async () => {
      const data = await fetchEvents();
      setEvents(data);
    };

    load();
  }, []);

  return { events };
}
