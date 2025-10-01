// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import adminRoutes from "./routes/admin.js";
import clubRoutes from "./routes/clubRoutes.js";
import coordinatorRoutes from "./routes/coordinator.js";
import eventRoutes from "./routes/eventRoutes.js";
import joinRequestRoutes from "./routes/joinRequests.js";
import postRoutes from "./routes/post.js";

dotenv.config();
const app = express();

// Required for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev
      "https://club-connectsx.vercel.app", // production frontend
    ],
    credentials: true,
  })
);
app.use(express.json());

// ✅ Serve poster uploads statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Serve postuploads folder
app.use("/postuploads", express.static("postuploads"));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/coordinator", coordinatorRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/join", joinRequestRoutes);
app.use("/api/posts", postRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log("Server running on port " + process.env.PORT)
    )
  )
  .catch((err) => console.error(err));
