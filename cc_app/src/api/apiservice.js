//api/apiservice.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 👇 If you're running debug locally, use your IP
const isLocal = __DEV__; 

const API = axios.create({
  baseURL: isLocal
    ? "http://192.168.0.133:5000/api/auth"   // 👈 Local backend for dev
    : "https://club-connect-p2o2.onrender.com/api/auth", // 👈 Render backend
//   timeout: 10000, // optional safety timeout
});

API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
