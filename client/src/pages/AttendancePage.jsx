// client/src/pages/AttendancePage.jsx

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  format,
  isSameDay,
  differenceInCalendarDays,
  subDays,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  TrendingUp,
  Calendar,
  ClipboardList,
  LoaderCircle,
  List,
  BarChart2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import DashboardLayout from "../components/DashboardLayout.jsx";
import { getStudentAttendance, getStudentClasses } from "../api/apiService.js";
import WeeklyCalendar from "../components/Attendance/WeeklyCalendar.jsx";
import AttendanceCalendarModal from "../components/Attendance/AttendanceCalendarModal.jsx";
import AttendanceStreak from "../components/Attendance/AttendanceStreak.jsx";
import FullAttendanceLog from "../components/Attendance/FullAttendanceLog.jsx";

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
  const [allAttendance, setAllAttendance] = useState([]);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isFullLogModalOpen, setIsFullLogModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [attendanceRes, classesRes] = await Promise.all([
          getStudentAttendance(),
          getStudentClasses(),
        ]);

        const sorted = attendanceRes.data.records.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setAllAttendance(sorted);
        setEnrolledClasses(classesRes.data);
      } catch (error) {
        console.error("Failed to fetch attendance data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredAttendance = useMemo(() => {
    if (selectedClassId === "all") {
      return allAttendance;
    }
    return allAttendance.filter(
      (record) => record.classId?._id === selectedClassId
    );
  }, [allAttendance, selectedClassId]);

  const {
    presentDays,
    absentDays,
    overallPercentage,
    totalPresent,
    currentStreak,
  } = useMemo(() => {
    // --- FIX START: Added a filter to ensure we only process records with valid dates ---
    const validAttendance = filteredAttendance.filter(
      (rec) => rec.timestamp && !isNaN(new Date(rec.timestamp).getTime())
    );

    if (validAttendance.length === 0) {
      return {
        presentDays: [],
        absentDays: [],
        overallPercentage: "0.0",
        totalPresent: 0,
        currentStreak: 0,
      };
    }
    // --- FIX END ---

    const present = new Set();
    const absent = new Set();
    // Use the sanitized 'validAttendance' array for all calculations
    validAttendance.forEach((record) => {
      const dateStr = new Date(record.timestamp).toDateString();
      if (record.status === "Present") present.add(dateStr);
      else absent.add(dateStr);
    });

    const presentDates = [...present]
      .map((d) => new Date(d))
      .sort((a, b) => b.getTime() - a.getTime()); // Use .getTime() for safer date sorting

    let streak = 0;
    if (presentDates.length > 0) {
      const today = new Date();
      if (
        isSameDay(presentDates[0], today) ||
        isSameDay(presentDates[0], subDays(today, 1))
      ) {
        streak = 1;
        for (let i = 0; i < presentDates.length - 1; i++) {
          // This calculation is now safe from errors
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
      presentDays: presentDates, // --- FIX: Correctly assign presentDates to presentDays ---
      absentDays: [...absent].map((d) => new Date(d)),
      overallPercentage: percentage,
      totalPresent: present.size,
      currentStreak: streak,
    };
  }, [filteredAttendance]);

  const weeklyTrendData = useMemo(() => {
    const validAttendance = filteredAttendance.filter(
      (rec) => rec.timestamp && !isNaN(new Date(rec.timestamp).getTime())
    );
    const weeks = [];
    for (let i = 4; i >= 0; i--) {
      const targetDate = subDays(new Date(), i * 7);
      const weekStart = startOfWeek(targetDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(targetDate, { weekStartsOn: 1 });

      const presentDaysInWeek = new Set(
        validAttendance
          .filter((rec) => {
            const recDate = new Date(rec.timestamp);
            return (
              rec.status === "Present" &&
              recDate >= weekStart &&
              recDate <= weekEnd
            );
          })
          .map((rec) => new Date(rec.timestamp).toDateString())
      ).size;

      weeks.push({
        name: `${format(weekStart, "MMM d")}`,
        "Days Attended": presentDaysInWeek,
      });
    }
    return weeks;
  }, [filteredAttendance]);

  const recordsForSelectedDay = useMemo(() => {
    if (!selectedDay) return [];
    return filteredAttendance.filter((record) =>
      isSameDay(new Date(record.timestamp), selectedDay)
    );
  }, [filteredAttendance, selectedDay]);

  return (
    <DashboardLayout>
      <AttendanceCalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        presentDays={presentDays}
        absentDays={absentDays}
        setSelectedDay={setSelectedDay}
      />
      <FullAttendanceLog
        isOpen={isFullLogModalOpen}
        onClose={() => setIsFullLogModalOpen(false)}
        records={filteredAttendance}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 md:p-6 lg:p-8"
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullLogModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg shadow-lg text-indigo-600 bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-900/50 hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-transform transform hover:scale-105"
            >
              <List size={16} />
              <span>View Full Log</span>
            </button>
            <button
              onClick={() => setIsCalendarModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg shadow-lg text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-purple-500 hover:to-indigo-500 transition-transform transform hover:scale-105"
            >
              <Calendar size={16} />
              <span>View Full Calendar</span>
            </button>
          </div>
        </div>

        <div className="mb-8">
          <label
            htmlFor="class-filter"
            className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2"
          >
            Filter by Class
          </label>
          <select
            id="class-filter"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full max-w-sm p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="all">All Classes</option>
            {enrolledClasses.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>
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

        <motion.div
          className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
            <BarChart2 className="text-indigo-500" />
            Weekly Attendance Trend
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={weeklyTrendData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis
                dataKey="name"
                tick={{ fill: "currentColor" }}
                className="text-xs text-slate-500 dark:text-slate-400"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "currentColor" }}
                className="text-xs text-slate-500 dark:text-slate-400"
              />
              <Tooltip
                cursor={{ fill: "rgba(128, 128, 128, 0.1)" }}
                contentStyle={{
                  backgroundColor: "rgba(30, 41, 59, 0.9)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                }}
                labelStyle={{ color: "#cbd5e1" }}
              />
              <Legend wrapperStyle={{ fontSize: "14px" }} />
              <Bar
                dataKey="Days Attended"
                fill="#4f46e5"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

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
                <div className="flex justify-center items-center h-full">
                  <LoaderCircle className="w-8 h-8 animate-spin text-indigo-500" />
                </div>
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
                        {record.classId?.name || "Unknown Class"}
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
