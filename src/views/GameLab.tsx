import { useState, useRef, useEffect } from 'react';
import { Send, User, Calculator, BrainCircuit, Terminal } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import type { Message } from '../context/AppContext';

export default function GameLab() {
  const { navigateTo, chatMessages, addMessage, showEstimateButton, setShowEstimateButton, setIsGeneratingGame } = useAppContext();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isLoading]);

  const fetchAIResponse = async (userText: string, messageHistory: Message[]) => {
    const apiKey = import.meta.env.VITE_AI_API_KEY;
    
    if (!apiKey) {
      // Fallback mock if no API key is provided
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (messageHistory.length < 3) {
        return "That's a very interesting concept. Tell me more about the core mechanics and visual style you want to achieve.";
      }
      setShowEstimateButton(true);
      return "Got it! I have enough details to put together a plan. Let's check out the generation estimate whenever you're ready.";
    }

    try {
      // Gemini API format
      let formattedHistory = messageHistory.map(msg => ({
        role: msg.sender === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));
      
      // Gemini strictly requires the first message to be from a 'user'. 
      // If the initial greeting is 'model', we must drop it or prepend a dummy user message.
      if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
        formattedHistory.shift(); 
      }
      
      // Add current user message
      formattedHistory.push({ role: 'user', parts: [{ text: userText }] });

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: formattedHistory,
          systemInstruction: {
            role: 'system',
            parts: [{ text: "You are Croevo AI, a game creation assistant. Ask clarifying questions about game design. Be concise. After 2 or 3 exchanges, tell the user you have enough details to generate an estimate." }]
          }
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error("Gemini API Error:", data);
        return `Gemini API Error: ${data.error?.message || response.statusText}`;
      }

      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
      }
      return "I encountered an unknown error analyzing your request.";
    } catch (error) {
      console.error("API Error:", error);
      return "I encountered a network error while connecting to NATAD Tech servers.";
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    
    // Intent detection for generating estimate
    if (/estimate|proceed|cost|finish|generate|ready/i.test(userText)) {
      setIsGeneratingGame(true);
      setTimeout(() => {
        setIsGeneratingGame(false);
        navigateTo('estimate');
      }, 1500);
      return;
    }

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: userText };
    addMessage(userMsg);
    setInput('');
    setIsLoading(true);
    
    const aiText = await fetchAIResponse(userText, chatMessages);
    
    const aiMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: aiText };
    addMessage(aiMsg);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 animate-in fade-in zoom-in-95 duration-700 h-full relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Terminal className="text-brand-neon animate-pulse" size={28} />
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Game Lab</h2>
        </div>
        <button 
          onClick={() => navigateTo('estimate')}
          className="px-4 py-2 bg-brand-deep border border-brand-neon hover:bg-brand-neon text-white font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(0,119,182,0.4)]"
        >
          Finish & Estimate
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pb-6 scrollbar-hide pr-2">
        {chatMessages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`flex max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-surface-dark border border-brand-deep ml-3' : 'bg-brand-deep border border-brand-neon text-brand-neon mr-3 shadow-[0_0_10px_rgba(217,70,239,0.3)]'}`}>
                {msg.sender === 'user' ? <User size={16} className="text-gray-300" /> : <BrainCircuit size={16} />}
              </div>
              <div className={`p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-brand-deep/40 border border-brand-neon/30 text-white' : 'bg-surface-dark border border-brand-deep text-gray-300'} whitespace-pre-wrap`}>
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-in fade-in">
            <div className="flex flex-row max-w-[85%]">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-deep border border-brand-neon text-brand-neon mr-3 flex items-center justify-center shadow-[0_0_15px_rgba(217,70,239,0.5)]">
                <BrainCircuit size={16} className="animate-pulse" />
              </div>
              <div className="p-4 rounded-2xl bg-surface-dark border border-brand-deep text-brand-neon flex items-center space-x-2">
                <span className="animate-pulse">Processing via NATAD Tech</span>
                <span className="flex space-x-1">
                  <span className="w-1.5 h-1.5 bg-brand-neon rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-brand-neon rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-brand-neon rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="pt-4 border-t border-brand-deep">
        {showEstimateButton && (
          <div className="mb-4 flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <p className="text-xs text-brand-neon mb-2 uppercase tracking-widest font-semibold flex items-center">
              <Calculator className="mr-2" size={14} /> 
              Powered by NATAD Tech Calculation
            </p>
            <button 
              onClick={() => navigateTo('estimate')}
              className="flex items-center px-8 py-4 bg-gradient-to-r from-brand-neon to-brand-neon-dark text-background-black font-bold rounded-xl hover:from-brand-neon-light hover:to-brand-neon transition-all shadow-[0_0_30px_-5px_rgba(217,70,239,0.6)] hover:scale-105"
            >
              Generate Cost Estimate
            </button>
          </div>
        )}
        
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Detail your game mechanics..."
            disabled={isLoading}
            className="w-full bg-surface-dark border border-brand-deep text-white rounded-xl pl-4 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-brand-neon/50 transition-all placeholder:text-gray-600 disabled:opacity-50"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 p-2 bg-brand-deep text-brand-neon border border-brand-neon/30 rounded-lg hover:bg-brand-neon/20 hover:text-white disabled:opacity-50 disabled:grayscale transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
