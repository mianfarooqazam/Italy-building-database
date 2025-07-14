
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useProposedLightingStore = create(
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
      name: "proposed-lighting-storage", // unique key for persistence
    }
  )
);

export default useProposedLightingStore;