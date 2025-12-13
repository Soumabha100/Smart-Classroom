import React, { useState, useEffect, useRef } from "react";
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
  History,
  X,
  FileText,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { askAI } from "../api/apiService";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

// --- FINAL VERSION: Message Component ---
// This now correctly uses ReactMarkdown with the 'prose' class for perfect formatting.
const Message = ({ message }) => {
  const isUser = message.role === "user";
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-xl p-3 rounded-lg shadow-md ${
          isUser
            ? "bg-indigo-500 text-white"
            : "bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200"
        }`}
      >
        <div className="prose prose dark:prose-invert max-w-none">
          <ReactMarkdown>{message.parts[0].text}</ReactMarkdown>
        </div>
      </div>
      <div ref={messageEndRef} />
    </div>
  );
};

// --- Your other components (ToolCard, FeatureDisplay, etc.) are unchanged ---
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

const ActionButton = ({ icon, label, onClick, isActive }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors font-medium ${
      isActive
        ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700"
        : "bg-slate-200 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600"
    }`}
  >
    {icon} <span>{label}</span>
  </button>
);

const ThinkingComponent = ({ userQuery }) => {
  const [thinkingMessage, setThinkingMessage] = useState("Thinking...");
  const thinkingMessages = [
    "Analyzing your request...",
    "Consulting my knowledge base...",
    `Searching for information about "${userQuery}"...`,
    "Compiling the best response for you...",
    "Just a moment, formulating the answer...",
    "Cross-referencing data points...",
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % thinkingMessages.length;
      setThinkingMessage(thinkingMessages[index]);
    }, 1500);

    return () => clearInterval(interval);
  }, [userQuery]);

  return (
    <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
      <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse delay-75"></div>
      <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse delay-150"></div>
      <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse delay-250"></div>
      <span>{thinkingMessage}</span>
    </div>
  );
};

