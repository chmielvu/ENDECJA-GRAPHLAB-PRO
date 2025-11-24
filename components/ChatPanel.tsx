import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, Sparkles, User, Bot } from 'lucide-react';
import { sendMessageToDmowski } from '../services/geminiService';
import { ChatMessage } from '../types';

interface ChatPanelProps {
  onNodeSelect: (id: string) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ onNodeSelect }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'model', text: "Witam Szanownego Państwa. Nazywam się Roman Dmowski. Służę wyjaśnieniem meandór polskiej polityki.", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Convert history for API
    const history = messages.map(m => ({ role: m.role, parts: m.text }));
    const response = await sendMessageToDmowski(history, userMsg.text);

    const modelMsg: ChatMessage = { 
      id: (Date.now() + 1).toString(), 
      role: 'model', 
      text: response, 
      timestamp: Date.now() 
    };
    
    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 border-l border-zinc-700">
      {/* Header */}
      <div className="p-4 border-b border-zinc-700 bg-zinc-900 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-amber-600 flex items-center justify-center overflow-hidden">
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Roman_Dmowski_1919.jpg" alt="Dmowski" className="w-full h-full object-cover sepia" />
        </div>
        <div>
          <h2 className="text-amber-500 font-serif font-bold text-lg leading-none">Roman Dmowski</h2>
          <span className="text-zinc-500 text-xs font-mono">Dostępny (Paryż, 1919)</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg p-3 text-sm font-serif leading-relaxed shadow-lg ${
              msg.role === 'user' 
                ? 'bg-zinc-800 text-zinc-200 border border-zinc-600' 
                : 'bg-zinc-950 text-amber-50/90 border border-amber-900/50'
            }`}>
               {msg.role === 'model' && <div className="text-amber-600 text-[10px] font-mono mb-1 tracking-widest uppercase">Telegram dyplomatyczny</div>}
               {msg.text.split('\n').map((line, i) => <p key={i} className="mb-1">{line}</p>)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-950 border border-amber-900/30 p-3 rounded-lg flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
              <span className="text-zinc-500 text-xs font-mono">Myślenie analityczne...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-zinc-900 border-t border-zinc-700">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Zapytaj o Polskę lub Ligę Narodową..."
            className="w-full bg-zinc-950 border border-zinc-700 text-zinc-200 p-3 pr-12 rounded-sm focus:outline-none focus:border-amber-600 font-mono text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="absolute right-2 top-2 p-1 hover:bg-zinc-800 rounded text-amber-500 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="flex justify-between items-center mt-2 px-1">
             <div className="flex gap-2">
                <button className="text-zinc-500 hover:text-zinc-300 transition-colors" title="Live Voice Mode">
                    <Mic size={16} />
                </button>
             </div>
             <span className="text-[10px] text-zinc-600 font-mono">GEMINI 3 PRO • THINKING MODE ACTIVE</span>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
