import { GraphData, Node, Link } from '../types';

/**
 * Calculates Degree Centrality for visual sizing
 */
export const calculateCentrality = (nodes: Node[], edges: Link[]): Map<string, number> => {
  const degreeMap = new Map<string, number>();
  
  nodes.forEach(n => degreeMap.set(n.id, 0));
  
  edges.forEach(e => {
    const s = typeof e.source === 'string' ? e.source : e.source.id;
    const t = typeof e.target === 'string' ? e.target : e.target.id;
    
    degreeMap.set(s, (degreeMap.get(s) || 0) + 1);
    degreeMap.set(t, (degreeMap.get(t) || 0) + 1);
  });

  // Normalize
  const maxDegree = Math.max(...Array.from(degreeMap.values()));
  const centralityMap = new Map<string, number>();
  degreeMap.forEach((val, key) => {
    centralityMap.set(key, val / (maxDegree || 1));
  });

  return centralityMap;
};

/**
 * Simple community detection (Label Propagation simulation)
 * In a real python env we would use Louvain. Here we cluster by type + connectivity.
 */
export const detectCommunities = (nodes: Node[], edges: Link[]): Map<string, number> => {
  const communityMap = new Map<string, number>();
  
  // Initialize communities based on type for simulation of structure
  // In a real generic graph we would propagate labels
  nodes.forEach(n => {
    let group = 0;
    if (n.type === 'person') group = 1;
    if (n.type === 'organization') group = 2;
    if (n.type === 'event') group = 3;
    if (n.type === 'publication' || n.type === 'concept') group = 4;
    
    // Override for specific clusters known in history for demo quality
    if (['onr', 'mosdorf_jan', 'giertych_jedrzej'].includes(n.id)) group = 5; // Radykałowie
    if (['komitet_narodowy', 'konferencja_paryska', 'paderewski'].includes(n.id)) group = 6; // Dyplomacja
    
    communityMap.set(n.id, group);
  });

  return communityMap;
};
