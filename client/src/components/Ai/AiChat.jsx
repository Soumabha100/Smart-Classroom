import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowUp, Paperclip, Mic, FileText, Image as ImageIcon } from 'lucide-react';

// Reusable action button component
const ActionButton = ({ icon, label }) => (
  <motion.button 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700/50 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
  >
    {icon}
    <span>{label}</span>
  </motion.button>
);

export default function AiChat() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      
      {/* Main Search/Chat Input Area */}
      <motion.div 
        layout 
        className="w-full"
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className={`relative w-full transition-all duration-300 ${isFocused ? 'mb-4' : 'mb-8'}`}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask anything or start a new topic..."
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-14 h-16 text-lg placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow focus:shadow-xl focus:shadow-indigo-500/10"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors transform hover:scale-110 disabled:scale-100">
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
      
      {/* Action Buttons Below Search Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isFocused ? 0 : 1, y: isFocused ? -10 : 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-3"
      >
        <ActionButton icon={<Paperclip size={16} />} label="Attach File" />
        <ActionButton icon={<FileText size={16} />} label="Focus on Writing" />
        <ActionButton icon={<ImageIcon size={16} />} label="Generate Image" />
        <ActionButton icon={<Mic size={16} />} label="Use Microphone" />
      </motion.div>

      {/* Placeholder for AI Response (this will be built out later) */}
      <div className="mt-12 text-center">
        <p className="text-slate-400 dark:text-slate-500">
          Your conversation with the AI will appear here.
        </p>
      </div>
    </div>
  );
}