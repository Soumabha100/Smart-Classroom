import { io } from "socket.io-client";
import { setClientToken } from "./apiService"; 

// Socket MUST connect directly to Render (Vercel serverless doesn't support persistent WS)
const SOCKET_URL = "https://intelli-class-project.onrender.com";

export const socket = io(SOCKET_URL, {
  autoConnect: false, // Wait until we have the token
  transports: ["websocket"],
  auth: (cb) => {
    // We pass the token dynamically during connection
    // We will set this token in AuthContext
    cb({ token: localStorage.getItem("temp_access_token") }); 
  }
});