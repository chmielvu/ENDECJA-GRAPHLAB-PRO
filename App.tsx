import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_DATA, TIMELINE_EVENTS } from './constants';
import { GraphData, Node, Myth, AppMode } from './types';
import GraphCanvas from './components/GraphCanvas';
import ChatPanel from './components/ChatPanel';
import { calculateCentrality, detectCommunities } from './services/graphMath';
import { ShieldAlert, BookOpen, Clock, AlertTriangle, CheckCircle, Network, Search, X } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<GraphData>(INITIAL_DATA);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [mode, setMode] = useState<AppMode>(AppMode.EXPLORE);
  const [activeMyth, setActiveMyth] = useState<Myth | null>(null);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);

  // Phase 1: Analyze Graph on Mount
  useEffect(() => {
    const centrality = calculateCentrality(data.nodes, data.edges);
    const communities = detectCommunities(data.nodes, data.edges);

    const enrichedNodes = data.nodes.map(n => ({
      ...n,
      centrality: centrality.get(n.id),
      group: communities.get(n.id)
    }));

    setData(prev => ({ ...prev, nodes: enrichedNodes }));
  }, []);

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
    setHighlightedNodeId(node.id);
  };

  const handleTimelineClick = (nodeId: string) => {
    setHighlightedNodeId(nodeId);
    const node = data.nodes.find(n => n.id === nodeId);
    if (node) setSelectedNode(node);
  };

  const handleMythClick = (myth: Myth) => {
    setActiveMyth(myth);
    setHighlightedNodeId(myth.relatedNodes[0]);
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      
      {/* Navbar */}
      <header className="h-14 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between px-6 shadow-md z-20">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gradient-to-b from-white to-red-600 rounded-sm border border-zinc-600 shadow-sm"></div>
          <h1 className="font-serif text-xl font-bold tracking-wide text-zinc-100">
            ENDECJA <span className="text-amber-500">GRAPHLAB</span> PRO
          </h1>
          <span className="ml-2 px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-400 font-mono uppercase">
            Demitologizator v1.0
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>SYSTEM ON-LINE</span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar: Myths & Info */}
        <aside className="w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col z-10 shadow-xl">
          <div className="p-4 border-b border-zinc-800">
             <h2 className="text-zinc-400 text-xs font-mono uppercase mb-2">Panel Analityczny</h2>
             <div className="flex gap-2">
                <button 
                  onClick={() => setMode(AppMode.EXPLORE)}
                  className={`flex-1 py-2 text-xs font-bold border ${mode === AppMode.EXPLORE ? 'bg-amber-900/20 border-amber-600 text-amber-500' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
                >
                  EKSPLORACJA
                </button>
                <button 
                   onClick={() => setMode(AppMode.ANALYSIS)}
                   className={`flex-1 py-2 text-xs font-bold border ${mode === AppMode.ANALYSIS ? 'bg-amber-900/20 border-amber-600 text-amber-500' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
                >
                  MITY
                </button>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mode === AppMode.EXPLORE && selectedNode ? (
              <div className="art-deco-border p-4 bg-zinc-950/50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-serif text-white">{selectedNode.label}</h3>
                  <span className="text-xs font-mono text-amber-500">{selectedNode.type}</span>
                </div>
                {selectedNode.dates && <div className="text-sm text-zinc-400 mb-4 font-mono">{selectedNode.dates}</div>}
                <p className="text-sm text-zinc-300 leading-relaxed mb-4">{selectedNode.description}</p>
                
                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-zinc-500 border-t border-zinc-800 pt-3">
                   <div>
                      <div className="uppercase mb-1">Centralność</div>
                      <div className="text-zinc-200">{(selectedNode.centrality || 0).toFixed(3)}</div>
                   </div>
                   <div>
                      <div className="uppercase mb-1">Grupa</div>
                      <div className="text-zinc-200">Klaster #{selectedNode.group}</div>
                   </div>
                </div>
              </div>
            ) : mode === AppMode.EXPLORE ? (
               <div className="text-center text-zinc-500 mt-10">
                  <Network className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">Wybierz węzeł na grafie, aby zobaczyć szczegóły.</p>
               </div>
            ) : (
              // Myth Mode
              <div className="space-y-4">
                {data.myths.map(myth => (
                  <div 
                    key={myth.id} 
                    onClick={() => handleMythClick(myth)}
                    className={`cursor-pointer border p-3 transition-all ${activeMyth?.id === myth.id ? 'bg-zinc-800 border-amber-600' : 'bg-zinc-900 border-zinc-700 hover:border-zinc-500'}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                       <ShieldAlert className="w-4 h-4 text-red-500" />
                       <h4 className="font-bold text-sm text-zinc-200 decoration-red-500/50 line-through decoration-2">{myth.title}</h4>
                    </div>
                    <p className="text-xs text-red-400/80 italic mb-2">"{myth.claim}"</p>
                    
                    {activeMyth?.id === myth.id && (
                      <div className="mt-3 pt-3 border-t border-zinc-700 animation-fade-in">
                         <div className="flex items-center gap-2 mb-1 text-green-500">
                            <CheckCircle className="w-3 h-3" />
                            <span className="text-xs font-bold uppercase">Prawda historyczna</span>
                         </div>
                         <p className="text-xs text-zinc-300 leading-relaxed mb-2">{myth.truth}</p>
                         <div className="text-[10px] text-zinc-500 font-mono">
                            Źródła: {myth.sources.join(', ')}
                         </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Center: Graph */}
        <main className="flex-1 relative bg-zinc-950 flex flex-col">
          <div className="flex-1 relative">
             <GraphCanvas 
               data={data} 
               onNodeClick={handleNodeClick} 
               highlightNodeId={highlightedNodeId}
             />
             
             {/* Overlay Controls */}
             <div className="absolute top-4 right-4 flex gap-2">
               <div className="bg-zinc-900/80 backdrop-blur border border-zinc-700 p-2 rounded flex gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-700"></span> OSOBA</div>
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-700"></span> ORG.</div>
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-600"></span> WYDARZENIE</div>
               </div>
             </div>
          </div>

          {/* Bottom Timeline */}
          <div className="h-24 bg-zinc-900 border-t border-zinc-800 relative">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-800 via-amber-900 to-zinc-800"></div>
             <div className="flex items-center h-full px-8 overflow-x-auto gap-12 no-scrollbar">
                {TIMELINE_EVENTS.map((evt, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleTimelineClick(evt.nodeId)}
                    className="flex flex-col items-center min-w-[100px] group opacity-70 hover:opacity-100 transition-opacity"
                  >
                     <span className="text-xs font-mono text-zinc-500 mb-1 group-hover:text-amber-500">{evt.year}</span>
                     <div className="w-3 h-3 rounded-full bg-zinc-700 border-2 border-zinc-900 group-hover:bg-amber-500 transition-colors mb-2 relative">
                        {/* Connector line */}
                        {i < TIMELINE_EVENTS.length - 1 && (
                          <div className="absolute left-3 top-[3px] w-24 h-[1px] bg-zinc-800 -z-10"></div>
                        )}
                     </div>
                     <span className="text-[10px] font-bold text-zinc-300 text-center w-24 truncate">{evt.label}</span>
                  </button>
                ))}
             </div>
          </div>
        </main>

        {/* Right Sidebar: Chat */}
        <aside className="w-96 z-10 shadow-xl h-full">
           <ChatPanel onNodeSelect={setHighlightedNodeId} />
        </aside>

      </div>
    </div>
  );
}
