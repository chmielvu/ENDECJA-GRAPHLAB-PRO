import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { useGraphStore } from '../store/useGraphStore';
import { sendMessageToDmowski } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatPanel: React.FC = () => {
  const { addNodesFromAI, data } = useGraphStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'model', text: "Jestem do usług. O czym Waść chcesz rozmawiać? O Wersalu? O Żydach? O Niemcach?", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { id: Date.now().toString(), role: 'user' as const, text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare context
    const nodeNames = data.nodes.map(n => n.label).join(", ");
    const context = `Obecne węzły w grafie: ${nodeNames}`;

    const { text, graphUpdates } = await sendMessageToDmowski(
      messages.map(m => ({ role: m.role, parts: m.text })), 
      userMsg.text,
      context
    );

    if (graphUpdates) {
      addNodesFromAI(graphUpdates.newNodes, graphUpdates.newEdges);
      const updateMsg = { 
        id: Date.now().toString() + 'sys', 
        role: 'model' as const, 
        text: `[SYSTEM] Dodano do grafu: ${graphUpdates.newNodes.length} węzłów.`, 
        timestamp: Date.now() 
      };
      setMessages(prev => [...prev, updateMsg]);
    }

    const modelMsg = { 
      id: (Date.now() + 1).toString(), 
      role: 'model' as const, 
      text: text, 
      timestamp: Date.now() 
    };
    
    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 border-l border-zinc-700 font-serif">
      <div className="p-4 border-b border-zinc-700 flex items-center gap-3 bg-zinc-900">
        <div className="w-10 h-10 rounded-full border-2 border-amber-600 overflow-hidden sepia">
           <img src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Roman_Dmowski_1919.jpg" alt="Dmowski" />
        </div>
        <div>
           <h2 className="text-amber-500 font-bold">Roman Dmowski</h2>
           <span className="text-zinc-500 text-xs font-mono">AI PERSONA • 3.0 PRO</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-sm p-3 text-sm leading-relaxed border ${
              msg.role === 'user' 
                ? 'bg-zinc-800 text-zinc-200 border-zinc-600' 
                : 'bg-zinc-950 text-amber-50/90 border-amber-900/40'
            }`}>
               {msg.role === 'model' && <div className="text-amber-600/50 text-[10px] font-mono mb-1">TELEGRAM</div>}
               {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2 text-amber-500 items-center p-2 text-xs font-mono">
            <Sparkles className="w-4 h-4 animate-spin" /> Dmowski myśli...
          </div>
        )}
      </div>

      <div className="p-4 border-t border-zinc-700 bg-zinc-900">
        <div className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Zapytaj o Polskę..."
            className="w-full bg-zinc-950 border border-zinc-700 text-zinc-300 p-3 pr-10 rounded-sm focus:border-amber-600 outline-none font-mono text-sm"
          />
          <button onClick={handleSend} className="absolute right-2 top-2 text-amber-600 hover:text-amber-500">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;