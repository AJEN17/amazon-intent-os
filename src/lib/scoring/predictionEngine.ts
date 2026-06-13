// src/lib/scoring/predictionEngine.ts
import { ProductItem } from "../../types/inventory";

export interface PurchaseRecord {
  user_id: string;
  asin: string;
  quantity: number;
  timestamp: string;
}

export interface PredictedItem extends ProductItem {
  predictionScore: number;
  frequency: number;
  timeMatchBoost: boolean;
}

export const predictUsuals = (
  history: PurchaseRecord[],
  inventory: ProductItem[],
  currentHour: number
): PredictedItem[] => {
  const itemStats: Record<string, { frequency: number; hours: number[] }> = {};

  history.forEach(record => {
    if (!itemStats[record.asin]) {
      itemStats[record.asin] = { frequency: 0, hours: [] };
    }
    itemStats[record.asin].frequency += record.quantity;
    const hour = new Date(record.timestamp).getUTCHours();
    itemStats[record.asin].hours.push(hour);
  });

  const predictions: PredictedItem[] = [];

  for (const asin in itemStats) {
    const stats = itemStats[asin];
    const product = inventory.find(p => p.asin === asin);
    
    if (!product || product.stock_count === 0) continue;

    // Check if the current hour is within 2 hours of their usual purchase time
    const timeMatchBoost = stats.hours.some(h => Math.abs(h - currentHour) <= 2 || Math.abs(h - currentHour) >= 22);

    let predictionScore = stats.frequency * 10;
    if (timeMatchBoost) {
      predictionScore *= 2.5; // Huge boost for time of day match
    }

    predictions.push({
      ...product,
      predictionScore,
      frequency: stats.frequency,
      timeMatchBoost
    });
  }

  // Sort by prediction score descending
  return predictions.sort((a, b) => b.predictionScore - a.predictionScore).slice(0, 4);
};
