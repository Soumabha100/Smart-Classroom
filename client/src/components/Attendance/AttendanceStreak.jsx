import React from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

const AttendanceStreak = ({ streak, isLoading }) => {
  return (
    <motion.div
      className="p-6 rounded-2xl shadow-lg text-white"
      style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }} // Vibrant Orange Gradient
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      {isLoading ? (
        <div className="animate-pulse flex items-center gap-4">
          <div className="w-10 h-10 bg-white/30 rounded-full"></div>
          <div className="flex-grow space-y-2">
            <div className="h-6 w-1/4 bg-white/30 rounded-md"></div>
            <div className="h-4 w-1/2 bg-white/30 rounded-md"></div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Flame className="w-10 h-10 text-yellow-300" />
          <div>
            <p className="text-3xl font-bold">{streak} Days</p>
            <p className="text-sm opacity-80 font-medium">Current Streak</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AttendanceStreak;
