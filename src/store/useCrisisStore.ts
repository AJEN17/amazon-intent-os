// src/store/useCrisisStore.ts
import { create } from 'zustand';
import { RankedItem } from '@/types/inventory';
import { CrisisCategory } from '@/types/intent';

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
    set({ isLoading: true, activeCrisis: crisis, isDrawerOpen: true });
    
    try {
      const response = await fetch('/api/inventory/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, userId: "ajendra_001" })
      });
      
      const data = await response.json();
      
      // Inject the ranked items into the UI state
      set({ recommendedItems: data.items, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch crisis bundle:", error);
      set({ isLoading: false });
    }
  },

  closeDrawer: () => set({ isDrawerOpen: false, activeCrisis: null, recommendedItems: [] }),
  
  // Fires when you swipe to checkout
  resolveCrisis: () => {
    set({ isDrawerOpen: false });
  }
}));