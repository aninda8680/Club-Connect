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

// Load environment variables
dotenv.config();
const app = express();

// Required for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CORS Setup ---
const allowedOrigins = [
  "http://localhost:5173",               // local dev
  "https://club-connect-ad.vercel.app",  // production frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // allow cookies/auth headers
  })
);

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

// --- Connect to MongoDB and start server ---
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
