import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      // Redirect based on role
      if (role === "admin") navigate("/adminpanel");
      else if (role === "coordinator") navigate("/coordinatorpanel");
      else if (role === "leader") navigate("/leaderpanel");
      else if (role === "member") navigate("/memberpanel");
      else navigate("/publicpanel");
    } else {
      // No session -> go to Auth page
      navigate("/auth");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Club Management System</h1>
      <div className="space-x-4">
        <button
          onClick={handleLoginClick}
          className="px-4 py-2 text-white bg-black rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}
