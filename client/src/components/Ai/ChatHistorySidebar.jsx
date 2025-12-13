import React, { useState, useEffect, useCallback, useMemo } from "react";
import { getChatHistories, deleteChatHistory } from "../../api/apiService";
import { Plus, Trash2, MoreVertical, MessageSquare } from "lucide-react";

const ChatHistorySidebar = ({ selectedChatId, setSelectedChatId }) => {
  const [chatHistories, setChatHistories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch chat histories
  const fetchChatHistories = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await getChatHistories();
      setChatHistories(data || []);
    } catch (error) {
      console.error("Failed to fetch chat histories:", error);
      setChatHistories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount and when selectedChatId changes
  useEffect(() => {
    fetchChatHistories();
  }, [selectedChatId, fetchChatHistories]);

  // Handle new chat
  const handleNewChat = useCallback(() => {
    setSelectedChatId(null);
    setMenuOpen(null);
  }, [setSelectedChatId]);

  // Handle delete chat
  const handleDeleteChat = useCallback(
    async (e, chatId) => {
      e.stopPropagation();
      try {
        await deleteChatHistory(chatId);
        if (selectedChatId === chatId) {
          setSelectedChatId(null);
        }
        await fetchChatHistories();
        setMenuOpen(null);
      } catch (error) {
        console.error("Failed to delete chat history:", error);
      }
    },
    [selectedChatId, setSelectedChatId, fetchChatHistories]
  );

  // Handle menu toggle
  const handleMenuToggle = useCallback(
    (e, chatId) => {
      e.stopPropagation();
      setMenuOpen(menuOpen === chatId ? null : chatId);
    },
    [menuOpen]
  );

  // Handle chat selection
  const handleSelectChat = useCallback(
    (chatId) => {
      setSelectedChatId(chatId);
      setMenuOpen(null);
    },
    [setSelectedChatId]
  );

  // Close menu when clicking outside
  useEffect(() => {
    const closeMenu = () => setMenuOpen(null);
    if (menuOpen) {
      document.addEventListener("click", closeMenu);
      return () => document.removeEventListener("click", closeMenu);
    }
  }, [menuOpen]);

  // Memoize chat list rendering
  const chatListContent = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
      );
    }

    if (chatHistories.length === 0) {
      return (
        <div className="text-center py-12 px-4">
          <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No conversations yet
          </p>
        </div>
      );
    }

    return chatHistories.map((chat) => (
      <ChatHistoryItem
        key={chat.chatId}
        chat={chat}
        isSelected={selectedChatId === chat.chatId}
        isMenuOpen={menuOpen === chat.chatId}
        onSelect={handleSelectChat}
        onMenuToggle={handleMenuToggle}
        onDelete={handleDeleteChat}
      />
    ));
  }, [
    isLoading,
    chatHistories,
    selectedChatId,
    menuOpen,
    handleSelectChat,
    handleMenuToggle,
    handleDeleteChat,
  ]);

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-900">
      {/* Header Section */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 bg-white dark:bg-slate-900">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
          Chat History
        </h2>
        <button
          onClick={handleNewChat}
          className="flex items-center justify-center w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white font-medium text-sm transition-all duration-200 shadow-sm"
        >
          <Plus className="mr-2 w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Chat List with Custom Scrollbar */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
        {chatListContent}
      </div>
    </div>
  );
};

/**
 * Memoized Chat History Item Component
 * Prevents unnecessary re-renders of individual chat items
 */
const ChatHistoryItem = React.memo(
  ({ chat, isSelected, isMenuOpen, onSelect, onMenuToggle, onDelete }) => {
    return (
      <div
        onClick={() => onSelect(chat.chatId)}
        className={`
        group relative flex items-center justify-between p-3 rounded-lg cursor-pointer 
        transition-all duration-200 border border-transparent
        ${
          isSelected
            ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/50"
            : "hover:bg-slate-100 dark:hover:bg-slate-800/50"
        }
      `}
      >
        {/* Chat Title with Icon */}
        <div className="flex items-center min-w-0 flex-1 mr-2">
          <MessageSquare
            size={16}
            className={`flex-shrink-0 mr-3 transition-colors ${
              isSelected
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-400 dark:text-slate-500"
            }`}
          />
          <span
            className={`truncate text-sm font-medium transition-colors ${
              isSelected
                ? "text-slate-900 dark:text-white"
                : "text-slate-700 dark:text-slate-300"
            }`}
            title={chat.title}
          >
            {chat.title || "Untitled Conversation"}
          </span>
        </div>

        {/* Delete Menu Button */}
        <div className="relative">
          <button
            onClick={(e) => onMenuToggle(e, chat.chatId)}
            className={`
            p-1 rounded-md transition-all duration-200
            ${
              isSelected || isMenuOpen
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            }
            hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400
          `}
            title="More options"
          >
            <MoreVertical size={16} />
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => onDelete(e, chat.chatId)}
                className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="mr-2 w-4 h-4" />
                Delete Chat
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ChatHistoryItem.displayName = "ChatHistoryItem";

export default ChatHistorySidebar;
