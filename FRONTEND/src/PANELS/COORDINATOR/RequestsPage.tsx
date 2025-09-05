// src/PANELS/COORDINATOR/RequestsPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";


interface JoinRequest {
  _id: string;
  user: { username: string; email: string };
  status: string;
}

export default function RequestsPage() {
  const { clubId } = useParams<{ clubId: string }>();
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    if (!clubId) return;
    console.log("clubId param:", clubId);
    

    const fetchRequests = async () => {
      try {
        const res = await fetch(`https://club-connect-xcq2.onrender.com/api/join-requests/club/${clubId}`);
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

  const handleDecision = async (requestId: string, status: "accepted" | "rejected") => {
    try {
      const res = await fetch(`https://club-connect-xcq2.onrender.com/api/join-requests/decision/${requestId}`, {
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
      <h1 className="text-2xl font-bold mb-6">Join Requests</h1>

      {requests.length === 0 ? (
        <p>No pending requests for this club.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="flex justify-between items-center bg-gray-800 p-4 rounded-lg"
            >
              <div>
                <p className="font-semibold">{req.user?.username || "Unknown User"}</p>
                <p className="text-sm text-gray-400">{req.user?.email}</p>
                <p className="text-xs">Status: {req.status}</p>
              </div>

              {req.status === "pending" && (
                <div className="space-x-2">
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleDecision(req._id, "accepted")}
                  >
                    Accept
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => handleDecision(req._id, "rejected")}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
