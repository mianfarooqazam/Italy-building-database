// File: useDoorFabricDetailsStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useDoorFabricDetailsStore = create(
  persist(
    (set) => ({
      // State variables
      doorMaterial: null,
      doorThickness: '',
      uValue: null,
      uaValue: null,
      doorHeatLoss: null, // Added doorHeatLoss
      fabricHeatLoss: null, // Added fabricHeatLoss

      // Actions
      setDoorMaterial: (doorMaterial) => set({ doorMaterial }),
      setDoorThickness: (doorThickness) => set({ doorThickness }),
      setUValue: (uValue) => set({ uValue }),
      setUAValue: (uaValue) => set({ uaValue }),
      setDoorHeatLoss: (doorHeatLoss) => set({ doorHeatLoss }),
      setFabricHeatLoss: (fabricHeatLoss) => set({ fabricHeatLoss }),
    }),
    {
      name: 'door-fabric-details-storage', // Unique name for storage key
    }
  )
);

export default useDoorFabricDetailsStore;