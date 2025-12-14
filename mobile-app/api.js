import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- CRITICAL STEP: CHANGE THIS IP ADDRESS ---
// 
// 🚨 Replace 'YOUR_COMPUTER_LOCAL_IP' with the actual, current 
//    IPv4 address of the computer running your backend server (e.g., 192.168.1.100).
//    The port (5001) must match the port your Node.js server is running on.
const YOUR_COMPUTER_IP = '192.168.1.4'; // <-- CHANGE THIS TO YOUR ACTUAL IP
const API_PORT = '5001';
const API_URL = `http://${YOUR_COMPUTER_IP}:${API_PORT}/api`; 

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // Optional: Add a 10-second timeout
});

// Interceptor to add the token to every request
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // This handles errors before the request is sent (like bad configuration)
    return Promise.reject(error);
  }
);

// Optional: Interceptor to handle global errors (like 401 Unauthorized)
/*
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (e.g., automatically log out the user)
      // This requires importing the logout function or navigation logic.
      // For now, we will leave this commented out.
    }
    return Promise.reject(error);
  }
);
*/

export default api;