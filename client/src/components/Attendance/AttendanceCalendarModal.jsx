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
    setSelectedDay(day);
    onClose();
  };

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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-700 w-full max-w-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-center mb-4">
              Full Calendar View
            </h2>
            <DayPicker
              mode="single"
              onDayClick={handleDayClick}
              modifiers={{ present: presentDays, absent: absentDays }}
              modifiersClassNames={{
                present: "rdp-day_present",
                absent: "rdp-day_absent",
              }}
              components={{
                IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                IconRight: () => <ChevronRight className="h-4 w-4" />,
              }}
              className="w-full"
              classNames={{
                caption:
                  "flex justify-center items-center relative text-lg font-semibold mb-4",
                caption_label: "text-slate-800 dark:text-white",
                nav_button:
                  "h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700",
                day: "h-10 w-10 flex items-center justify-center rounded-full transition-colors font-medium",
                day_today:
                  "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300",
                day_selected:
                  "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700",
              }}
            />
            <style>{`
                .rdp-day_present { background-color: #22c55e; color: white; }
                .rdp-day_present:hover { background-color: #16a34a !important; }
                .rdp-day_absent { background-color: #ef4444; color: white; }
                .rdp-day_absent:hover { background-color: #dc2626 !important; }
            `}</style>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AttendanceCalendarModal;
