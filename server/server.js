const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const os = require("os");
const cookieParser = require("cookie-parser");
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
    `http://${localIp}:5173`,
    `https://${localIp}:5173`, // Allow dynamic local IP
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

const PORT = process.env.PORT || 5001;

// --- 4. Middleware ---
app.use(
  cors({
    origin: checkOrigin,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// --- 5. Routes ---
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

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from the backend! 👋" });
});

// Global Error Handler
app.use(errorHandler);

// --- 6. Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
