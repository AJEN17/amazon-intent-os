// src/lib/db/seedData.ts
import { ProductItem, UserProfile } from "../../types/inventory";

export const mockUserProfile: UserProfile = {
  user_id: "ajendra_001",
  preferred_brands: ["Anker", "Duracell", "Sony"], 
  default_location: "Thane"
};

export const mockInventory: ProductItem[] = [
  {
    asin: "B07QXV6N1B",
    brand: "Anker",
    product_name: "Anker PowerCore 10000mAh",
    category: "power_bank",
    stock_count: 0, 
    base_price: 1500,
    eta_mins: 12,
    purchase_frequency_rank: 98,
    llm_review_pros: "20-Min Fast Charge", 
    llm_review_cons: "Short Cable Included",
    image_url: "/images/anker-pb.png"
  },
  {
    asin: "B08JV4W4KY",
    brand: "Mi",
    product_name: "Mi Pocket Power Bank Pro 10000mAh",
    category: "power_bank",
    stock_count: 15,
    base_price: 1100, 
    eta_mins: 9,      
    purchase_frequency_rank: 95,
    llm_review_pros: "Extremely Compact",
    llm_review_cons: "Smudges Easily",
    image_url: "/images/mi-pb.png"
  },
  {
    asin: "B09XM7P34K",
    brand: "Portronics",
    product_name: "Portronics Power PRO 10k",
    category: "power_bank",
    stock_count: 8,
    base_price: 999,
    eta_mins: 15,
    purchase_frequency_rank: 85,
    llm_review_pros: "Great Value",
    llm_review_cons: "Heavy Build",
    image_url: "/images/portronics-pb.png"
  }
];