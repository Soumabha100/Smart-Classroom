import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  CheckCircle2,
  XCircle,
  QrCode,
  BookOpen,
  CalendarCheck,
  Trophy,
  Activity,
  ArrowRight,
  FileText,
} from "lucide-react";

import DashboardLayout from "../components/DashboardLayout";
import AIAssistant from "../components/AIAssistant";
import PersonalizedLearningPath from "../components/Learning/PersonalizedLearningPath";
import SmartProgressInsights from "../components/Learning/SmartProgressInsights";
import QuizGenerator from "../components/learning/QuizGenerator";
import CareerRecommendations from "../components/learning/CareerRecommendations";
import StudyPlanner from "../components/learning/StudyPlanner";
import GamificationPanel from "../components/learning/GamificationPanel";
import QuickWins from "../components/learning/QuickWins";

// ✅ HOOK IMPORT: We will get the user directly from our global context
import { useAuth } from "../context/AuthContext";
import api from "../api/apiService";

// ---------------- Reusable Components (with Dark Mode Fixes) ----------------

const StatCard = ({ icon, label, value, color }) => {
  // ✅ FIX: Added dark mode variants for background and text colors
  const colorClasses = {
    green:
      "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300",
    yellow:
      "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-300",
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300",
    purple:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300",
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 flex items-center gap-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className={`p-3 rounded-xl ${colorClasses[color]}`}>{icon}</div>
      <div>
        {/* ✅ FIX: Added dark mode text color */}
        <p className="text-2xl font-bold text-slate-800 dark:text-white">
          {value}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </motion.div>
  );
};

const AssignmentCard = ({ title, subject, dueDate }) => (
  <a
    href="#"
    className="block p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 hover:border-blue-300 transition-all duration-300 group"
  >
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        {/* ✅ FIX: Added dark mode styles */}
        <div className="p-3 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          {/* ✅ FIX: Added dark mode text colors */}
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">
            {title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {subject} •{" "}
            <span className="text-red-500 font-medium">Due: {dueDate}</span>
          </p>
        </div>
      </div>
      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
    </div>
  </a>
);

// ---------------- Main Student Dashboard ----------------

export default function StudentDashboard() {
  // ✅ OPTIMIZATION: Get user state from the global AuthContext
  const { user } = useAuth();

  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const navigate = useNavigate();

  const assignments = [
    {
      id: 1,
      title: "React Hooks In-depth",
      subject: "Web Development",
      dueDate: "Sep 5, 2025",
    },
    {
      id: 2,
      title: "AI Ethics Essay",
      subject: "Artificial Intelligence",
      dueDate: "Sep 8, 2025",
    },
  ];

  // ✅ OPTIMIZATION: Removed the local useEffect for fetching user data.
  // The AuthContext now handles this globally, making this component cleaner.

  const handleScan = async (result) => {
    if (!result || result.length === 0) return;
    setShowScanner(false);
    try {
      const res = await api.post("/attendance/mark", {
        qrToken: result[0]?.rawValue,
      });
      setScanResult({ type: "success", message: res.data.message });
    } catch (error) {
      setScanResult({
        type: "error",
        message: error.response?.data?.message || "Failed to mark attendance.",
      });
    }
    setTimeout(() => setScanResult(null), 4000);
  };

  // ✅ Show a loading state while AuthContext is fetching the user.
  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-slate-500 dark:text-slate-400">
            Loading dashboard...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
          Welcome back, {user.name.split(" ")[0]} 👋
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Here is your summary for today. Keep up the great work!
        </p>
      </header>

      {/* Stats Section */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <StatCard
          icon={<CalendarCheck size={24} />}
          label="Attendance"
          value="95%"
          color="green"
        />
        <StatCard
          icon={<Trophy size={24} />}
          label="Avg. Grade"
          value="A-"
          color="yellow"
        />
        <StatCard
          icon={<BookOpen size={24} />}
          label="Assignments Due"
          value={assignments.length}
          color="blue"
        />
        <StatCard
          icon={<Activity size={24} />}
          label="Activities Done"
          value="12"
          color="purple"
        />
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Assignments & Learning Path Section */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">
              Upcoming Assignments
            </h2>
            <div className="space-y-4">
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <AssignmentCard key={assignment.id} {...assignment} />
                ))
              ) : (
                <p className="text-center py-10 text-slate-500 dark:text-slate-400">
                  🎉 You're all caught up! No assignments due.
                </p>
              )}
            </div>
          </motion.div>

          {/* Learning Path & other components */}
          <PersonalizedLearningPath
            onOpenLesson={(lesson) => console.log("Open", lesson)}
          />
          <SmartProgressInsights />
          <QuizGenerator />
          <StudyPlanner assignments={assignments} />
          <CareerRecommendations
            strengths={user.profile?.strengths || ["AI", "Algorithms"]}
          />
          <GamificationPanel xp={420} badges={["Quiz Champ", "Streak 7"]} />
          <QuickWins onMood={(m) => console.log("Mood:", m)} />
        </div>

        {/* Quick Actions */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="sticky top-24 space-y-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">
                Quick Actions
              </h2>

              <button
                onClick={() => setShowScanner(!showScanner)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 mb-4"
              >
                <QrCode className="w-5 h-5" />
                {showScanner ? "Close Scanner" : "Scan Attendance QR"}
              </button>

              <AnimatePresence>
                {showScanner && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 border-2 border-dashed border-slate-300 dark:border-slate-600 p-2 rounded-lg overflow-hidden"
                  >
                    <Scanner
                      onScan={handleScan}
                      onError={(error) => console.log(error?.message)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {scanResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm font-semibold ${
                      scanResult.type === "success"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
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
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">
                My Drive
              </h2>
              <button
                onClick={() => navigate("/drive")}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition duration-300"
              >
                📂 Go to Drive
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Assistant Floating Chatbot */}
      <AIAssistant />
    </DashboardLayout>
  );
}
