import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertTriangle } from 'lucide-react';
import './ChatInterface.css';

const ChatInterface = ({ initialChatMsg, setInitialChatMsg, user }) => {
  const [messages, setMessages] = useState([{
    id: 1,
    sender: 'bot',
    text: "Hello! I'm your AI Health Assistant. Please describe your symptoms.",
    isAlert: false
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (initialChatMsg) {
      setInput(initialChatMsg);
      // Clear it so it doesn't stay pre-filled forever if they switch tabs back and forth
      setInitialChatMsg(''); 
    }
  }, [initialChatMsg, setInitialChatMsg]);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveToLocalHistory = (user, userMsg, botReply, isAlert) => {
    if (!user) return;
    const key = `history_${user.email || 'guest'}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push({
      _id: 'local_' + Date.now(),
      userMessage: userMsg,
      botReply: botReply,
      recommendDoctor: isAlert,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(key, JSON.stringify(existing));
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', text: input, isAlert: false };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, userId: user?._id })
      });
      
      if (!response.ok) throw new Error('Server error');
      const data = await response.json();

      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: data.reply,
        isAlert: data.recommendDoctor
      };
      
      if (data.recommendDoctor) {
        botMessage.text = "🚨 " + botMessage.text + "\n\nRecommendation: Please visit a medical professional or hospital immediately.";
      }

      setMessages(prev => [...prev, botMessage]);
      saveToLocalHistory(user, userMessage.text, data.reply, data.recommendDoctor);
      setIsLoading(false);

    } catch (error) {
      setTimeout(() => {
        const fallbackText = getFallbackResponse(userMessage.text);
        const isAlert = userMessage.text.toLowerCase().includes('chest pain') || userMessage.text.toLowerCase().includes('bleeding');
        
        const botMessage = {
          id: Date.now() + 1,
          sender: 'bot',
          text: fallbackText,
          isAlert
        };

        if (isAlert) {
          botMessage.text = "🚨 " + botMessage.text + "\n\nRecommendation: Please visit a medical professional or hospital immediately.";
        }

        setMessages(prev => [...prev, botMessage]);
        saveToLocalHistory(user, userMessage.text, fallbackText, isAlert);
        setIsLoading(false);
      }, 1000);
    }
  };

  const getFallbackResponse = (msg) => {
    const lower = msg.toLowerCase();
    if (lower.includes('fever')) return "For a mild fever, rest and stay hydrated. If it exceeds 103°F, see a doctor.";
    if (lower.includes('chest pain')) return "🚨 Chest pain can be serious. Please seek emergency medical care immediately.";
    return "I'm a prototype virtual assistant. I understand you're experiencing symptoms. Please consult a real doctor for an accurate diagnosis.";
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <Bot className="bot-icon-header" size={24} />
        <h3>Symptom Checker Chat</h3>
        <div className="status-indicator">
          <span className="dot"></span> Online
        </div>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
            <div className={`avatar ${msg.sender}`}>
              {msg.sender === 'bot' ? <Bot size={20} /> : <User size={20} />}
            </div>
            <div className={`message-bubble ${msg.sender} ${msg.isAlert ? 'alert' : ''}`}>
              {msg.isAlert && <AlertTriangle size={16} className="alert-icon" />}
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message-wrapper bot">
            <div className="avatar bot"><Bot size={20} /></div>
            <div className="message-bubble bot typing">
              <span className="dot-typing"></span>
              <span className="dot-typing"></span>
              <span className="dot-typing"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSend}>
        <input 
          ref={inputRef}
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (input.trim() && !isLoading) {
                handleSend(e);
              }
            }
          }}
          placeholder="Type your symptoms here (e.g., 'I have a fever and headache')..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
