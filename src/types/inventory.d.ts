// src/types/inventory.d.ts

export interface ProductItem {
  asin: string;
  brand: string;
  product_name: string;
  category: string;
  stock_count: number;
  base_price: number;
  eta_mins: number;
  purchase_frequency_rank: number;
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