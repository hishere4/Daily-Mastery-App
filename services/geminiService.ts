
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateChallengeTasks = async (topic: string, days: number) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a structured ${days}-day challenge for the topic: "${topic}". Provide a brief daily task description for each day.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.NUMBER },
                  description: { type: Type.STRING }
                },
                required: ["day", "description"]
              }
            }
          }
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return data.tasks;
    }
    return [];
  } catch (error) {
    console.error("Error generating tasks:", error);
    return [];
  }
};
