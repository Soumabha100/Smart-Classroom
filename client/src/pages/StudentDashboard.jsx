import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  ExternalLink,
  GraduationCap,
  FileArchive,
  X,
  CameraOff, // ✨ IMPORTED ICON FOR ERROR STATE
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
import OnlineResources from "../components/learning/onlineResource.jsx";
import PeriodManagement from "../components/learning/periodManagement.jsx";



// --- Reusable Components ---

const StatCardSkeleton = () => (
  <div className="bg-white dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4 animate-pulse h-28">
    <div className="p-3 rounded-xl bg-slate-200 dark:bg-slate-700 h-12 w-12 shrink-0"></div>
    <div className="space-y-2 flex-grow">
      <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
      <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
    </div>
  </div>
);

const StatCard = ({ icon, label, value, color, to }) => {
  const colorClasses = {
    green:
      "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300",
    yellow:
      "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-300",
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300",
    purple:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300",
  };

  const cardContent = (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className={`w-full bg-white dark:bg-slate-800/60 dark:backdrop-blur-sm p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4 transition-all duration-300 h-28 ${
        to ? "group" : ""
      }`}
    >
      <div className={`p-3 rounded-xl shrink-0 ${colorClasses[color]}`}>
        {icon}
      </div>
      <div className="flex-grow">
        <p className="text-xl font-bold text-slate-800 dark:text-white">
          {value}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      </div>
      {to && (
        <ExternalLink className="w-5 h-5 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
      )}
    </motion.div>
  );

  return to ? (
    <Link
      to={to}
      className="block hover:shadow-lg rounded-2xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {cardContent}
    </Link>
  ) : (
    <div className="block rounded-2xl">{cardContent}</div>
  );
};

