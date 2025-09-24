import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./ChatBot.css";

export default function ChatBot({ onClose }) {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setChatHistory([...chatHistory, { user: message }]);
    setIsTyping(true);
    setMessage("");

    try {
      const res = await axios.get(
        `http://localhost:8080/chat/${encodeURIComponent(message)}`
      );

      setChatHistory((prev) => [...prev, { bot: res.data }]);
    } catch (error) {
      console.error(error);
      setChatHistory((prev) => [...prev, { bot: "Error getting response." }]);
    }

    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chatbot-window">
      <div className="chatbot-header">
        Chatbot
        <button onClick={onClose}>✖</button>
      </div>

      <div className="chatbot-body">
        {chatHistory.map((chat, index) => (
          <div key={index}>
            {chat.user && <div className="user-message">{chat.user}</div>}
            {chat.bot && <div className="bot-message">{chat.bot}</div>}
          </div>
        ))}
        {isTyping && <div className="bot-message typing">Typing...</div>}
        <div ref={chatEndRef} />
      </div>

      <div className="chatbot-footer">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
        />
       <button 
  className="send-btn" 
  onClick={sendMessage} 
  style={{ display: message.trim() ? "flex" : "none" }}
>
  ➤
</button>

      </div>
    </div>
  );
}
