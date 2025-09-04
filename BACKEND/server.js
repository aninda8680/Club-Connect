// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import adminRoutes from "./routes/admin.js";
import clubRoutes from "./routes/clubRoutes.js";
import coordinatorRoutes from "./routes/coordinator.js"; // ✅ import here
import eventRoutes from "./routes/eventRoutes.js";

dotenv.config();
const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173", // local dev
    "https://your-frontend.vercel.app" // production frontend
  ],
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/coordinator", coordinatorRoutes); // ✅ use here
app.use("/api/events", eventRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log("Server running on port " + process.env.PORT)
    )
  )
  .catch((err) => console.error(err));
