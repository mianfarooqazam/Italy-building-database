// File: useRoofFabricDetailsStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useProposedRoofFabricDetailsStore = create(
  persist(
    (set) => ({
      // State variables
      outerLayerMaterial: null,
      outerLayerThickness: '',
      coreLayerMaterial: null,
      coreLayerThickness: '',
      insulationLayerMaterial: null,
      insulationLayerThickness: '',
      innerLayerMaterial: null,
      innerLayerThickness: '',
      uValue: null,
      uaValue: null,
      fabricHeatLoss: null,
      kappaValueRoof: null,
      roofHeatLoss: null, // Added individual roof heat loss

      // Actions
      setOuterLayerMaterial: (outerLayerMaterial) => set({ outerLayerMaterial }),
      setOuterLayerThickness: (outerLayerThickness) =>
        set({ outerLayerThickness }),
      setCoreLayerMaterial: (coreLayerMaterial) => set({ coreLayerMaterial }),
      setCoreLayerThickness: (coreLayerThickness) => set({ coreLayerThickness }),
      setInsulationLayerMaterial: (insulationLayerMaterial) =>
        set({ insulationLayerMaterial }),
      setInsulationLayerThickness: (insulationLayerThickness) =>
        set({ insulationLayerThickness }),
      setInnerLayerMaterial: (innerLayerMaterial) => set({ innerLayerMaterial }),
      setInnerLayerThickness: (innerLayerThickness) =>
        set({ innerLayerThickness }),
      setUValue: (uValue) => set({ uValue }),
      setUAValue: (uaValue) => set({ uaValue }),
      setFabricHeatLoss: (fabricHeatLoss) =>
        set({ fabricHeatLoss }),
      setKappaValueRoof: (kappaValueRoof) => set({ kappaValueRoof }),
      setRoofHeatLoss: (roofHeatLoss) => set({ roofHeatLoss }), // Added setter for roof heat loss
    }),
    {
      name: 'proposed-roof-fabric-details-storage', // Unique name for storage key
    }
  )
);

export default useProposedRoofFabricDetailsStore;