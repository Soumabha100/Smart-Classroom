import React from "react";
import { motion } from "framer-motion";

export default function OnlineResources() {
  const resources = [
    { title: "Free Coding Courses", link: "https://www.freecodecamp.org/" },
    { title: "AI & Machine Learning Tutorials", link: "https://www.coursera.org/" },
    { title: "Career Guidance Articles", link: "https://www.linkedin.com/learning/" },
    { title: "Resume & Interview Tips", link: "https://www.glassdoor.com/" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-xl shadow-xl"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">
        Easy Access to Online Resources and Materials for Career Growth
      </h2>
      <ul className="space-y-3">
        {resources.map((res, index) => (
          <motion.a
            key={index}
            href={res.link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="block p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer text-blue-400 hover:underline"
          >
            {res.title}
          </motion.a>
        ))}
      </ul>
    </motion.div>
  );
}
