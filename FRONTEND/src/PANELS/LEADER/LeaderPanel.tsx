import { useNavigate } from "react-router-dom";


export default function LeaderPanel() {
  const navigate = useNavigate();
    const username = localStorage.getItem("username");


    const handleLogout = () => {
    navigate("/"); // redirect to landing page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-900 text-white space-y-6">
      <h1 className="text-3xl font-bold">Welcome Leader, {username} 🌍</h1>
      <button
        onClick={handleLogout}
        className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow-lg transition"
      >
        Logout
      </button>
    </div>
  );
}
