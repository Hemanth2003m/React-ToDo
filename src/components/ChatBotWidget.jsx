import React, { useState } from "react";
import ChatBot from "./ChatBot"; // Chatbot UI component
import "./ChatBotButton.css";

export default function ChatBotWidget() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Floating Chatbot Button */}
      <div className="chatbot-button" onClick={() => setIsChatOpen(!isChatOpen)}>
        💬
      </div>

      {/* Chatbot Window */}
      {isChatOpen && <ChatBot onClose={() => setIsChatOpen(false)} />}
    </>
  );
}
