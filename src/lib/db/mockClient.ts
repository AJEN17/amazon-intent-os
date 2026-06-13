// src/lib/db/mockClient.ts
import { mockInventory, mockUserProfile } from "./seedData";
import { ProductItem, UserProfile } from "../../types/inventory";

// Simulates a DynamoDB query with a slight delay for realism
export const fetchInventoryByCategory = async (category: string): Promise<ProductItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = mockInventory.filter(item => item.category === category);
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