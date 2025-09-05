// src/components/ClubCard.tsx

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type ClubCardProps = {
  _id: string;
  name: string;
  description: string;
  coordinator?: string;
  logo?: string;
  onView?: (id: string) => void;
  isHovered?: boolean;
};

export default function ClubCard({
  _id,
  name,
  description,
  coordinator,
  logo,
  onView,
  isHovered = false,
}: ClubCardProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);

  const handleJoinClub = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId"); // assuming userId stored in localStorage
      if (!userId) {
        alert("Please login first!");
        return;
      }

      const res = await fetch(`https://club-connect-xcq2.onrender.com/api/join-requests/${_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (res.ok) {
        setJoined(true);
        alert("Join request sent!");
      } else {
        alert(data.message || "Failed to send request");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="relative w-full max-w-sm ...">
      {/* Header, content ... */}

      <CardFooter className="flex flex-col gap-3 pt-6">
        {/* ✅ FIX: Navigate with real clubId */}
        <Button
          className="w-full bg-gradient-to-r from-[#7546E8] to-[#C8B3F6] hover:from-[#C8B3F6] hover:to-[#7546E8] text-[#0D0E20] font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#7546E8]/30 border-none"
          onClick={() => {
            if (onView) {
              onView(_id); // still call parent if needed
            }
            navigate(`/requests/${_id}`);
          }}
        >
          <span className="flex items-center gap-2">
            View Requests
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Button>

        {/* Join club button stays same */}
        <Button
          disabled={loading || joined}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 disabled:bg-gray-500"
          onClick={handleJoinClub}
        >
          {joined ? "Request Sent" : loading ? "Sending..." : "Join Club"}
        </Button>
      </CardFooter>
    </Card>
  );
}
