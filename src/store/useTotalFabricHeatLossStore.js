// File: useTotalFabricHeatLossStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTotalFabricHeatLossStore = create(
  persist(
    (set) => ({
      // State for all heat loss values
      roofHeatLoss: '0.000',
      wallHeatLoss: '0.000',
      slabHeatLoss: '0.000',
      windowHeatLoss: '0.000',
      doorHeatLoss: '0.000',
      totalFabricHeatLoss: '0.000',

      // Actions
      setRoofHeatLoss: (value) => 
        set((state) => {
          const roofHL = parseFloat(value) || 0;
          const wallHL = parseFloat(state.wallHeatLoss) || 0;
          const slabHL = parseFloat(state.slabHeatLoss) || 0;
          const windowHL = parseFloat(state.windowHeatLoss) || 0;
          const doorHL = parseFloat(state.doorHeatLoss) || 0;
          
          const total = (roofHL + wallHL + slabHL + windowHL + doorHL).toFixed(3);
          
          return { 
            roofHeatLoss: value,
            totalFabricHeatLoss: total
          };
        }),
      
      setWallHeatLoss: (value) => 
        set((state) => {
          const roofHL = parseFloat(state.roofHeatLoss) || 0;
          const wallHL = parseFloat(value) || 0;
          const slabHL = parseFloat(state.slabHeatLoss) || 0;
          const windowHL = parseFloat(state.windowHeatLoss) || 0;
          const doorHL = parseFloat(state.doorHeatLoss) || 0;
          
          const total = (roofHL + wallHL + slabHL + windowHL + doorHL).toFixed(3);
          
          return { 
            wallHeatLoss: value,
            totalFabricHeatLoss: total
          };
        }),
      
      setSlabHeatLoss: (value) => 
        set((state) => {
          const roofHL = parseFloat(state.roofHeatLoss) || 0;
          const wallHL = parseFloat(state.wallHeatLoss) || 0;
          const slabHL = parseFloat(value) || 0;
          const windowHL = parseFloat(state.windowHeatLoss) || 0;
          const doorHL = parseFloat(state.doorHeatLoss) || 0;
          
          const total = (roofHL + wallHL + slabHL + windowHL + doorHL).toFixed(3);
          
          return { 
            slabHeatLoss: value,
            totalFabricHeatLoss: total
          };
        }),
      
      setWindowHeatLoss: (value) => 
        set((state) => {
          const roofHL = parseFloat(state.roofHeatLoss) || 0;
          const wallHL = parseFloat(state.wallHeatLoss) || 0;
          const slabHL = parseFloat(state.slabHeatLoss) || 0;
          const windowHL = parseFloat(value) || 0;
          const doorHL = parseFloat(state.doorHeatLoss) || 0;
          
          const total = (roofHL + wallHL + slabHL + windowHL + doorHL).toFixed(3);
          
          return { 
            windowHeatLoss: value,
            totalFabricHeatLoss: total
          };
        }),
      
      setDoorHeatLoss: (value) => 
        set((state) => {
          const roofHL = parseFloat(state.roofHeatLoss) || 0;
          const wallHL = parseFloat(state.wallHeatLoss) || 0;
          const slabHL = parseFloat(state.slabHeatLoss) || 0;
          const windowHL = parseFloat(state.windowHeatLoss) || 0;
          const doorHL = parseFloat(value) || 0;
          
          const total = (roofHL + wallHL + slabHL + windowHL + doorHL).toFixed(3);
          
          return { 
            doorHeatLoss: value,
            totalFabricHeatLoss: total
          };
        }),
    }),
    {
      name: 'total-fabric-heat-loss-storage',
    }
  )
);

export default useTotalFabricHeatLossStore;