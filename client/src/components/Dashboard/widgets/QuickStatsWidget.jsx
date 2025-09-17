import React from 'react';

const QuickStatsWidget = ({ data }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">{data.title}</h3>
      <div className="grid grid-cols-2 gap-4">
        {data.stats.map((stat, index) => (
          <div key={index} className="text-center">
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stat.value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickStatsWidget;