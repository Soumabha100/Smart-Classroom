import React from "react";
import { motion } from "framer-motion";

export default function GamificationPanel({ xp = 420, badges = ["Streak", "QuizPro"], leaderboard = [] }) {
  const level = Math.floor(xp / 100);
  const progress = xp % 100;
  const sampleBoard = leaderboard.length ? leaderboard : [
    { name: "You", xp: xp },
    { name: "Riya", xp: 650 },
    { name: "Akash", xp: 580 },
  ];

  return (
    <motion.div
      className="p-6 rounded-2xl shadow border text-white"
      style={{
        background: "linear-gradient(135deg, #6A0DAD, #1E3A8A)", // Dark sweet purple-blue gradient
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-lg font-semibold mb-3">🎮 Gamification</h3>

      <div className="mb-4">
        <div className="text-sm text-purple-200">Level {level}</div>
        <div className="w-full bg-purple-800/30 rounded-full h-3 mt-2 overflow-hidden">
          <div
            className="h-3 rounded-full"
            style={{ width: `${progress}%`, background: "#FBBF24" }} // Gold-like XP bar
          />
        </div>
        <div className="text-sm text-purple-100 mt-2">{xp} XP</div>
      </div>

      <div className="mb-4">
        <div className="font-medium mb-2">🏅 Badges</div>
        <div className="flex gap-2 flex-wrap">
          {badges.map((b, i) => (
            <motion.span
              key={i}
              className="px-2 py-1 bg-yellow-400/20 text-yellow-300 rounded"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.2 }}
            >
              {b}
            </motion.span>
          ))}
        </div>
      </div>

      <div>
        <div className="font-medium mb-2">🏆 Leaderboard</div>
        <ul className="text-sm space-y-1">
          {sampleBoard.map((p, i) => (
            <motion.li
              key={i}
              className="flex justify-between"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.2 }}
            >
              <span>{i + 1}. {p.name}</span>
              <span className="text-purple-200">{p.xp} XP</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
