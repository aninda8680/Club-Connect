import axios from "axios";

// Detect whether you're running locally or on production
const isLocal = window.location.hostname === "localhost";

// Dynamically choose API base URL
const API_BASE_URL = isLocal
  ? "http://localhost:5000/api" // 🧩 Local backend for dev
  : "https://club-connect-p2o2.onrender.com/api"; // 🚀 Render backend for production

// console.log("✅ API Base URL:", API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // set true only if using cookies/sessions
});

export default api;
