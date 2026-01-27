// client/src/api/socket.js
import { io } from "socket.io-client";

// Use the ROOT URL (without /api)
// Locally, this defaults to "http://localhost:5001"
const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

console.log("🔌 Socket Connecting to:", SOCKET_URL);

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false, // We connect manually in App.jsx or AuthContext
  transports: ["websocket"], // Prevents CORS polling errors
});