// src/types/inventory.d.ts
export interface ProductItem {
  asin: string;
  brand: string;
  product_name: string;
  category: string; 
  macro_crisis: string;
  stock_count: number;
  base_price: number; 
  surge_multiplier: number; 
  eta_mins: number; 
  weight_grams: number;
  is_veg?: boolean;
  purchase_frequency_rank: number;
  ai_search_tags: string[];
  llm_review_pros: string;
  llm_review_cons: string;
  image_url: string;
}

export interface RankedItem extends ProductItem {
  score: number;
  is_alternative: boolean;
  alternative_message?: string;
}

export interface UserProfile {
  user_id: string;
  preferred_brands: string[];
  default_location: string;
}