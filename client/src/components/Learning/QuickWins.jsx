import React, { useState } from "react";
import { motion } from "framer-motion";

const tips = [
  "Try the Pomodoro: 25m work, 5m break.",
  "Practice one small problem every day.",
  "Summarize what you learned in 5 sentences.",
];

export default function QuickWins({ onMood }) {
  const [mood, setMood] = useState(null);
  const [tip, setTip] = useState(tips[0]);

  return (
    <motion.div
      className="p-4 rounded-2xl shadow-lg border text-white relative"
      style={{
        background: "linear-gradient(135deg, rgb(17, 24, 39), rgb(22, 42, 62))", // Dark sweet purple-blue
        boxShadow: "0 0 15px rgba(91, 33, 182, 0.6), 0 0 30px rgba(30, 58, 138, 0.4)", // soft glow
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      // Floating animation
      whileHover={{ y: -5 }}
      whileTap={{ y: 0 }}
    >
      <h4 className="font-semibold mb-2 text-blue-600 text-lg">Quick Wins</h4>

      <div className="mb-3">
        <div className="text-sm text-purple-200">How are you?</div>
        <div className="flex gap-2 mt-2">
          {["😃","🙂","😕","😔"].map((em, i) => (
            <motion.button
              key={i}
              onClick={() => { setMood(em); onMood?.(em); }}
              className={`p-2 rounded-lg ${
                mood === em ? "bg-blue-400/30" : "bg-purple-800/40"
              }`}
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.95, y: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {em}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <div className="font-medium text-blue-500">Daily Tip</div>
        <motion.div
          key={tip}
          className="mt-2 text-sm text-purple-100"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {tip}
        </motion.div>
        <button
          onClick={() => setTip(tips[Math.floor(Math.random() * tips.length)])}
          className="text-xs mt-2 text-blue-500 hover:text-sky-500 transition"
        >
          Another tip
        </button>
      </div>

      <div className="text-xs text-purple-300">
        Tip: Hover lesson titles to see inline AI tooltip (integrate in LearningPath)
      </div>
    </motion.div>
  );
}
