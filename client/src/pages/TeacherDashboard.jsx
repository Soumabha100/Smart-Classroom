import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import QRCode from "react-qr-code";
import {
  QrCode,
  LoaderCircle,
  AlertCircle,
  Clock,
  LayoutDashboard,
  Presentation,
  ClipboardList,
  MessageSquare,
  Megaphone,
} from "lucide-react";
import { getTeacherClasses, generateQrCode } from "../api/apiService";
import io from "socket.io-client";

// Import all necessary components
import ClassesManager from "../components/ClassManager";
import AssingmentManager from "../components/AssingmentManager";
import Hodfeed from "../components/Hodfeed";
import ChatBox from "./ChatBox";
import AttendanceChart from "../components/AttendanceChart";

// A new, reusable component for our tab buttons
const TabButton = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
      isActive
        ? "bg-indigo-600 text-white shadow-md"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
    }`}
  >
    {icon}
    {label}
  </button>
);

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [qrCodeData, setQrCodeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(120);
  const [liveAttendance, setLiveAttendance] = useState([]);

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data: teacherClasses } = await getTeacherClasses();
        setClasses(teacherClasses);
        if (teacherClasses.length > 0) {
          setSelectedClass(teacherClasses[0]._id);
        }
      } catch (err) {
        console.error("Failed to fetch teacher classes:", err);
      }
    };
    fetchClasses();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!qrCodeData) return;
    setCountdown(120);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setQrCodeData(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [qrCodeData]);

  // WebSocket for live attendance
  useEffect(() => {
    const socket = io("http://localhost:5001");
    socket.on("new_attendance", (newLog) => {
      setLiveAttendance((prevLogs) => [newLog, ...prevLogs]);
    });
    return () => socket.disconnect();
  }, []);

  // QR Code generation
  const handleGenerateQr = async () => {
    if (!selectedClass) {
      setError("Please select a class first.");
      return;
    }
    setError("");
    setQrCodeData(null);
    setIsLoading(true);
    try {
      const { data } = await generateQrCode(selectedClass);
      setQrCodeData(data.qrToken);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate QR code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 p-6 overflow-auto bg-slate-50 dark:bg-slate-900">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Teacher Tools
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            Welcome back, {user?.name}! Select a tool to get started.
          </p>

          {/* --- MOVED CLASS SELECTOR HERE --- */}
          <div className="max-w-xs">
            <label
              htmlFor="class-select-global"
              className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Current Class
            </label>
            <select
              id="class-select-global"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full input-style"
              disabled={classes.length === 0}
            >
              {classes.length > 0 ? (
                classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))
              ) : (
                <option>Loading classes...</option>
              )}
            </select>
          </div>
        </header>

        {/* --- TAB NAVIGATION --- */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">
          <TabButton
            label="Dashboard"
            icon={<LayoutDashboard size={16} />}
            isActive={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
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
        </div>

        {/* --- CONDITIONAL CONTENT BASED ON ACTIVE TAB --- */}
        <div id="tab-content">
          {/* Tab 1: Main Dashboard */}
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-8">
                {/* QR Code Generator */}
                <div className="p-6 bg-white border rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-700">
                  <h2 className="flex items-center gap-3 text-xl font-semibold text-slate-800 dark:text-white mb-4">
                    <QrCode className="w-6 h-6 text-indigo-500" />
                    Attendance QR Code
                  </h2>
                  {/* The class selector was here, now it's global */}
                  <div className="space-y-4">
                    <button
                      onClick={handleGenerateQr}
                      disabled={
                        isLoading || classes.length === 0 || !selectedClass
                      }
                      className="inline-flex items-center justify-center w-full gap-2 px-4 py-3 font-bold text-white transition-transform transform bg-indigo-600 rounded-md shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:scale-95 disabled:bg-indigo-400"
                    >
                      {isLoading ? (
                        <>
                          <LoaderCircle className="w-5 h-5 animate-spin" />{" "}
                          Generating...
                        </>
                      ) : (
                        "Generate QR Code"
                      )}
                    </button>
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 p-3 mt-4 text-sm text-red-700 bg-red-100 rounded-md dark:bg-red-900/50 dark:text-red-300">
                      <AlertCircle className="w-5 h-5" /> {error}
                    </div>
                  )}
                </div>
                {qrCodeData && (
                  <div className="p-6 text-center bg-white border rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-700">
                    <div className="p-4 bg-white inline-block rounded-lg">
                      <QRCode value={qrCodeData} size={200} />
                    </div>
                    <p className="flex items-center justify-center gap-2 mt-4 text-lg font-bold text-red-600 dark:text-red-400">
                      <Clock className="w-5 h-5" /> Expires in: {countdown}s
                    </p>
                  </div>
                )}
              </div>
              <div className="lg:col-span-2 space-y-8">
                {/* Live Attendance */}
                <div className="p-6 bg-white border rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-700">
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                    Live Attendance Feed
                  </h2>
                  <div className="space-y-3 h-96 overflow-y-auto">
                    {liveAttendance.length > 0 ? (
                      liveAttendance.map((log, index) => (
                        <div
                          key={index}
                          className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg flex justify-between items-center"
                        >
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">
                              {log.student_name}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                          <span className="text-green-600 font-semibold">
                            {log.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-center pt-10">
                        Waiting for students to check in...
                      </p>
                    )}
                  </div>
                </div>
                <AttendanceChart />
              </div>
            </div>
          )}

          {/* Tab 2: Classes Manager */}
          {activeTab === "classes" && <ClassesManager />}

          {/* Tab 3: Assignments Manager */}
          {activeTab === "assignments" && (
            <AssingmentManager classIdProp={selectedClass} />
          )}

          {/* Tab 4: HOD Feed */}
          {activeTab === "hod" && <Hodfeed />}

          {/* Tab 5: Chat Box */}
          {activeTab === "chat" && <ChatBox user="Teacher" />}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
