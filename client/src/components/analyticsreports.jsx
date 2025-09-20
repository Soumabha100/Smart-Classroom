// src/components/AnalyticsReports.jsx
import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { motion } from "framer-motion";

const studentEnrollment = [
  { grade: "Grade 1", students: 50 },
  { grade: "Grade 2", students: 45 },
  { grade: "Grade 3", students: 60 },
  { grade: "Grade 4", students: 40 },
  { grade: "Grade 5", students: 55 },
];

const teacherPerformance = [
  { name: "Math", score: 85 },
  { name: "Science", score: 90 },
  { name: "English", score: 75 },
  { name: "History", score: 80 },
];

const classDistribution = [
  { name: "Class A", value: 8 },
  { name: "Class B", value: 6 },
  { name: "Class C", value: 10 },
  { name: "Class D", value: 5 },
];

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

export default function AnalyticsReports() {
  return (
    <div className="p-6 rounded-2xl shadow-xl bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 animate-gradient">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📈 Analytics & Reports</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Student Enrollment - Bar Chart */}
        <motion.div
          className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Student Enrollment</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={studentEnrollment}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grade" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="students" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Teacher Performance - Line Chart */}
        <motion.div
          className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Teacher Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={teacherPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Class Distribution - Pie Chart */}
        <motion.div
          className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Class Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={classDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {classDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
