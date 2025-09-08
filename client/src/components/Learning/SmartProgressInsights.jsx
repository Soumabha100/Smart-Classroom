import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, Target } from "lucide-react";

export default function SmartProgressInsights() {
  const insights = [
    {
      id: 1,
      icon: <TrendingUp className="text-green-300 w-6 h-6" />,
      title: "Overall Progress",
      detail: "You have completed 65% of your current modules.",
    },
    {
      id: 2,
      icon: <AlertTriangle className="text-yellow-300 w-6 h-6" />,
      title: "Weak Areas",
      detail: "Struggling in JavaScript Quizzes (score avg. 55%).",
    },
    {
      id: 3,
      icon: <Target className="text-pink-300 w-6 h-6" />,
      title: "Next Target",
      detail: "Focus on AI Basics to improve your overall grade.",
    },
  ];

  return (
    <motion.div
      className="mt-10 rounded-2xl p-6 text-white shadow-lg"
      style={{
        background: "linear-gradient(135deg, #0F4C75, #3282B8)", // medium dark sky-blue gradient
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-7 h-7 text-yellow-200" />
        <h2 className="text-2xl font-bold">📊 Smart Progress Insights</h2>
      </div>

      {/* Insights List */}
      <div className="grid gap-4">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            className="bg-white/10 hover:bg-white/20 p-4 rounded-xl flex items-start gap-3 transition-all cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
          >
            <div>{insight.icon}</div>
            <div>
              <h3 className="font-semibold">{insight.title}</h3>
              <p className="text-sm text-blue-200">{insight.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
