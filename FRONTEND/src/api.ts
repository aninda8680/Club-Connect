import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5000/api"
    : "https://club-connect-p2o2.onrender.com/api");

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

export default api;
