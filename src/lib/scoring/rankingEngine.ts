// src/lib/scoring/rankingEngine.ts
import { ProductItem, RankedItem, UserProfile } from "../../types/inventory";

export const rankAndFlagAlternatives = (
  inventory: ProductItem[],
  userProfile: UserProfile,
  isSearch: boolean = false
): RankedItem[] => {
  
  const scoredItems: RankedItem[] = inventory.map(item => {
    const currentPrice = item.base_price * item.surge_multiplier;
    
    // New Hackathon Demo Formula: Normalize scores between 1-100 for a realistic "Match Percentage"
    let baseScore = 80 + (item.purchase_frequency_rank * 0.15) - (item.eta_mins * 0.6) - (currentPrice * 0.005);
    
    // Personalization Boost
    if (userProfile.preferred_brands.includes(item.brand)) {
      baseScore += 12; 
    }
    
    // Clamp score strictly between 15 and 99 so it looks like a realistic algorithmic match
    const score = Math.min(99, Math.max(15, baseScore));
    
    return { 
      ...item, 
      score, 
      is_alternative: false 
    };
  });

  // 2. Sort by highest score to get the absolute best options
  scoredItems.sort((a, b) => b.score - a.score);

  // 3. Process stock checks and dynamic alternative flags
  const finalTopItems: RankedItem[] = [];
  let isAlternativeTriggered = false;
  let originalBrand = "";

  for (const currentItem of scoredItems) {
    // If an item is out of stock, we skip it.
    // If it's a direct search AND the absolute best item was out of stock, flag for an alternative.
    if (currentItem.stock_count === 0) {
      if (isSearch && finalTopItems.length === 0) {
        isAlternativeTriggered = true;
        originalBrand = currentItem.brand;
      }
      continue; 
    }

    const processedItem = { ...currentItem };

    // Apply the Alternative Banner to the NEXT best item
    if (isSearch && isAlternativeTriggered && finalTopItems.length === 0) {
      processedItem.is_alternative = true;
      processedItem.alternative_message = `${originalBrand} is out. Suggested Substitute: ${processedItem.brand}`;
    }

    finalTopItems.push(processedItem);
  }

  return finalTopItems;
};