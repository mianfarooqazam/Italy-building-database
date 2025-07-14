// useVentilationStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useVentilationStore = create(
  persist(
    (set) => ({
      numberOfFans: '',
      constructionType: '',
      lobbyType: '',
      percentageDraughtProofed: '',
      ventilationType: '',
      ventilationDataArray: [],

      setNumberOfFans: (value) => set({ numberOfFans: value }),
      setConstructionType: (value) => set({ constructionType: value }),
      setLobbyType: (value) => set({ lobbyType: value }),
      setPercentageDraughtProofed: (value) => set({ percentageDraughtProofed: value }),
      setVentilationType: (value) => set({ ventilationType: value }),
      setVentilationDataArray: (array) => set({ ventilationDataArray: array }),
    }),
    {
      name: 'ventilation-storage',
    }
  )
);

export default useVentilationStore;