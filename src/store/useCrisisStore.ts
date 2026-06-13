// src/store/useCrisisStore.ts
import { create } from 'zustand';
import { RankedItem } from '@/types/inventory';

// Note: If you don't have a separate intent.ts file, we can just define the type here natively!
export type CrisisCategory = 
  | "POWER_CUT_CRISIS" | "PARTY_CRISIS" | "BABY_CRISIS" 
  | "TRAVEL_CRISIS" | "MEDICINE_CRISIS" | "RAIN_CRISIS" 
  | "COOKING_CRISIS" | "PET_CRISIS";

interface CrisisState {
  isDrawerOpen: boolean;
  isLoading: boolean;
  activeCrisis: CrisisCategory | null;
  recommendedItems: RankedItem[];
  // Actions
  triggerCrisis: (crisis: CrisisCategory, category: string) => Promise<void>;
  closeDrawer: () => void;
  resolveCrisis: () => void;
}

export const useCrisisStore = create<CrisisState>((set) => ({
  isDrawerOpen: false,
  isLoading: false,
  activeCrisis: null,
  recommendedItems: [],

  // This fires when the user speaks their problem or clicks a tile
  triggerCrisis: async (crisis, category) => {
    // 1. Immediately open drawer and show loading state
    set({ isLoading: true, activeCrisis: crisis, isDrawerOpen: true });
    
    try {
      const response = await fetch('/api/inventory/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_category: category, userId: "ajendra_001" })      
      });
      
      const data = await response.json();
      
      // 2. SAFETY CHECK: If the API failed, throw to the catch block
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch items");
      }
      
      // 3. Inject the ranked items into the UI state safely
      set({ recommendedItems: data.items || [], isLoading: false });
      
    } catch (error) {
      console.error("Failed to fetch crisis bundle:", error);
      // Ensure loading stops and perhaps clear items on failure
      set({ isLoading: false, recommendedItems: [] });
    }
  },

  closeDrawer: () => set({ isDrawerOpen: false, activeCrisis: null, recommendedItems: [] }),
  
  // Fires when you swipe to checkout
  resolveCrisis: () => {
    set({ isDrawerOpen: false });
  }
}));