// --- The Main AI Dashboard Page ---
export default function AiDashboardPage() {
  const [query, setQuery] = useState("");
  const [currentResponse, setCurrentResponse] = useState(null);
  const [isResponding, setIsResponding] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [lastQuery, setLastQuery] = useState("");

  // File/Voice States
  const [attachment, setAttachment] = useState(null); // { file, type, name }
  const [isListening, setIsListening] = useState(false);

  const [showContent, setShowContent] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [shuffledPrompts, setShuffledPrompts] = useState([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  // Refs for hidden inputs
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

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

  useEffect(() => {
    const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);
    setShuffledPrompts(shuffle(prompts));
  }, []);

  useEffect(() => {
    if (shuffledPrompts.length === 0) return;
    const interval = setInterval(() => {
      setCurrentPromptIndex((prev) => (prev + 1) % shuffledPrompts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [shuffledPrompts]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!query.trim() && !attachment) || isResponding) return;

    const currentQuery = query;
    const chatIdToUse = uuidv4();
    setCurrentChatId(chatIdToUse);

    setLastQuery(currentQuery);
    setQuery("");
    setIsResponding(true);
    setCurrentResponse(null);

    try {
      // If attachment exists, use FormData
      if (attachment) {
        const formData = new FormData();
        formData.append("prompt", currentQuery);
        formData.append("chatId", chatIdToUse);
        formData.append("file", attachment.file);

        const { data } = await askAI(formData);
        setCurrentResponse(data.response);
      } else {
        // Regular text-only message
        const { data } = await askAI(currentQuery, chatIdToUse);
        setCurrentResponse(data.response);
      }

      clearAttachment();
    } catch (error) {
      console.error("Failed to send message", error);
      setCurrentResponse("Sorry, I encountered an error. Please try again.");
    } finally {
      setIsResponding(false);
    }
  };

  // --- Voice Input Handler ---
  const handleVoiceInput = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert(
        "Voice input is not supported in your browser. Try Chrome or Edge."
      );
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery((prev) => (prev ? prev + " " + transcript : transcript));
    };

    recognition.onerror = (event) => {
      console.error("Voice recognition error:", event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  // --- File Upload Handlers ---
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment({
        file,
        type: "file",
        name: file.name,
      });
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment({
        file,
        type: "image",
        name: file.name,
        previewUrl: URL.createObjectURL(file),
      });
    }
  };

  const clearAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleNext = () =>
    setCarouselIndex((prev) => (prev + 1) % featureList.length);
  const handlePrev = () =>
    setCarouselIndex(
      (prev) => (prev - 1 + featureList.length) % featureList.length
    );
  const handleToolSelect = (feature) => {
    setSelectedFeature(feature);
    setShowContent(true);
  };

  return (
    <DashboardLayout>
      <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* === Hidden File Inputs === */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.txt,.md,.java,.py,.js,.jsx,.ts,.tsx,.c,.cpp,.h,.cs,.json,.xml,.sql,.env"
        />
        <input
          type="file"
          ref={imageInputRef}
          className="hidden"
          onChange={handleImageSelect}
          accept="image/*"
        />

        {/* === HERO SECTION (Unchanged) === */}
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
            Ask complex questions, upload files/images, use voice, or explore
            one of your powerful AI tools below.
          </motion.p>
        </div>

        {/* === MAIN CHAT INPUT FORM === */}
        <div className="relative mb-6">
          <form onSubmit={handleSendMessage} className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 z-10" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isListening ? "Listening..." : ""}
              className={`w-full bg-white dark:bg-slate-900/50 border-2 ${
                isListening
                  ? "border-red-400 animate-pulse"
                  : "border-slate-200 dark:border-slate-700"
              } rounded-full py-4 pl-14 pr-16 h-16 text-lg placeholder:text-transparent focus:placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all duration-300 shadow-lg`}
              disabled={isResponding}
            />
            {!isFocused && query === "" && !isListening && (
              <div className="absolute left-14 top-1/2 -translate-y-1/2 w-3/4 h-full pointer-events-none">
                <AnimatePresence>
                  <motion.span
                    key={currentPromptIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center text-lg text-slate-400 cursor-text"
                    onClick={() =>
                      document.querySelector('input[type="text"]').focus()
                    }
                  >
                    {shuffledPrompts[currentPromptIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            )}
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors transform hover:scale-110 disabled:bg-indigo-300 disabled:scale-100"
              disabled={isResponding || (!query.trim() && !attachment)}
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </form>

          {/* Attachment Preview Pill */}
          {attachment && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-4 mt-2 flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-full text-xs font-medium"
            >
              {attachment.type === "image" ? (
                <ImageIcon size={14} />
              ) : (
                <FileText size={14} />
              )}
              <span className="max-w-[150px] truncate">{attachment.name}</span>
              <button
                type="button"
                onClick={clearAttachment}
                className="ml-1 hover:text-indigo-900 dark:hover:text-indigo-100"
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
        </div>

        {/* === ACTION BUTTONS AREA === */}
        <div className="flex items-center justify-center gap-3 mb-12 flex-wrap">
          <ActionButton
            icon={<Paperclip size={14} />}
            label="Attach File"
            onClick={() => fileInputRef.current?.click()}
            isActive={attachment?.type === "file"}
          />
          <ActionButton
            icon={<ImageIcon size={14} />}
            label="Upload Image"
            onClick={() => imageInputRef.current?.click()}
            isActive={attachment?.type === "image"}
          />
          <ActionButton
            icon={
              <Mic
                size={14}
                className={isListening ? "text-red-500 animate-pulse" : ""}
              />
            }
            label={isListening ? "Listening..." : "Use Voice"}
            onClick={handleVoiceInput}
            isActive={isListening}
          />
          <Link
            to="/chat-history"
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-200 dark:bg-slate-700/50 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium"
          >
            <History size={14} />
            <span>Chat History</span>
          </Link>
        </div>

        {/* === DYNAMIC RESPONSE AREA (FINAL VERSION) === */}
        <AnimatePresence>
          {(isResponding || currentResponse) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} // Start slightly lower and invisible
              animate={{ opacity: 1, y: 0 }} // Fade in and move to final position
              exit={{ opacity: 0, height: 0 }} // Fade out and collapse
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mb-12 bg-white/50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700"
            >
              {isResponding ? (
                <ThinkingComponent userQuery={lastQuery} />
              ) : (
                <div className="prose prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{currentResponse || ""}</ReactMarkdown>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* === AI TOOLKIT SECTION (Unchanged) === */}
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
        <AnimatePresence>
          {showContent && <FeatureDisplay feature={selectedFeature} />}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
