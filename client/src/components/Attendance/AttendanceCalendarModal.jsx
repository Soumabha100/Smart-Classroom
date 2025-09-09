import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import "react-day-picker/dist/style.css";

const AttendanceCalendarModal = ({
  isOpen,
  onClose,
  presentDays,
  absentDays,
  setSelectedDay,
}) => {
  if (!isOpen) return null;

  const handleDayClick = (day) => {
    if (day) {
      setSelectedDay(day);
    }
    onClose();
  };

  const footer = (
    <div className="flex justify-center items-center gap-6 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
        <span className="font-medium text-slate-600 dark:text-slate-300">
          Present
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
        <span className="font-medium text-slate-600 dark:text-slate-300">
          Absent
        </span>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-700 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X size={20} />
            </button>

            {/* This is a completely custom-styled calendar using Tailwind CSS */}
            <DayPicker
              mode="single"
              onDayClick={handleDayClick}
              modifiers={{ present: presentDays, absent: absentDays }}
              footer={footer}
              components={{
                IconLeft: () => <ChevronLeft className="h-5 w-5" />,
                IconRight: () => <ChevronRight className="h-5 w-5" />,
              }}
              classNames={{
                root: "text-slate-800 dark:text-slate-100",
                caption:
                  "flex justify-center items-center relative text-lg font-bold mb-4",
                caption_label: "text-slate-900 dark:text-white",
                nav: "space-x-1",
                nav_button:
                  "h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors",
                table: "w-full border-collapse",
                head_cell:
                  "text-sm font-semibold text-slate-500 dark:text-slate-400 pb-2",
                cell: "text-center relative",
                day: "h-10 w-10 flex items-center justify-center rounded-full transition-colors font-medium hover:bg-slate-100 dark:hover:bg-slate-700",
                day_today:
                  "text-blue-600 dark:text-blue-400 font-bold bg-slate-100 dark:bg-slate-700/50",
                day_selected:
                  "bg-blue-600 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-600",
                day_outside: "text-slate-400 dark:text-slate-500 opacity-50",
                // Custom dot modifiers
                modifier_present: "relative",
                modifier_absent: "relative",
              }}
            >
              {(day, modifiers) => (
                <div className="relative w-full h-full flex items-center justify-center">
                  <span>{format(day.date, "d")}</span>
                  {modifiers.present && (
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  )}
                  {modifiers.absent && (
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-500"></div>
                  )}
                </div>
              )}
            </DayPicker>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AttendanceCalendarModal;
