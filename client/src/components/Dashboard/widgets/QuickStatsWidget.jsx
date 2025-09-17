import React from "react";
import { TrendingUp, Award, CalendarCheck, Activity } from "lucide-react";

// A map to assign icons to labels for a more dynamic feel
const iconMap = {
  attendance: <CalendarCheck size={24} />,
  grade: <Award size={24} />,
  assignments: <Activity size={24} />,
  default: <TrendingUp size={24} />,
};

const QuickStatsWidget = ({ data }) => {
  // Helper to get an icon based on the label text
  const getIconForStat = (label = "") => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes("attendance")) return iconMap.attendance;
    if (lowerLabel.includes("grade")) return iconMap.grade;
    if (lowerLabel.includes("assignment")) return iconMap.assignments;
    return iconMap.default;
  };

  return (
    <div className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 h-full">
      <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">
        {data.title}
      </h3>
      <div className="space-y-4">
        {/* Safely map over the stats array */}
        {Array.isArray(data.stats) &&
          data.stats.map((stat, index) =>
            // Add a check to ensure stat is a valid object before rendering
            typeof stat === "object" && stat.label && stat.value ? (
              <div key={index} className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
                  {getIconForStat(stat.label)}
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                </div>
              </div>
            ) : null
          )}
      </div>
    </div>
  );
};

export default QuickStatsWidget;
