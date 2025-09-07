import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Default multi-subject questions
const quizData = {
  math: {
    title: "Math Quiz",
    questions: [
      {
        question: "What is the quadratic formula?",
        options: [
          { text: "x = (-b ± √(b²-4ac)) / 2a", correct: true },
          { text: "x = (a ± √(b²+4ac)) / 2b", correct: false },
          { text: "x = (-a ± √(b²-2ac)) / 2b", correct: false },
          { text: "x = (b ± √(a²-4bc)) / 2a", correct: false },
        ],
      },
      {
        question: "Derivative of sin(x) is?",
        options: [
          { text: "cos(x)", correct: true },
          { text: "-cos(x)", correct: false },
          { text: "sin(x)", correct: false },
          { text: "-sin(x)", correct: false },
        ],
      },
    ],
  },
  c: {
    title: "C Programming Quiz",
    questions: [
      {
        question: "Which header file is required for printf() in C?",
        options: [
          { text: "stdlib.h", correct: false },
          { text: "stdio.h", correct: true },
          { text: "string.h", correct: false },
          { text: "math.h", correct: false },
        ],
      },
      {
        question: "What is the size of int in C (most systems)?",
        options: [
          { text: "2 bytes", correct: false },
          { text: "4 bytes", correct: false },
          { text: "8 bytes", correct: false },
          { text: "Depends on compiler", correct: true },
        ],
      },
    ],
  },
  python: {
    title: "Python Quiz",
    questions: [
      {
        question: "Which keyword is used to define a function in Python?",
        options: [
          { text: "func", correct: false },
          { text: "function", correct: false },
          { text: "def", correct: true },
          { text: "define", correct: false },
        ],
      },
      {
        question: "What is the output of len([10,20,30])?",
        options: [
          { text: "2", correct: false },
          { text: "3", correct: true },
          { text: "30", correct: false },
          { text: "Error", correct: false },
        ],
      },
    ],
  },
};

export default function Quiz({ quiz, onFinish }) {
  const [subject, setSubject] = useState("math"); // default subject
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // use quiz prop if passed, otherwise default quizData[subject]
  const activeQuiz = quiz || quizData[subject];
  if (!activeQuiz || !activeQuiz.questions || activeQuiz.questions.length === 0) {
    return <p className="text-white text-center">❌ No questions available.</p>;
  }

  const q = activeQuiz.questions[current];

  function handleAnswer(correct) {
    if (correct) setScore(score + 1);

    if (current + 1 < activeQuiz.questions.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
      if (onFinish) onFinish(score + (correct ? 1 : 0));
    }
  }

  function resetQuiz() {
    setCurrent(0);
    setScore(0);
    setFinished(false);
  }

  function changeSubject(newSub) {
    setSubject(newSub);
    setCurrent(0);
    setScore(0);
    setFinished(false);
  }

  return (
    <div className="text-white">
      {/* Subject selector (only if using default quizData) */}
      {!quiz && (
        <div className="flex gap-3 mb-6">
          {Object.keys(quizData).map((sub) => (
            <button
              key={sub}
              onClick={() => changeSubject(sub)}
              className={`px-4 py-2 rounded-lg ${
                subject === sub ? "bg-indigo-600" : "bg-gray-700"
              }`}
            >
              {quizData[sub].title}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {!finished ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            {/* Question */}
            <h3 className="text-2xl font-bold mb-4">
              Q{current + 1}. {q.question}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt.correct)}
                  className="block w-full text-left px-4 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 transition"
                >
                  {opt.text}
                </button>
              ))}
            </div>

            {/* Progress */}
            <div className="mt-6 text-sm text-gray-300">
              {current + 1} / {activeQuiz.questions.length}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-4">🎉 Quiz Finished!</h2>
            <p className="text-lg mb-2">
              You scored <span className="font-bold">{score}</span> out of{" "}
              {activeQuiz.questions.length}
            </p>
            <p className="text-indigo-300 mb-6">
              ({Math.round((score / activeQuiz.questions.length) * 100)}%)
            </p>

            <div className="space-x-4">
              <button
                onClick={resetQuiz}
                className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition"
              >
                🔄 Try Again
              </button>
              <button
                onClick={() => onFinish && onFinish(score)}
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                ✅ Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
