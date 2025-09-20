import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import ChatHistorySidebar from "../components/Ai/ChatHistorySidebar";
import AiChat from "../components/Ai/AiChat";
import { MessageSquareText } from "lucide-react";

/**
 * A professional placeholder component to display when no chat is selected.
 * This is a standard UX pattern in enterprise applications.
 */
const ChatEmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
    <div className="bg-indigo-100 dark:bg-indigo-900/50 p-4 rounded-full mb-4">
      <MessageSquareText className="w-10 h-10 text-indigo-600 dark:text-indigo-300" />
    </div>
    <h2 className="text-xl font-bold text-slate-800 dark:text-white">
      Your Conversation Hub
    </h2>
    <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-xs">
      Select a past conversation from the sidebar to continue where you left
      off, or start a new one.
    </p>
  </div>
);

/**
 * The redesigned, dedicated page for viewing and continuing all past conversations.
 * It features a balanced, enterprise-level design with a responsive layout.
 */
const ChatHistoryPage = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);

  return (
    <DashboardLayout>
      <div className="bg-slate-100 dark:bg-slate-900 h-[calc(100vh-80px)] flex flex-col">
        {/* Page Header */}
        <header className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Conversation History
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Review, continue, or manage your past conversations with the AI.
          </p>
        </header>

        {/* Main Content Area with Optimized Layout */}
        <div className="flex-grow flex flex-col md:flex-row p-4 sm:p-6 lg:p-8 gap-6 overflow-hidden">
          {/* --- THE FIX: Sidebar with Constrained and Responsive Width --- */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 h-full">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 h-full">
              <ChatHistorySidebar
                selectedChatId={selectedChatId}
                setSelectedChatId={setSelectedChatId}
              />
            </div>
          </div>

          {/* --- The Chat Window now correctly takes up the remaining space --- */}
          <div className="flex-1 flex flex-col overflow-hidden h-full">
            {selectedChatId ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 h-full">
                <AiChat
                  selectedChatId={selectedChatId}
                  setSelectedChatId={setSelectedChatId}
                />
              </div>
            ) : (
              <ChatEmptyState />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChatHistoryPage;
