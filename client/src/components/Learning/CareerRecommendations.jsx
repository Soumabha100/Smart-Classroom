import React, { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Target, Rocket, X } from "lucide-react"; // Added X icon

export default function CareerRecommendations() {
  const [recommendations, setRecommendations] = useState([]);

  const generateRecommendations = () => {
    setRecommendations([
      {
        id: 1,
        title: "Frontend Developer",
        skills: ["React", "JavaScript", "CSS"],
        project: "Build a Personal Portfolio Website",
      },
      {
        id: 2,
        title: "Data Scientist",
        skills: ["Python", "Pandas", "Machine Learning"],
        project: "Predict Student Performance",
      },
      {
        id: 3,
        title: "AI Engineer",
        skills: ["TensorFlow", "NLP", "Deep Learning"],
        project: "Chatbot for Education",
      },
    ]);
  };

  const closeRecommendations = () => {
    setRecommendations([]); // Clears the recommendations
  };

  return (
    <motion.div
      className="mt-10 rounded-2xl p-6 text-white shadow-lg relative"
      style={{
        background: "linear-gradient(135deg, #06D6A0, #118AB2)", // dark sweet teal-blue
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Briefcase className="w-7 h-7 text-yellow-300" />
        <h2 className="text-2xl font-bold">🚀 Career & Skill Recommendations</h2>

        {/* Close button */}
        {recommendations.length > 0 && (
          <button
            onClick={closeRecommendations}
            className="ml-auto p-1 rounded-full bg-white/20 hover:bg-white/40 transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={generateRecommendations}
        className="px-5 py-2 bg-yellow-400 text-black font-semibold rounded-lg shadow-md hover:bg-yellow-300 transition"
      >
        Show Recommendations
      </motion.button>

      <div className="mt-6 grid gap-4">
        {recommendations.map((rec, i) => (
          <motion.div
            key={rec.id}
            className="bg-white/10 p-4 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-yellow-200" /> {rec.title}
            </h3>
            <p className="mt-2 text-sm text-yellow-100">
              <strong>Skills:</strong> {rec.skills.join(", ")}
            </p>
            <p className="mt-1 text-sm text-green-100 flex items-center gap-2">
              <Rocket className="w-4 h-4" /> {rec.project}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
