import { create } from 'zustand';

interface CardStore {
  isAllCollapsed: boolean;
  onCollapseAll: () => void;
  resetCollapse: () => void;
}

export const useCardStore = create<CardStore>((set) => ({
  isAllCollapsed: false,
  onCollapseAll: () => set({ isAllCollapsed: true }),
  resetCollapse: () => set({ isAllCollapsed: false }),
}));
