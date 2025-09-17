const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

// Define Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const activityRoutes = require("./routes/activityRoutes");
const classRoutes = require("./routes/classRoutes");
const parentRoutes = require("./routes/parentRoutes");
const inviteRoutes = require("./routes/inviteRoutes");
const aiRoutes = require("./routes/aiRoutes");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("DB Connection Error:", err));

const app = express();

// Create an HTTP server from the Express app
const server = http.createServer(app);

// Initialize Socket.IO and attach it to the server
const io = new Server(server, {
  cors: {
    // Allow connections from your frontend development server
    origin: ["https://localhost:5173", `https://192.168.1.5:5173`],
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Make `io` accessible to your routes by attaching it to the request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/parents", parentRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/api/ai", aiRoutes);

// Socket.IO connection logic
io.on("connection", (socket) => {
  console.log("🔌 A user connected to WebSocket");

  socket.on("disconnect", () => {
    console.log("❌ User disconnected");
  });
});

// A simple test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from the backend! 👋" });
});

// Start the server using the http server instance
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
