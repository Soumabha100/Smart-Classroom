import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Trophy, Zap, Award } from "lucide-react";

import * as learningService from "../services/learningService";
import DashboardLayout from "../components/DashboardLayout.jsx";
import ModuleCard from "../components/Learning/ModuleCard";
import ProgressBar from "../components/Learning/ProgressBar";
import Quiz from "../components/Learning/Quiz";
import PuzzleGame from "../components/Learning/PuzzleGame";

const PathStats = ({ percent, doneCount, totalCount }) => (
  <div className="p-6 bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="font-bold text-lg text-slate-800 dark:text-white">
        Path Progress
      </h3>
      <span className="font-bold text-blue-600 dark:text-blue-400">
        {percent}%
      </span>
    </div>
    <ProgressBar percent={percent} />
    <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
      <span>
        {doneCount} of {totalCount} modules completed
      </span>
      <span>{Math.max(0, totalCount - doneCount)} remaining</span>
    </div>
  </div>
);

const PathRewards = ({ modules }) => {
  const totalQuizzes = modules.filter((m) => m.type === "quiz").length;
  const completedQuizzes = modules.filter(
    (m) => m.type === "quiz" && m.done,
  ).length;

  return (
    <div className="p-6 bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
      <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">
        Path Rewards
      </h3>
      <div className="space-y-3">
        <div
          className={`flex items-center gap-3 transition-opacity ${
            completedQuizzes < totalQuizzes ? "opacity-40" : ""
          }`}
        >
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-full text-yellow-500">
            <Zap size={20} />
          </div>
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            Quiz Master
          </span>
        </div>
        <div
          className={`flex items-center gap-3 transition-opacity ${
            modules.some((m) => !m.done) ? "opacity-40" : ""
          }`}
        >
          <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-full text-green-500">
            <Trophy size={20} />
          </div>
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            Path Completion
          </span>
        </div>
      </div>
    </div>
  );
};

export default function LearningPath() {
  const [modules, setModules] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  // ❌ REMOVED: Confetti state logic (Optimization)

  useEffect(() => {
    learningService.getPath().then(setModules);
  }, []);

  const doneCount = modules.filter((m) => m.done).length;
  const percent = modules.length
    ? Math.round((doneCount / modules.length) * 100)
    : 0;

  function startModule(m) {
    if (m.type === "quiz") {
      setActiveQuiz({
        id: m.id,
        title: m.title,
        questions: [
          {
            question: "What is recursion?",
            options: [
              { text: "Repeating without end", correct: false },
              { text: "A function calling itself", correct: true },
            ],
          },
        ],
      });
    } else {
      setActiveModule(m);
    }
  }

  function completeModule(moduleId) {
    setModules((prev) =>
      prev.map((x) => (x.id === moduleId ? { ...x, done: true } : x)),
    );
    setActiveModule(null);
  }

  function onQuizFinish(score) {
    setModules((prev) =>
      prev.map((x) =>
        x.id === activeQuiz.id ? { ...x, done: true, score } : x,
      ),
    );
    setQuizResult({ title: activeQuiz.title, score });
    setActiveQuiz(null);
  }

  const firstUnfinishedIndex = modules.findIndex((m) => !m.done);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-slate-800 dark:text-white" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Personalized Learning Path
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Your tailored journey to mastering new skills.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: The Path */}
          <div className="lg:col-span-2 relative">
            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-slate-200 dark:bg-slate-700 -z-10"></div>
            <div className="space-y-6">
              {modules.map((m, index) => {
                const isLocked = index > 0 && !modules[index - 1].done;
                const isCurrent = index === firstUnfinishedIndex;
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="pl-16 relative"
                  >
                    <div
                      className={`absolute left-8 top-1/2 -translate-y-1/2 -translate-x-1/2 h-5 w-5 rounded-full border-4 bg-slate-50 dark:bg-slate-900
                                  ${
                                    m.done
                                      ? "border-green-500"
                                      : isCurrent
                                        ? "border-blue-500 animate-pulse"
                                        : "border-slate-300 dark:border-slate-600"
                                  }`}
                    />
                    <ModuleCard
                      module={m}
                      onStart={startModule}
                      isLocked={isLocked}
                      isCurrent={isCurrent}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Stats and Rewards */}
          <div className="lg:sticky top-24 space-y-6">
            <PathStats
              percent={percent}
              doneCount={doneCount}
              totalCount={modules.length}
            />
            <PathRewards modules={modules} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModule && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-2xl bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-2xl font-bold mb-4">{activeModule.title}</h3>
              {activeModule.type === "lesson" && (
                <div>
                  <div className="aspect-video w-full mb-4">
                    <iframe
                      src="https://www.youtube.com/embed/8hly31xKli0"
                      title="Lesson Video"
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <button
                    onClick={() => completeModule(activeModule.id)}
                    className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold"
                  >
                    Mark as Completed
                  </button>
                </div>
              )}
              {activeModule.type === "puzzle" && (
                <div>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">
                    Solve the puzzle to complete this module.
                  </p>
                  <PuzzleGame
                    onComplete={() => completeModule(activeModule.id)}
                  />
                </div>
              )}
              <button
                onClick={() => setActiveModule(null)}
                className="absolute top-4 right-4 p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeQuiz && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-lg bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <Quiz quiz={activeQuiz} onFinish={onQuizFinish} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {quizResult && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <Award size={48} className="mx-auto text-green-500 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Quiz Completed!</h3>
              <p className="mb-4 text-slate-500 dark:text-slate-400">
                You scored {quizResult.score} points in {quizResult.title}.
              </p>
              <button
                onClick={() => setQuizResult(null)}
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold"
              >
                Continue Path
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
