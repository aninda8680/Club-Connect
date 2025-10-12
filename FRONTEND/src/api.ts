import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL 
  || "http://localhost:5000/api";
console.log("✅ Using API base URL:", import.meta.env.VITE_API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

export default api;
