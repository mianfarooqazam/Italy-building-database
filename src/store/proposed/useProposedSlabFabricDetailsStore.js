import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useProposedSlabFabricDetailsStore = create(
  persist(
    (set) => ({
      // State variables
      selectedSlabType: null,
      uValue: null,
      uaValue: null,
      slabHeatLoss: null,  // Added slab heat loss
      fabricHeatLoss: null, // Added total fabric heat loss

      //Actions
      setSelectedSlabType: (selected) => set({ selectedSlabType: selected }),
      setUValue: (uValue) => set({ uValue }),
      setUAValue: (uaValue) => set({ uaValue }),
      setSlabHeatLoss: (slabHeatLoss) => set({ slabHeatLoss }),
      setFabricHeatLoss: (fabricHeatLoss) => set({ fabricHeatLoss })
    }),
    {
      name: 'proposed-slab-fabric-details-storage',
    }
  )
);

export default useProposedSlabFabricDetailsStore;