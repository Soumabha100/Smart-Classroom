import React, { useEffect, useState } from "react";
import * as learningService from "../services/learningService";
import ModuleCard from "../components/Learning/ModuleCard";
import ProgressBar from "../components/Learning/ProgressBar";
import Quiz from "../components/Learning/Quiz";
import PuzzleGame from "../components/Learning/PuzzleGame"; // ✅ Added Puzzle Game
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-dom-confetti"; // ✅ Import burst confetti

export default function LearningPath() {
  const [modules, setModules] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [challengeText, setChallengeText] = useState("");
  const [showCongrats, setShowCongrats] = useState(false); // 🎉 NEW STATE

  useEffect(() => {
    learningService.getPath().then(setModules);
  }, []);

  const doneCount = modules.filter((m) => m.done).length;
  const percent = modules.length
    ? Math.round((doneCount / modules.length) * 100)
    : 0;

  useEffect(() => {
    if (modules.length > 0 && doneCount === modules.length) {
      setShowCongrats(true);
    }
  }, [doneCount, modules.length]);

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
      prev.map((x) => (x.id === moduleId ? { ...x, done: true } : x))
    );
    setActiveModule(null);
    setChallengeText("");
  }

  function onQuizFinish(score) {
    setModules((prev) =>
      prev.map((x) =>
        x.id === activeQuiz.id ? { ...x, done: true } : x
      )
    );
    setQuizResult({ title: activeQuiz.title, score });
    setActiveQuiz(null);
  }

  // ✅ Config for burst confetti
  const confettiConfig = {
    angle: 90,
    spread: 120,
    startVelocity: 30,
    elementCount: 100,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    colors: ["#ff0a54", "#ff477e", "#ff85a1", "#fbb1b9", "#f9bec7"],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black p-10 text-white">
      {/* Header */}
      <motion.h2
        className="text-4xl font-extrabold mb-6 drop-shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🎯 Learning Path
      </motion.h2>

      {/* Progress */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <ProgressBar percent={percent} />
        <div className="text-sm text-gray-300 mt-2">
          {doneCount}/{modules.length} completed
        </div>
      </motion.div>

      {/* Modules */}
      <div className="space-y-4">
        <AnimatePresence>
          {modules.map((m, index) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="transform transition"
            >
              <ModuleCard module={m} onStart={startModule} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Lesson / Challenge / Puzzle Modal */}
      <AnimatePresence>
        {activeModule && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-2xl bg-gradient-to-br from-gray-900 via-slate-800 to-black p-6 rounded-2xl shadow-xl border border-gray-700 text-white"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-2xl font-bold mb-4">{activeModule.title}</h3>

              {/* Lesson Section */}
              {activeModule.type === "lesson" && (
                <div className="space-y-4">
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src="https://www.youtube.com/embed/8hly31xKli0"
                      title="Lesson Video"
                      className="w-full h-64 rounded-lg shadow-md"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>

                  <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
                    <h4 className="font-semibold mb-2">📝 Notes</h4>
                    <p className="text-gray-300 text-sm">
                      Recursion is a method of solving a problem where the
                      solution depends on smaller instances of the same problem.
                      A recursive function calls itself until a base case is met.
                    </p>
                  </div>

                  <button
                    onClick={() => completeModule(activeModule.id)}
                    className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white"
                  >
                    ✅ Mark as Completed
                  </button>
                </div>
              )}

              {/* Challenge Section */}
              {activeModule.type === "challenge" && (
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
                    <h4 className="font-semibold mb-2">💻 Challenge</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Write a recursive function to calculate the factorial of a
                      number.
                    </p>
                    <textarea
                      value={challengeText}
                      onChange={(e) => setChallengeText(e.target.value)}
                      placeholder="Write your solution here..."
                      className="w-full h-40 bg-gray-900 text-gray-200 rounded-lg p-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    ></textarea>

                    <button
                      onClick={() => completeModule(activeModule.id)}
                      disabled={!challengeText.trim()}
                      className={`mt-4 px-4 py-2 rounded-lg text-white ${
                        challengeText.trim()
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-gray-600 cursor-not-allowed"
                      }`}
                    >
                      🚀 Submit Challenge
                    </button>
                  </div>
                </div>
              )}

             {/* ✅ Puzzle Section */}
{activeModule.type === "puzzle" && (
  <div className="space-y-4">
    <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
      <h4 className="font-semibold mb-2">🧩 Puzzle Game</h4>
      <p className="text-gray-300 text-sm mb-3">
        Solve the puzzle to complete this module.
      </p>
      <div className="border border-gray-700 rounded-lg p-2">
        <PuzzleGame
          onComplete={() => {
            completeModule(activeModule.id);
            setShowCongrats(true); // 🎉 Trigger confetti for puzzle completion
          }}
        />
      </div>
    </div>
  </div>
)}


              <button
                onClick={() => setActiveModule(null)}
                className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-blue"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz Modal */}
      <AnimatePresence>
        {activeQuiz && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-lg bg-gradient-to-br from-gray-900 via-slate-800 to-black p-6 rounded-2xl shadow-xl border border-gray-700"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Quiz quiz={activeQuiz} onFinish={onQuizFinish} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz Result Modal */}
      <AnimatePresence>
        {quizResult && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md bg-gradient-to-br from-green-900 via-emerald-800 to-black p-6 rounded-2xl shadow-xl border border-green-700 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-2xl font-bold mb-4">✅ Quiz Completed!</h3>
              <p className="mb-4">
                You scored <span className="font-bold">{quizResult.score}</span>{" "}
                points in{" "}
                <span className="font-semibold">{quizResult.title}</span>.
              </p>
              <button
                onClick={() => setQuizResult(null)}
                className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎉 Congratulations Modal with Burst Confetti */}
      <AnimatePresence>
        {showCongrats && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center p-6 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Burst confetti */}
            <div className="absolute top-0">
              <Confetti active={showCongrats} config={confettiConfig} />
            </div>

            <motion.div
              className="w-full max-w-lg bg-gradient-to-br from-yellow-500 via-orange-600 to-red-700 p-8 rounded-2xl shadow-2xl border border-yellow-400 text-center text-white z-10"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.5, bounce: 0.3 }}
            >
              <h2 className="text-4xl font-extrabold mb-4">🎉 Congratulations!</h2>
              <p className="text-lg mb-6">
                You’ve completed{" "}
                <span className="font-bold">
                  {doneCount}/{modules.length}
                </span>{" "}
                modules. Keep up the great work 🚀
              </p>
              <button
                onClick={() => setShowCongrats(false)}
                className="px-6 py-3 bg-green-700 hover:bg-green-800 rounded-lg text-white font-semibold"
              >
                Awesome! 🎯
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
