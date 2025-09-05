import { useEffect, useState } from "react";

interface Request {
  _id: string;
  user: { username: string; email: string };
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const clubId = localStorage.getItem("clubId");

  useEffect(() => {
    if (!clubId) {
      console.warn("⚠️ No clubId found in localStorage");
      return;
    }

    console.log("Fetching requests for clubId:", clubId);

    fetch(`http://localhost:5000/api/join/club/${clubId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched requests:", data);
        setRequests(data);
      })
      .catch((err) => {
        console.error("Error fetching join requests:", err);
        setRequests([]);
      });
  }, [clubId]);

  const handleAction = async (id: string, action: string) => {
    await fetch(`http://localhost:5000/api/join/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    setRequests((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Join Requests</h1>
      {!clubId ? (
        <p className="text-red-400">
          No clubId found. Please log in as a coordinator.
        </p>
      ) : requests.length === 0 ? (
        <p className="text-gray-400">No pending requests</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="flex justify-between items-center bg-gray-800 p-4 rounded-lg"
            >
              <span className="text-white">
                {req.user?.username} ({req.user?.email})
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(req._id, "accept")}
                  className="bg-green-500 px-3 py-1 rounded text-white"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleAction(req._id, "reject")}
                  className="bg-red-500 px-3 py-1 rounded text-white"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
