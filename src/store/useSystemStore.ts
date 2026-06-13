// src/store/useSystemStore.ts
import { create } from 'zustand';
import { CrisisCategory } from './useCrisisStore';

interface SystemState {
  activeNudge: CrisisCategory | null;
  triggerNudge: (nudge: CrisisCategory) => void;
  clearNudge: () => void;
  isSearchFocused: boolean;
  setSearchFocused: (focused: boolean) => void;
}

export const useSystemStore = create<SystemState>((set) => ({
  activeNudge: null,
  triggerNudge: (nudge) => set({ activeNudge: nudge }),
  clearNudge: () => set({ activeNudge: null }),
  isSearchFocused: false,
  setSearchFocused: (focused) => set({ isSearchFocused: focused }),
}));