const AssignmentCard = ({ title, subject, dueDate }) => (
  <a
    href="#"
    className="block p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700/60 hover:border-blue-300 transition-all duration-300 group"
  >
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4 min-w-0">
        <div className="p-3 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 shrink-0">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 truncate">
            {title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {subject} •{" "}
            <span className="text-red-500 font-medium">Due: {dueDate}</span>
          </p>
        </div>
      </div>
      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1 shrink-0 ml-4" />
    </div>
  </a>
);

// --- Main Student Dashboard Component ---

export default function StudentDashboard() {
  const { user } = useAuth();
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scannerError, setScannerError] = useState(null);
  const [activeTab, setActiveTab] = useState("feed");
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await new Promise((res) => setTimeout(res, 1500));
        setDashboardData({
          stats: {
            attendance: "95%",
            grade: "A-",
            assignmentsDue: 3,
            activitiesDone: 12,
          },
          assignments: [
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
          ],
        });
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleScan = async (result) => {
    if (!result) return;
    setShowScanner(false);
    try {
      const res = await api.post("/attendance/mark", { qrToken: result });
      setScanResult({ type: "success", message: res.data.message });
    } catch (error) {
      setScanResult({
        type: "error",
        message: error.response?.data?.message || "Failed to mark attendance.",
      });
    }
    setTimeout(() => setScanResult(null), 5000);
  };

  const handleScannerError = (error) => {
    console.error("Scanner Error:", error);
    setScannerError(
      "Could not access camera. Please grant permission and ensure you are on a secure (HTTPS) connection."
    );
  };

  const openScanner = () => {
    setScannerError(null);
    setShowScanner(true);
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
      {icon} {label}
    </button>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Welcome back, {user?.name.split(" ")[0]} 👋
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Ready to learn something new today? Let's get started.
          </p>
        </header>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))
          ) : (
            <>
              <StatCard
                icon={<CalendarCheck size={24} />}
                label="Attendance"
                value={dashboardData.stats.attendance}
                color="green"
                to="/attendance"
              />
              <StatCard
                icon={<Trophy size={24} />}
                label="Avg. Grade"
                value={dashboardData.stats.grade}
                color="yellow"
              />
              <StatCard
                icon={<BookOpen size={24} />}
                label="Assignments Due"
                value={dashboardData.stats.assignmentsDue}
                color="blue"
              />
              <StatCard
                icon={<Activity size={24} />}
                label="Activities Done"
                value={dashboardData.stats.activitiesDone}
                color="purple"
              />
            </>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 lg:order-last">
            <div className="lg:sticky top-24 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">
                    Quick Actions
                  </h2>
                  <div className="space-y-3">
                    <button
                      onClick={openScanner}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105"
                    >
                      <QrCode className="w-5 h-5" />
                      <span>Scan Attendance</span>
                    </button>
                    <Link
                      to="/learning-path"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition duration-300 transform hover:scale-105"
                    >
                      <GraduationCap className="w-5 h-5" />
                      <span>My Learning Path</span>
                    </Link>
                    <Link
                      to="/drive"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition duration-300 transform hover:scale-105"
                    >
                      <FileArchive className="w-5 h-5" />
                      <span>My Drive</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
              {/* ✅ COMPONENT RESTORED */}
              <GamificationPanel xp={420} badges={["Quiz Champ", "Streak 7"]} />
              <QuickWins onMood={(m) => console.log("Mood:", m)} />
            </div>
          </div>

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
                            {isLoading ? (
                              Array.from({ length: 2 }).map((_, i) => (
                                <div
                                  key={i}
                                  className="h-20 bg-slate-100 dark:bg-slate-700/50 rounded-xl animate-pulse"
                                ></div>
                              ))
                            ) : dashboardData?.assignments.length > 0 ? (
                              dashboardData.assignments.map((assignment) => (
                                <AssignmentCard
                                  key={assignment.id}
                                  {...assignment}
                                />
                              ))
                            ) : (
                              <div className="text-center py-10 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <CheckCircle2
                                  size={40}
                                  className="mx-auto text-green-500"
                                />
                                <h3 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">
                                  All caught up!
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400">
                                  You have no pending assignments. 🎉
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* ✅ COMPONENT RESTORED */}
                        <PersonalizedLearningPath
                          onOpenLesson={(lesson) => console.log("Open", lesson)}
                        />
                      </div>
                    )}
                    {activeTab === "tools" && (
                      <div className="space-y-8">
                        {/* ✅ COMPONENT RESTORED */}
                        <SmartProgressInsights />
                        <StudyPlanner
                          assignments={dashboardData?.assignments || []}
                        />
                        <QuizGenerator />
                      </div>
                    )}
                    {activeTab === "career" && (
                      <div>
                        {/* ✅ COMPONENT RESTORED */}
                        <CareerRecommendations
                          strengths={
                            user?.profile?.strengths || ["AI", "Algorithms"]
                          }
                        />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowScanner(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-800 p-6 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl"
            >
              <button
                onClick={() => setShowScanner(false)}
                className="absolute -top-3 -right-3 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-transform transform hover:scale-110"
              >
                <X size={20} />
              </button>
              <div className="w-full overflow-hidden rounded-lg aspect-square bg-slate-900 flex items-center justify-center">
                {scannerError ? (
                  <div className="text-center text-red-400 p-4">
                    <CameraOff size={48} className="mx-auto" />
                    <p className="mt-4 font-semibold">Camera Error</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {scannerError}
                    </p>
                  </div>
                ) : (
                  <Scanner
                    onScan={handleScan}
                    onError={handleScannerError}
                    components={{ finder: false }}
                    constraints={{ facingMode: "environment" }}
                    styles={{
                      container: {
                        width: "100%",
                        paddingTop: "100%",
                        position: "relative",
                      },
                      video: {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      },
                    }}
                  />
                )}
              </div>
              <p className="text-center text-slate-400 mt-4 text-sm font-semibold">
                {scannerError
                  ? "Please try again."
                  : "Point the camera at the QR code"}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {scanResult && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 p-4 rounded-lg flex items-center gap-3 text-sm font-semibold shadow-2xl z-50 ${
              scanResult.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
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
       <OnlineResources />  
        <PeriodManagement />

      <AIAssistant />
    </DashboardLayout>
  );
}
