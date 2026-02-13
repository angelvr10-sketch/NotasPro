
import { GoogleGenAI, Type } from "@google/genai";

export async function getSmartBreakdown(taskTitle: string): Promise<string[]> {
  try {
    // Inicializar dentro de la función para mayor seguridad y dinamismo
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Actúa como un experto en productividad. Divide la siguiente tarea en 3 a 5 sub-tareas muy cortas, claras y accionables en español: "${taskTitle}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subtasks: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["subtasks"]
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    const data = JSON.parse(text);
    return data.subtasks || [];
  } catch (error) {
    console.error("Gemini breakdown error:", error);
    return [];
  }
}
