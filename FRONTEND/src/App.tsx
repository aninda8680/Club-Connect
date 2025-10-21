// src/App.tsx
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
import ManageRoles from "./PANELS/ADMIN/ManageRoles";
import CreateClub from "./PANELS/ADMIN/CreateClub";
import AdminEvent from "./PANELS/ADMIN/AdminEvent";
import EventCreate from "./PANELS/COORDINATOR/EventCreate";
import RequestsPage from "./PANELS/COORDINATOR/RequestsPage";
import CoordinatorMembers from "./PANELS/COORDINATOR/CoordinatorMember";
import EventsPage from "./pages/EventsPage";
import CreatePostPage from "./pages/CreatePostPage";
import FeedPage from "./pages/FeedPage";
import Profile from "./pages/Profile";
import Notification from "./pages/NotificationPage";
import Layout from "./components/Layout";

function App() {
  return (
    <div className="h-screen w-screen bg-black overflow-x-hidden text-white">
      <Router>
        <Routes>
          {/* ---------- 🌐 PUBLIC ROUTES ---------- */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/complete-profile" element={<ProfileCompletionPage />} />

          {/* ---------- ROUTES WITH NAVBAR (Persistent) ---------- */}
          <Route element={<Layout />}>
            {/* 👤 Profile (any logged-in user) */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* 📰 Feed (for member, visitor, coordinator, leader) */}
            <Route
              path="/feed"
              element={
                <ProtectedRoute role={["member", "visitor", "coordinator", "leader", "admin"]}>
                  <FeedPage />
                </ProtectedRoute>
              }
            />

            {/* ✍️ Create Post (for member, visitor, coordinator, leader) */}
            <Route
              path="/create-post"
              element={
                <ProtectedRoute role={["member", "visitor", "coordinator", "leader"]}>
                  <CreatePostPage />
                </ProtectedRoute>
              }
            />

            {/* 🔔 Notification (for member, visitor, coordinator, leader) */}
            <Route
              path="/notifications"
              element={
                <ProtectedRoute role={["member", "visitor", "coordinator", "leader"]}>
                  <Notification />
                </ProtectedRoute>
              }
            />

            {/* ---------- 🔐 PROTECTED PANELS ---------- */}

            {/* Admin */}
            <Route
              path="/adminpanel"
              element={
                <ProtectedRoute role="admin">
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manageroles"
              element={
                <ProtectedRoute role="admin">
                  <ManageRoles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/createclub"
              element={
                <ProtectedRoute role="admin">
                  <CreateClub />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adminevent"
              element={
                <ProtectedRoute role="admin">
                  <AdminEvent />
                </ProtectedRoute>
              }
            />

            {/* Coordinator */}
            <Route
              path="/coordinatorpanel"
              element={
                <ProtectedRoute role="coordinator">
                  <CoordinatorPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/eventcreate"
              element={
                <ProtectedRoute role="coordinator">
                  <EventCreate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/requests/:clubId"
              element={
                <ProtectedRoute role="coordinator">
                  <RequestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/coordinator/members"
              element={
                <ProtectedRoute role="coordinator">
                  <CoordinatorMembers />
                </ProtectedRoute>
              }
            />

            {/* Leader */}
            <Route
              path="/leaderpanel"
              element={
                <ProtectedRoute role="leader">
                  <LeaderPanel />
                </ProtectedRoute>
              }
            />

            {/* Member */}
            <Route
              path="/memberpanel"
              element={
                <ProtectedRoute role="member">
                  <MemberPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute role="member">
                  <EventsPage />
                </ProtectedRoute>
              }
            />

            {/* Visitor */}
            <Route
              path="/publicpanel"
              element={
                <ProtectedRoute role="visitor">
                  <PublicPanel />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
