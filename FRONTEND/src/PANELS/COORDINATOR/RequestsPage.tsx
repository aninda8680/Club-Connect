// src/PANELS/COORDINATOR/RequestsPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const API_BASE = "https://club-connect-xcq2.onrender.com"; // replace if needed

interface JoinRequest {
  _id: string;
  user: { username: string; email: string };
  status: string;
}

export default function RequestsPage() {
  const { clubId } = useParams<{ clubId: string }>();
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch requests
  useEffect(() => {
    if (!clubId) return;
    console.log("clubId param:", clubId);

    const fetchRequests = async () => {
      try {
        const res = await fetch(`https://club-connect-xcq2.onrender.com/api/join-requests/${clubId}`);
        if (!res.ok) throw new Error("Failed to fetch requests");
        const data = await res.json();
        setRequests(data);
      } catch (err) {
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [clubId]);

  // handle accept/reject
  const handleDecision = async (requestId: string, status: "accepted" | "rejected") => {
  try {
    const res = await fetch(`${API_BASE}/api/join-requests/${requestId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

      if (!res.ok) throw new Error("Failed to update request");

      setRequests(prev =>
        prev.map(r => (r._id === requestId ? { ...r, status } : r))
      );
    } catch (err) {
      console.error("Error updating request:", err);
    }
  };

  if (loading) return <p className="text-white">Loading requests...</p>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Join Requests</h1>
      {requests.length === 0 ? (
        <p>No requests for this club.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map(req => (
            <li
              key={req._id}
              className="flex justify-between items-center bg-gray-800 p-4 rounded-lg"
            >
              <div>
                <p className="font-semibold">{req.user.username}</p>
                <p className="text-sm text-gray-400">{req.user.email}</p>
                <p className="text-xs text-gray-500">Status: {req.status}</p>
              </div>
              {req.status === "pending" && (
                <div className="flex gap-2">
                  <Button onClick={() => handleDecision(req._id, "accepted")} className="bg-green-600">
                    Accept
                  </Button>
                  <Button onClick={() => handleDecision(req._id, "rejected")} className="bg-red-600">
                    Reject
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
