// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import Routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import adminRoutes from "./routes/admin.js";
import clubRoutes from "./routes/clubRoutes.js";
import coordinatorRoutes from "./routes/coordinator.js";
import eventRoutes from "./routes/eventRoutes.js";
import joinRequestRoutes from "./routes/joinRequests.js";
import postRoutes from "./routes/post.js";
import notificationRoutes from "./routes/notifications.js";
import announcementRoutes from "./routes/announcementRoutes.js";

// Load environment variables
dotenv.config();
const app = express();

// --- Required for __dirname in ES modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- ✅ Updated CORS Setup (Works with Web + React Native) ---
app.use(
  cors({
    origin: [
      "http://localhost:8680",              // local web frontend
      "http://localhost",                   // localhost web
      "http://127.0.0.1",                   // emulator
      "http://192.168.0.133",               // local LAN for device testing
      "https://club-connect-ad.vercel.app", // production web
      "exp://",                             // Expo / React Native
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Allow requests with no origin (like mobile apps or curl)
app.options("*", cors());

// --- Middleware ---
app.use(express.json());

// --- Serve static files ---
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/postuploads", express.static(path.join(__dirname, "postuploads")));

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/coordinator", coordinatorRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/join", joinRequestRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/announcements", announcementRoutes);

// ✅ Root Route for Render / Browser Check
app.get("/", (req, res) => {
  res.send("✅ Club Connect backend is running successfully!");
});

// ✅ Health Check Route (for monitoring or uptime ping)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy 🚀" });
});

// --- MongoDB Connection & Server Start ---
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
