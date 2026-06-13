// src/app/api/intent/route.ts
import { NextResponse } from 'next/server';
import { extractIntentFromText } from '@/lib/ai/bedrockClient';
import { z } from 'zod';

const RequestSchema = z.object({
  transcript: z.string().min(2, "Transcript too short").max(200, "Transcript too long")
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate incoming data from the frontend
    const { transcript } = RequestSchema.parse(body);

    // Call the advanced Bedrock engine
    const aiDecision = await extractIntentFromText(transcript);

    return NextResponse.json({ 
      success: true, 
      macro_crisis: aiDecision.macro_crisis,
      target_category: aiDecision.target_category
    }, { status: 200 });

  } catch (error) {
    console.error("[API/INTENT ERROR]:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Invalid input format" }, { status: 400 });
    }

    return NextResponse.json({ 
      success: false, 
      error: "Internal Server Error during AI routing" 
    }, { status: 500 });
  }
}