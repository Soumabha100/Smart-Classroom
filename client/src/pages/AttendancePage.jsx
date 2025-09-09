import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { format, isSameDay } from "date-fns";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
  ClipboardList,
} from "lucide-react";

import DashboardLayout from "../components/DashboardLayout.jsx";
import { getStudentAttendance } from "../api/apiService.js";
import WeeklyCalendar from "../components/Attendance/WeeklyCalendar.jsx";
import AttendanceCalendarModal from "../components/Attendance/AttendanceCalendarModal.jsx";

const StatCard = ({ icon, label, value, color, isLoading }) => {
  const colors = {
    blue: "border-blue-500/50 hover:border-blue-500",
    green: "border-green-500/50 hover:border-green-500",
    red: "border-red-500/50 hover:border-red-500",
  };
  return (
    <div
      className={`flex items-center gap-4 p-4 bg-white dark:bg-slate-800/60 rounded-xl border-2 transition-colors ${colors[color]}`}
    >
      {icon}
      {isLoading ? (
        <div className="animate-pulse w-full">
          <div className="h-6 w-1/4 bg-slate-200 dark:bg-slate-700 rounded-md mb-1"></div>
          <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
        </div>
      ) : (
        <div>
          <p className="text-xl font-bold text-slate-800 dark:text-white">
            {value}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        </div>
      )}
    </div>
  );
};

const AttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAttendance = async () => {
      setIsLoading(true);
      try {
        await new Promise((res) => setTimeout(res, 1500)); // MOCK DELAY
        const mockData = [
          {
            _id: "1",
            classId: "CS101 Web Development",
            status: "Present",
            timestamp: "2025-09-08T09:00:00.000Z",
          },
          {
            _id: "2",
            classId: "MA202 Advanced Calculus",
            status: "Present",
            timestamp: "2025-09-08T11:00:00.000Z",
          },
          {
            _id: "3",
            classId: "PH105 Quantum Physics",
            status: "Absent",
            timestamp: "2025-09-05T14:00:00.000Z",
          },
          {
            _id: "4",
            classId: "CS101 Web Development",
            status: "Present",
            timestamp: "2025-09-04T09:00:00.000Z",
          },
          {
            _id: "5",
            classId: "MA202 Advanced Calculus",
            status: "Present",
            timestamp: "2025-09-02T11:00:00.000Z",
          },
          {
            _id: "6",
            classId: "CS301 Algorithms",
            status: "Present",
            timestamp: "2025-09-09T10:00:00.000Z",
          },
        ];
        const sorted = mockData.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setAttendance(sorted);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const {
    presentDays,
    absentDays,
    overallPercentage,
    totalPresent,
    totalAbsent,
  } = useMemo(() => {
    const present = new Set();
    const absent = new Set();
    attendance.forEach((record) => {
      const dateStr = new Date(record.timestamp).toDateString();
      if (record.status === "Present") {
        present.add(dateStr);
      } else {
        absent.add(dateStr);
      }
    });
    const totalDays = new Set([...present, ...absent]).size;
    const percentage =
      totalDays === 0 ? "0.0" : ((present.size / totalDays) * 100).toFixed(1);
    return {
      presentDays: [...present].map((d) => new Date(d)),
      absentDays: [...absent].map((d) => new Date(d)),
      overallPercentage: percentage,
      totalPresent: present.size,
      totalAbsent: absent.size,
    };
  }, [attendance]);

  return (
    <DashboardLayout>
      <AttendanceCalendarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        presentDays={presentDays}
        absentDays={absentDays}
        setSelectedDay={setSelectedDay}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="p-2 mr-4 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-slate-800 dark:text-white" />
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Attendance
            </h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Calendar size={16} />
            <span>View Full Calendar</span>
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<TrendingUp size={24} className="text-blue-500" />}
            label="Overall"
            value={`${overallPercentage}%`}
            color="blue"
            isLoading={isLoading}
          />
          <StatCard
            icon={<CheckCircle size={24} className="text-green-500" />}
            label="Attended Days"
            value={totalPresent}
            color="green"
            isLoading={isLoading}
          />
          <StatCard
            icon={<XCircle size={24} className="text-red-500" />}
            label="Missed Days"
            value={totalAbsent}
            color="red"
            isLoading={isLoading}
          />
        </div>

        {/* Weekly Calendar & Recent Activity */}
        <div className="space-y-8">
          <WeeklyCalendar
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />

          <div className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-12 w-full bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"
                  ></div>
                ))
              ) : attendance.length > 0 ? (
                attendance.slice(0, 5).map((record) => (
                  <div
                    key={record._id}
                    className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    {record.status === "Present" ? (
                      <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500 shrink-0" />
                    )}
                    <div className="flex-grow">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {record.classId}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {format(new Date(record.timestamp), "PPP, p")}
                      </p>
                    </div>
                    <span
                      className={`font-bold text-sm px-2 py-1 rounded-md ${
                        record.status === "Present"
                          ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
                          : "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
                      }`}
                    >
                      {record.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <ClipboardList size={40} className="mx-auto text-slate-400" />
                  <h3 className="mt-4 font-semibold text-slate-700 dark:text-slate-300">
                    No attendance history found.
                  </h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AttendancePage;
