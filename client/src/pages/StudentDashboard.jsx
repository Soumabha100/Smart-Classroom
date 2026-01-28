import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";




// --- ICONS ---
import {
  CheckCircle2,
  XCircle,
  QrCode,
  BookOpen,
  CalendarCheck,
  Trophy,
  Activity,
  ExternalLink,
  GraduationCap,
  FileArchive,
  X,
  CameraOff,
  Zap,
} from "lucide-react";

// --- COMPONENT IMPORTS ---
import DashboardLayout from "../components/DashboardLayout.jsx";
import AIAssistant from "../components/AIAssistant.jsx";
import AIDrivenDashboard from "../components/Dashboard/AIDrivenDashboard.jsx";
import PersonalizedLearningPath from "../components/Learning/PersonalizedLearningPath.jsx";
import SmartProgressInsights from "../components/Learning/SmartProgressInsights.jsx";
import QuizGenerator from "../components/Learning/QuizGenerator.jsx";
import CareerRecommendations from "../components/Learning/CareerRecommendations.jsx";
import StudyPlanner from "../components/Learning/StudyPlanner.jsx";
import GamificationPanel from "../components/Learning/GamificationPanel.jsx";
import QuickWins from "../components/Learning/QuickWins.jsx";
import OnlineResources from "../components/Learning/onlineResource.jsx";
import PeriodManagement from "../components/Learning/periodManagement.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getStudentAttendance, getStudentClasses } from "../api/apiService.js";
import StudentAssignments from "../components/StudentAssignments.jsx";
import AnnouncementsList from "../components/AnnouncementsList";

// --- Reusable UI Components(No Changes Needed Here) ---

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
        <p className="text-2xl font-bold text-slate-800 dark:text-white">
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
      to={to.path}
      state={to.state} // Pass state for navigation
      className="block hover:shadow-xl dark:hover:shadow-blue-900/30 rounded-2xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {cardContent}
    </Link>
  ) : (
    <div className="block rounded-2xl">{cardContent}</div>
  );
};

const SectionWrapper = ({ title, icon, children, className }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.4 }}
    className={`bg-white dark:bg-slate-800/60 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 ${className}`}
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg">
        {icon}
      </div>
      <h2 className="text-xl font-bold text-slate-800 dark:text-white">
        {title}
      </h2>
    </div>
    <div className="space-y-4">{children}</div>
  </motion.section>
);

// --- Main Student Dashboard Component ---

export default function StudentDashboard() {
  const { user } = useAuth();
  const [scanResult, setScanResult] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [attendanceRes, classesRes] = await Promise.all([
          getStudentAttendance(),
          getStudentClasses(),
        ]);

        setDashboardData({
          stats: {
            attendance: `${
              attendanceRes.data.overallAttendancePercentage || 0
            }%`,
            enrolledClasses: classesRes.data.length || 0,
            grade: "A-", // Placeholder
            assignmentsDue: 3, // Placeholder
          },
        });
      } catch (error) {
        console.error("Failed to load dashboard:", error);
        setDashboardData({
          stats: {
            attendance: "N/A",
            enrolledClasses: 0,
            grade: "N/A",
            assignmentsDue: 0,
          },
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-8">
        {/* --- Header --- */}
        <header>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Welcome back, {user?.name.split(" ")[0]} 👋
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Your personalized dashboard is ready. Let's make today productive.
            </p>
          </div>
        </header>

        {/* --- Quick Stats Overview --- */}
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
                to={{ path: "/student/attendance" }}
              />
              <StatCard
                icon={<GraduationCap size={24} />}
                label="My Classes"
                value={dashboardData.stats.enrolledClasses}
                color="blue"
                to={{ path: "/student/classes" }}
              />
              <StatCard
                icon={<BookOpen size={24} />}
                label="Assignments Due"
                value={dashboardData.stats.assignmentsDue}
                color="purple"
                
                to={{ path: "/student/classes" }}
              />
              <StatCard
                icon={<Trophy size={24} />}
                label="Avg. Grade"
                value={dashboardData.stats.grade}
                color="yellow"
              />
            </>
          )}
        </motion.div>

        {/* --- Main Dashboard Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* AI Dashboard Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="relative p-1 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-blue-500 shadow-2xl shadow-purple-500/20"
            >
              <div className="absolute -inset-2 bg-grid-slate-900/10 bg-[length:100px_100px] [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-slate-100/10 -z-10"></div>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-[22px] p-4 sm:p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      AI Personalized Dashboard
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Your dynamic hub, tailored just for you.
                    </p>
                  </div>
                  <Link
                    to="/ai-dashboard"
                    className="group flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 text-sm font-semibold rounded-full shadow-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all transform hover:scale-105"
                  >
                    <span>Expand</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  </Link>
                </div>
                <AIDrivenDashboard />
              </div>
            </motion.div>

            {/* Other Components */}
            <PersonalizedLearningPath
              onOpenLesson={(lesson) => console.log("Open", lesson)}
            />
            <SmartProgressInsights />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <QuizGenerator />
              <StudyPlanner />
            </div>
            <CareerRecommendations
              strengths={user?.profile?.strengths || ["AI", "Algorithms"]}
            />
            <OnlineResources />
            <PeriodManagement />
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky top-24 space-y-8">
              <SectionWrapper
                title="Quick Actions"
                icon={
                  <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                }
              >
                <Link
                  to="/student/classes"
                  state={{ openScanner: true }}
                  className="w-full bg-slate-700 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105"
                >
                  <QrCode className="w-5 h-5" />
                  <span>Scan Attendance</span>
                </Link>
                <Link
                  to="/learning-path"
                  className="w-full bg-slate-700 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition duration-300 transform hover:scale-105"
                >
                  <GraduationCap className="w-5 h-5" />
                  <span>My Learning Path</span>
                </Link>
                <Link
                  to="/drive"
                  className="w-full bg-slate-700 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition duration-300 transform hover:scale-105"
                >
                  <FileArchive className="w-5 h-5" />
                  <span>My Drive</span>
                </Link>
              </SectionWrapper>
              <GamificationPanel xp={420} badges={["Quiz Champ", "Streak 7"]} />
              <QuickWins onMood={(m) => console.log("Mood:", m)} />
            </div>
          </div>
        </div>
      </div>

      {/* MODALS AND FLOATING ELEMENTS */}
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
      <AIAssistant />
      <AnnouncementsList audience="student" limit={6} />
      <StudentAssignments />
    </DashboardLayout>
  );
}
