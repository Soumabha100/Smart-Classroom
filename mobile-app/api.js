import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// --- 1. PERMANENT PUBLIC URL (DEFAULT) ---
// Your friends can use the app immediately with this URL.
// Note: We append '/api' because your server routes are likely prefixed with it.
const DEFAULT_URL = "https://intelli-class-project.onrender.com/api";

const api = axios.create({
  baseURL: DEFAULT_URL,
  timeout: 15000, // Increased timeout for Render (free tier can be slow to wake up)
});

// --- 2. DYNAMIC CONFIGURATION (INTERCEPTOR) ---
// This allows you to override the default URL from the Login screen
// (e.g., if you want to switch back to 192.168.x.x for local development).
api.interceptors.request.use(
  async (config) => {
    try {
      // Check if the user has saved a custom server URL
      const dynamicUrl = await AsyncStorage.getItem("server_url");

      if (dynamicUrl) {
        // Normalize the URL: remove trailing slash
        const cleanUrl = dynamicUrl.replace(/\/$/, "");
        // Ensure it ends with /api
        config.baseURL = cleanUrl.endsWith("/api")
          ? cleanUrl
          : `${cleanUrl}/api`;
      }

      // Add Auth Token
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log("Error reading config", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
