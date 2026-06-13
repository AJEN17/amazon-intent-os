// src/store/useCrisisStore.ts
import { create } from 'zustand';
import { RankedItem } from '@/types/inventory';
import { useCartStore } from './useCartStore';

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
  selectedItems: { [asin: string]: { item: RankedItem; quantity: number } };
  // Actions
  triggerCrisis: (crisis: CrisisCategory, category: string, isSearch?: boolean) => Promise<void>;
  updateItemQuantity: (item: RankedItem, delta: number) => void;
  closeDrawer: () => void;
  resolveCrisis: () => void;
}

export const useCrisisStore = create<CrisisState>((set, get) => ({
  isDrawerOpen: false,
  isLoading: false,
  activeCrisis: null,
  recommendedItems: [],
  selectedItems: {},
  
  updateItemQuantity: (item, delta) => set((state) => {
    const prevEntry = state.selectedItems[item.asin];
    const prevQty = prevEntry ? prevEntry.quantity : 0;
    const newQty = Math.max(0, prevQty + delta);
    
    const newSelectedItems = { ...state.selectedItems };
    
    if (newQty === 0) {
      delete newSelectedItems[item.asin];
    } else {
      newSelectedItems[item.asin] = { item, quantity: newQty };
    }
    
    return { selectedItems: newSelectedItems };
  }),

  // This fires when the user speaks their problem or clicks a tile
  triggerCrisis: async (crisis, category, isSearch = false) => {
    // 1. Immediately open drawer and show loading state
    set({ isLoading: true, activeCrisis: crisis, isDrawerOpen: true, selectedItems: {} });
    
    try {
      const response = await fetch('/api/inventory/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_category: category, macro_crisis: crisis, userId: "ajendra_001", isSearch })
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) throw new Error("Matchmaking failed");
      
      const items = data.items || [];
      
      set({ recommendedItems: items, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch crisis bundle:", error);
      set({ isLoading: false, recommendedItems: [], selectedItems: {} });
    }
  },

  closeDrawer: () => set({ isDrawerOpen: false, activeCrisis: null, recommendedItems: [], selectedItems: {} }),
  
  // Fires when you swipe to checkout
  resolveCrisis: () => {
    const { selectedItems } = get();
    const cartStore = useCartStore.getState();
    
    Object.values(selectedItems).forEach(({ item, quantity }) => {
      for (let i = 0; i < quantity; i++) {
        cartStore.addItem(item);
      }
    });
    
    set({ isDrawerOpen: false });
  }
}));