
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, Send, X, Bot, FileText, Loader2, Activity, AlertTriangle } from 'lucide-react';
import { useStore } from '../store';
import { getCaptainCritique } from '../services/geminiService';
import * as turf from '@turf/turf';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([{
    id: 'init',
    sender: 'ai',
    text: "Captain Arjun here. Tactical link established. Awaiting your coordinates for vector analysis."
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastTriggeredRisk, setLastTriggeredRisk] = useState(0);
  
  const { riskLevel, violations, droneSettings, weather, flightPath, telemetry, userApiKey } = useStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // AUTO-TRIGGER LOGIC: Force briefing if risk spikes
  useEffect(() => {
    if (riskLevel > 50 && riskLevel > lastTriggeredRisk + 5) {
        if (!isOpen) setIsOpen(true);
        handleSend("CRITICAL_ALERT: Risk assessment has exceeded safety thresholds. Requesting immediate tactical critique.");
        setLastTriggeredRisk(riskLevel);
    } else if (riskLevel < 50) {
        setLastTriggeredRisk(0);
    }
  }, [riskLevel]);

  const getFlightStats = () => {
      if (flightPath.length < 2) return undefined;
      try {
        const line = turf.lineString(flightPath.map(p => [p.lng, p.lat]));
        const distance = parseFloat(turf.length(line, { units: 'kilometers' }).toFixed(2));
        return { distance, waypoints: flightPath.length };
      } catch (e) {
          return undefined;
      }
  };

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!overrideText) setInput('');
    setIsLoading(true);

    const flightStats = getFlightStats();

    // Prioritize userApiKey from store, falling back to process.env.API_KEY in service if missing
    const aiResponseText = await getCaptainCritique(
      textToSend,
      riskLevel,
      violations,
      droneSettings,
      weather,
      flightStats,
      telemetry,
      flightPath,
      userApiKey
    );

    const aiMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: aiResponseText };
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="absolute bottom-6 right-6 z-[1000] flex flex-col items-end">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-96 h-[500px] bg-slate-900/95 backdrop-blur border border-slate-700 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center relative overflow-hidden">
            <div className="flex items-center gap-3 z-10">
              <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-aviation-orange flex items-center justify-center overflow-hidden">
                <Bot size={24} className="text-slate-300" />
              </div>
              <div>
                <h3 className="font-bold text-slate-200">Captain Arjun</h3>
                <p className="text-[10px] text-aviation-orange font-mono uppercase tracking-widest flex items-center gap-1">
                    AI Tactical Assistant
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white z-10">
              <X size={20} />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-700 flex flex-col gap-3">
             <div className="flex gap-2 overflow-x-auto custom-scrollbar">
                <button 
                    onClick={() => handleSend("Request mission briefing, Captain.")}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs font-medium text-slate-200 transition-colors whitespace-nowrap disabled:opacity-50"
                >
                    <FileText size={12} className="text-aviation-orange" />
                    Briefing
                </button>
                <button 
                    onClick={() => handleSend("Analyze current risk and safety violations.")}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs font-medium text-slate-200 transition-colors whitespace-nowrap disabled:opacity-50"
                >
                    <Activity size={12} className="text-blue-400" />
                    Risk Analysis
                </button>
             </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth custom-scrollbar">
            {!userApiKey && !process.env.API_KEY && (
               <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-[10px] text-red-400 font-mono">
                  WARNING: Tactical link compromised. Gemini API Key missing. Access systems config to restore comms.
               </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user' 
                    ? 'bg-aviation-orange text-white rounded-br-none shadow-md' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none font-mono shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex gap-3 items-center">
                  <Loader2 size={16} className="animate-spin text-aviation-orange" />
                  <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Consulting Regulations</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-slate-800/80 border-t border-slate-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Query safety officer..."
              className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-aviation-orange outline-none transition-all"
            />
            <button 
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="p-2.5 bg-aviation-orange text-white rounded-lg hover:bg-orange-600 disabled:opacity-30 transition-all shadow-md"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className={`group relative flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-full shadow-2xl border-2 ${riskLevel > 50 ? 'border-red-500 animate-pulse shadow-red-900/20' : 'border-aviation-orange'} transition-all hover:scale-105 active:scale-95`}
        >
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 font-bold text-sm tracking-wide">
            TACTICAL AI COMMAND
          </span>
          <MessageSquare size={24} />
          {riskLevel > 50 && (
              <div className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600"></span>
              </div>
          )}
        </button>
      )}
    </div>
  );
};

export default AiAssistant;
