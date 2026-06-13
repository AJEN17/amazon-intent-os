// src/app/api/intent/route.ts
import { NextResponse } from 'next/server';
import { extractIntentFromText } from '@/lib/ai/bedrockClient';
import { z } from 'zod';

const RequestSchema = z.object({
  transcript: z.string().min(2, "Transcript too short").max(200, "Transcript too long")
});

export async function POST(req: Request) {
  let transcript = "";
  try {
    const body = await req.json();
    try {
      const parsed = RequestSchema.parse(body);
      transcript = parsed.transcript;
    } catch (e) {
      return NextResponse.json({ success: false, error: "Invalid input format" }, { status: 400 });
    }

    // Call the advanced Bedrock engine
    const aiDecision = await extractIntentFromText(transcript);

    return NextResponse.json({ 
      success: true, 
      macro_crisis: aiDecision.macro_crisis,
      target_category: aiDecision.target_category
    }, { status: 200 });

  } catch (error) {
    console.error("[API/INTENT ERROR]:", error);

    // Graceful Fallback for demo when Bedrock fails
    console.warn("Using fallback static routing due to AI failure.");
    
    let fallbackCategory = "POWER_CUT_CRISIS";
    let fallbackTarget = "emergency_light";
    
    const lower = transcript.toLowerCase();
    if (lower.includes("rain") || lower.includes("storm") || lower.includes("umbrella")) {
      fallbackCategory = "RAIN_CRISIS";
      fallbackTarget = "umbrella";
    } else if (lower.includes("party") || lower.includes("drinks") || lower.includes("ice")) {
      fallbackCategory = "PARTY_CRISIS";
      fallbackTarget = "ice_cubes";
    }

    return NextResponse.json({ 
      success: true, 
      macro_crisis: fallbackCategory,
      target_category: fallbackTarget
    }, { status: 200 });
  }
}