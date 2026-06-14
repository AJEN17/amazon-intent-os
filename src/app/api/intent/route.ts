// src/app/api/intent/route.ts
import { NextResponse } from 'next/server';
import { extractIntentFromText } from '@/lib/ai/geminiClient';
import { z } from 'zod';

const RequestSchema = z.object({
  transcript: z.string().min(2, "Transcript too short").max(200, "Transcript too long")
});

// In-memory cache to save Gemini API Quota!
const intentCache = new Map<string, { macro_crisis: string; target_category: string }>();

export async function POST(req: Request) {
  let transcript = "";
  try {
    const body = await req.json();
    try {
      const parsed = RequestSchema.parse(body);
      transcript = parsed.transcript.toLowerCase().trim();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid input format" }, { status: 400 });
    }

    // Check cache first!
    if (intentCache.has(transcript)) {
      const cached = intentCache.get(transcript)!;
      console.log(`[CACHE HIT] Loaded intent for "${transcript}" from memory.`);
      return NextResponse.json({ 
        success: true, 
        macro_crisis: cached.macro_crisis,
        target_category: cached.target_category,
        cached: true 
      }, { status: 200 });
    }

    // Call the advanced AI engine
    console.log(`[CACHE MISS] Pinging AI for "${transcript}"...`);
    const aiDecision = await extractIntentFromText(transcript);

    // Save to cache
    intentCache.set(transcript, {
      macro_crisis: aiDecision.macro_crisis,
      target_category: aiDecision.target_category
    });

    return NextResponse.json({ 
      success: true, 
      macro_crisis: aiDecision.macro_crisis,
      target_category: aiDecision.target_category,
      cached: false
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