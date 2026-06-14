// src/lib/ai/geminiClient.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { INTENT_ROUTING_PROMPT } from "./promptTemplates";

// Strict validation for AI output
const IntentSchema = z.object({
  macro_crisis: z.enum([
    "POWER_CUT_CRISIS", "PARTY_CRISIS", "BABY_CRISIS", 
    "TRAVEL_CRISIS", "MEDICINE_CRISIS", "RAIN_CRISIS", 
    "COOKING_CRISIS", "PET_CRISIS"
  ]),
  target_category: z.string().min(2)
});

export async function extractIntentFromText(userInput: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || "";
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // We use gemini-2.5-flash for maximum speed and cost efficiency
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: INTENT_ROUTING_PROMPT,
      generationConfig: {
        temperature: 0.1, // Highly deterministic output
        responseMimeType: "application/json", // Force JSON output
      }
    });

    const result = await model.generateContent(`User input: "${userInput}"`);
    const responseText = result.response.text();
    
    // Parse and validate using Zod
    const rawJson = JSON.parse(responseText);
    return IntentSchema.parse(rawJson);

  } catch (error) {
    console.error("[GEMINI FATAL ERROR]:", error);
    throw new Error("Failed to extract intent using Google Gemini");
  }
}
