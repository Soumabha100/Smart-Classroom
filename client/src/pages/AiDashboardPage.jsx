// client/src/pages/AiDashboardPage.jsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Bot,
  ArrowRight,
  BookOpen,
  ListTodo,
  BrainCircuit,
  Briefcase,
  Download,
  BarChart2,
  LifeBuoy,
  FileText,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";

// --- Reusable Component for Feature Cards ---
const FeatureCard = ({ icon, title, description, onClick }) => (
  <motion.div
    whileHover={{
      y: -5,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    }}
    className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 cursor-pointer flex flex-col"
    onClick={onClick}
  >
    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-slate-500 dark:text-slate-400 text-sm flex-grow">
      {description}
    </p>
    <div className="mt-4 text-indigo-600 dark:text-indigo-400 font-semibold flex items-center">
      Explore <ArrowRight className="w-4 h-4 ml-1" />
    </div>
  </motion.div>
);

// --- Main AI Dashboard Page Component ---
export default function AiDashboardPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! How can I assist you with your studies today?",
    },
  ]);
  const [inputText, setInputText] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Add user message and a mock AI response
    setMessages((prev) => [...prev, { sender: "user", text: inputText }]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: `Thinking about "${inputText}"...` },
      ]);
    }, 1000);

    setInputText("");
  };

  const featureList = [
    {
      icon: <BookOpen />,
      title: "Learning Suggestion",
      description:
        "Get personalized recommendations for articles, videos, and courses.",
    },
    {
      icon: <ListTodo />,
      title: "To-Do Activity List",
      description: "Manage your daily tasks and assignments in one place.",
    },
    {
      icon: <BrainCircuit />,
      title: "Daily Practice Session",
      description:
        "Engage with tailored quizzes and exercises to sharpen your skills.",
    },
    {
      icon: <Download />,
      title: "Study Materials & Drive",
      description:
        "Access all your notes, documents, and resources from your cloud drive.",
    },
    {
      icon: <FileText />,
      title: "Previous Year Questions",
      description: "Review and analyze past exam papers and solutions.",
    },
    {
      icon: <Briefcase />,
      title: "Career Guidance Mode",
      description:
        "Explore career paths, skill requirements, and get expert advice.",
    },
    {
      icon: <BarChart2 />,
      title: "Performance Analysis",
      description:
        "Visualize your academic progress with detailed charts and insights.",
    },
    {
      icon: <LifeBuoy />,
      title: "Help and Support",
      description:
        "Find answers to your questions or get in touch with our support team.",
    },
  ];

  return (
    <DashboardLayout>
      <div className="relative min-h-screen">
        {/* Header with Search/Chat Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              AI Dashboard
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Your intelligent hub for personalized learning and productivity.
            </p>
          </div>
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105"
          >
            <Search className="w-5 h-5" />
            <span className="hidden sm:inline">Chat with AI</span>
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featureList.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        {/* AI Chat Window (Expandable) */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="fixed bottom-0 right-0 sm:bottom-8 sm:right-8 w-full sm:w-96 h-[70vh] sm:h-[500px] bg-white dark:bg-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col z-50"
            >
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <Bot className="text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-bold text-lg">AI Assistant</h3>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Message Area */}
              <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-end gap-2 ${
                      msg.sender === "user" ? "justify-end" : ""
                    }`}
                  >
                    {msg.sender === "ai" && (
                      <div className="w-8 h-8 flex-shrink-0 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-slate-500" />
                      </div>
                    )}
                    <div
                      className={`max-w-xs px-4 py-2 rounded-2xl ${
                        msg.sender === "user"
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0"
              >
                <div className="relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask anything..."
                    className="w-full bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-full py-3 pl-4 pr-12 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
