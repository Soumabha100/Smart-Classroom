// client/src/components/AnalyticsReports.jsx
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { getAdminAnalytics } from "../api/apiService";
import { Loader2, ServerCrash } from "lucide-react";

const COLORS = ["#4f46e5", "#14b8a6", "#f59e0b", "#ec4899"];

const ChartCard = ({ title, children }) => (
  <motion.div
    className="bg-white dark:bg-slate-800/60 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
  >
    <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">
      {title}
    </h3>
    <div className="h-64">{children}</div>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-slate-800 text-white rounded-lg shadow-lg border border-slate-700">
        <p className="label font-semibold">{`${label}`}</p>
        <p className="intro text-sm">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAdminAnalytics();
        setData(res.data);
      } catch (err) {
        setError("Failed to fetch analytics data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-96 text-center text-red-500">
        <ServerCrash size={40} />
        <p className="mt-2 font-semibold">{error}</p>
      </div>
    );
  }

  const userDistributionData = [
    { name: "Students", value: data?.userCounts?.student || 0 },
    { name: "Teachers", value: data?.userCounts?.teacher || 0 },
    { name: "Parents", value: data?.userCounts?.parent || 0 },
    { name: "Admins", value: data?.userCounts?.admin || 0 },
  ];

  const classEnrollmentData = data?.classEnrollments || [];

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <ChartCard title="User Role Distribution">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={userDistributionData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
            >
              {userDistributionData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Student Enrollment per Class">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={classEnrollmentData}
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
              className="text-xs"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="studentCount"
              name="Students"
              fill="#4f46e5"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </motion.div>
  );
}
