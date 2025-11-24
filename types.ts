export interface Node {
  id: string;
  label: string;
  type: 'person' | 'organization' | 'event' | 'publication' | 'concept';
  dates?: string;
  description: string;
  importance: number; // 0 to 1
  group?: number; // Louvain community ID
  centrality?: number; // Calculated PageRank
  kCore?: number; // K-Core shell
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface Link {
  source: string | Node;
  target: string | Node;
  relationship: string;
  dates?: string;
  value?: number;
}

export interface Myth {
  id: string;
  title: string;
  claim: string;
  truth: string;
  sources: string[];
  severity: 'wysoka' | 'średnia' | 'niska' | 'krytyczna';
  relatedNodes: string[];
  category: string;
}

export interface GraphData {
  nodes: Node[];
  edges: Link[];
  myths: Myth[];
}

export interface TimelineEvent {
  year: number;
  label: string;
  nodeId: string;
}

export enum AppMode {
  EXPLORE = 'EXPLORE',
  ANALYSIS = 'ANALYSIS',
}

export type ColorMode = 'type' | 'community' | 'kcore' | 'importance';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isThinking?: boolean;
}

// Global Analysis Types

export interface AnalysisMetrics {
  density: number;
  is_connected: boolean;
  components: number;
  diameter?: number;
}

export interface NodeMetrics {
  betweenness: number;
  pagerank: number;
  degree: number;
}

export interface AnalysisResult {
  type: 'global' | 'node';
  timestamp: number;
  metrics?: AnalysisMetrics; // For global analysis
  nodeMetrics?: NodeMetrics; // For specific node analysis
  top_influencers?: Array<{ id: string; label: string; score: number }>;
  communities_summary?: string;
  paths_to_key_figures?: Record<string, any>;
  commentary: string; // The "Dmowski" textual explanation
}
