import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useProposedHlpStore = create(
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
    name: 'proposed-hlp-store',
  }
));

export default useProposedHlpStore;