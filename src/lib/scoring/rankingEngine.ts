// src/lib/scoring/rankingEngine.ts
import { ProductItem, RankedItem, UserProfile } from "../../types/inventory";

export const rankAndFlagAlternatives = (
  inventory: ProductItem[],
  userProfile: UserProfile
): RankedItem[] => {
  
 let scoredItems: RankedItem[] = inventory.map(item => {
    const currentPrice = item.base_price * item.surge_multiplier;
    let score = (item.purchase_frequency_rank * 0.8) - (item.eta_mins * 3) - (currentPrice * 0.05);
    // Personalization Boost: If the user loves this brand, boost its score heavily
    if (userProfile.preferred_brands.includes(item.brand)) {
      score += 75; 
    }
    
    return { 
      ...item, 
      base_price: Math.round(currentPrice), // Update the price the user actually sees
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
    // If the #1 best item is out of stock, skip it and flag that we need an alternative
    if (currentItem.stock_count === 0 && finalTopItems.length === 0) {
      isAlternativeTriggered = true;
      originalBrand = currentItem.brand;
      continue; 
    }

    // Skip any subsequent out-of-stock items (we only show in-stock items)
    if (currentItem.stock_count === 0) continue;

    let processedItem = { ...currentItem };

    // Apply the Alternative Banner to the NEXT best item
    if (isAlternativeTriggered && finalTopItems.length === 0) {
      processedItem.is_alternative = true;
      processedItem.alternative_message = `${originalBrand} is out. Suggested Substitute: ${processedItem.brand}`;
    }

    finalTopItems.push(processedItem);
    
    // We strictly return only the Top 3 items for the Showdown Drawer
    if (finalTopItems.length === 3) break; 
  }

  return finalTopItems;
};