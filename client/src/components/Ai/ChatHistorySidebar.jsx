import React, { useState, useEffect } from "react";
import { getChatHistories, deleteChatHistory } from "../../api/apiService";
import { Plus, Trash, MoreVertical } from "lucide-react";

const ChatHistorySidebar = ({ selectedChatId, setSelectedChatId }) => {
  const [chatHistories, setChatHistories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);

  // This function will be called to refresh the chat list
  const fetchChatHistories = async () => {
    try {
      const { data } = await getChatHistories();
      setChatHistories(data);
    } catch (error) {
      console.error("Failed to fetch chat histories:", error);
    }
  };

  useEffect(() => {
    fetchChatHistories();
  }, [selectedChatId]); // Refresh the list when a new chat is created

  const handleNewChat = () => {
    setSelectedChatId(null);
  };

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation(); // Prevent the click from selecting the chat
    try {
      await deleteChatHistory(chatId);
      if (selectedChatId === chatId) {
        setSelectedChatId(null);
      }
      fetchChatHistories(); // Refresh the list after deleting
    } catch (error) {
      console.error("Failed to delete chat history:", error);
    }
  };

  return (
    <div className="w-72 bg-white dark:bg-slate-800 p-4 flex flex-col border-r border-slate-200 dark:border-slate-700">
      <button
        onClick={handleNewChat}
        className="flex items-center justify-center w-full p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-semibold"
      >
        <Plus className="mr-2" size={20} />
        New Chat
      </button>
      <div className="mt-4 flex-1 overflow-y-auto space-y-2 pr-2">
        {chatHistories.map((chat) => (
          <div
            key={chat.chatId}
            className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
              selectedChatId === chat.chatId
                ? "bg-indigo-100 dark:bg-indigo-900/50"
                : "hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
            onClick={() => setSelectedChatId(chat.chatId)}
          >
            <span
              className={`truncate text-sm font-medium ${
                selectedChatId === chat.chatId
                  ? "text-indigo-700 dark:text-indigo-300"
                  : "text-slate-700 dark:text-slate-300"
              }`}
            >
              {chat.title}
            </span>
            <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(menuOpen === chat.chatId ? null : chat.chatId);
                }}
                className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600"
              >
                <MoreVertical size={16} className="text-slate-500" />
              </button>
              {menuOpen === chat.chatId && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-md shadow-lg z-10 border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={(e) => handleDeleteChat(e, chat.chatId)}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Trash className="mr-2" size={14} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistorySidebar;
