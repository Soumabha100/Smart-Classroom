import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const SOCKET_PORT = 5001;

const isSecure = window.location.protocol === "https:";

const SOCKET_URL = window.location.hostname === "localhost" 
  ? "http://localhost:5001" 
  : window.location.origin;

export default function ChatBox({ user }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // 🛑 Prevent connection if user isn't logged in yet
    if (!user) return;

    console.log(`🔌 Connecting to Socket at: ${SOCKET_URL}`);

    const socketInstance = io(SOCKET_URL, {
      transports: ["websocket", "polling"], 
      withCredentials: true, 
    });

    setSocket(socketInstance);

    // Connection Listeners
    socketInstance.on("connect", () => {
      console.log("✅ Socket Connected Successfully");
    });

    socketInstance.on("connect_error", (err) => {
      console.error("❌ Socket Connection Error:", err.message);
    });

    // Incoming Message Listener
    socketInstance.on("chat_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Cleanup on unmount
    return () => {
      console.log("🔌 Disconnecting Socket...");
      socketInstance.disconnect();
    };
  }, [user]);

  // --- AUTO-SCROLL EFFECT ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- SEND MESSAGE FUNCTION ---
  const sendMessage = () => {
    if (input.trim() && socket) {
      const msgData = {
        user, // The user's name (passed from props)
        text: input,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      // Emit to server
      socket.emit("chat_message", msgData);

      // Clear input
      setInput("");
    }
  };

  // --- RENDER ---
  return (
    <div className="mt-8 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-xl border border-slate-700">
      <h2 className="text-xl font-semibold mb-4 text-slate-100">
        Central Chat
      </h2>

      {/* Messages Area */}
      <div className="h-72 overflow-y-auto rounded-lg bg-slate-900/80 p-4 border border-slate-700">
        {messages.map((msg, idx) => {
          const isMe = msg.user === user;

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
