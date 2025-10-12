import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AdminPanel from "./PANELS/ADMIN/AdminPanel";
import CoordinatorPanel from "./PANELS/COORDINATOR/CoordinatorPanel";
import LeaderPanel from "./PANELS/LEADER/LeaderPanel";
import MemberPanel from "./PANELS/MEMBER/MemberPanel";
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
import RequestsPage from "./PANELS/COORDINATOR/RequestsPage";
import CoordinatorMembers from "./PANELS/COORDINATOR/CoordinatorMember";
import EventsPage from "./pages/EventsPage";
import CreatePostPage from "./pages/CreatePostPage";
import FeedPage from "./pages/FeedPage";
import Profile from "./pages/Profile";

function App() {
  return (
    <div className="h-screen w-screen bg-black overflow-x-hidden text-white">
      <Router>
        <Routes>
          {/* ---------- 🌐 PUBLIC ROUTES ---------- */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/complete-profile" element={<ProfileCompletionPage />} />

          <Route
            path="/profile"
            element={
              <>
                <Navbar />
                <Profile />
              </>
            }
          />

          {/* Feed Page */}
          <Route
            path="/feed"
            element={
              <>
                <Navbar />
                <FeedPage />
              </>
            }
          />

          {/* Create Post (Public Access if needed) */}
          <Route
            path="/create-post"
            element={
              <>
                <Navbar />
                <CreatePostPage />
              </>
            }
          />

          {/* ---------- 🔐 PROTECTED ROUTES ---------- */}

          {/* 🧠 Admin Routes */}
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

          {/* Uncomment if needed */}
          {/* <Route
            path="/manageclubs"
            element={
              <ProtectedRoute role="admin">
                <Navbar />
                <ManageClubs />
              </ProtectedRoute>
            }
          /> */}

          {/* 🧩 Coordinator Routes */}
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

          {/* Dynamic Requests Page */}
          <Route
            path="/requests/:clubId"
            element={
              <ProtectedRoute role="coordinator">
                <Navbar />
                <RequestsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/coordinator/members"
            element={
              <ProtectedRoute role="coordinator">
                <Navbar />
                <CoordinatorMembers />
              </ProtectedRoute>
            }
          />

          {/* 🧭 Leader Route */}
          <Route
            path="/leaderpanel"
            element={
              <ProtectedRoute role="leader">
                <Navbar />
                <LeaderPanel />
              </ProtectedRoute>
            }
          />

          {/* 👥 Member Routes */}
          <Route
            path="/memberpanel"
            element={
              <ProtectedRoute role="member">
                <Navbar />
                <MemberPanel />
              </ProtectedRoute>
            }
          />

          <Route
            path="/events"
            element={
              <ProtectedRoute role="member">
                <Navbar />
                <EventsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-post"
            element={
              <ProtectedRoute role="member">
                <Navbar />
                <CreatePostPage />
              </ProtectedRoute>
            }
          />

          {/* 🌍 Public Panel (Visitors & Members) */}
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
