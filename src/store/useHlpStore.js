// useHlpStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useHlpStore = create(
  persist(
    (set) => ({
    ventilationHeatLoss: [],
    heatTransferCoefficient: [],
    heatLossParameter: [],
    setVentilationHeatLoss: (data) => set({ ventilationHeatLoss: data }),
    setHeatTransferCoefficient: (data) => set({ heatTransferCoefficient: data }),
    setHeatLossParameter: (data) => set({ heatLossParameter: data }),
  }),
  {
    name: 'hlp-store',
  }
));

export default useHlpStore;