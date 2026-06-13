// src/app/api/inventory/match/route.ts
import { NextResponse } from 'next/server';
import { fetchInventoryByCategory, fetchUserProfile } from '@/lib/db/mockClient';
import { rankAndFlagAlternatives } from '@/lib/scoring/rankingEngine';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { target_category, userId } = body;

    if (!target_category) {
      return NextResponse.json({ error: "Missing target_category" }, { status: 400 });
    }

    // 1. Fetch raw items from the specific category (e.g., "candles" or "raincoat")
    const inventory = await fetchInventoryByCategory(target_category);
    
    // 2. Fetch the user profile (simulated user)
    const userProfile = await fetchUserProfile(userId || "ajendra_001");

    // 3. Process items through the advanced scoring engine
    const rankedItems = rankAndFlagAlternatives(inventory, userProfile);

    // 4. Return to the frontend UI
    return NextResponse.json({ 
      success: true, 
      items: rankedItems 
    });

  } catch (error) {
    console.error("[MATCHMAKING ERROR]:", error);
    return NextResponse.json(
      { success: false, error: 'Failed to process crisis match' }, 
      { status: 500 }
    );
  }
}