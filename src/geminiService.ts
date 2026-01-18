
import { GoogleGenAI } from "@google/genai";

// Fix: Initialize GoogleGenAI strictly following the guideline to use process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTournamentDetails = async (game: string, title: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, professional, and exciting tournament description and 3 basic rules for an esports tournament. 
      Game: ${game}
      Tournament Title: ${title}
      Output format: Just the text, no markdown headers.`
    });
    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Join our exciting tournament and compete for the top spot! Standard rules apply.";
  }
};
