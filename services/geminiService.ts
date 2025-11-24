import { GoogleGenAI } from "@google/genai";
import { DMOWSKI_SYSTEM_PROMPT } from "../constants";
import { Node, Link, AnalysisResult } from '../types';

// Access env safely
// @ts-ignore
const apiKey = process.env.API_KEY || import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_3_PRO = 'gemini-2.0-flash-thinking-exp-01-21';

// Helper to parse graph updates from text
const extractGraphData = (text: string): { newNodes: Node[], newEdges: Link[] } | null => {
  try {
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    }
  } catch (e) {
    console.error("Failed to parse graph expansion", e);
  }
  return null;
};

// Helper to sanitize JSON for Python
const sanitizeGraphData = (nodes: Node[], edges: Link[]) => {
  return JSON.stringify({
    nodes: nodes.map(n => ({ 
      id: n.id, 
      label: n.label, 
      group: n.group || 'unknown',
      description: n.description || '' 
    })),
    edges: edges.map(e => ({ 
      from: typeof e.source === 'string' ? e.source : (e.source as Node).id, 
      to: typeof e.target === 'string' ? e.target : (e.target as Node).id,
      label: e.relationship 
    }))
  });
};

export const sendMessageToDmowski = async (
  history: {role: string, parts: string}[], 
  message: string,
  currentGraphContext: string
) => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_3_PRO,
      contents: [
        { role: 'user', parts: [{ text: DMOWSKI_SYSTEM_PROMPT }] },
        { role: 'user', parts: [{ text: `KONTEKST GRAFU: ${currentGraphContext}. 
          JEŚLI użytkownik prosi o dodanie informacji/węzłów, zwróć JSON na końcu odpowiedzi w formacie:
          \`\`\`json
          { "newNodes": [...], "newEdges": [...] }
          \`\`\`
          Ensure 'id' fields in JSON are unique and URL-friendly strings.
          Thinking is enabled for historical accuracy.
        `}]},
        ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.parts }] })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });

    const fullText = response.text || "";
    const graphUpdates = extractGraphData(fullText);
    
    // Remove JSON from text for display
    const displayText = fullText.replace(/```json[\s\S]*?```/, '').trim();

    return { text: displayText, graphUpdates };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "Przepraszam, depesza z Paryża nie dotarła. Proszę powtórzyć.", graphUpdates: null };
  }
};

export const analyzeGraphWithNetworkX = async (
  nodes: Node[], 
  edges: Link[], 
  targetNodeId?: string
) => {
  const graphJson = sanitizeGraphData(nodes, edges);
  
  // Python Script Generation
  const pythonScript = `
import networkx as nx
import json
from networkx.algorithms import community

# 1. Load Data
data = json.loads('''${graphJson}''')
G = nx.DiGraph()

for n in data['nodes']:
    G.add_node(n['id'], label=n['label'], desc=n.get('description',''))
for e in data['edges']:
    G.add_edge(e['from'], e['to'], label=e['label'])

G_undirected = G.to_undirected()
target_id = "${targetNodeId || ''}"

result = {}

# 2. Global Metrics (Always run)
result['type'] = 'node' if target_id else 'global'
result['global_metrics'] = {
    "density": round(nx.density(G), 4),
    "is_connected": nx.is_connected(G_undirected),
    "components": nx.number_connected_components(G_undirected)
}

# Top PageRank (Global Context)
pagerank = nx.pagerank(G)
top_5 = sorted(pagerank.items(), key=lambda x: x[1], reverse=True)[:5]
result['top_influencers'] = [{"id": k, "label": G.nodes[k]['label'], "score": round(v,3)} for k,v in top_5]

# Community Detection
comms = list(community.greedy_modularity_communities(G_undirected))
result['communities_count'] = len(comms)

# 3. Target Analysis (If Node Selected)
if target_id and target_id in G:
    # Centrality
    result['node_metrics'] = {
        "degree": G.degree(target_id),
        "betweenness": round(nx.betweenness_centrality(G)[target_id], 4),
        "pagerank": round(pagerank[target_id], 4)
    }
    
    # Shortest Paths to Key Figures
    key_figures = ['dmowski_roman', 'pilsudski_jozef', 'mosdorf_jan']
    paths = {}
    for fig in key_figures:
        if fig in G and fig != target_id:
            try:
                p = nx.shortest_path(G, target_id, fig)
                paths[G.nodes[fig]['label']] = [G.nodes[n]['label'] for n in p]
            except:
                pass
    result['paths'] = paths

print(json.dumps(result))
`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_3_PRO,
      contents: [
        { role: 'user', parts: [{ text: DMOWSKI_SYSTEM_PROMPT }] },
        { role: 'user', parts: [{ text: `
          Wykonaj analizę grafu Endecji używając NetworkX.
          
          KOD PYTHON DO WYKONANIA:
          \`\`\`python
          ${pythonScript}
          \`\`\`

          Zwróć wynik jako JSON. Następnie, jako Roman Dmowski, skomentuj te wyniki.
          Jeśli analizujemy konkretną osobę (target_id), skup się na jej roli.
          Jeśli to analiza globalna, oceń kondycję całego ruchu narodowego.
        ` }]},
      ],
      config: { 
        tools: [{ codeExecution: {} }] 
      }
    });

    // Parse Output
    const text = response.text || "";
    let jsonData = null;
    
    // Try to find JSON block in the text (Gemini often puts it in markdown)
    const jsonMatch = text.match(/\{[\s\S]*"global_metrics"[\s\S]*\}/);
    if (jsonMatch) {
      try {
        jsonData = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.warn("Failed to parse JSON from Vibe Code output", e);
      }
    }

    // Fallback: If code execution output is available in metadata (not standard in @google/genai basic text access but handled via text flow here)

    return {
      raw: text,
      data: jsonData,
      commentary: text.replace(/```json[\s\S]*?```/g, '').replace(/\{[\s\S]*"global_metrics"[\s\S]*\}/, '').trim()
    };

  } catch (error) {
    console.error("Analysis Failed", error);
    return null;
  }
};