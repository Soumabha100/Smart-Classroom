import React from "react";
import { motion } from "framer-motion";
import { BookOpen, PlayCircle, Brain, Star } from "lucide-react";

export default function PersonalizedLearningPath({ onOpenLesson }) {
  const lessons = [
    { id: 1, title: "React Basics", type: "Lesson", progress: 70 },
    { id: 2, title: "JavaScript Quiz", type: "Quiz", progress: 40 },
    { id: 3, title: "AI Concepts", type: "Lesson", progress: 90 },
    { id: 4, title: "Mini Project: To-Do App", type: "Challenge", progress: 20 },
  ];

  return (
    <motion.div
      className="mt-10 rounded-2xl p-6 text-white shadow-lg"
      style={{
        background: "linear-gradient(135deg, #231635ff, #16243dff)", // medium dark purple gradient
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-7 h-7 text-yellow-300" />
        <h2 className="text-2xl font-bold">🎯 Personalized Learning Path</h2>
      </div>

      {/* Lessons List */}
      <div className="grid gap-4">
        {lessons.map((lesson, index) => (
          <motion.div
            key={lesson.id}
            onClick={() => onOpenLesson(lesson)}
            className="cursor-pointer bg-white/10 hover:bg-white/20 p-4 rounded-xl flex justify-between items-center transition-all"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-3">
              {lesson.type === "Lesson" && <BookOpen className="text-pink-300" />}
              {lesson.type === "Quiz" && <PlayCircle className="text-green-300" />}
              {lesson.type === "Challenge" && <Star className="text-yellow-300" />}
              <div>
                <h3 className="font-semibold">{lesson.title}</h3>
                <p className="text-sm text-purple-200">{lesson.type}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-32 bg-purple-900/40 h-2 rounded-full overflow-hidden">
              <motion.div
                className="h-2 bg-yellow-300"
                initial={{ width: 0 }}
                animate={{ width: `${lesson.progress}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
