import { mockInventory, mockUserProfile, mockPurchaseHistory } from "./seedData";
import { ProductItem, UserProfile } from "../../types/inventory";

// Simulates a DynamoDB query with a slight delay for realism
export const fetchInventoryByCategory = async (category: string, macro_crisis?: string): Promise<ProductItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Normalize the input: remove spaces, lowercase, replace spaces with underscores
      const normalizedCategory = category ? category.toLowerCase().trim().replace(/ /g, '_') : "";
      const normalizedCrisis = macro_crisis ? macro_crisis.toLowerCase().trim().replace(/ /g, '_') : "";
      
      const results = mockInventory.filter(item => 
        (normalizedCategory && item.category.toLowerCase() === normalizedCategory) || 
        (normalizedCrisis && item.macro_crisis.toLowerCase() === normalizedCrisis)
      );
      resolve(results);
    }, 150); // 150ms mock latency
  });
};

export const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUserProfile);
    }, 50);
  });
};

export const fetchUserHistory = async (userId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPurchaseHistory.filter(h => h.user_id === userId));
    }, 50);
  });
};
export const fetchFullInventory = async (): Promise<ProductItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockInventory);
    }, 50);
  });
};