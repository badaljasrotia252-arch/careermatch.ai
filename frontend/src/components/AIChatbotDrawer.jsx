import React, { useState, useRef, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  MessageSquare, 
  User, 
  ChevronRight, 
  HelpCircle,
  Lightbulb,
  CornerDownLeft
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  "Which jobs are suitable for my skills?",
  "What skills should I learn for Data Science?",
  "How can I improve my resume?",
  "What internships should I apply for?",
  "What should I learn to become a Data Engineer?",
  "Why am I not getting shortlisted?"
];

export default function AIChatbotDrawer() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! 👋 I am **CareerMate AI**, your personal career strategist.\n\nI can analyze your skills, recommend matching roles, identify missing skills, or review your resume strategy. How can I help you today?`,
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query || !query.trim() || loading) return;

    const userMsg = {
      sender: 'user',
      text: query.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.chatWithCareerMate(query.trim());
      const botMsg = {
        sender: 'bot',
        text: res.message,
        suggestions: res.suggestions,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: "I apologize, but I am momentarily experiencing high traffic. Please try again shortly!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Glowing Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-semibold shadow-2xl shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all border border-indigo-400/30"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-300 animate-ping"></span>
            </div>
            <span className="text-sm font-heading font-bold tracking-tight">CareerMate AI</span>
            <Sparkles className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
          </button>
        )}
      </div>

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-black/80 overflow-hidden animate-fade-in backdrop-blur-xl">
          
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-indigo-900/90 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-heading">
                  CareerMate AI
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">Smart Career & Recommendation Advisor</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts Carousel Bar */}
          <div className="px-3 py-2 bg-slate-950/60 border-b border-slate-800/60 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
            <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1 flex-shrink-0">
              <Lightbulb className="w-3 h-3 text-amber-400" /> Prompts:
            </span>
            {SUGGESTED_QUESTIONS.slice(0, 3).map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="text-[11px] text-slate-300 hover:text-white bg-slate-800/80 hover:bg-indigo-900/60 border border-slate-700/60 rounded-full px-2.5 py-1 whitespace-nowrap transition-colors flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-xl p-3 leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-none'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none shadow-sm'
                }`}>
                  <div className="whitespace-pre-line text-xs font-normal">
                    {msg.text}
                  </div>

                  {/* Follow-up suggestions if returned */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-700/50 flex flex-col gap-1">
                      <span className="text-[10px] font-semibold text-slate-400">Suggested questions:</span>
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(sug)}
                          className="text-[11px] text-left text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
                        >
                          <ChevronRight className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                          <span>{sug}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className={`text-[9px] mt-1.5 opacity-60 text-right ${msg.sender === 'user' ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {msg.time}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce delay-150"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce delay-300"></span>
                  <span className="text-[11px] ml-1 text-slate-400 font-medium">Analyzing career trends...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about roles, skills, or resume..."
              className="input-field text-xs py-2 px-3 flex-1"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-primary p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
