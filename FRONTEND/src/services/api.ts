import axios from "axios";
import type { AxiosInstance } from "axios";

// Explicitly type API as AxiosInstance
const API: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string, // 👈 tell TS it's a string
});

export default API;
