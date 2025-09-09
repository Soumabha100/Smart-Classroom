import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Calendar,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout.jsx";
import { getStudentAttendance } from "../api/apiService.js";
import { useAuth } from "../context/AuthContext.jsx";

// --- Reusable Components ---

const StatPill = ({ icon, label, value, color }) => {
  const colors = {
    green:
      "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400",
    red: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400",
  };

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-full ${colors[color]}`}
    >
      {icon}
      <div>
        <p className="font-bold text-lg">{value}</p>
        <p className="text-sm">{label}</p>
      </div>
    </div>
  );
};

const AttendanceRowSkeleton = () => (
  <div className="flex items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg animate-pulse">
    <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
    <div className="ml-4 flex-grow space-y-2">
      <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
      <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded"></div>
    </div>
  </div>
);

const AttendancePage = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await getStudentAttendance();
        // Sort by most recent first
        const sortedData = res.data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setAttendance(sortedData);
      } catch (err) {
        setError("Failed to fetch attendance records.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const overallPercentage = () => {
    if (attendance.length === 0) return 0;
    const presentCount = attendance.filter(
      (a) => a.status === "Present"
    ).length;
    return ((presentCount / attendance.length) * 100).toFixed(1);
  };

  const totalPresent = attendance.filter((a) => a.status === "Present").length;
  const totalAbsent = attendance.length - totalPresent;

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            to="/dashboard"
            className="p-2 mr-4 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-slate-800 dark:text-white" />
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Attendance Record
          </h1>
        </div>

        {/* Summary Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <StatPill
            icon={<TrendingUp className="h-8 w-8" />}
            label="Overall"
            value={`${overallPercentage()}%`}
            color="blue"
          />
          <StatPill
            icon={<CheckCircle className="h-8 w-8" />}
            label="Classes Attended"
            value={totalPresent}
            color="green"
          />
          <StatPill
            icon={<TrendingDown className="h-8 w-8" />}
            label="Classes Missed"
            value={totalAbsent}
            color="red"
          />
        </motion.div>

        {/* Attendance List */}
        <div className="bg-white dark:bg-slate-800/60 dark:backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
            Detailed History
          </h2>
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <AttendanceRowSkeleton key={i} />
              ))
            ) : error ? (
              <p className="text-center text-red-500 py-8">{error}</p>
            ) : attendance.length > 0 ? (
              attendance.map((record) => (
                <motion.div
                  key={record._id}
                  className="flex items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div
                    className={`p-2 rounded-full ${
                      record.status === "Present"
                        ? "bg-green-100 dark:bg-green-900/50"
                        : "bg-red-100 dark:bg-red-900/50"
                    }`}
                  >
                    {record.status === "Present" ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                  <div className="ml-4 flex-grow">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {record.classId}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {new Date(record.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`font-bold text-sm ${
                      record.status === "Present"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {record.status}
                  </span>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16">
                <Calendar size={48} className="mx-auto text-slate-400" />
                <h3 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">
                  No Records Found
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Your attendance history will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AttendancePage;
