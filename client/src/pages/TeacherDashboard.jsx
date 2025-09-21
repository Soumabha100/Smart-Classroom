import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import QRCode from "react-qr-code";
import { QrCode, LoaderCircle, AlertCircle, Clock } from "lucide-react";
import { getTeacherClasses, generateQrCode } from "../api/apiService";
import io from "socket.io-client";

import ClassesManager from "../components/ClassManager";
import AssingmentManager from "../components/AssingmentManager";
import Hodfeed from "../components/Hodfeed";
import ChatBox from "./ChatBox";
import AttendanceChart from "../components/AttendanceChart"; // The missing import that caused the error

// Constants
const QR_CODE_VALIDITY_SECONDS = 120; // 2 minutes

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [qrCodeData, setQrCodeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(QR_CODE_VALIDITY_SECONDS);
  const [liveAttendance, setLiveAttendance] = useState([]);

  // Fetch the teacher's classes when the component loads
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const teacherClasses = await getTeacherClasses();
        setClasses(teacherClasses);
        if (teacherClasses.length > 0) {
          setSelectedClass(teacherClasses[0]._id);
        }
      } catch (err) {
        console.error("Failed to fetch teacher classes:", err);
        setError("Could not load your classes. Please refresh the page.");
      }
    };
    fetchClasses();
  }, []);

  // Countdown timer effect for the QR code
  useEffect(() => {
    if (!qrCodeData) return;
    setCountdown(QR_CODE_VALIDITY_SECONDS);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setQrCodeData(null); // Invalidate QR code
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [qrCodeData]);

  // WebSocket for live attendance
  useEffect(() => {
    const socket = io("http://localhost:5001"); // Make sure this port is correct
    socket.on("new_attendance", (newLog) => {
      setLiveAttendance((prevLogs) => [newLog, ...prevLogs]);
    });
    return () => socket.disconnect();
  }, []);

  // Handle QR code generation
  const handleGenerateQr = async () => {
    if (!selectedClass) {
      setError("Please select a class to generate a QR code.");
      return;
    }
    setError("");
    setQrCodeData(null);
    setIsLoading(true);

    try {
      const data = await generateQrCode(selectedClass);
      setQrCodeData(data.qrToken);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate QR code.");
    } finally {
      setIsLoading(false); // This ensures loading always stops
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 p-6 overflow-auto bg-slate-50 dark:bg-slate-900">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Teacher Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Welcome back, {user?.name}! Manage your classes and attendance.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: QR Code Generator */}
          <div className="lg:col-span-1 space-y-8">
            <div className="p-6 bg-white border rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-700">
              <h2 className="flex items-center gap-3 text-xl font-semibold text-slate-800 dark:text-white mb-4">
                <QrCode className="w-6 h-6 text-indigo-500" />
                Attendance QR Code
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="class-select"
                    className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Select Class
                  </label>
                  <select
                    id="class-select"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full input-style"
                    disabled={classes.length === 0 || isLoading}
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
                <button
                  onClick={handleGenerateQr}
                  disabled={isLoading || classes.length === 0}
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
                  <Clock className="w-5 h-5" />
                  Expires in: {countdown}s
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Live Feed & Chart */}
          <div className="lg:col-span-2 space-y-8">
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

        <div className="mt-10 space-y-8">
          <ClassesManager />
          <AssingmentManager classIdProp={selectedClass} />
          <Hodfeed />
          <ChatBox user="Teacher" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
