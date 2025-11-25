import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuthRedirect from "./hooks/useAuthRedirect";
import useFetchClubs from "./hooks/useFetchClubs";
import useFetchEvents from "./hooks/useFetchEvents";

import AuroraBackground from "./components/AuroraBackground";
import DotBackground from "./components/DotBackground";
import LoginButton from "./components/LoginButton";
import Hero from "./components/Hero";
import ClubsSection from "./components/ClubsSection";
import EventsSection from "./components/EventsSection";
import FooterCombined from "./components/Footer";

import Loader from "@/components/Loader";
import { toast } from "react-hot-toast";
import type  { Club } from "../../components/types/club";
// import type { Event } from "./types/event";

export default function LandingPage() {
  const navigate = useNavigate();

  // ======================= STATES =======================
  const [joinedClubs, setJoinedClubs] = useState<Set<string>>(new Set());
  const [interestedEvents, setInterestedEvents] = useState<Set<string>>(new Set());
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [loading, setLoading] = useState(true);

  // ======================= HOOKS =======================
  const { clubs, clubCounts } = useFetchClubs();
  const { events } = useFetchEvents();
  useAuthRedirect();

  // ======================= UTILS =======================
  const isAuthenticated = () => {
    return !!(localStorage.getItem("token") && localStorage.getItem("role"));
  };

  const getCurrentUser = () => ({
    id: localStorage.getItem("userId"),
    role: localStorage.getItem("role"),
    token: localStorage.getItem("token"),
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "Date TBD";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Date TBD";
    }
  };

  const handleLoginClick = () => {
    const role = localStorage.getItem("role");
    if (isAuthenticated()) {
      if (role === "admin") navigate("/adminpanel");
      else if (role === "coordinator") navigate("/coordinatorpanel");
      else if (role === "leader") navigate("/leaderpanel");
      else if (role === "member") navigate("/memberpanel");
      else navigate("/publicpanel");
    } else navigate("/auth");
  };

  // ======================= USER CLUB STATUS =======================
  useEffect(() => {
    if (!clubs.length) return;

    const currentUser = getCurrentUser();
    if (!currentUser.id) return;

    const clubStatus = new Set<string>();
    clubs.forEach((club: Club) => {
      if (
        club.joinRequests.includes(currentUser.id || "") ||
        club.members.includes(currentUser.id || "")
      ) {
        clubStatus.add(club._id);
      }
    });

    setJoinedClubs(clubStatus);
  }, [clubs]);

  // ======================= HANDLERS =======================
  const handleJoin = (clubId: string) => {
    if (!isAuthenticated()) {
      navigate("/auth");
      return;
    }

    toast("Join request feature will be implemented with the backend API!", {
      icon: "ℹ️",
    });

    setJoinedClubs((prev) => new Set([...prev, clubId]));
  };

  const handleInterested = (eventId: string) => {
    if (!isAuthenticated()) {
      navigate("/auth");
      return;
    }

    setInterestedEvents((prev) => {
      const updated = new Set(prev);
      updated.has(eventId) ? updated.delete(eventId) : updated.add(eventId);
      return updated;
    });
  };

  // ======================= TESTIMONIALS ROTATION =======================
  const testimonials = [
    { id: 1, name: "-------", role: "----", text: "--------- ----- ------ ----- -------- -- ---------" },
    { id: 2, name: "-------", role: "----", text: "--------- ----- ------ ----- -------- -- ---------" },
    { id: 3, name: "-------", role: "----", text: "--------- ----- ------ ----- -------- -- ---------" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ======================= LOADING STATE =======================
  useEffect(() => {
    if (clubs.length || events.length) {
      setLoading(false);
    }
  }, [clubs, events]);

  // ======================= SCROLL HANDLERS =======================
  const scrollToClubs = () =>
    document.getElementById("clubs-section")?.scrollIntoView({ behavior: "smooth" });

  const scrollToEvents = () =>
    document.getElementById("events-section")?.scrollIntoView({ behavior: "smooth" });

  // ======================= RENDER =======================
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black text-white w-full overflow-x-hidden scroll-smooth relative">
      {/* Background Layers */}
      <AuroraBackground />
      <DotBackground dotColor="rgba(147, 197, 253, 0.15)" dotSize={1.5} gap={30} />

      {/* Login Button */}
      <LoginButton isAuthenticated={isAuthenticated()} onClick={handleLoginClick} />

      {/* Sections */}
      <Hero
        handleScrollToClubs={scrollToClubs}
        handleScrollToEvents={scrollToEvents}
      />

      <ClubsSection
        clubs={clubs}
        clubCounts={clubCounts}
        joinedClubs={joinedClubs}
        isAuthenticated={isAuthenticated}
        handleJoin={handleJoin}
      />

      <EventsSection
        events={events}
        interestedEvents={interestedEvents}
        isAuthenticated={isAuthenticated}
        handleInterested={handleInterested}
        formatDate={formatDate}
      />

      <FooterCombined
        testimonials={testimonials}
        activeTestimonial={activeTestimonial}
        setActiveTestimonial={setActiveTestimonial}
        handleLoginClick={handleLoginClick}
      />
    </div>
  );
}
