const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const os = require("os");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken"); // Added for Socket Auth
require("dotenv").config();

const errorHandler = require("./middlewares/errorMiddleware");

// --- 1. Dynamic Local IP Logic ---
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

const localIp = getLocalIpAddress();
console.log(`📡 Local Network IP detected: ${localIp}`);

// --- 2. Centralized Origin Validation ---
const checkOrigin = (origin, callback) => {
  // Allow requests with no origin (like mobile apps or curl requests)
  if (!origin) return callback(null, true);

  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://localhost:5173",
    `http://${localIp}:5173`, // Allow dynamic local IP
    process.env.CORS_ORIGIN, // Production Main Domain
  ];

  // Check against static allowed list
  if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  }

  // Allow Vercel Preview Deployments (Wildcard)
  if (origin.endsWith(".vercel.app")) {
    return callback(null, true);
  }

  // Allow Render Backend to talk to itself
  if (origin.includes("onrender.com")) {
    return callback(null, true);
  }

  console.error("🚫 CORS Blocked:", origin);
  return callback(new Error("Not allowed by CORS"));
};

// --- 3. Database Connection ---
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("DB Connection Error:", err));

const app = express();
app.set("trust proxy", 1); // Trust Render's proxy for secure cookies

const server = http.createServer(app);

// --- 4. Socket.IO Configuration ---
const io = new Server(server, {
  cors: {
    origin: checkOrigin, // Use the shared function
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5001;

// --- 5. Middleware ---
app.use(
  cors({
    origin: checkOrigin,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// Make `io` accessible to your routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// --- 6. Routes ---
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const activityRoutes = require("./routes/activityRoutes");
const classRoutes = require("./routes/classRoutes");
const parentRoutes = require("./routes/parentRoutes");
const inviteRoutes = require("./routes/inviteRoutes");
const aiRoutes = require("./routes/aiRoutes");
const forumRoutes = require("./routes/forumRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const hodFeedRoutes = require("./routes/hodFeedRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/parents", parentRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/hodfeed", hodFeedRoutes);

// --- 7. Socket.IO Security Middleware [NEW] ---
// This runs BEFORE a socket is allowed to connect
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
    // Attach the decoded user data (e.g., id, role) to the socket object
    socket.user = decoded;
    next();
  });
});

// --- 8. Socket Connection Logic ---
io.on("connection", (socket) => {
  // Now we can safely log the user's ID because middleware passed
  console.log(
    `🔌 User connected via WebSocket: ${socket.user?.id || socket.id}`,
  );

  // Example: Join a room based on User ID for private notifications
  if (socket.user?.id) {
    socket.join(socket.user.id);
  }

  socket.on("chat_message", (msg) => {
    // Optional: Attach sender info automatically
    const messageWithUser = { ...msg, sender: socket.user?.id };
    io.emit("chat_message", messageWithUser);
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.user?.id || socket.id}`);
  });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from the backend! 👋" });
});

// Global Error Handler
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
