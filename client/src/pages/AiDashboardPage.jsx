import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  BookOpen,
  ListTodo,
  BrainCircuit,
  Briefcase,
  Download,
  BarChart2,
  ArrowUp,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  Mic,
  Image as ImageIcon,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";

// --- Reusable Component: ToolCard (Unchanged) ---
const ToolCard = ({ icon, title, description, onClick, isSelected }) => (
  <div
    onClick={onClick}
    className={`relative h-48 p-6 rounded-2xl cursor-pointer transition-all duration-300 flex-shrink-0 ${
      isSelected
        ? "bg-indigo-600 text-white shadow-2xl shadow-indigo-500/30"
        : "bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600"
    }`}
    style={{ width: "calc(100% / 3 - (16px * 2 / 3))" }}
  >
    <div
      className={`mb-3 w-12 h-12 flex items-center justify-center rounded-xl transition-colors duration-300 ${
        isSelected
          ? "bg-white/20 text-white"
          : "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300"
      }`}
    >
      {icon}
    </div>
    <h3
      className={`font-bold transition-colors duration-300 ${
        isSelected ? "text-white" : "text-slate-800 dark:text-white"
      }`}
    >
      {title}
    </h3>
    <p
      className={`text-sm mt-1 transition-colors duration-300 ${
        isSelected ? "text-white/70" : "text-slate-500 dark:text-slate-400"
      }`}
    >
      {description}
    </p>
    <div
      className={`absolute bottom-4 right-4 p-1 rounded-full transition-all duration-300 ${
        isSelected
          ? "bg-white text-indigo-600 scale-100"
          : "bg-slate-100 dark:bg-slate-700 scale-0"
      }`}
    >
      <ArrowRight className="w-4 h-4" />
    </div>
  </div>
);

