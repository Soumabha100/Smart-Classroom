// client/src/components/Attendance/DetailedAttendanceModal.jsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ClipboardList, CheckCircle, XCircle, Search } from "lucide-react";
import { format } from "date-fns";

export default function DetailedAttendanceModal({
  isOpen,
  onClose,
  records,
  className,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const formatDateTime = (isoString) => {
    return format(new Date(isoString), "PPP 'at' p");
  };

  const filteredRecords =
    records?.filter((record) =>
      record.studentId?.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-700 w-full max-w-4xl shadow-2xl flex flex-col"
            style={{ maxHeight: "90vh" }}
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg">
                  <ClipboardList className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                    Detailed Attendance Log
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    All records for {className}
                  </p>
                </div>
              </div>
              <div className="relative mt-4 sm:mt-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by student name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 bg-slate-100 dark:bg-slate-700 border border-transparent focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg py-2 pl-10 pr-4"
                />
              </div>
            </div>

            <div className="flex-grow overflow-y-auto pr-2">
              {filteredRecords.length > 0 ? (
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-600">
                  <thead className="bg-slate-50 dark:bg-slate-700 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        Date & Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredRecords.map((record) => (
                      <tr
                        key={record._id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                          {record.studentId?.name || "Unknown Student"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                          <span
                            className={`flex items-center gap-2 ${
                              record.status === "Present"
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-500 dark:text-red-400"
                            }`}
                          >
                            {record.status === "Present" ? (
                              <CheckCircle size={16} />
                            ) : (
                              <XCircle size={16} />
                            )}
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                          {formatDateTime(record.timestamp)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-16">
                  <p className="text-slate-500 dark:text-slate-400">
                    No attendance records found for this student or period.
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="absolute -top-4 -right-4 bg-slate-600 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-all transform hover:scale-110"
            >
              <X size={20} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
