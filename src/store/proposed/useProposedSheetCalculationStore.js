
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useProposedSheetCalculationStore = create(
  persist(
    (set) => ({
      totalKWhCoolingSelected: 0,
      totalKWhHeatingSelected: 0,
      eui: 0, // Energy Utilization Index (EUI)
      
      // New fields for appliances and lighting
      totalAnnualAppliancesEnergy: 0,
      totalAnnualLightingEnergy: 0,

      // Month-wise kWh Cooling and Heating (arrays of 12 elements)
      monthlyKWhCoolingSelected: Array(12).fill(0),
      monthlyKWhHeatingSelected: Array(12).fill(0),

      // Function to set the total sums
      setSums: (cooling, heating) =>
        set({
          totalKWhCoolingSelected: cooling,
          totalKWhHeatingSelected: heating,
        }),

      // Function to set month-wise kWh Cooling
      setMonthlyKWhCooling: (monthlyCooling) =>
        set({
          monthlyKWhCoolingSelected: monthlyCooling,
        }),

      // Function to set month-wise kWh Heating
      setMonthlyKWhHeating: (monthlyHeating) =>
        set({
          monthlyKWhHeatingSelected: monthlyHeating,
        }),

      // Function to set EUI
      setEUI: (euiValue) =>
        set({
          eui: euiValue,
        }),
        
      // New function to set appliances energy
      setAppliancesEnergy: (energy) =>
        set({
          totalAnnualAppliancesEnergy: energy,
        }),
        
      // New function to set lighting energy
      setLightingEnergy: (energy) =>
        set({
          totalAnnualLightingEnergy: energy,
        }),

      // Optional: Function to reset all values
      resetStore: () =>
        set({
          totalKWhCoolingSelected: 0,
          totalKWhHeatingSelected: 0,
          eui: 0,
          totalAnnualAppliancesEnergy: 0,
          totalAnnualLightingEnergy: 0,
          monthlyKWhCoolingSelected: Array(12).fill(0),
          monthlyKWhHeatingSelected: Array(12).fill(0),
        }),
    }),
    {
      name: "proposed-sheet-calculation-store", // unique name
    }
  )
);

export default useProposedSheetCalculationStore;