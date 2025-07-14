// useLightingStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useLightingStore = create(
  persist(
    (set) => ({
      lights: [],
      totalWattage: 0,
      totalAnnualEnergy: 0,
      setLights: (lights) => set({ lights }),
      setTotalWattage: (totalWattage) => set({ totalWattage }),
      setTotalAnnualEnergy: (totalAnnualEnergy) => set({ totalAnnualEnergy }),
    }),
    {
      name: "lighting-storage", // unique key for persistence
    }
  )
);

export default useLightingStore;