// src/app/api/inventory/match/route.ts
import { NextResponse } from 'next/server';
import { fetchInventoryByCategory, fetchUserProfile } from '@/lib/db/mockClient';
import { rankAndFlagAlternatives } from '@/lib/scoring/rankingEngine';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, userId } = body;

    // 1. Fetch from mock DynamoDB
    const inventory = await fetchInventoryByCategory(category);
    // Hardcoding your user ID for the demo
    const userProfile = await fetchUserProfile(userId || "ajendra_001");

    // 2. Run our proprietary scoring and substitution logic
    const rankedItems = rankAndFlagAlternatives(inventory, userProfile);

    // 3. Return the payload to the frontend
    return NextResponse.json({ 
      success: true, 
      items: rankedItems 
    });

  } catch (error) {
    console.error("Matchmaking Error:", error);
    return NextResponse.json(
      { success: false, error: 'Failed to process crisis match' }, 
      { status: 500 }
    );
  }
}