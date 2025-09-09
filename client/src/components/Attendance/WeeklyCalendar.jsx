import React from "react";
import {
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  format,
  isToday,
  isSameDay,
} from "date-fns";
import { motion } from "framer-motion";

const WeeklyCalendar = ({
  selectedDay,
  setSelectedDay,
  presentDays = [],
  absentDays = [],
}) => {
  const week = eachDayOfInterval({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }), // Monday
    end: endOfWeek(new Date(), { weekStartsOn: 1 }), // Sunday
  });

  const getDayStatus = (day) => {
    if (presentDays.some((d) => isSameDay(d, day))) return "present";
    if (absentDays.some((d) => isSameDay(d, day))) return "absent";
    return "none";
  };

  return (
    <div className="flex justify-between items-center bg-white dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
      {week.map((day) => {
        const status = getDayStatus(day);
        return (
          <motion.div
            key={day.toString()}
            onClick={() => setSelectedDay(day)}
            className={`relative w-full h-20 flex flex-col items-center justify-center rounded-lg cursor-pointer transition-colors duration-300
              ${
                isSameDay(selectedDay, day)
                  ? "bg-blue-600 text-white shadow"
                  : "hover:bg-slate-100 dark:hover:bg-slate-700/60"
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span
              className={`text-xs font-bold uppercase ${
                isSameDay(selectedDay, day) ? "text-white/80" : "text-slate-400"
              }`}
            >
              {format(day, "EEE")}
            </span>
            <span
              className={`text-2xl font-bold mt-1 ${
                isSameDay(selectedDay, day)
                  ? "text-white"
                  : "text-slate-700 dark:text-slate-200"
              }`}
            >
              {format(day, "d")}
            </span>

            {status !== "none" && (
              <div
                className={`absolute bottom-2 w-1.5 h-1.5 rounded-full ${
                  status === "present" ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
            )}

            {isToday(day) && !isSameDay(selectedDay, day) && (
              <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default WeeklyCalendar;
