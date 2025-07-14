import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useProposedSolarGainStore = create(
  persist(
    (set) => ({
      solarGainTotals: {}, // { January: value, February: value, ... }
      totalGains: {},      // { January: value, February: value, ... }

      setSolarGainTotals: (totals) => set({ solarGainTotals: totals }),
      setTotalGains: (gains) => set({ totalGains: gains }),
    }),
    {
      name: 'proposed-solar-gain-storage', // Unique name for storage key
    }
  )
);

export default useProposedSolarGainStore;
