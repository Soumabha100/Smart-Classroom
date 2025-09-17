import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const AttendanceCalendarModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Example events (replace with real data)
  const events = [
    { title: "All Day Event", start: "2025-09-01" },
    { title: "Conference", start: "2025-09-02", end: "2025-09-03" },
    { title: "Meeting", start: "2025-09-03T10:30:00", end: "2025-09-03T12:30:00" },
    { title: "Lunch", start: "2025-09-03T12:00:00" },
    { title: "Birthday Party", start: "2025-09-04T07:00:00" },
    { title: "Long Event", start: "2025-09-07", end: "2025-09-10" },
    { title: "Repeating Event", start: "2025-09-09T16:00:00", groupId: "999" },
    { title: "Repeating Event", start: "2025-09-16T16:00:00", groupId: "999" },
    { title: "Click for Google", url: "http://google.com/", start: "2025-09-28" },
  ];

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
            className="bg-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-700 w-full max-w-6xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-300 hover:bg-gray-700 transition-colors"
            >
              <X size={20} />
            </button>

            {/* FullCalendar */}
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={events}
              height="auto"
              contentHeight="auto"
  expandRows={true}          // ✅ makes rows expand evenly
  handleWindowResize={true}  // ✅ re-renders on resize
  dayMaxEventRows={true}     // ✅ prevents overflow
              dayCellClassNames={() =>
                "bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 transition-colors"
              }
              eventClassNames={() =>
                "bg-green-500 text-white rounded-md px-1 py-0.5 text-sm"
              }
              dayHeaderClassNames={() =>
    "bg-gray-900 text-white font-semibold border border-gray-700"
  }
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AttendanceCalendarModal;
