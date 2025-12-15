// client/src/pages/TeacherDashboard.jsx 

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import QRCode from "react-qr-code";
import { motion, AnimatePresence } from "framer-motion";
// --- FIX: Import Link for navigation and BarChart2 for the new icon ---
import { Link } from "react-router-dom";
import {
  QrCode,
  LoaderCircle,
  AlertCircle,
  Clock,
  Presentation,
  ClipboardList,
  MessageSquare,
  Megaphone,
  Users,
  ClipboardCheck,
  BarChart2, // Changed from Percent
  Expand,
  X,
  CheckCircle,
  BookOpen, // NEW: Icon for Resource Planner
} from "lucide-react";
// --- END FIX ---
import {
  getTeacherClasses,
  generateQrCode,
  getTeacherAnalytics,
} from "../api/apiService";

// Import other components
import ClassesManager from "../components/ClassManager";
import AssingmentManager from "../components/AssingmentManager";
import Hodfeed from "../components/Hodfeed";
import ChatBox from "./ChatBox";

// --- NEW COMPONENT IMPORT ---
import ResourcePlanner from "../components/ResourcePlanner"; // REQUIRED for Resource Planner feature


// --- Reusable UI Components (StatCard, TabButton, QrFullscreenModal remain the same) ---

const StatCard = ({ icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="flex-1 p-5 bg-white border rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 dark:bg-slate-800/50 dark:border-slate-700 flex items-center gap-4"
  >
    <div className={`p-3 rounded-lg ${color} shadow-lg`}>{icon}</div>
    <div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  </motion.div>
);

const TabButton = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
      isActive
        ? "bg-indigo-600 text-white shadow-lg"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const QrFullscreenModal = ({ qrCodeData, onClose }) => (
  <AnimatePresence>
    {qrCodeData && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="relative p-8 bg-white rounded-2xl shadow-2xl"
        >
          <QRCode value={qrCodeData} size={256} />
          <button
            onClick={onClose}
            className="absolute -top-5 -right-5 bg-white text-slate-700 rounded-full p-2 shadow-xl hover:bg-red-500 hover:text-white transform hover:rotate-90 transition-all duration-300"
          >
            <X size={24} />
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// --- Helper for Teacher Role ---
const getTeacherPosition = (user) => {
    if (user?.roleDetails?.position) {
        return user.roleDetails.position;
    }
    if (user?.name && user.name.toLowerCase().includes("head")) return "Head of Department (HOD)";
    if (user?.name && user.name.toLowerCase().includes("coordinator")) return "Department Coordinator";
    if (user?.name && user.name.toLowerCase().includes("admin")) return "Administrator";
    return "Teacher"; // Default role
}

// --- Main Dashboard Component ---

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("classes");
  const [classes, setClasses] = useState([]);
  const [qrCodeDetails, setQrCodeDetails] = useState({
    data: null,
    classId: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(120);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const [analytics, setAnalytics] = useState(null);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true);

  const teacherPosition = getTeacherPosition(user); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsAnalyticsLoading(true);
        const [classesRes, analyticsRes] = await Promise.all([
          getTeacherClasses(),
          getTeacherAnalytics(),
        ]);
        setClasses(classesRes.data);
        setAnalytics(analyticsRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Could not load initial dashboard data.");
      } finally {
        setIsAnalyticsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!qrCodeDetails.data) return;
    setCountdown(120);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setQrCodeDetails({ data: null, classId: null });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [qrCodeDetails.data]);

  const handleGenerateQr = async (classId) => {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await generateQrCode(classId); 
      setQrCodeDetails({ data: data.qrToken, classId });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate QR code.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedClassName = classes.find(
    (c) => c._id === qrCodeDetails.classId
  )?.name;

  return (
    <DashboardLayout>
      <QrFullscreenModal
        qrCodeData={isQrModalOpen ? qrCodeDetails.data : null}
        onClose={() => setIsQrModalOpen(false)}
      />
      <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto bg-slate-100 dark:bg-slate-900 font-sans">
        
        {/* --- HEADER (UPDATED with Role) --- */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            {teacherPosition} Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, {user?.name}! Your role: <span className="font-semibold text-indigo-500 dark:text-indigo-400">{teacherPosition}</span>.
          </p>
        </motion.div>

        {/* --- ANALYTICS BAR (remains the same) --- */}
        <div className="mb-8">
          {isAnalyticsLoading ? (
            <div className="flex justify-center items-center h-24">
              <LoaderCircle className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-4">
              <StatCard
                icon={<Presentation size={24} className="text-white" />}
                label="Total Classes"
                value={analytics?.classCount ?? 0}
                color="bg-blue-500"
                delay={0.1}
              />
              <StatCard
                icon={<Users size={24} className="text-white" />}
                label="Total Students"
                value={analytics?.studentCount ?? 0}
                color="bg-green-500"
                delay={0.2}
              />
              <StatCard
                icon={<ClipboardCheck size={24} className="text-white" />}
                label="Submission Rate"
                value={`${analytics?.submissionRate ?? 0}%`}
                color="bg-amber-500"
                delay={0.3}
              />
              <Link to="/teacher/attendance" className="flex-1">
                <StatCard
                  icon={<BarChart2 size={24} className="text-white" />}
                  label="Attendance Analytics"
                  value={"View Report"}
                  color="bg-violet-500"
                  delay={0.4}
                />
              </Link>
            </div>
          )}
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT COLUMN: QR Code Generator */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:col-span-2 p-6 bg-white border rounded-xl shadow-sm dark:bg-slate-800/50 dark:border-slate-700"
          >
            <h2 className="flex items-center gap-3 text-2xl font-semibold text-slate-800 dark:text-white mb-4">
              <QrCode className="w-7 h-7 text-indigo-500" />
              Attendance QR Generator
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Select a class to instantly generate a secure QR code for
              attendance.
            </p>

            {qrCodeDetails.data ? (
              <AnimatePresence>
                <motion.div
                  key="qr-display"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center p-6 bg-slate-50 dark:bg-slate-800 rounded-lg flex flex-col items-center"
                >
                  <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {selectedClassName}
                  </h3>
                  <div className="p-4 bg-white inline-block rounded-lg my-4 shadow-inner">
                    <QRCode value={qrCodeDetails.data} size={180} />
                  </div>
                  <motion.button
                    onClick={() => setIsQrModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg shadow-sm hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-200"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Expand size={18} />
                    <span>View Fullscreen</span>
                  </motion.button>
                  <p className="flex items-center justify-center gap-2 mt-4 text-lg font-bold text-red-600 dark:text-red-400">
                    <Clock className="w-5 h-5" /> Expires in: {countdown}s
                  </p>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map((c) => (
                  <motion.button
                    key={c._id}
                    onClick={() => handleGenerateQr(c._id)}
                    disabled={isLoading && qrCodeDetails.classId !== c._id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative p-4 text-left border rounded-lg dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors duration-200 disabled:opacity-50 ${
                      qrCodeDetails.classId === c._id ? "border-indigo-500" : ""
                    }`}
                  >
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">
                      {c.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {c.subject || "No subject"}
                    </p>
                    {qrCodeDetails.classId === c._id && (
                      <div className="absolute top-2 right-2 p-1 bg-green-500 text-white rounded-full">
                        <CheckCircle size={14} />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            )}
            {isLoading && (
              <div className="flex justify-center mt-4">
                <LoaderCircle className="w-6 h-6 animate-spin text-indigo-500" />
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 p-3 mt-4 text-sm text-red-700 bg-red-100 rounded-md">
                <AlertCircle size={16} /> {error}
              </div>
            )}
          </motion.div>

          {/* RIGHT COLUMN: OTHER TOOLS (UPDATED TABS) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="lg:col-span-1 p-6 bg-white border rounded-xl shadow-sm dark:bg-slate-800/50 dark:border-slate-700"
          >
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">
              Management Tools
            </h2>
            <div className="space-y-2">
              <TabButton
                label="Classes" 
                icon={<Presentation size={16} />}
                isActive={activeTab === "classes"}
                onClick={() => setActiveTab("classes")}
              />
              <TabButton
                label="Assignments" 
                icon={<ClipboardList size={16} />}
                isActive={activeTab === "assignments"}
                onClick={() => setActiveTab("assignments")}
              />
              <TabButton
                label="Resources" 
                icon={<BookOpen size={16} />}
                isActive={activeTab === "resources"}
                onClick={() => setActiveTab("resources")}
              />
              <TabButton
                label="HOD Feed"
                icon={<Megaphone size={16} />}
                isActive={activeTab === "hod"}
                onClick={() => setActiveTab("hod")}
              />
              <TabButton
                label="Chat"
                icon={<MessageSquare size={16} />}
                isActive={activeTab === "chat"}
                onClick={() => setActiveTab("chat")}
              />
              <Link
                to="/teacher/attendance"
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-300 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <BarChart2 size={16} />
                <span>Attendance Analytics</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* TAB CONTENT AREA (Updated to include Resources) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-8 p-6 bg-white border rounded-xl shadow-sm dark:bg-slate-800/50 dark:border-slate-700"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "classes" && <ClassesManager />}
              {activeTab === "assignments" && <AssingmentManager />}
              {activeTab === "resources" && <ResourcePlanner />}
              {activeTab === "hod" && <Hodfeed />}
              {activeTab === "chat" && <ChatBox user="Teacher" />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;