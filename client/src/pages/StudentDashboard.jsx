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
  LayoutGrid,
  Bot,
  Briefcase,
} from "lucide-react";

import DashboardLayout from "../components/DashboardLayout.jsx";
import AIAssistant from "../components/AIAssistant.jsx";
import PersonalizedLearningPath from "../components/Learning/PersonalizedLearningPath.jsx";
import SmartProgressInsights from "../components/Learning/SmartProgressInsights.jsx";
import QuizGenerator from "../components/learning/QuizGenerator.jsx";
import CareerRecommendations from "../components/learning/CareerRecommendations.jsx";
import StudyPlanner from "../components/learning/StudyPlanner.jsx";
import GamificationPanel from "../components/learning/GamificationPanel.jsx";
import QuickWins from "../components/learning/QuickWins.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/apiService.js";

// --- Reusable Components (Slightly updated for new design) ---

const StatCard = ({ icon, label, value, color }) => {
  // This component remains the same as your original
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
      className="bg-white dark:bg-slate-800/60 dark:backdrop-blur-sm p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className={`p-3 rounded-xl ${colorClasses[color]}`}>{icon}</div>
      <div>
        <p className="text-xl font-bold text-slate-800 dark:text-white">
          {value}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </motion.div>
  );
};

const AssignmentCard = ({ title, subject, dueDate }) => (
  // This component also remains the same
  <a
    href="#"
    className="block p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700/60 hover:border-blue-300 transition-all duration-300 group"
  >
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
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

// --- Main Student Dashboard Component ---

export default function StudentDashboard() {
  const { user } = useAuth();
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [activeTab, setActiveTab] = useState("feed");
  const navigate = useNavigate();

  const assignments = [
    {
      id: 1,
      title: "React Hooks In-depth",
      subject: "Web Development",
      dueDate: "Sep 15, 2025",
    },
    {
      id: 2,
      title: "AI Ethics Essay",
      subject: "Artificial Intelligence",
      dueDate: "Sep 18, 2025",
    },
    {
      id: 3,
      title: "Calculus Problem Set",
      subject: "Mathematics",
      dueDate: "Sep 22, 2025",
    },
  ];

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
    setTimeout(() => setScanResult(null), 5000);
  };

  const TabButton = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
        activeTab === id
          ? "bg-blue-600 text-white shadow-md"
          : "text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
      }`}
    >
      {icon}
      {label}
    </button>
  );

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p>Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <header>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Welcome back, {user.name.split(" ")[0]} 👋
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Ready to learn something new today? Let's get started.
          </p>
        </header>

        {/* Top Stats Section - Kept from original */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
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

        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed (Left Column) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-800/60 dark:backdrop-blur-sm p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 p-2">
                <TabButton
                  id="feed"
                  label="My Feed"
                  icon={<LayoutGrid size={16} />}
                />
                <TabButton
                  id="tools"
                  label="AI Learning Tools"
                  icon={<Bot size={16} />}
                />
                <TabButton
                  id="career"
                  label="Career Hub"
                  icon={<Briefcase size={16} />}
                />
              </div>

              <div className="p-2 md:p-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    {activeTab === "feed" && (
                      <div className="space-y-8">
                        <div>
                          <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">
                            Upcoming Assignments
                          </h2>
                          <div className="space-y-4">
                            {assignments.map((assignment) => (
                              <AssignmentCard
                                key={assignment.id}
                                {...assignment}
                              />
                            ))}
                          </div>
                        </div>
                        <PersonalizedLearningPath
                          onOpenLesson={(lesson) => console.log("Open", lesson)}
                        />
                      </div>
                    )}

                    {activeTab === "tools" && (
                      <div className="space-y-8">
                        <SmartProgressInsights />
                        <StudyPlanner assignments={assignments} />
                        <QuizGenerator />
                      </div>
                    )}

                    {activeTab === "career" && (
                      <div>
                        <CareerRecommendations
                          strengths={
                            user.profile?.strengths || ["AI", "Algorithms"]
                          }
                        />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Sidebar (Right Column) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="bg-white dark:bg-slate-800/60 dark:backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">
                    Quick Actions
                  </h2>
                  <button
                    onClick={() => setShowScanner(!showScanner)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 mb-4"
                  >
                    <QrCode className="w-5 h-5" />
                    {showScanner ? "Close Scanner" : "Scan Attendance"}
                  </button>
                  <AnimatePresence>
                    {showScanner && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 border-2 border-dashed border-slate-300 dark:border-slate-600 p-2 rounded-lg overflow-hidden"
                      >
                        <Scanner
                          onScan={handleScan}
                          onError={(error) => console.log(error?.message)}
                        />
                      </motion.div>
                    )}
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
                  <button
                    onClick={() => navigate("/drive")}
                    className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition duration-300"
                  >
                    📂 My Drive
                  </button>
                </div>
              </motion.div>
              <GamificationPanel xp={420} badges={["Quiz Champ", "Streak 7"]} />
              <QuickWins onMood={(m) => console.log("Mood:", m)} />
            </div>
          </div>
        </div>
      </div>
      <AIAssistant />
    </DashboardLayout>
  );
}
