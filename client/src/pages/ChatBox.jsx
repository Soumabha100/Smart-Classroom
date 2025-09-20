import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const isSecure = window.location.protocol === "https:";
const SOCKET_URL = `${isSecure ? "wss" : "ws"}://${window.location.hostname}:5001`;

export default function ChatBox({ user }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL);
    setSocket(socketInstance);

    socketInstance.on("chat_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socketInstance.disconnect();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() && socket) {
      const msg = { user, text: input, timestamp: new Date().toLocaleTimeString() };
      socket.emit("chat_message", msg);
      setInput("");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">Central Chat</h2>
      <div className="h-64 overflow-y-auto mb-4 border rounded-lg p-3 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <strong className="text-blue-600">{msg.user}:</strong> {msg.text}{" "}
            <span className="text-xs text-gray-400">({msg.timestamp})</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-grow p-2 border rounded-l-md focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