// --- Reusable Component: FeatureDisplay (Unchanged) ---
const FeatureDisplay = ({ feature }) => (
  <motion.div
    key={feature.id}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -30 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
    className="bg-white/50 dark:bg-slate-800/50 p-8 rounded-b-2xl border-x border-b border-slate-200 dark:border-slate-700"
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300">
        {feature.icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">
          {feature.title}
        </h3>
        <p className="text-slate-500 dark:text-slate-400">
          {feature.description}
        </p>
      </div>
    </div>
    <div className="mt-6 h-64 bg-slate-100 dark:bg-slate-700/50 rounded-lg flex items-center justify-center">
      <p className="text-slate-400 dark:text-slate-500 text-sm">
        Full implementation of {feature.title} will appear here.
      </p>
    </div>
  </motion.div>
);

// --- NEW Reusable Component: ActionButton ---
const ActionButton = ({ icon, label }) => (
  <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-200 dark:bg-slate-700/50 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
    {icon}
    <span>{label}</span>
  </button>
);

// --- The Final, Merged AI Dashboard Page ---
export default function AiDashboardPage() {
  const [query, setQuery] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  // --- NEW: Logic for Animated Suggestive Prompts ---
  const prompts = [
    "Generate me this week's table",
    "Make a study plan for my exams",
    "Explain this topic in simple words",
    "Give me practice questions from Physics",
    "Test me with 5 MCQs from Chapter 2",
    "Revise yesterday’s notes in short",
    "Suggest effective revision tips",
    "Create a timetable for my daily routine",
    "Help me prepare for viva questions",
    "Break down this formula step by step",
    "Give a motivational tip to stay consistent",
    "Explain this program line by line",
    "List important definitions from Chapter 3",
    "Summarize today’s lecture in points",
    "Generate a mind map for this topic",
    "Suggest group study activities",
    "How to reduce exam stress",
    "Highlight the key topics for mid-sem",
    "Create a mnemonic for these terms",
    "Generate an assignment outline",
    "Give feedback on my project idea",
    "How to score more",
    "Help me focus more in studies",
    "Summarize my Computer Science Chapter 1",
    "How to memorize notes efficiently",
    "Generate a quick quiz for me",
    "Analyze and give a full review of my grade card",
    "How to manage my time efficiently",
    "Give a nice plan for this weekend",
    "Generate the flashcards for me",
  ];

  const [shuffledPrompts, setShuffledPrompts] = useState([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  useEffect(() => {
    const shuffle = (array) => {
      let currentIndex = array.length,
        randomIndex;
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }
      return array;
    };
    setShuffledPrompts(shuffle([...prompts]));
  }, []);

  useEffect(() => {
    if (shuffledPrompts.length === 0) return;
    const interval = setInterval(() => {
      setCurrentPromptIndex(
        (prevIndex) => (prevIndex + 1) % shuffledPrompts.length
      );
    }, 4000); // Cycle every 4 seconds
    return () => clearInterval(interval);
  }, [shuffledPrompts]);

  const featureList = [
    {
      id: "suggestion",
      icon: <BookOpen />,
      title: "Learning Suggestions",
      description: "Get curated study recommendations.",
    },
    {
      id: "practice",
      icon: <BrainCircuit />,
      title: "Practice Sessions",
      description: "Sharpen your skills with AI quizzes.",
    },
    {
      id: "planner",
      icon: <ListTodo />,
      title: "Study Planner",
      description: "Organize your schedule intelligently.",
    },
    {
      id: "career",
      icon: <Briefcase />,
      title: "Career Guidance",
      description: "Explore potential career paths.",
    },
    {
      id: "analysis",
      icon: <BarChart2 />,
      title: "Performance Analysis",
      description: "Visualize your academic progress.",
    },
    {
      id: "drive",
      icon: <Download />,
      title: "My Drive",
      description: "Access your cloud resources.",
    },
  ];

  const [selectedFeature, setSelectedFeature] = useState(featureList[0]);

  // --- IMPROVED Carousel Logic ---
  const AUTO_SLIDE_INTERVAL = 5000;
  const cardCount = featureList.length;

  const handleNext = () => {
    setCarouselIndex((prevIndex) => (prevIndex + 1) % cardCount);
  };
  const handlePrev = () => {
    setCarouselIndex((prevIndex) => (prevIndex - 1 + cardCount) % cardCount);
  };

  useEffect(() => {
    const slideTimer = setInterval(handleNext, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(slideTimer);
  }, [carouselIndex]);

  const handleToolSelect = (feature) => {
    setSelectedFeature(feature);
    setShowContent(true);
  };

  return (
    <DashboardLayout>
      <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* --- HERO SECTION (Unchanged) --- */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white"
          >
            Your Personal AI Study Partner
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
            className="mt-4 max-w-xl mx-auto text-slate-500 dark:text-slate-400"
          >
            Ask complex questions, get help with assignments, or explore one of
            your powerful AI tools below.
          </motion.p>
        </div>

        {/* --- MERGED: Redesigned Chat Interface --- */}
        <div className="relative mb-6">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 z-10" />
          <div className="absolute left-14 top-1/2 -translate-y-1/2 w-3/4 h-full pointer-events-none">
            <AnimatePresence>
              {!isFocused && query === "" && (
                <motion.span
                  key={currentPromptIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center text-lg text-slate-400"
                  onClick={() => setQuery(shuffledPrompts[currentPromptIndex])}
                >
                  {shuffledPrompts[currentPromptIndex]}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder=""
            className="w-full bg-white dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-700 rounded-full py-4 pl-14 pr-16 h-16 text-lg placeholder:text-transparent focus:placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all duration-300 shadow-lg"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors transform hover:scale-110">
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-12"
        >
          <ActionButton icon={<Paperclip size={14} />} label="Attach File" />
          <ActionButton icon={<ImageIcon size={14} />} label="Upload Image" />
          <ActionButton icon={<Mic size={14} />} label="Use Voice" />
        </motion.div>

        {/* --- TOOLKIT SECTION: FLUID SLIDING CAROUSEL --- */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                AI Toolkit
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-4"
              animate={{
                x: `calc(-${(carouselIndex * 100) / 3}% - ${
                  (carouselIndex * 16 * 2) / 3
                }px)`,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {featureList.map((feature) => (
                <ToolCard
                  key={feature.id}
                  {...feature}
                  isSelected={showContent && selectedFeature.id === feature.id}
                  onClick={() => handleToolSelect(feature)}
                />
              ))}
            </motion.div>
          </div>
        </div>

        {/* --- DYNAMIC CONTENT DISPLAY AREA (Unchanged) --- */}
        <AnimatePresence>
          {showContent && <FeatureDisplay feature={selectedFeature} />}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
