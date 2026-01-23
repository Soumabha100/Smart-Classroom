const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const os = require("os");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const errorHandler = require("./middlewares/errorMiddleware");

// --- 1. Dynamic Local IP Logic ---
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Find IPv4 address that is not internal (like 127.0.0.1)
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

const localIp = getLocalIpAddress();
const clientPort = 5173; // Standard frontend port

// --- 2. Centralized Allowed Origins ---
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://localhost:5173",
  // Dynamic local network origins
  `http://${localIp}:${clientPort}`,
  `https://${localIp}:${clientPort}`,
];

// Add production URL from environment variables if it exists
if (process.env.CORS_ORIGIN) {
  allowedOrigins.push(process.env.CORS_ORIGIN);
}

console.log(`📡 Local Network IP detected: ${localIp}`);
console.log(`🔓 Allowed Origins:`, allowedOrigins);

// --- 3. Database Connection ---
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("DB Connection Error:", err));

const app = express();

app.set("trust proxy", 1);

const server = http.createServer(app);

// --- 4. Socket.IO Configuration ---
// Now uses the same allowedOrigins list as Express
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5001;

// --- 5. Middleware ---
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
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

// --- 7. Socket Logic ---
io.on("connection", (socket) => {
  console.log("🔌 A user connected to WebSocket");

  // Listen for chat messages from any client
  socket.on("chat_message", (msg) => {
    // Broadcast received message to all connected clients
    io.emit("chat_message", msg);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected");
  });
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from the backend! 👋" });
});

app.use(errorHandler);

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
