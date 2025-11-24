import { GoogleGenAI } from "@google/genai";
import { DMOWSKI_SYSTEM_PROMPT } from "../constants";
import { Node, Link } from '../types';

// Access env safely
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

export const sendMessageToDmowski = async (
  history: {role: string, parts: string}[], 
  message: string,
  currentGraphContext: string
) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using Gemini 3 Pro for complex reasoning
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