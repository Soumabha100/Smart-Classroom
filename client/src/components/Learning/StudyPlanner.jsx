import React, { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Loader2, CheckCircle, X } from "lucide-react";

export default function AIStudyPlanner() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState([]);
  const [visible, setVisible] = useState(true);

  const generatePlan = () => {
    setLoading(true);
    setTimeout(() => {
      setPlan([
        { id: 1, task: "Revise React Hooks", time: "9:00 AM - 10:30 AM" },
        { id: 2, task: "Math Practice: Probability", time: "11:00 AM - 12:00 PM" },
        { id: 3, task: "Break & Relax", time: "12:00 PM - 12:30 PM" },
        { id: 4, task: "Work on AI Project", time: "2:00 PM - 4:00 PM" },
      ]);
      setLoading(false);
    }, 1200);
  };

  // If hidden → show reopen button
  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="mt-6 px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-500 transition"
      >
        Open Study Planner
      </button>
    );
  }

  return (
    <motion.div
      className="mt-10 rounded-2xl p-6 text-white shadow-lg relative"
      style={{
        background: "linear-gradient(135deg, rgb(17, 24, 39), rgb(22, 42, 62))", // dark sweet purple
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Close Button */}
      <button
        onClick={() => setVisible(false)}
        className="absolute top-4 right-4 text-white/70 hover:text-white"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <CalendarDays className="w-7 h-7 text-pink-300" />
        <h2 className="text-2xl font-bold">📅 AI Study Planner</h2>
      </div>

      {/* Generate Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={generatePlan}
        className="px-5 py-2 bg-blue-500 text-black font-semibold rounded-lg shadow-md hover:bg-blue-200 transition"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="animate-spin w-5 h-5" /> Creating Plan...
          </div>
        ) : (
          "Generate Study Plan"
        )}
      </motion.button>

      {/* Plan Output */}
      <div className="mt-6 grid gap-4">
        {plan.map((p, i) => (
          <motion.div
            key={p.id}
            className="bg-white/10 p-4 rounded-lg flex justify-between items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <p className="font-semibold">{p.task}</p>
            <p className="text-sm text-pink-200 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> {p.time}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
