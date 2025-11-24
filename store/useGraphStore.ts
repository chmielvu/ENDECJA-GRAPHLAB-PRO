import { create } from 'zustand';
import { GraphData, Node, Link, Myth, AnalysisResult } from '../types';
import { INITIAL_DATA } from '../constants';
import { analyzeGraphWithNetworkX } from '../services/geminiService';
import Graph from 'graphology';
import pagerank from 'graphology-metrics/centrality/pagerank';
import louvain from 'graphology-communities-louvain';

interface GraphState {
  data: GraphData;
  isLoading: boolean;
  isAnalyzing: boolean;
  highlightedNodeId: string | null;
  selectedNode: Node | null;
  activeMyth: Myth | null;
  lastAnalysis: AnalysisResult | null;
  
  // Actions
  initializeGraph: () => void;
  selectNode: (nodeId: string | null) => void;
  setHighlight: (nodeId: string | null) => void;
  activateMyth: (myth: Myth) => void;
  addNodesFromAI: (newNodes: Node[], newEdges: Link[]) => void;
  runGlobalAnalysis: (targetNodeId?: string) => Promise<void>;
}

// Client-side helper: K-Core Decomposition
const computeKCore = (graph: Graph): Record<string, number> => {
  const g = graph.copy();
  const cores: Record<string, number> = {};
  
  // Initialize
  g.forEachNode(node => { cores[node] = 0; });
  
  let k = 0;
  // Safety break
  while (g.order > 0 && k < 100) {
    let removed = true;
    while (removed) {
      removed = false;
      const nodesToRemove = g.filterNodes(node => g.degree(node) < k);
      
      if (nodesToRemove.length > 0) {
        nodesToRemove.forEach(node => {
          cores[node] = Math.max(0, k - 1);
          g.dropNode(node);
        });
        removed = true;
      }
    }
    k++;
  }
  
  return cores;
};

export const useGraphStore = create<GraphState>((set, get) => ({
  data: INITIAL_DATA,
  isLoading: false,
  isAnalyzing: false,
  highlightedNodeId: null,
  selectedNode: null,
  activeMyth: null,
  lastAnalysis: null,

  initializeGraph: () => {
    // 1. Convert to Graphology
    const graph = new Graph();
    const { nodes, edges } = get().data;

    nodes.forEach(n => {
      if (!graph.hasNode(n.id)) graph.addNode(n.id, { ...n });
    });
    edges.forEach(e => {
        const s = typeof e.source === 'string' ? e.source : (e.source as Node).id;
        const t = typeof e.target === 'string' ? e.target : (e.target as Node).id;
        if (graph.hasNode(s) && graph.hasNode(t) && !graph.hasEdge(s, t)) {
            graph.addEdge(s, t);
        }
    });

    // 2. Run Client-side Algorithms
    const ranks = pagerank(graph);
    const communities = louvain(graph);
    const cores = computeKCore(graph);

    // 3. Update State
    const enrichedNodes = nodes.map(n => ({
      ...n,
      importance: (ranks[n.id] || 0) * 10,
      centrality: ranks[n.id],
      group: communities[n.id] || 0,
      kCore: cores[n.id] || 0
    }));

    set(state => ({
      data: { ...state.data, nodes: enrichedNodes }
    }));
  },

  selectNode: (nodeId) => {
    if (!nodeId) {
      set({ selectedNode: null, highlightedNodeId: null });
      return;
    }
    const node = get().data.nodes.find(n => n.id === nodeId);
    set({ selectedNode: node || null, highlightedNodeId: nodeId });
  },

  setHighlight: (nodeId) => set({ highlightedNodeId: nodeId }),

  activateMyth: (myth) => {
    set({ activeMyth: myth, highlightedNodeId: myth.relatedNodes[0] });
  },

  addNodesFromAI: (newNodes, newEdges) => {
    set(state => {
      const existingIds = new Set(state.data.nodes.map(n => n.id));
      const uniqueNewNodes = newNodes.filter(n => !existingIds.has(n.id));
      
      const mergedNodes = [...state.data.nodes, ...uniqueNewNodes];
      const mergedEdges = [...state.data.edges, ...newEdges];

      // Re-run analytics immediately
      const graph = new Graph();
      mergedNodes.forEach(n => graph.addNode(n.id));
      mergedEdges.forEach(e => {
          const s = typeof e.source === 'string' ? e.source : (e.source as Node).id;
          const t = typeof e.target === 'string' ? e.target : (e.target as Node).id;
          if (graph.hasNode(s) && graph.hasNode(t)) graph.addEdge(s, t);
      });

      const ranks = pagerank(graph);
      const communities = louvain(graph);
      const cores = computeKCore(graph);

      const finalNodes = mergedNodes.map(n => ({
        ...n,
        importance: (ranks[n.id] || 0) * 10,
        centrality: ranks[n.id],
        group: communities[n.id] || 0,
        kCore: cores[n.id] || 0
      }));

      return {
        data: { nodes: finalNodes, edges: mergedEdges, myths: state.data.myths }
      };
    });
  },

  // Global Analysis via Gemini
  runGlobalAnalysis: async (targetNodeId) => {
    set({ isAnalyzing: true, lastAnalysis: null });
    const { nodes, edges } = get().data;

    try {
      const result = await analyzeGraphWithNetworkX(nodes, edges, targetNodeId);
      
      if (result && result.data) {
        set({ 
          lastAnalysis: {
            type: targetNodeId ? 'node' : 'global',
            timestamp: Date.now(),
            metrics: result.data.global_metrics,
            nodeMetrics: result.data.node_metrics,
            top_influencers: result.data.top_influencers,
            communities_summary: `Detected ${result.data.communities_count} communities`,
            paths_to_key_figures: result.data.paths,
            commentary: result.commentary
          }
        });
      }
    } catch (e) {
      console.error("Global analysis failed", e);
    } finally {
      set({ isAnalyzing: false });
    }
  }
}));