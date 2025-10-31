import React, { useState } from "react";
import { Send, MessageCircle } from "lucide-react";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 I'm your AI Assistant. How can I help?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages([...messages, newMessage]);

    // Mock AI response (replace later with API call)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `🤖 AI is thinking about "${input}"...` },
      ]);
    }, 1000);

    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 dark:bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-300"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 h-96 bg-white dark:bg-slate-800 shadow-xl dark:shadow-slate-900/50 rounded-2xl flex flex-col overflow-hidden border dark:border-slate-700">
          {/* Header */}
          <div className="bg-blue-600 dark:bg-blue-500 text-white p-3 flex justify-between items-center">
            <h2 className="font-semibold">AI Assistant</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-700 dark:hover:bg-blue-600 rounded-lg p-1 transition-colors duration-200"
            >
              ✖
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 dark:text-white">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.sender === "user"
                    ? "ml-auto bg-blue-100 dark:bg-blue-500/20 text-right"
                    : "bg-gray-100 dark:bg-slate-700"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-2 border-t dark:border-slate-700 flex items-center gap-2">
            <input
              type="text"
              className="flex-1 border dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 dark:bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
