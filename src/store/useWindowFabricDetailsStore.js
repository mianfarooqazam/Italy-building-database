// File: useWindowFabricDetailsStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWindowFabricDetailsStore = create(
  persist(
    (set) => ({
      // State variables
      selectedWindowType: null,
      selectedFrameType: null,
      selectedShadingCover: null,
      uValue: null,
      uaValue: null,
      windowHeatLoss: null, // Added windowHeatLoss
      fabricHeatLoss: null, // Added fabricHeatLoss

      // Actions
      setSelectedWindowType: (selectedWindowType) => set({ selectedWindowType }),
      setSelectedFrameType: (selectedFrameType) => set({ selectedFrameType }),
      setSelectedShadingCover: (selectedShadingCover) => set({ selectedShadingCover }),
      setUValue: (uValue) => set({ uValue }),
      setUAValue: (uaValue) => set({ uaValue }),
      setWindowHeatLoss: (windowHeatLoss) => set({ windowHeatLoss }),
      setFabricHeatLoss: (fabricHeatLoss) => set({ fabricHeatLoss }),
    }),
    {
      name: 'window-fabric-details-storage', // Unique name for storage key
    }
  )
);

export default useWindowFabricDetailsStore;