import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Read clubId from the route parameter instead of requiring a prop
export default function RequestsPage() {
  const { clubId } = useParams<{ clubId: string }>();
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    if (!clubId) return; // guard if route param missing
    fetch(`/api/join-requests/${clubId}`)
      .then((res) => res.json())
      .then((data) => setRequests(data));
  }, [clubId]);

  const handleAction = async (requestId: string, action: "accept" | "reject") => {
    await fetch(`/api/join-requests/${requestId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setRequests((prev) => prev.filter((r) => r._id !== requestId)); // remove from list
  };

  if (!clubId) {
    return <div className="p-6">Missing clubId.</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Join Requests</h2>
      {requests.map((req) => (
        <div key={req._id} className="flex justify-between p-3 border rounded-lg mb-2">
          <span>
            {req.user.username} ({req.user.email})
          </span>
          <div className="space-x-2">
            <button
              onClick={() => handleAction(req._id, "accept")}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Accept
            </button>
            <button
              onClick={() => handleAction(req._id, "reject")}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
