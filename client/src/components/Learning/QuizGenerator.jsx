import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Loader2, CheckCircle, XCircle, X } from "lucide-react";

export default function QuizGenerator() {
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState(true); // ✅ visibility state

  // Mock AI quiz generator (new random quiz each time)
  const generateQuiz = () => {
    const questionBank = [
      {
        question: "What is React primarily used for?",
        options: ["Backend APIs", "Game Development", "Building user interfaces", "Database management"],
        correct: "Building user interfaces",
      },
      {
        question: "Which hook is used for state in functional components?",
        options: ["useFetch", "useState", "useClass", "useEffect"],
        correct: "useState",
      },
      {
        question: "What does JSX stand for?",
        options: ["JavaScript XML", "Java Syntax Extension", "JSON Xchange", "JavaScript Execution"],
        correct: "JavaScript XML",
      },
      {
        question: "Which company developed React?",
        options: ["Google", "Facebook", "Microsoft", "Amazon"],
        correct: "Facebook",
      },
      {
        question: "Which command creates a new React app?",
        options: ["npx create-react-app myApp", "npm install react", "node init react", "git clone react"],
        correct: "npx create-react-app myApp",
      },
    ];

    // Pick 3 random questions
    const shuffled = [...questionBank].sort(() => 0.5 - Math.random()).slice(0, 3);
    return shuffled;
  };

  const handleGenerateQuiz = () => {
    setLoading(true);
    setSubmitted(false);
    setAnswers({});
    setTimeout(() => {
      setQuiz(generateQuiz());
      setLoading(false);
    }, 1000);
  };

  const handleAnswer = (qid, option) => {
    setAnswers({ ...answers, [qid]: option });
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  // If closed, show only "Open Quiz" button
  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="mt-6 px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-500 transition"
      >
        Open Quiz Generator
      </button>
    );
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="mt-10 rounded-2xl p-6 text-white shadow-lg relative"
          style={{
            background: "linear-gradient(135deg, rgb(17, 24, 39), rgb(22, 42, 62))", // medium dark sky-grey gradient
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          {/* Close Button */}
          <button
            onClick={() => setVisible(false)}
            className="absolute top-3 right-3 text-white hover:text-red-400 transition"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-7 h-7 text-yellow-300" />
            <h2 className="text-2xl font-bold">📝 AI Quiz Generator</h2>
          </div>

          {/* Generate Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerateQuiz}
            className="px-5 py-2 bg-blue-500 text-black font-semibold rounded-lg shadow-md hover:bg-blue-200 transition"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin w-5 h-5" /> Generating...
              </div>
            ) : (
              "Generate New Quiz"
            )}
          </motion.button>

          {/* Quiz Output */}
          <div className="mt-6 grid gap-6">
            {quiz.map((q, index) => (
              <motion.div
                key={index}
                className="bg-white/10 p-4 rounded-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <p className="font-semibold">Q{index + 1}. {q.question}</p>
                
                <div className="mt-3 grid gap-2">
                  {q.options.map((option, i) => {
                    const isSelected = answers[index] === option;
                    const isCorrect = submitted && option === q.correct;
                    const isWrong = submitted && isSelected && option !== q.correct;

                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(index, option)}
                        disabled={submitted}
                        className={`px-3 py-2 rounded-lg text-left transition 
                          ${isSelected ? "bg-yellow-400 text-black" : "bg-white/20 hover:bg-white/30"} 
                          ${isCorrect ? "bg-green-500 text-white" : ""} 
                          ${isWrong ? "bg-red-500 text-white" : ""}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Submit Button */}
          {quiz.length > 0 && !submitted && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              className="mt-6 px-5 py-2 bg-green-500 font-semibold rounded-lg shadow-md hover:bg-green-400 transition"
            >
              Submit Answers
            </motion.button>
          )}

          {/* Results */}
          {submitted && (
            <div className="mt-6 p-4 bg-white/10 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Results</h3>
              {quiz.map((q, i) => {
                const correct = answers[i] === q.correct;
                return (
                  <p key={i} className={`flex items-center gap-2 ${correct ? "text-green-300" : "text-red-300"}`}>
                    {correct ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    Q{i + 1}: {correct ? "Correct" : "Incorrect"}
                  </p>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
