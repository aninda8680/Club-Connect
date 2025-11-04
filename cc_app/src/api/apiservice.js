// api/apiService.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Always use Render in Expo Go, local only if you're running the backend yourself
const useLocalServer = false; // 👈 change to true only when your localhost backend is running

const API = axios.create({
  baseURL: useLocalServer
    ? "http://192.168.0.133:5000/api"
    : "https://club-connect-p2o2.onrender.com/api",
  timeout: 20000,
});

API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
