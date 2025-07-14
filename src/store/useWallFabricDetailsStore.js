// File: useWallFabricDetailsStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWallFabricDetailsStore = create(
  persist(
    (set) => ({
      // Wall Layer Materials
      wallOuterLayerMaterial: null,
      wallOuterLayerThickness: "",
      wallCoreLayerMaterial: null,
      wallCoreLayerThickness: "",
      wallInsulationLayerMaterial: null,
      wallInsulationLayerThickness: "",
      wallInnerLayerMaterial: null,
      wallInnerLayerThickness: "",
      
      // Calculated Values
      uValue: null,
      uaValue: null,
      kappaValue: null,
      wallHeatLoss: null, // Added individual wall heat loss
      fabricHeatLoss: null,

      // Actions
      setWallOuterLayerMaterial: (material) => set({ wallOuterLayerMaterial: material }),
      setWallOuterLayerThickness: (thickness) => set({ wallOuterLayerThickness: thickness }),
      setWallCoreLayerMaterial: (material) => set({ wallCoreLayerMaterial: material }),
      setWallCoreLayerThickness: (thickness) => set({ wallCoreLayerThickness: thickness }),
      setWallInsulationLayerMaterial: (material) => set({ wallInsulationLayerMaterial: material }),
      setWallInsulationLayerThickness: (thickness) => set({ wallInsulationLayerThickness: thickness }),
      setWallInnerLayerMaterial: (material) => set({ wallInnerLayerMaterial: material }),
      setWallInnerLayerThickness: (thickness) => set({ wallInnerLayerThickness: thickness }),
      setUValue: (uValue) => set({ uValue }),
      setUAValue: (uaValue) => set({ uaValue }),
      setKappaValue: (kappaValue) => set({ kappaValue }),
      setWallHeatLoss: (wallHeatLoss) => set({ wallHeatLoss }), // Added setter for wall heat loss
      setFabricHeatLoss: (fabricHeatLoss) => set({ fabricHeatLoss }),
    }),
    {
      name: 'wall-fabric-details-storage', // Unique name for storage key
    }
  )
);

export default useWallFabricDetailsStore;