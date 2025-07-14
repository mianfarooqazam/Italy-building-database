import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppliancesLoadStore = create(
  persist(
    (set) => ({
      // State variables
      appliance: '',
      quantity: '',
      dailyHourUsage: '',
      daysUsage: '',
      wattage: '',
      refrigeratorType: '',
      appliances: [],

      // Actions
      setAppliance: (appliance) => set({ appliance }),
      setQuantity: (quantity) => set({ quantity }),
      setDailyHourUsage: (dailyHourUsage) => set({ dailyHourUsage }),
      setDaysUsage: (daysUsage) => set({ daysUsage }),
      setWattage: (wattage) => set({ wattage }),
      setRefrigeratorType: (refrigeratorType) => set({ refrigeratorType }),
      addAppliance: (newAppliance) =>
        set((state) => ({
          appliances: [...state.appliances, newAppliance],
        })),
      removeAppliance: (index) =>
        set((state) => ({
          appliances: state.appliances.filter((_, i) => i !== index),
        })),
    }),
    {
      name: 'appliances-load-storage',
    }
  )
);

export default useAppliancesLoadStore;