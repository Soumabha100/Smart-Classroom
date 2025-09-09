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

const WeeklyCalendar = ({ selectedDay, setSelectedDay }) => {
  const week = eachDayOfInterval({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }), // Monday
    end: endOfWeek(new Date(), { weekStartsOn: 1 }), // Sunday
  });

  return (
    <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 p-2 rounded-xl">
      {week.map((day, i) => (
        <motion.div
          key={day.toString()}
          onClick={() => setSelectedDay(day)}
          className={`relative w-12 h-16 flex flex-col items-center justify-center rounded-lg cursor-pointer transition-colors duration-300
            ${
              isSameDay(selectedDay, day)
                ? "bg-blue-600 text-white shadow"
                : "hover:bg-slate-200 dark:hover:bg-slate-700"
            }
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-xs font-medium uppercase opacity-80">
            {format(day, "EEE")}
          </span>
          <span className="text-xl font-bold mt-1">{format(day, "d")}</span>
          {isToday(day) && (
            <div
              className={`absolute bottom-1 w-1 h-1 rounded-full ${
                isSameDay(selectedDay, day) ? "bg-white" : "bg-blue-600"
              }`}
            ></div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default WeeklyCalendar;
