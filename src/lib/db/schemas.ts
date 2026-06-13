// src/lib/db/schemas.ts
import { z } from 'zod';

export const UserProfileSchema = z.object({
  user_id: z.string(),
  preferred_brands: z.array(z.string()),
  default_location: z.string()
});

export const ProductItemSchema = z.object({
  asin: z.string(),
  brand: z.string(),
  product_name: z.string(),
  category: z.string(),
  macro_crisis: z.string(),
  stock_count: z.number(),
  base_price: z.number(),
  surge_multiplier: z.number(),
  eta_mins: z.number(),
  weight_grams: z.number(),
  is_veg: z.boolean().optional(),
  purchase_frequency_rank: z.number(),
  ai_search_tags: z.array(z.string()),
  llm_review_pros: z.string(),
  llm_review_cons: z.string(),
  image_url: z.string()
});
