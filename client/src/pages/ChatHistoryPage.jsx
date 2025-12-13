import React, { useState, useCallback, useMemo } from "react";
import DashboardLayout from "../components/DashboardLayout";
import ChatHistorySidebar from "../components/Ai/ChatHistorySidebar";
import AiChat from "../components/Ai/AiChat";
import { MessageSquareText, Maximize2, X } from "lucide-react";

/**
 * Empty State Component - Displayed when no chat is selected
 */
const ChatEmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8">
    <div className="mb-6">
      <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-full inline-block">
        <MessageSquareText className="w-16 h-16 text-indigo-600 dark:text-indigo-400" />
      </div>
    </div>
    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
      Your Conversation Hub
    </h2>
    <p className="text-slate-500 dark:text-slate-400 max-w-sm">
      Select a past conversation from the sidebar to continue where you left
      off, or start a new one.
    </p>
  </div>
);

/**
 * Full Screen Chat Modal - Shows chat in expanded view
 */
const FullScreenChatModal = ({ selectedChatId, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4">
    <div className="w-full h-full max-w-6xl bg-white dark:bg-slate-950 rounded-xl overflow-hidden flex flex-col shadow-2xl">
      {/* Header with Close Button */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Full Screen Conversation
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close fullscreen"
        >
          <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
      </div>

      {/* Chat Content */}
      <div className="flex-1 overflow-hidden">
        <AiChat selectedChatId={selectedChatId} setSelectedChatId={() => {}} />
      </div>
    </div>
  </div>
);

/**
 * Chat History Page - Split-pane layout with fullscreen support
 * Features: Custom scrollbars, responsive design, fullscreen mode
 */
const ChatHistoryPage = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Memoize callbacks to prevent unnecessary re-renders
  const handleCloseFullscreen = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  const handleOpenFullscreen = useCallback(() => {
    if (selectedChatId) {
      setIsFullscreen(true);
    }
  }, [selectedChatId]);

  // Memoize sidebar props to prevent unnecessary re-renders
  const sidebarProps = useMemo(
    () => ({
      selectedChatId,
      setSelectedChatId,
    }),
    [selectedChatId]
  );

  // Memoize chat props to prevent unnecessary re-renders
  const chatProps = useMemo(
    () => ({
      selectedChatId,
      setSelectedChatId,
      onFullscreen: handleOpenFullscreen,
    }),
    [selectedChatId, handleOpenFullscreen]
  );

  return (
    <DashboardLayout>
      {/* Full-height split-pane layout with custom scrollbars */}
      <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden bg-white dark:bg-slate-950">
        {/* Sidebar Panel with Custom Scrollbar */}
        <div
          className={`
            flex-shrink-0 md:w-80 border-r border-slate-200 dark:border-slate-800 
            bg-slate-50 dark:bg-slate-900 overflow-hidden custom-scrollbar
            ${selectedChatId ? "hidden md:flex" : "flex w-full"}
          `}
        >
          <ChatHistorySidebar {...sidebarProps} />
        </div>

        {/* Chat Panel with Custom Scrollbar */}
        <div
          className={`
            flex-1 flex flex-col min-w-0 overflow-hidden custom-scrollbar
            ${!selectedChatId ? "hidden md:flex" : "flex h-full"}
          `}
        >
          {selectedChatId ? (
            <div className="flex-1 flex flex-col overflow-hidden relative">
              <AiChat {...chatProps} />

              {/* Fullscreen Button */}
              <button
                onClick={handleOpenFullscreen}
                className="absolute top-4 right-4 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white transition-all duration-200 shadow-lg z-10"
                title="Open in fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <ChatEmptyState />
          )}
        </div>
      </div>

      {/* Fullscreen Chat Modal */}
      {isFullscreen && selectedChatId && (
        <FullScreenChatModal
          selectedChatId={selectedChatId}
          onClose={handleCloseFullscreen}
        />
      )}
    </DashboardLayout>
  );
};

export default ChatHistoryPage;
