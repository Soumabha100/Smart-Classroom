import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { format, isSameDay, differenceInCalendarDays, subDays } from "date-fns";
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
import AttendanceStreak from "../components/Attendance/AttendanceStreak.jsx"; // ✨ Import the new component

const StatCard = ({ icon, label, value, color, isLoading }) => {
  const colors = {
    blue: "text-blue-500",
    green: "text-green-500",
    red: "text-red-500",
  };
  return (
    <div
      className={`flex items-center gap-4 p-4 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700`}
    >
      <div
        className={`p-3 rounded-full bg-slate-100 dark:bg-slate-900/50 ${colors[color]}`}
      >
        {icon}
      </div>
      {isLoading ? (
        <div className="animate-pulse w-full">
          <div className="h-6 w-1/4 bg-slate-200 dark:bg-slate-700 rounded-md mb-1.5"></div>
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
        await new Promise((res) => setTimeout(res, 1500));
        const today = new Date();
        const mockData = [
          {
            _id: "1",
            classId: "CS101 Web Development",
            status: "Present",
            timestamp: new Date(
              new Date().setDate(today.getDate() - 1)
            ).toISOString(),
          },
          {
            _id: "2",
            classId: "MA202 Advanced Calculus",
            status: "Present",
            timestamp: new Date(
              new Date().setDate(today.getDate() - 1)
            ).toISOString(),
          },
          {
            _id: "3",
            classId: "PH105 Quantum Physics",
            status: "Absent",
            timestamp: new Date(
              new Date().setDate(today.getDate() - 2)
            ).toISOString(),
          },
          {
            _id: "4",
            classId: "CS101 Web Development",
            status: "Present",
            timestamp: new Date(
              new Date().setDate(today.getDate() - 4)
            ).toISOString(),
          },
          {
            _id: "6",
            classId: "CS301 Algorithms",
            status: "Present",
            timestamp: today.toISOString(),
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
    currentStreak,
  } = useMemo(() => {
    const present = new Set();
    const absent = new Set();
    attendance.forEach((record) => {
      const dateStr = new Date(record.timestamp).toDateString();
      if (record.status === "Present") present.add(dateStr);
      else absent.add(dateStr);
    });

    const presentDates = [...present]
      .map((d) => new Date(d))
      .sort((a, b) => b - a);

    let streak = 0;
    if (presentDates.length > 0) {
      const today = new Date();
      const todayString = today.toDateString();
      const yesterdayString = subDays(today, 1).toDateString();

      // Check if today or yesterday is the most recent present day
      if (
        presentDates[0].toDateString() === todayString ||
        presentDates[0].toDateString() === yesterdayString
      ) {
        streak = 1;
        for (let i = 0; i < presentDates.length - 1; i++) {
          const diff = differenceInCalendarDays(
            presentDates[i],
            presentDates[i + 1]
          );
          if (diff === 1) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    const totalDays = new Set([...present, ...absent]).size;
    const percentage =
      totalDays === 0 ? "0.0" : ((present.size / totalDays) * 100).toFixed(1);

    return {
      presentDays: presentDates,
      absentDays: [...absent].map((d) => new Date(d)),
      overallPercentage: percentage,
      totalPresent: present.size,
      totalAbsent: absent.size,
      currentStreak: streak,
    };
  }, [attendance]);

  const recordsForSelectedDay = useMemo(() => {
    if (!selectedDay) return [];
    return attendance.filter((record) =>
      isSameDay(new Date(record.timestamp), selectedDay)
    );
  }, [attendance, selectedDay]);

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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="p-2 mr-2 md:mr-4 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-slate-800 dark:text-white" />
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Attendance
            </h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg shadow-lg text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-purple-500 hover:to-indigo-500 transition-transform transform hover:scale-105"
          >
            <Calendar size={16} />
            <span>View Full Calendar</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<TrendingUp size={24} />}
            label="Overall"
            value={`${overallPercentage}%`}
            color="blue"
            isLoading={isLoading}
          />
          <StatCard
            icon={<CheckCircle size={24} />}
            label="Attended Days"
            value={totalPresent}
            color="green"
            isLoading={isLoading}
          />
          <AttendanceStreak streak={currentStreak} isLoading={isLoading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <motion.div
            className="lg:col-span-3 bg-white dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold mb-4 px-2 text-slate-800 dark:text-white">
              This Week
            </h2>
            <WeeklyCalendar
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              presentDays={presentDays}
              absentDays={absentDays}
            />
          </motion.div>

          <motion.div
            className="lg:col-span-2 bg-white dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">
              Log for{" "}
              <span className="text-blue-600 dark:text-blue-400">
                {format(selectedDay, "PPP")}
              </span>
            </h2>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {isLoading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-14 w-full bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"
                  ></div>
                ))
              ) : recordsForSelectedDay.length > 0 ? (
                recordsForSelectedDay.map((record) => (
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
                        {format(new Date(record.timestamp), "p")}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 flex flex-col items-center justify-center h-full">
                  <ClipboardList size={40} className="mx-auto text-slate-400" />
                  <h3 className="mt-4 font-semibold text-slate-700 dark:text-slate-300">
                    No records for this day.
                  </h3>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AttendancePage;
