import React, { useState, useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import { fetchChatHistory, sendChatMessage } from "../../api/apiService";
import { useAuth } from "../../context/AuthContext";

// A reusable component for rendering a single message bubble
const Message = ({ message }) => {
  const isUser = message.role === "user";
  const messageEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  // Simple renderer for bold text (e.g., **text**)
  const renderText = (text) => {
    return text
      .split("**")
      .map((part, index) =>
        index % 2 === 1 ? <strong key={index}>{part}</strong> : part
      );
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-xl p-3 rounded-lg shadow-md ${
          isUser
            ? "bg-indigo-500 text-white"
            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">
          {renderText(message.parts[0].text)}
        </p>
      </div>
      <div ref={messageEndRef} />
    </div>
  );
};

// The main AI Chat Component
const AiChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  // Fetch chat history when the component first loads
  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      try {
        const history = await fetchChatHistory();
        setMessages(history);
      } catch (error) {
        console.error("Failed to fetch chat history", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadHistory();
  }, []);

  // Scroll chat container to the bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle form submission
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", parts: [{ text: input }] };
    setMessages((prev) => [...prev, userMessage]); // Optimistically update UI
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const data = await sendChatMessage(currentInput);
      const aiMessage = { role: "model", parts: [{ text: data.response }] };
      setMessages((prev) => [...prev.slice(0, -1), userMessage, aiMessage]); // Replace optimistic update with final
    } catch (error) {
      console.error("Failed to send message", error);
      const errorMessage = {
        role: "model",
        parts: [{ text: "Sorry, I encountered an error. Please try again." }],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white border-b pb-2">
        IntelliClass AI Assistant
      </h2>

      <div ref={chatContainerRef} className="flex-grow overflow-y-auto pr-2">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start mb-4">
            <div className="max-w-xl p-3 rounded-lg shadow-md bg-gray-200 dark:bg-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse delay-75"></div>
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse delay-250"></div>
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
          placeholder="Ask me anything about your studies..."
          className="flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-indigo-500 text-white p-3 rounded-r-lg hover:bg-indigo-600 disabled:bg-indigo-300 transition-colors"
          disabled={isLoading || !input.trim()}
        >
          <FiSend size={20} />
        </button>
      </form>
    </div>
  );
};

export default AiChat;
