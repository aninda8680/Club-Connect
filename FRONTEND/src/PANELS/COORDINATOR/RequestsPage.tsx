import { useEffect, useState } from "react";

export default function RequestsPage({ clubId }: { clubId: string }) {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/join-requests/${clubId}`)
      .then(res => res.json())
      .then(data => setRequests(data));
  }, [clubId]);

  const handleAction = async (requestId: string, action: "accept" | "reject") => {
    await fetch(`/api/join-requests/${requestId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action })
    });
    setRequests(prev => prev.filter(r => r._id !== requestId)); // remove from list
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Join Requests</h2>
      {requests.map(req => (
        <div key={req._id} className="flex justify-between p-3 border rounded-lg mb-2">
          <span>{req.user.username} ({req.user.email})</span>
          <div className="space-x-2">
            <button onClick={() => handleAction(req._id, "accept")} className="bg-green-500 text-white px-3 py-1 rounded">Accept</button>
            <button onClick={() => handleAction(req._id, "reject")} className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}
