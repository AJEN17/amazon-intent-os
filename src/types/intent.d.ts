// src/types/intent.d.ts

export type CrisisCategory = 
  | "PARTY_CRISIS" 
  | "BABY_CRISIS" 
  | "TRAVEL_CRISIS" 
  | "MEDICINE_CRISIS" 
  | "RAIN_CRISIS" 
  | "POWER_CUT_CRISIS" 
  | "COOKING_CRISIS" 
  | "PET_CRISIS";

export interface IntentPayload {
  crisis_category: CrisisCategory;
  target_categories: string[];
  urgency_level: "HIGH" | "MEDIUM" | "LOW";
}