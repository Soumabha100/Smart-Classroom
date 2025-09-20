// src/components/UpcomingEvents.jsx
import React from "react";
import { motion } from "framer-motion";
import { CalendarDays, Users, Trophy, BookOpen } from "lucide-react";

const events = [
  {
    id: 1,
    date: "2025-10-10",
    title: "Midterm Exams",
    description: "Class 10 & 12 exams start",
    icon: <BookOpen className="w-6 h-6 text-blue-600" />,
    reason: "Helps in better planning & time management",
  },
  {
    id: 2,
    date: "2025-10-15",
    title: "Parent-Teacher Meeting",
    description: "Meeting with parents of all students",
    icon: <Users className="w-6 h-6 text-green-600" />,
    reason: "Quick communication with parents & teachers",
  },
  {
    id: 3,
    date: "2025-11-01",
    title: "Diwali Holiday",
    description: "School closed for festival",
    icon: <CalendarDays className="w-6 h-6 text-yellow-600" />,
    reason: "Keeps everyone updated about holidays",
  },
  {
    id: 4,
    date: "2025-11-20",
    title: "Annual Sports Day",
    description: "Track and field competitions",
    icon: <Trophy className="w-6 h-6 text-red-600" />,
    reason: "Improves student engagement & participation",
  },
];

export default function UpcomingEvents() {
  return (
    <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📅 Upcoming Events</h2>
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {events.map((event) => (
          <motion.div
            key={event.id}
            className="flex items-start bg-gray rounded-xl shadow-md p-4 hover:shadow-lg transition"
            whileHover={{ scale: 1.03 }}
          >
            <div className="mr-4">{event.icon}</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                {event.title} – <span className="text-sm text-gray-500">{event.date}</span>
              </h3>
              <p className="text-gray-600">{event.description}</p>
              <p className="text-xs text-purple-600 mt-1 italic">💡 {event.reason}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}