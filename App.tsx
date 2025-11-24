import React, { useEffect, useState } from 'react';
import { useGraphStore } from './store/useGraphStore';
import GraphCanvas from './components/GraphCanvas';
import ChatPanel from './components/ChatPanel';
import { AppMode, ColorMode } from './types';
import { Network, ShieldAlert, CheckCircle, Layers, Activity, Users, Box, Zap, BarChart3 } from 'lucide-react';

export default function App() {
  const { 
    data, 
    initializeGraph, 
    selectNode, 
    highlightedNodeId, 
    selectedNode, 
    activeMyth, 
    activateMyth,
    runGlobalAnalysis,
    lastAnalysis,
    isAnalyzing
  } = useGraphStore();
  const [mode, setMode] = useState<AppMode>(AppMode.EXPLORE);
  const [colorMode, setColorMode] = useState<ColorMode>('type');

  useEffect(() => {
    initializeGraph();
  }, [initializeGraph]);

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      <header className="h-14 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between px-6 shadow-md z-20">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gradient-to-b from-white to-red-600 border border-zinc-600"></div>
          <h1 className="font-serif text-xl font-bold tracking-wide text-zinc-100">
            ENDECJA <span className="text-amber-500">GRAPHLAB</span> PRO
          </h1>
        </div>
        <div className="flex items-center gap-4">
           {isAnalyzing && (
             <div className="text-amber-500 text-xs font-mono animate-pulse flex items-center gap-2">
               <Zap size={14} /> ANALIZA SIECIOWA AI TRWA...
             </div>
           )}
           <button 
             onClick={() => runGlobalAnalysis()}
             disabled={isAnalyzing}
             className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono border border-zinc-700 rounded transition-all disabled:opacity-50 flex items-center gap-2"
           >
             <BarChart3 size={14}/> ANALIZA GLOBALNA
           </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col z-10">
           <div className="flex border-b border-zinc-800">
              <button onClick={() => setMode(AppMode.EXPLORE)} className={`flex-1 py-3 text-xs font-bold ${mode === AppMode.EXPLORE ? 'text-amber-500 bg-amber-900/10' : 'text-zinc-500'}`}>EKSPLORACJA</button>
              <button onClick={() => setMode(AppMode.ANALYSIS)} className={`flex-1 py-3 text-xs font-bold ${mode === AppMode.ANALYSIS ? 'text-amber-500 bg-amber-900/10' : 'text-zinc-500'}`}>MITY</button>
           </div>
           
           {/* Color Mode Selector (Visible in Explore) */}
           {mode === AppMode.EXPLORE && (
             <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
               <label className="text-[10px] text-zinc-500 font-bold mb-2 block uppercase tracking-wider flex items-center gap-2">
                 <Layers size={10} /> Soczewka Analityczna
               </label>
               <div className="grid grid-cols-2 gap-2">
                 <button onClick={() => setColorMode('type')} className={`flex items-center gap-2 justify-center text-[10px] py-1.5 px-2 border rounded transition-colors ${colorMode === 'type' ? 'bg-amber-900/30 border-amber-600 text-amber-500' : 'border-zinc-700 text-zinc-400 hover:bg-zinc-800'}`}>
                   <Box size={10} /> Typ
                 </button>
                 <button onClick={() => setColorMode('community')} className={`flex items-center gap-2 justify-center text-[10px] py-1.5 px-2 border rounded transition-colors ${colorMode === 'community' ? 'bg-amber-900/30 border-amber-600 text-amber-500' : 'border-zinc-700 text-zinc-400 hover:bg-zinc-800'}`}>
                   <Users size={10} /> Grupy
                 </button>
                 <button onClick={() => setColorMode('kcore')} className={`flex items-center gap-2 justify-center text-[10px] py-1.5 px-2 border rounded transition-colors ${colorMode === 'kcore' ? 'bg-amber-900/30 border-amber-600 text-amber-500' : 'border-zinc-700 text-zinc-400 hover:bg-zinc-800'}`}>
                   <Layers size={10} /> K-Core
                 </button>
                 <button onClick={() => setColorMode('importance')} className={`flex items-center gap-2 justify-center text-[10px] py-1.5 px-2 border rounded transition-colors ${colorMode === 'importance' ? 'bg-amber-900/30 border-amber-600 text-amber-500' : 'border-zinc-700 text-zinc-400 hover:bg-zinc-800'}`}>
                   <Activity size={10} /> PageRank
                 </button>
               </div>
             </div>
           )}

           <div className="p-4 overflow-y-auto flex-1">
             {/* Global Analysis Result Panel */}
             {lastAnalysis && !selectedNode && mode === AppMode.EXPLORE && (
               <div className="border border-amber-900/50 p-4 bg-zinc-950/80 mb-4 animate-in fade-in">
                  <h3 className="text-amber-500 font-serif text-lg mb-2 flex items-center gap-2">
                     <Activity size={16}/> Raport Sieciowy
                  </h3>
                  {lastAnalysis.metrics && (
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono text-zinc-400 mb-3">
                       <div>Gęstość: <span className="text-white">{lastAnalysis.metrics.density}</span></div>
                       <div>Spójność: <span className="text-white">{lastAnalysis.metrics.is_connected ? 'TAK' : 'NIE'}</span></div>
                       <div>Komponenty: <span className="text-white">{lastAnalysis.metrics.components}</span></div>
                    </div>
                  )}
                  {lastAnalysis.top_influencers && (
                    <div className="mb-3">
                       <div className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Top Influencerzy (PageRank)</div>
                       <ul className="space-y-1">
                          {lastAnalysis.top_influencers.map((inf, i) => (
                            <li key={inf.id} className="text-xs flex justify-between">
                               <span className="text-zinc-300">{i+1}. {inf.label}</span>
                               <span className="text-amber-600 font-mono">{inf.score}</span>
                            </li>
                          ))}
                       </ul>
                    </div>
                  )}
                  <p className="text-xs text-zinc-400 italic border-t border-zinc-800 pt-2">
                    "{lastAnalysis.commentary}"
                  </p>
               </div>
             )}

             {mode === AppMode.EXPLORE && selectedNode ? (
               <div className="border border-amber-900/50 p-4 bg-zinc-950 relative animate-in slide-in-from-left-2">
                 <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
                 <div className="flex justify-between items-start">
                    <h3 className="text-xl font-serif text-amber-100 mb-1">{selectedNode.label}</h3>
                    <button onClick={() => runGlobalAnalysis(selectedNode.id)} className="text-amber-600 hover:text-amber-500 p-1" title="Analiza węzła AI">
                       <Zap size={16}/>
                    </button>
                 </div>
                 <div className="text-xs font-mono text-amber-600 mb-4">{selectedNode.dates}</div>
                 <p className="text-sm text-zinc-400 leading-relaxed mb-4">{selectedNode.description}</p>
                 
                 <div className="space-y-2 pt-2 border-t border-zinc-800">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500 uppercase font-mono">PageRank (Wpływ)</span>
                      <span className="text-amber-500 font-mono font-bold">{selectedNode.centrality?.toFixed(4)}</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                       <div className="h-full bg-amber-600" style={{ width: `${(selectedNode.importance || 0) * 10}%` }}></div>
                    </div>

                    <div className="flex justify-between items-center text-xs mt-3">
                      <span className="text-zinc-500 uppercase font-mono">K-Core (Rdzeń)</span>
                      <span className="text-purple-400 font-mono font-bold">Warstwa {selectedNode.kCore}</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                       <div className="h-full bg-purple-500" style={{ width: `${Math.min(((selectedNode.kCore || 0) / 5) * 100, 100)}%` }}></div>
                    </div>

                    <div className="flex justify-between items-center text-xs mt-3">
                      <span className="text-zinc-500 uppercase font-mono">Społeczność</span>
                      <span className="text-blue-400 font-mono font-bold">Cluster #{selectedNode.group}</span>
                    </div>
                 </div>
                 
                 {/* Specific AI Analysis for Node */}
                 {lastAnalysis && lastAnalysis.type === 'node' && selectedNode && (
                    <div className="mt-4 pt-4 border-t border-dashed border-zinc-700 animate-in fade-in">
                        <h4 className="text-xs font-bold text-amber-500 mb-2 flex items-center gap-1"><Zap size={10}/> ANALIZA DMOWSKIEGO</h4>
                        <div className="text-xs text-zinc-300 italic mb-2">"{lastAnalysis.commentary}"</div>
                        {lastAnalysis.nodeMetrics && (
                           <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-zinc-500">
                              <div>Betweenness: {lastAnalysis.nodeMetrics.betweenness}</div>
                              <div>Stopień: {lastAnalysis.nodeMetrics.degree}</div>
                           </div>
                        )}
                    </div>
                 )}
               </div>
             ) : mode === AppMode.ANALYSIS ? (
                <div className="space-y-4">
                  {data.myths.map(myth => (
                    <div key={myth.id} onClick={() => activateMyth(myth)} className={`p-3 border cursor-pointer transition-colors ${activeMyth?.id === myth.id ? 'border-amber-600 bg-zinc-800' : 'border-zinc-800 hover:border-zinc-700'}`}>
                       <div className="flex items-center gap-2 mb-2 text-red-400 font-bold text-sm line-through decoration-2">
                         <ShieldAlert size={14} /> {myth.title}
                       </div>
                       <div className="text-xs text-zinc-500 italic mb-2">"{myth.claim}"</div>
                       {activeMyth?.id === myth.id && (
                         <div className="mt-2 pt-2 border-t border-zinc-700 animate-in fade-in slide-in-from-top-1">
                            <div className="flex items-center gap-2 text-green-500 text-xs font-bold uppercase mb-1"><CheckCircle size={12}/> Prawda</div>
                            <p className="text-xs text-zinc-300 leading-relaxed">{myth.truth}</p>
                         </div>
                       )}
                    </div>
                  ))}
                </div>
             ) : (
               !lastAnalysis && (
                  <div className="text-center mt-20 text-zinc-600">
                    <Network className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="text-xs font-mono">Wybierz węzeł lub uruchom analizę</p>
                  </div>
               )
             )}
           </div>
        </aside>

        {/* Center */}
        <main className="flex-1 relative bg-zinc-950">
           <GraphCanvas 
             data={data} 
             onNodeClick={(node) => selectNode(node.id)}
             highlightNodeId={highlightedNodeId}
             colorMode={colorMode}
           />
        </main>

        {/* Right Chat */}
        <aside className="w-96 shadow-xl z-20">
          <ChatPanel />
        </aside>
      </div>
    </div>
  );
}