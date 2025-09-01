import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AdminPanel from "./PANELS/ADMIN/AdminPanel";
import CoordinatorPanel from "./PANELS/COORDINATOR/CoordinatorPanel";
import LeaderPanel from "./PANELS/LEADER/LeaderPanel";
import PublicPanel from "./PANELS/PUBLIC/PublicPanel";
import ProtectedRoute from "./ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import ProfileCompletionPage from "./pages/ProfileCompletionPage";
import Navbar from "./components/Navbar";
import ManageRoles from "./PANELS/ADMIN/ManageRoles";
// import ManageClubs from "./PANELS/ADMIN/ManageClubs";
import CreateClub from "./PANELS/ADMIN/CreateClub";
import AdminEvent from "./PANELS/ADMIN/AdminEvent";
import EventCreate from "./PANELS/COORDINATOR/EventCreate";


function App() {
  return (
    <div className = "h-screen w-screen bg-black overflow-hidden text=white">
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
              <Navbar />
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manageroles"
          element={
            <ProtectedRoute role="admin">
              <Navbar />
              <ManageRoles />
            </ProtectedRoute>
          }
        />

        <Route
          path="/createclub"
          element={
            <ProtectedRoute role="admin">
              <Navbar />
              <CreateClub />
            </ProtectedRoute>
          }
        />

        <Route
          path="/adminevent"
          element={
            <ProtectedRoute role="admin">
              <Navbar />
              <AdminEvent />
            </ProtectedRoute>
          }
        />

          {/* <Route
          path="/manageclubs"
          element={
            <ProtectedRoute role="admin">
              <Navbar />
              <ManageClubs />
            </ProtectedRoute>
          }
        /> */}

        <Route
          path="/coordinatorpanel"
          element={
            <ProtectedRoute role="coordinator">
              <Navbar />
              <CoordinatorPanel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/eventcreate"
          element={
            <ProtectedRoute role="coordinator">
              <Navbar />
              <EventCreate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leaderpanel"
          element={
            <ProtectedRoute role="leader">
              <Navbar />
              <LeaderPanel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/publicpanel"
          element={
            <ProtectedRoute role="visitor">
              <Navbar />
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
