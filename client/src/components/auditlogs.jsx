import React from "react";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";

const logs = [
  { id: 1, user: "Admin", action: "Logged in", time: "Today 10:30 AM" },
  { id: 2, user: "Teacher - Soumabha", action: "Uploaded Assignment", time: "Today 09:15 AM" },
  { id: 3, user: "Student - krisanu", action: "Submitted Homework", time: "Yesterday 05:00 PM" },
];

export default function AuditLogs() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="p-6 rounded-2xl shadow-xl 
                 bg-gradient-to-br from-white to-slate-100 
                 dark:from-[#1a1a2e] dark:via-[#16213e] dark:to-[#0f3460]"
    >
      <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">
        Audit Logs
      </h2>
      <ul className="space-y-3">
        {logs.map((log, index) => (
          <motion.li
            key={log.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-3 rounded-xl 
                       bg-slate-50 dark:bg-slate-800 
                       shadow-sm hover:shadow-md cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5 text-red-500" />
              <span className="text-slate-700 dark:text-slate-200">
                <span className="font-medium">{log.user}</span> – {log.action}
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {log.time}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}