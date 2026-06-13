// src/store/useCartStore.ts
import { create } from 'zustand';
import { RankedItem } from '@/types/inventory';

interface CartState {
  items: RankedItem[];
  addItem: (item: RankedItem) => void;
  removeItem: (asin: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (asin) => set((state) => ({ items: state.items.filter(i => i.asin !== asin) })),
  clearCart: () => set({ items: [] }),
}));
