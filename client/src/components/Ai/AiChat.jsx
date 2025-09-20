import React, { useState, useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import { askAI, getChatHistory } from "../../api/apiService";
import ReactMarkdown from "react-markdown";
import { v4 as uuidv4 } from "uuid";

// Reusable Message Bubble with Typography styling
const Message = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-2xl px-4 py-2 rounded-xl shadow-md ${
          isUser
            ? "bg-indigo-600 text-white"
            : "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
        }`}
      >
        {/* The 'prose' class applies all the beautiful formatting */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{message.parts[0].text}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

// Main AI Chat Component
const AiChat = ({ selectedChatId, setSelectedChatId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (selectedChatId) {
      const loadHistory = async () => {
        setIsLoading(true);
        try {
          const { data } = await getChatHistory(selectedChatId);
          setMessages(data.history);
        } catch (error) {
          console.error("Failed to fetch chat history", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadHistory();
    } else {
      setMessages([]);
    }
  }, [selectedChatId]);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", parts: [{ text: input }] };
    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const chatId = selectedChatId || uuidv4();
      if (!selectedChatId) {
        setSelectedChatId(chatId);
      }
      const { data } = await askAI(currentInput, chatId);
      const aiMessage = { role: "model", parts: [{ text: data.response }] };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div ref={chatContainerRef} className="flex-grow overflow-y-auto pr-4">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start mb-4">
            <div className="max-w-xl p-3 rounded-lg shadow-md bg-white dark:bg-slate-700">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse delay-75"></div>
                <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse delay-250"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="mt-4 flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white p-3 rounded-r-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
          disabled={isLoading || !input.trim()}
        >
          <FiSend size={20} />
        </button>
      </form>
    </div>
  );
};

export default AiChat;
