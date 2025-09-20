import React from "react";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

const activities = [
  { id: 1, text: "New student registered in CSE-A", time: "2 mins ago" },
  { id: 2, text: "Teacher uploaded assignment for CSE-B", time: "1 hr ago" },
  { id: 3, text: "Parent joined system", time: "Yesterday" },
];

export default function RecentActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="p-6 rounded-2xl shadow-xl 
                 bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 
                 dark:from-[#1a1a2e] dark:via-[#16213e] dark:to-[#0f3460]"
    >
      <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">
        Recent Activity
      </h2>
      <ul className="space-y-4">
        {activities.map((activity, index) => (
          <motion.li
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="flex items-start space-x-3 p-3 rounded-lg 
                       bg-white dark:bg-slate-800 shadow-sm 
                       hover:shadow-md cursor-pointer"
          >
            <Clock className="w-5 h-5 text-blue-500 mt-1" />
            <div>
              <p className="text-slate-700 dark:text-slate-200">
                {activity.text}
              </p>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {activity.time}
              </span>
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}