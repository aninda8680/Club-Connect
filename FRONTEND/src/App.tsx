import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AdminPanel from "./PANELS/ADMIN/AdminPanel";
import CoordinatorPanel from "./PANELS/COORDINATOR/CoordinatorPanel";
import LeaderPanel from "./PANELS/LEADER/LeaderPanel";
import PublicPanel from "./PANELS/PUBLIC/PublicPanel";
import ProtectedRoute from "./ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import ProfileCompletionPage from "./pages/ProfileCompletionPage";

function App() {
  return (
    <div className = "min-h-screen w-screen bg-black text=white">
     <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/complete-profile" element={<ProfileCompletionPage />} />

        {/* Protected routes */}
        
        <Route
          path="/adminpanel"
          element={
            <ProtectedRoute role="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coordinatorpanel"
          element={
            <ProtectedRoute role="coordinator">
              <CoordinatorPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderpanel"
          element={
            <ProtectedRoute role="leader">
              <LeaderPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/publicpanel"
          element={
            <ProtectedRoute role="visitor">
              <PublicPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
