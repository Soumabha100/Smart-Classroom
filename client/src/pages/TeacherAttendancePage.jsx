import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  getTeacherClasses,
  getTeacherAttendanceAnalytics,
} from "../api/apiService";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  ChevronLeft,
  LoaderCircle,
  AlertCircle,
  CalendarDays,
  Users,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

// You might need to install recharts: npm install recharts

export default function TeacherAttendancePage() {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data } = await getTeacherClasses();
        setClasses(data);
        if (data.length > 0) {
          setSelectedClassId(data[0]._id); // Select the first class by default
          // Set default date range (e.g., last 30 days)
          const today = new Date();
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(today.getDate() - 30);
          setStartDate(thirtyDaysAgo.toISOString().split("T")[0]);
          setEndDate(today.toISOString().split("T")[0]);
        }
      } catch (err) {
        console.error("Failed to fetch classes:", err);
        setError("Could not load your classes.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId && startDate && endDate) {
      const fetchAnalytics = async () => {
        setIsAnalyticsLoading(true);
        setError("");
        try {
          const { data } = await getTeacherAttendanceAnalytics(
            selectedClassId,
            startDate,
            endDate
          );
          setAnalyticsData(data);
        } catch (err) {
          console.error("Failed to fetch attendance analytics:", err);
          setError(
            err.response?.data?.message ||
              "Failed to load attendance analytics."
          );
        } finally {
          setIsAnalyticsLoading(false);
        }
      };
      fetchAnalytics();
    }
  }, [selectedClassId, startDate, endDate]);

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString(); // Adjust formatting as needed
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            to="/teacher-dashboard"
            className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors mb-4"
          >
            <ChevronLeft size={16} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Attendance Analytics
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Overview of attendance for your classes.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <LoaderCircle className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="ml-3 text-slate-500">Loading classes...</p>
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800/60 rounded-lg shadow-sm">
            <AlertCircle size={48} className="mx-auto text-yellow-500" />
            <h3 className="mt-4 text-xl font-semibold text-slate-700 dark:text-slate-200">
              No classes found
            </h3>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Create a class to view attendance analytics.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
              <label htmlFor="class-select" className="sr-only">
                Select Class:
              </label>
              <select
                id="class-select"
                className="w-full md:w-auto p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
              >
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.subject})
                  </option>
                ))}
              </select>

              <div className="flex-1 min-w-0 flex flex-col md:flex-row gap-4">
                <label htmlFor="start-date" className="sr-only">
                  Start Date:
                </label>
                <input
                  type="date"
                  id="start-date"
                  className="flex-1 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <label htmlFor="end-date" className="sr-only">
                  End Date:
                </label>
                <input
                  type="date"
                  id="end-date"
                  className="flex-1 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {isAnalyticsLoading ? (
              <div className="flex justify-center items-center h-64">
                <LoaderCircle className="w-10 h-10 animate-spin text-indigo-500" />
                <p className="ml-3 text-lg text-slate-500">
                  Loading analytics...
                </p>
              </div>
            ) : error ? (
              <div className="flex items-center gap-2 p-4 text-red-700 bg-red-100 rounded-md dark:bg-red-900/50 dark:text-red-300">
                <AlertCircle size={20} /> <p>{error}</p>
              </div>
            ) : (
              analyticsData && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {analyticsData.className} Attendance Overview
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 dark:bg-slate-700 p-5 rounded-lg shadow-sm flex items-center justify-between">
                      <p className="text-slate-600 dark:text-slate-300 font-medium">
                        Total Sessions
                      </p>
                      <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {analyticsData.totalRecords}
                      </span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700 p-5 rounded-lg shadow-sm flex items-center justify-between">
                      <p className="text-slate-600 dark:text-slate-300 font-medium">
                        Total Present
                      </p>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {analyticsData.totalPresent}
                      </span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700 p-5 rounded-lg shadow-sm flex items-center justify-between">
                      <p className="text-slate-600 dark:text-slate-300 font-medium">
                        Overall %
                      </p>
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {analyticsData.attendancePercentage}%
                      </span>
                    </div>
                  </div>

                  {/* Daily Attendance Chart */}
                  <div className="bg-slate-50 dark:bg-slate-700 p-5 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                      Daily Attendance Count
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analyticsData.byDay}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#e0e0e0"
                          className="dark:stroke-slate-600"
                        />
                        <XAxis
                          dataKey="_id"
                          stroke="#6b7280"
                          className="dark:text-slate-300"
                        />
                        <YAxis
                          stroke="#6b7280"
                          className="dark:text-slate-300"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgb(30 41 59)",
                            border: "none",
                            borderRadius: "8px",
                          }}
                          itemStyle={{ color: "white" }}
                          labelStyle={{ color: "rgb(148 163 184)" }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#8884d8"
                          name="Students Present"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Attendance by Student Chart/Table */}
                  <div className="bg-slate-50 dark:bg-slate-700 p-5 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                      Attendance by Student
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={analyticsData.byStudent.map((s) => ({
                          ...s,
                          name: s.studentName || "Unknown Student",
                        }))}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#e0e0e0"
                          className="dark:stroke-slate-600"
                        />
                        <XAxis
                          type="number"
                          stroke="#6b7280"
                          className="dark:text-slate-300"
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          stroke="#6b7280"
                          className="dark:text-slate-300"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgb(30 41 59)",
                            border: "none",
                            borderRadius: "8px",
                          }}
                          itemStyle={{ color: "white" }}
                          labelStyle={{ color: "rgb(148 163 184)" }}
                        />
                        <Legend />
                        <Bar
                          dataKey="presentCount"
                          fill="#82ca9d"
                          name="Times Present"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Recent Attendance Logs */}
                  <div className="bg-slate-50 dark:bg-slate-700 p-5 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                      Recent Attendance Logs
                    </h3>
                    {analyticsData.recentLogs.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-600">
                          <thead className="bg-slate-100 dark:bg-slate-800">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Student Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Date & Time
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-slate-700 divide-y divide-slate-200 dark:divide-slate-600">
                            {analyticsData.recentLogs.map((log) => (
                              <tr key={log._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                                  {log.studentId
                                    ? log.studentId.name
                                    : "Unknown Student"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-semibold">
                                  {log.status}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">
                                  {formatDateTime(log.timestamp)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-slate-500 dark:text-slate-400">
                        No attendance logs available for this period.
                      </p>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
