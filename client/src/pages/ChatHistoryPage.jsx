import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import ChatHistorySidebar from "../components/Ai/ChatHistorySidebar";
import AiChat from "../components/Ai/AiChat";

/**
 * This is the new, dedicated page for viewing and continuing all past conversations.
 * It features the professional sidebar layout you requested.
 */
const ChatHistoryPage = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-80px)]">
        {" "}
        {/* Adjusts height to fit within your layout */}
        {/* The dynamic sidebar for navigating chat histories */}
        <ChatHistorySidebar
          selectedChatId={selectedChatId}
          setSelectedChatId={setSelectedChatId}
        />
        {/* The chat window for viewing and continuing conversations */}
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
          <AiChat
            selectedChatId={selectedChatId}
            setSelectedChatId={setSelectedChatId}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChatHistoryPage;
