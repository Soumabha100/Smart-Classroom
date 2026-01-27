// client/src/pages/TeacherAttendancePage.jsx

import React, { useState, useEffect, useCallback, useMemo } from "react"; // --- FIX: Imported useMemo ---
import DashboardLayout from "../components/DashboardLayout";
import {
  getTeacherClasses,
  getTeacherAttendanceAnalytics,
} from "../api/apiService";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Link } from "react-router-dom";
import {
  format,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import {
  ChevronLeft,
  Loader2,
  AlertCircle,
  Calendar as CalendarIcon,
  Users,
  ServerCrash,
  Filter,
  List,
  BarChart2,
  Clock,
} from "lucide-react";
import DetailedAttendanceModal from "../components/Attendance/DetailedAttendanceModal";

const COLORS = ["#22c55e", "#ef4444", "#f59e0b"]; // Green for Present, Red for Absent, Yellow for Late

const AnalyticsCard = ({ title, icon, children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`bg-white dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm ${className}`}
  >
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
        {icon}
        {title}
      </h3>
    </div>
    {children}
  </motion.div>
);

export default function TeacherAttendancePage() {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [filterType, setFilterType] = useState("month");
  const [dateRange, setDateRange] = useState({
    from: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    to: format(endOfMonth(new Date()), "yyyy-MM-dd"),
  });

  const handleDateFilterChange = useCallback((type) => {
    setFilterType(type);
    const today = new Date();
    let from, to;
    switch (type) {
      case "week":
        from = startOfWeek(today, { weekStartsOn: 1 });
        to = endOfWeek(today, { weekStartsOn: 1 });
        break;
      case "month":
        from = startOfMonth(today);
        to = endOfMonth(today);
        break;
      case "last7":
        from = subDays(today, 6);
        to = today;
        break;
      default:
        from = startOfMonth(today);
        to = endOfMonth(today);
        break;
    }
    setDateRange({
      from: format(from, "yyyy-MM-dd"),
      to: format(to, "yyyy-MM-dd"),
    });
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data } = await getTeacherClasses();
        setClasses(data);
        if (data.length > 0) setSelectedClassId(data[0]._id);
      } catch (err) {
        setError("Could not load your classes.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId && dateRange.from && dateRange.to) {
      const fetchAnalytics = async () => {
        setIsAnalyticsLoading(true);
        setError("");
        try {
          const { data } = await getTeacherAttendanceAnalytics(
            selectedClassId,
            dateRange.from,
            dateRange.to
          );
          setAnalyticsData(data);
        } catch (err) {
          setError(err.response?.data?.message || "Failed to load analytics.");
        } finally {
          setIsAnalyticsLoading(false);
        }
      };
      fetchAnalytics();
    }
  }, [selectedClassId, dateRange]);

  const overallChartData = useMemo(() => {
    if (!analyticsData) return [];
    const absent = analyticsData.totalRecords - analyticsData.totalPresent;
    return [
      { name: "Present", value: analyticsData.totalPresent },
      { name: "Absent", value: absent > 0 ? absent : 0 },
    ];
  }, [analyticsData]);

  const selectedClassName =
    classes.find((c) => c._id === selectedClassId)?.name || "";

  return (
    <DashboardLayout>
      <DetailedAttendanceModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        records={analyticsData?.recentLogs}
        className={selectedClassName}
      />
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
            An enterprise-level overview of attendance for your classes.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800/60 rounded-lg shadow-sm">
            <AlertCircle size={48} className="mx-auto text-yellow-500" />
            <h3 className="mt-4 text-xl font-semibold">No classes found</h3>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"
            >
              <div className="flex items-center gap-2 font-semibold">
                <Filter size={18} />
                <span>Filters</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <select
                  id="class-select"
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500"
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                >
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                  {["week", "last7", "month"].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleDateFilterChange(type)}
                      className={`flex-1 px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                        filterType === type
                          ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                          : "hover:bg-white/50 dark:hover:bg-slate-600/50"
                      }`}
                    >
                      {type === "week"
                        ? "This Week"
                        : type === "last7"
                        ? "7 Days"
                        : "This Month"}
                    </button>
                  ))}
                </div>
                <input
                  type="date"
                  className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500"
                  value={dateRange.from}
                  onChange={(e) =>
                    setDateRange((p) => ({ ...p, from: e.target.value }))
                  }
                />
                <input
                  type="date"
                  className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500"
                  value={dateRange.to}
                  onChange={(e) =>
                    setDateRange((p) => ({ ...p, to: e.target.value }))
                  }
                />
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {isAnalyticsLoading ? (
                <motion.div
                  key="loader"
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center h-96"
                >
                  <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-96 text-center bg-white dark:bg-slate-800/60 rounded-2xl"
                >
                  <ServerCrash size={48} className="text-red-500 mb-4" />
                  <h3 className="text-xl font-bold">Server Error</h3>
                  <p className="mt-2 text-slate-500">{error}</p>
                </motion.div>
              ) : (
                analyticsData && (
                  <motion.div
                    key={selectedClassId + dateRange.from}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <AnalyticsCard
                        title="Overall Attendance"
                        icon={<BarChart2 className="text-indigo-500" />}
                        className="lg:col-span-1 flex flex-col justify-center items-center"
                      >
                        <div className="w-full h-56 relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={overallChartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                innerRadius={60}
                                paddingAngle={5}
                                labelLine={false}
                              >
                                {overallChartData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                ))}
                              </Pie>
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "rgb(30 41 59 / 0.9)",
                                  borderColor: "rgb(255 255 255 / 0.1)",
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-slate-800 dark:text-white">
                              {analyticsData.attendancePercentage}%
                            </span>
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                              Present
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 text-center">
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {analyticsData.totalPresent} out of{" "}
                            {analyticsData.totalRecords} records are 'Present'
                          </p>
                        </div>
                      </AnalyticsCard>

                      <AnalyticsCard
                        title="Student Leaderboard"
                        icon={<Users className="text-indigo-500" />}
                        className="lg:col-span-2"
                      >
                        <p className="text-sm text-slate-500 dark:text-slate-400 -mt-4 mb-4">
                          Top students by days present in the selected period.
                        </p>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart
                            data={analyticsData.byStudent.slice(0, 5)}
                            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              className="stroke-slate-200 dark:stroke-slate-700"
                            />
                            <XAxis
                              dataKey="studentName"
                              tick={{ fill: "currentColor" }}
                              className="text-xs text-slate-500 dark:text-slate-400"
                            />
                            <YAxis
                              allowDecimals={false}
                              tick={{ fill: "currentColor" }}
                              className="text-xs"
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "rgb(30 41 59 / 0.9)",
                                borderColor: "rgb(255 255 255 / 0.1)",
                              }}
                            />
                            <Bar
                              dataKey="presentCount"
                              name="Days Present"
                              fill="#4f46e5"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </AnalyticsCard>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => setIsDetailModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-transform transform hover:scale-105"
                      >
                        <List size={16} />
                        View Full Detailed Log
                      </button>
                    </div>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
