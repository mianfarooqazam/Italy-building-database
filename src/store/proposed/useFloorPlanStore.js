// File: useFloorPlanStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useFloorPlanStore = create(
  persist(
    (set) => ({
      // Building Information
      buildingOrientation: "",
      numberOfFloors: "",
      wallLengths: {},
      wallHeight: "",
      sidesConnected: 0,

      // Calculated Areas and Volume
      totalFloorArea: 0,
      dwellingVolume: 0,
      totalWallArea: 0,
      totalWindowArea: 0,
      totalDoorArea: 0,
      netWallArea: 0,
      totalArea: 0,

      // Openings
      windows: [], // Now includes length, height, and calculated area
      doors: [], // Now includes length, height, and calculated area

      // no of occupants
      numberOfOccupants: '',

      // Indoor Conditions Variables
      setTemperature: "",
      coolingHours: [],
      heatingHours: [],
      selectedCoolingHours: [], // Store the selected cooling time slots (e.g., "8am-9am")
      selectedHeatingHours: [], // Store the selected heating time slots (e.g., "8am-9am")

      // Actions for Building Information
      setBuildingOrientation: (buildingOrientation) => set({ buildingOrientation }),
      setNumberOfFloors: (numberOfFloors) => set({ numberOfFloors }),
      setWallLengths: (wallLengths) => set({ wallLengths }),
      setWallHeight: (wallHeight) => set({ wallHeight }),
      setSidesConnected: (sidesConnected) => set({ sidesConnected }),

      // Actions for Calculated Areas and Volume
      setTotalFloorArea: (totalFloorArea) => set({ totalFloorArea }),
      setDwellingVolume: (dwellingVolume) => set({ dwellingVolume }),
      setTotalWallArea: (totalWallArea) => set({ totalWallArea }),
      setTotalWindowArea: (totalWindowArea) => set({ totalWindowArea }),
      setTotalDoorArea: (totalDoorArea) => set({ totalDoorArea }),
      setNetWallArea: (netWallArea) => set({ netWallArea }),
      setTotalArea: (totalArea) => set({ totalArea }),

      // Actions for Openings
      setWindows: (windows) => set({ windows }),
      setDoors: (doors) => set({ doors }),
      // Actions for occupancy
      setNumberOfOccupants: (numberOfOccupants) => set({ numberOfOccupants }),
      // Actions for Indoor Conditions Variables
      setSetTemperature: (setTemperature) => set({ setTemperature }),
      setCoolingHours: (coolingHours) => set({ coolingHours }),
      setHeatingHours: (heatingHours) => set({ heatingHours }),
      setSelectedCoolingHours: (selectedCoolingHours) => set({ selectedCoolingHours }),
      setSelectedHeatingHours: (selectedHeatingHours) => set({ selectedHeatingHours }),
    }),
    {
      name: "floorplan-storage", // Unique key for persistence
    }
  )
);

export default useFloorPlanStore;