// src/lib/ai/bedrockClient.ts
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { z } from "zod";

// 1. Strict mathematical validation for the AI output
const IntentSchema = z.object({
  macro_crisis: z.enum([
    "POWER_CUT_CRISIS", "PARTY_CRISIS", "BABY_CRISIS", 
    "TRAVEL_CRISIS", "MEDICINE_CRISIS", "RAIN_CRISIS", 
    "COOKING_CRISIS", "PET_CRISIS"
  ]),
  target_category: z.string().min(2)
});

// 2. Initialize AWS Client securely
const client = new BedrockRuntimeClient({ 
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  }
});

export async function extractIntentFromText(userInput: string) {
  // Using Llama 3.1 8B on Bedrock: Lightning fast and incredibly cheap for development
  // You can easily swap this to "anthropic.claude-3-haiku-20240307-v1:0" for the final demo
  const modelId = "meta.llama3-1-8b-instruct-v1:0"; 

  const systemPrompt = `You are an NLP routing engine for a Quick Commerce app.
Your only job is to map the user's situation into exactly one macro_crisis category and identify the target_category.
Valid macro_crisis categories: POWER_CUT_CRISIS, PARTY_CRISIS, BABY_CRISIS, TRAVEL_CRISIS, MEDICINE_CRISIS, RAIN_CRISIS, COOKING_CRISIS, PET_CRISIS.
Output ONLY a raw JSON object. No markdown, no conversational text, no backticks.
Example: {"macro_crisis": "POWER_CUT_CRISIS", "target_category": "candles"}`;

  try {
    // AWS ConverseCommand is the modern, unified way to call any Bedrock model
    const command = new ConverseCommand({
      modelId: modelId,
      system: [{ text: systemPrompt }],
      messages: [
        {
          role: "user",
          content: [{ text: `User input: "${userInput}"\nReturn JSON only.` }]
        }
      ],
      inferenceConfig: {
        temperature: 0.1, // Highly deterministic output
        maxTokens: 150,
      }
    });

    const response = await client.send(command);
    
    // Extract the text safely based on the AWS Converse API structure
    const aiText = response.output?.message?.content?.[0]?.text || "{}";
    
    // Clean the string just in case the model wraps it in markdown like ```json ... ```
    const cleanedText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();

    // 3. Parse and validate using Zod
    const rawJson = JSON.parse(cleanedText);
    return IntentSchema.parse(rawJson);

  } catch (error) {
    console.error("[BEDROCK FATAL ERROR]:", error);
    throw new Error("Failed to extract intent using AWS Bedrock");
  }
}