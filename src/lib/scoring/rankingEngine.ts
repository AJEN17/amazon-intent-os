// src/lib/scoring/rankingEngine.ts
import { ProductItem, RankedItem, UserProfile } from "../../types/inventory";

export const rankAndFlagAlternatives = (
  inventory: ProductItem[],
  userProfile: UserProfile,
  isSearch: boolean = false
): RankedItem[] => {
  
 let scoredItems: RankedItem[] = inventory.map(item => {
    const currentPrice = item.base_price * item.surge_multiplier;
    let baseScore = (item.purchase_frequency_rank * 0.8) - (item.eta_mins * 3) - (currentPrice * 0.05);
    let score = Math.max(0, baseScore);
    
    // Personalization Boost: If the user loves this brand, boost its score heavily
    if (userProfile.preferred_brands.includes(item.brand)) {
      score += 75; 
    }
    
    return { 
      ...item, 
      score, 
      is_alternative: false 
    };
  });

  // 2. Sort by highest score to get the absolute best options
  scoredItems.sort((a, b) => b.score - a.score);

  // 3. Process stock checks and dynamic alternative flags
  let finalTopItems: RankedItem[] = [];
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

    let processedItem = { ...currentItem };

    // Apply the Alternative Banner to the NEXT best item
    if (isSearch && isAlternativeTriggered && finalTopItems.length === 0) {
      processedItem.is_alternative = true;
      processedItem.alternative_message = `${originalBrand} is out. Suggested Substitute: ${processedItem.brand}`;
    }

    finalTopItems.push(processedItem);
    
    // We strictly return only the Top 3 items for the Showdown Drawer if it's a direct search
    if (isSearch && finalTopItems.length === 3) break; 
  }

  return finalTopItems;
};