import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import Footer from "../components/Footer";

function TenantLanding() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "👋 Welcome to Settlr AI! I'm your personal rental assistant. I can help you find the perfect property based on your preferences. What kind of rental are you looking for?",
      time: "Just now"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Auto-resize textarea hook
  const textareaRef = useRef(null);
  const minHeight = 60;
  const maxHeight = 200;

  const adjustHeight = useCallback((reset) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    if (reset) {
      textarea.style.height = `${minHeight}px`;
      return;
    }

    textarea.style.height = `${minHeight}px`;
    const newHeight = Math.max(minHeight, Math.min(textarea.scrollHeight, maxHeight));
    textarea.style.height = `${newHeight}px`;
  }, [minHeight, maxHeight]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  const quickSuggestions = [
    "Show me 2BHK apartments in Bengaluru under ₹20,000",
    "Find pet-friendly rentals near metro stations",
    "What are the best neighborhoods for students?",
    "Show properties with parking available",
    "Find furnished apartments for couples"
  ];

  const handleSendMessage = (text) => {
    if (text.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        text: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setInputValue("");
      adjustHeight(true);
      
      // Simulate AI typing
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const aiResponse = {
          id: messages.length + 2,
          type: 'ai',
          text: "🔍 I'm searching for properties that match your criteria. Let me analyze the available listings and find the best options for you...",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 2000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) {
        handleSendMessage(inputValue);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden animate-page-enter">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-transparent via-[#26f50c]/10 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-transparent via-gray-200/20 to-transparent rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-[#26f50c]/5 via-transparent to-gray-100/10 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10 flex-grow flex flex-col">
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={() => navigate("/landing")}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-800 transition-all duration-200 hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        {/* Vercel-style Chat Container */}
        <div className="flex-grow flex items-start justify-center px-4 pt-16 pb-8 animate-fade-in-up">
          <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
            <h1 className="text-4xl font-bold text-black dark:text-white text-center animate-fade-in-up-delay-1">
              What can I help you find?
            </h1>

            <div className="w-full animate-fade-in-up-delay-2">
              <div className="relative bg-white rounded-2xl border border-emerald-200 shadow-2xl overflow-hidden">
                {/* Chat Header */}
                <div className="bg-white/80 backdrop-blur-sm px-6 py-4 border-b border-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <h2 className="text-gray-900 font-semibold">Settlr AI Assistant</h2>
                    <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">Online</span>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="overflow-y-auto max-h-96 p-6 space-y-4 bg-white">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                      <div className={`max-w-lg ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                        <div className={`px-4 py-3 rounded-2xl shadow-lg ${
                          message.type === 'user' 
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-500/90 text-white rounded-br-none font-medium' 
                            : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 rounded-bl-none border border-gray-300'
                        }`}>
                          <p className="text-sm leading-relaxed">{message.text}</p>
                        </div>
                        <p className={`text-xs text-gray-500 mt-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start animate-fade-in">
                      <div className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 rounded-2xl rounded-bl-none border border-gray-300 px-4 py-3 shadow-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-emerald-100">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105 group"
                    >
                      <svg className="w-5 h-5 text-gray-500 group-hover:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </button>
                    
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me anything about rentals..."
                        className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                      />
                    </div>
                    
                    <button
                      type="button"
                      className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
                        inputValue.trim() 
                          ? "bg-emerald-500 text-white shadow-lg hover:shadow-xl hover:bg-emerald-600" 
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                      onClick={() => handleSendMessage(inputValue)}
                      disabled={!inputValue.trim()}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Quick Suggestions */}
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {quickSuggestions.slice(0, 3).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(suggestion)}
                        className="px-3 py-1 bg-white hover:bg-emerald-50 text-gray-600 text-xs rounded-full border border-emerald-200 hover:border-emerald-300 transition-all duration-200 hover:scale-105"
                      >
                        {suggestion.length > 40 ? suggestion.substring(0, 40) + '...' : suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TenantLanding;
