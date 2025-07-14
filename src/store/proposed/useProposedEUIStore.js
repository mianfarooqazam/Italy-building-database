// src/store/useProposedEUIStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Create a Zustand store with persistence
const useProposedEUIStore = create(
  persist(
    (set) => ({
      // Initial state
      proposedEUI: 0,
      energySavings: 0,
      
      // Actions to update the state
      setProposedEUI: (value) => set({ proposedEUI: value }),
      setEnergySavings: (value) => set({ energySavings: value }),
      
      // Reset values
      resetValues: () => set({ proposedEUI: 0, energySavings: 0 }),
    }),
    {
      name: 'proposed-eui-storage', // unique name for localStorage
      getStorage: () => localStorage, // Use localStorage for persistence
    }
  )
);

export default useProposedEUIStore;