import React, { useState, useEffect, useRef } from "react";
import { socket } from "../api/socket"; // ✅ Import the shared socket instance

export default function ChatBox({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const handleMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    // Attach listeners
    socket.on("chat_message", handleMessage);

    // Cleanup listeners on unmount
    return () => {
      socket.off("chat_message", handleMessage);
    };
  }, [user]);

  // --- AUTO-SCROLL EFFECT ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- SEND MESSAGE FUNCTION ---
  const sendMessage = () => {
    if (input.trim()) {
      const msgData = {
        user: user.name || user, // Handle object or string
        text: input,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      // Emit using the shared socket
      socket.emit("chat_message", msgData);
      setInput("");
    }
  };

  return (
    <div className="mt-8 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-xl border border-slate-700">
      <h2 className="text-xl font-semibold mb-4 text-slate-100">
        Central Chat
      </h2>

      {/* Messages Area */}
      <div className="h-72 overflow-y-auto rounded-lg bg-slate-900/80 p-4 border border-slate-700">
        {messages.map((msg, idx) => {
          const isMe = msg.user === (user.name || user);

          return (
            <div
              key={idx}
              className={`mb-3 flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs md:max-w-sm px-4 py-2 rounded-lg text-sm transition-all
                ${
                  isMe
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-slate-800 text-slate-200 rounded-bl-none"
                }`}
              >
                {!isMe && (
                  <div className="text-xs text-indigo-400 font-semibold mb-1">
                    {msg.user}
                  </div>
                )}

                <div>{msg.text}</div>

                <div className="text-[10px] text-slate-400 text-right mt-1">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex mt-4">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-grow rounded-l-lg bg-slate-800 text-slate-100 px-4 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="rounded-r-lg bg-indigo-600 px-5 py-2 text-white font-medium hover:bg-indigo-700 disabled:bg-slate-700 disabled:text-slate-500 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
