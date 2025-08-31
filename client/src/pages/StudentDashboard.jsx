import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  CheckCircle2,
  XCircle,
  QrCode,
  BookOpen,
  ExternalLink,
  ShieldCheck,
  Trophy,
  Activity,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";

// Reusable Stat Card Component
const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl flex items-center gap-4">
    <div className={`p-3 rounded-lg bg-${color}-500/10 text-${color}-400`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  </div>
);

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState(null); // To show success/error message
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const api = axios.create({
          headers: { Authorization: `Bearer ${token}` },
        });
        const [profileRes, activitiesRes] = await Promise.all([
          api.get("/api/users/profile"),
          api.get("/api/activities"),
        ]);

        setUser(profileRes.data);
        setActivities(activitiesRes.data);

        if (
          !profileRes.data.profile ||
          profileRes.data.profile.academicInterests.length === 0
        ) {
          navigate("/onboarding");
        }
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    fetchData();
  }, [navigate]);

  const handleScan = async (result) => {
    setShowScanner(false);
    const token = localStorage.getItem("token");
    try {
      const api = axios.create({
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await api.post("/api/attendance/mark", {
        qrToken: result[0]?.rawValue,
      });
      setScanResult({ type: "success", message: res.data.message });
    } catch (error) {
      setScanResult({
        type: "error",
        message: error.response?.data?.message || "Failed to mark attendance.",
      });
    }
    // Hide the result message after 3 seconds
    setTimeout(() => setScanResult(null), 3000);
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center p-10">Loading dashboard...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          Welcome back, {user.name}!
        </h1>
        <p className="mt-2 text-slate-500">
          Here's a look at what's happening today. Seize the day!
        </p>
      </motion.header>

      {/* At-a-Glance Stats */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <StatCard
            icon={<ShieldCheck size={24} />}
            label="Attendance"
            value="95%"
            color="green"
          />
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <StatCard
            icon={<Trophy size={24} />}
            label="Avg. Grade"
            value="A-"
            color="yellow"
          />
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <StatCard
            icon={<BookOpen size={24} />}
            label="Assignments Due"
            value="2"
            color="blue"
          />
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <StatCard
            icon={<Activity size={24} />}
            label="Activities Done"
            value="12"
            color="purple"
          />
        </motion.div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recommended Activities */}
        <motion.div
          className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-slate-800">
            Recommended For You
          </h2>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <a
                  key={activity._id}
                  href={activity.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-lg bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 group"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-slate-800">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {activity.description}
                      </p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </a>
              ))
            ) : (
              <p className="text-center py-10 text-slate-500">
                No activities found. Check back later!
              </p>
            )}
          </div>
        </motion.div>

        {/* Right Column: Attendance */}
        <motion.div
          className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-slate-800">Attendance</h2>

          <AnimatePresence>
            {showScanner && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 mt-4 border-2 border-dashed p-2 rounded-lg overflow-hidden"
              >
                <Scanner
                  onScan={handleScan}
                  onError={(error) => console.log(error?.message)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setShowScanner(!showScanner)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105"
          >
            <QrCode className="w-5 h-5" />
            {showScanner ? "Close Scanner" : "Scan QR Code"}
          </button>

          <AnimatePresence>
            {scanResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
                  scanResult.type === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {scanResult.type === "success" ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <XCircle size={18} />
                )}
                {scanResult.message}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
