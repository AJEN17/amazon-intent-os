// src/lib/scoring/rankingEngine.ts
import { ProductItem, RankedItem, UserProfile } from "../../types/inventory";

export const rankAndFlagAlternatives = (
  inventory: ProductItem[],
  userProfile: UserProfile
): RankedItem[] => {
  
  // 1. Calculate base scores and apply personalization
  let scoredItems: RankedItem[] = inventory.map(item => {
    // Scoring Formula: (Freq * 0.5) - (ETA * 2) - (Price * 0.01)
    let score = (item.purchase_frequency_rank * 0.5) - (item.eta_mins * 2) - (item.base_price * 0.01);
    
    if (userProfile.preferred_brands.includes(item.brand)) {
      score += 50; // Historical Personalization Boost
    }
    
    return { ...item, score, is_alternative: false };
  });

  // 2. Sort by highest score
  scoredItems.sort((a, b) => b.score - a.score);

  // 3. Process stock checks and dynamic alternative flags
  let finalTopItems: RankedItem[] = [];
  let isAlternativeTriggered = false;
  let originalPrice = 0;
  let originalEta = 0;

  for (const currentItem of scoredItems) {
    // Top personalized item is out of stock
    if (currentItem.stock_count === 0 && finalTopItems.length === 0) {
      isAlternativeTriggered = true;
      originalPrice = currentItem.base_price;
      originalEta = currentItem.eta_mins;
      continue; // Skip this item entirely
    }

    let processedItem = { ...currentItem };

    // Apply the Alternative Banner to the next best item if triggered
    if (isAlternativeTriggered && finalTopItems.length === 0) {
      processedItem.is_alternative = true;
      
      const savings = originalPrice - processedItem.base_price;
      const timeSaved = originalEta - processedItem.eta_mins;
      
      processedItem.alternative_message = `Preferred brand out. Suggested Substitute: ${processedItem.brand} (Saves ₹${savings > 0 ? savings : 0} + ${timeSaved > 0 ? timeSaved : 0} mins faster)`;
    }

    finalTopItems.push(processedItem);
    
    // We strictly return only the Top 3 items for the Showdown Drawer
    if (finalTopItems.length === 3) break; 
  }

  return finalTopItems;
};