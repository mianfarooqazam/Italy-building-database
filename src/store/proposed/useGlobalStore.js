// src/store/useGlobalStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useGlobalStore = create(
  persist(
    (set) => ({
      /*** Building Information Slice ***/
      ownerName: "",
      address: "",
      plotNo: "",
      streetNo: "",
      postalCode: "",
      selectedCity: "",
      setOwnerName: (ownerName) => set({ ownerName }),
      setAddress: (address) => set({ address }),
      setPlotNo: (plotNo) => set({ plotNo }),
      setStreetNo: (streetNo) => set({ streetNo }),
      setPostalCode: (postalCode) => set({ postalCode }),
      setSelectedCity: (selectedCity) => set({ selectedCity }),

      /*** Floor Plan Slice ***/
      buildingOrientation: "",
      numberOfFloors: "",
      wallLengths: {},
      wallHeight: "",
      sidesConnected: 0,
      totalFloorArea: 0,
      dwellingVolume: 0,
      totalWallArea: 0,
      totalWindowArea: 0,
      totalDoorArea: 0,
      netWallArea: 0,
      totalArea: 0,
      windows: [],
      doors: [],
      numberOfOccupants: "",
      setTemperature: "",
      coolingHours: [],
      heatingHours: [],
      setBuildingOrientation: (buildingOrientation) => set({ buildingOrientation }),
      setNumberOfFloors: (numberOfFloors) => set({ numberOfFloors }),
      setWallLengths: (wallLengths) => set({ wallLengths }),
      setWallHeight: (wallHeight) => set({ wallHeight }),
      setSidesConnected: (sidesConnected) => set({ sidesConnected }),
      setTotalFloorArea: (totalFloorArea) => set({ totalFloorArea }),
      setDwellingVolume: (dwellingVolume) => set({ dwellingVolume }),
      setTotalWallArea: (totalWallArea) => set({ totalWallArea }),
      setTotalWindowArea: (totalWindowArea) => set({ totalWindowArea }),
      setTotalDoorArea: (totalDoorArea) => set({ totalDoorArea }),
      setNetWallArea: (netWallArea) => set({ netWallArea }),
      setTotalArea: (totalArea) => set({ totalArea }),
      setWindows: (windows) => set({ windows }),
      setDoors: (doors) => set({ doors }),
      setNumberOfOccupants: (numberOfOccupants) => set({ numberOfOccupants }),
      setSetTemperature: (setTemperature) => set({ setTemperature }),
      setCoolingHours: (coolingHours) => set({ coolingHours }),
      setHeatingHours: (heatingHours) => set({ heatingHours }),

      /*** Roof Fabric Details Slice ***/
      roofOuterLayerMaterial: null,
      roofOuterLayerThickness: "",
      roofCoreLayerMaterial: null,
      roofCoreLayerThickness: "",
      roofInsulationLayerMaterial: null,
      roofInsulationLayerThickness: "",
      roofInnerLayerMaterial: null,
      roofInnerLayerThickness: "",
      uValueRoof: null,
      uaValueRoof: null,
      fabricHeatLoss: null,
      kappaValueRoof: null,
      setRoofOuterLayerMaterial: (material) => set({ roofOuterLayerMaterial: material }),
      setRoofOuterLayerThickness: (thickness) => set({ roofOuterLayerThickness: thickness }),
      setRoofCoreLayerMaterial: (material) => set({ roofCoreLayerMaterial: material }),
      setRoofCoreLayerThickness: (thickness) => set({ roofCoreLayerThickness: thickness }),
      setRoofInsulationLayerMaterial: (material) => set({ roofInsulationLayerMaterial: material }),
      setRoofInsulationLayerThickness: (thickness) => set({ roofInsulationLayerThickness: thickness }),
      setRoofInnerLayerMaterial: (material) => set({ roofInnerLayerMaterial: material }),
      setRoofInnerLayerThickness: (thickness) => set({ roofInnerLayerThickness: thickness }),
      setUValueRoof: (uValue) => set({ uValueRoof: uValue }),
      setUAValueRoof: (uaValue) => set({ uaValueRoof: uaValue }),
      setFabricHeatLoss: (fabricHeatLoss) => set({ fabricHeatLoss }),
      setKappaValueRoof: (kappaValue) => set({ kappaValueRoof: kappaValue }),

      /*** Wall Fabric Details Slice ***/
      wallOuterLayerMaterial: null,
      wallOuterLayerThickness: "",
      wallCoreLayerMaterial: null,
      wallCoreLayerThickness: "",
      wallInsulationLayerMaterial: null,
      wallInsulationLayerThickness: "",
      wallInnerLayerMaterial: null,
      wallInnerLayerThickness: "",
      wallUValue: null,
      wallUAValue: null,
      kappaValueWall: null,
      setWallOuterLayerMaterial: (material) => set({ wallOuterLayerMaterial: material }),
      setWallOuterLayerThickness: (thickness) => set({ wallOuterLayerThickness: thickness }),
      setWallCoreLayerMaterial: (material) => set({ wallCoreLayerMaterial: material }),
      setWallCoreLayerThickness: (thickness) => set({ wallCoreLayerThickness: thickness }),
      setWallInsulationLayerMaterial: (material) => set({ wallInsulationLayerMaterial: material }),
      setWallInsulationLayerThickness: (thickness) => set({ wallInsulationLayerThickness: thickness }),
      setWallInnerLayerMaterial: (material) => set({ wallInnerLayerMaterial: material }),
      setWallInnerLayerThickness: (thickness) => set({ wallInnerLayerThickness: thickness }),
      setWallUValue: (uValue) => set({ wallUValue: uValue }),
      setWallUAValue: (uaValue) => set({ wallUAValue: uaValue }),
      setKappaValueWall: (kappaValue) => set({ kappaValueWall: kappaValue }),

      /*** Slab Fabric Details Slice ***/
      selectedSlabType: null,
      slabUValue: null,
      slabUAValue: null,
      setSelectedSlabType: (selected) => set({ selectedSlabType: selected }),
      setSlabUValue: (uValue) => set({ slabUValue: uValue }),
      setSlabUAValue: (uaValue) => set({ slabUAValue: uaValue }),

      /*** Window Fabric Details Slice ***/
      selectedWindowType: null,
      selectedFrameType: null,
      selectedShadingCover: null,
      windowUValue: null,
      windowUAValue: null,
      setSelectedWindowType: (selectedWindowType) => set({ selectedWindowType }),
      setSelectedFrameType: (selectedFrameType) => set({ selectedFrameType }),
      setSelectedShadingCover: (selectedShadingCover) => set({ selectedShadingCover }),
      setWindowUValue: (uValue) => set({ windowUValue: uValue }),
      setWindowUAValue: (uaValue) => set({ windowUAValue: uaValue }),

      /*** Door Fabric Details Slice ***/
      doorMaterial: null,
      doorThickness: "",
      doorUValue: null,
      doorUAValue: null,
      setDoorMaterial: (doorMaterial) => set({ doorMaterial }),
      setDoorThickness: (doorThickness) => set({ doorThickness }),
      setDoorUValue: (uValue) => set({ doorUValue: uValue }),
      setDoorUAValue: (uaValue) => set({ doorUAValue: uaValue }),

      /*** Lighting Slice ***/
      lights: [],
      totalWattage: 0,
      setLights: (lights) => set({ lights }),
      setTotalWattage: (totalWattage) => set({ totalWattage }),

      /*** Ventilation Slice ***/
      numberOfFans: "",
      constructionType: "",
      lobbyType: "",
      percentageDraughtProofed: "",
      ventilationType: "",
      ventilationDataArray: [],
      setNumberOfFans: (value) => set({ numberOfFans: value }),
      setConstructionType: (value) => set({ constructionType: value }),
      setLobbyType: (value) => set({ lobbyType: value }),
      setPercentageDraughtProofed: (value) => set({ percentageDraughtProofed: value }),
      setVentilationType: (value) => set({ ventilationType: value }),
      setVentilationDataArray: (array) => set({ ventilationDataArray: array }),

      /*** Appliances Load Slice ***/
      appliance: "",
      manufacturer: "",
      quantity: "",
      dailyHourUsage: "",
      wattage: "",
      refrigeratorType: "",
      appliances: [],
      setAppliance: (appliance) => set({ appliance }),
      setManufacturer: (manufacturer) => set({ manufacturer }),
      setQuantity: (quantity) => set({ quantity }),
      setDailyHourUsage: (dailyHourUsage) => set({ dailyHourUsage }),
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

      /*** HLP Slice ***/
      ventilationHeatLoss: [],
      heatTransferCoefficient: [],
      heatLossParameter: [],
      setVentilationHeatLoss: (data) => set({ ventilationHeatLoss: data }),
      setHeatTransferCoefficient: (data) => set({ heatTransferCoefficient: data }),
      setHeatLossParameter: (data) => set({ heatLossParameter: data }),

      /*** Solar Gain Slice ***/
      solarGainTotals: {},
      totalGains: {},
      setSolarGainTotals: (totals) => set({ solarGainTotals: totals }),
      setTotalGains: (gains) => set({ totalGains: gains }),

      /*** Sheet Calculation Slice ***/
      sheetSums: { cooling: 0, heating: 0 },
      monthlyKWhCooling: [],
      monthlyKWhHeating: [],
      eui: 0,
      setSheetSums: (cooling, heating) => set({ sheetSums: { cooling, heating } }),
      setMonthlyKWhCooling: (data) => set({ monthlyKWhCooling: data }),
      setMonthlyKWhHeating: (data) => set({ monthlyKWhHeating: data }),
      setSheetEUI: (euiValue) => set({ eui: euiValue }),
    }),
    {
      name: "global-store", // Persist all slices under one storage key
    }
  )
);

export default useGlobalStore;
