import { io } from "socket.io-client";

// ⚠️ FORCE the Render URL. Do not use Env vars for now to debug.
const SOCKET_URL = "https://intelli-class-project.onrender.com"; 

export const socket = io(SOCKET_URL, {
  autoConnect: false, // 🛑 CRITICAL: Do not connect on load. Wait for login.
  transports: ["websocket"], // Force WebSocket to avoid polling errors
  withCredentials: true,
  reconnectionAttempts: 5,
});