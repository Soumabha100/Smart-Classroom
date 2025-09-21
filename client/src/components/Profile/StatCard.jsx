import React from "react";

const StatCard = ({ icon, label, value, color }) => {
  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300",
    green:
      "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300",
    yellow:
      "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-300",
    purple:
      "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300",
  };

  return (
    <div className="p-4 transition-all duration-300 transform bg-white border rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-700 hover:-translate-y-1">
      <div
        className={`inline-flex items-center justify-center w-12 h-12 mb-4 rounded-lg ${colorClasses[color]}`}
      >
        {icon}
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="text-3xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
};

export default StatCard;
