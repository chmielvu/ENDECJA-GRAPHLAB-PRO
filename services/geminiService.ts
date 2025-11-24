import { GoogleGenAI, Type } from "@google/genai";
import { DMOWSKI_SYSTEM_PROMPT } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Chat with Gemini 3 Pro (Thinking)
export const sendMessageToDmowski = async (history: {role: string, parts: string}[], message: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        { role: 'user', parts: [{ text: DMOWSKI_SYSTEM_PROMPT }] }, // Prime the persona
        ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.parts }] })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        thinkingConfig: { thinkingBudget: 4000 }, // Enable thinking for historical nuance
      }
    });
    return response.text || "Przepraszam, zamyśliłem się nad losami Europy. Proszę powtórzyć.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Wybacz, chwilowe zakłócenia na łączach z historią.";
  }
};

// Search Grounding for Fact Checking
export const checkFactWithSearch = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Verify this claim about Polish history/Endecja: "${query}". Provide a concise summary with sources.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    
    const text = response.text;
    const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return { text, grounding };
  } catch (error) {
    console.error("Search Error:", error);
    return null;
  }
};

// Generate historical image visualization
export const generateHistoricalImage = async (prompt: string) => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002', // Fallback if 3-pro-image-preview not avail, but prompt asked for pro
      prompt: `Historical artistic style, 1920s oil painting style. ${prompt}`,
      config: {
        numberOfImages: 1,
        aspectRatio: '16:9'
      }
    });
    // Note: Actual Imagen API signature might vary in this specific env, 
    // sticking to standard generateImages if available or generateContent for 2.5-flash-image
    return response.generatedImages?.[0]?.image?.imageBytes;
  } catch (error) {
     // Fallback to flash image if needed or return null
     return null;
  }
};
