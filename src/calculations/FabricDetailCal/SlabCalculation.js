// File: SlabCalculation.js

export function calculateSlabHeatLoss(uaValue) {
    // Make sure we're working with a numeric value
    const numericUAValue = parseFloat(uaValue) || 0;
    return numericUAValue;
  }
  
  export function calculateTotalFabricHeatLoss(roofHeatLoss, wallHeatLoss, slabUAValue, windowUAValue, doorUAValue) {
    // Make sure we're working with numerical values
    const roof = parseFloat(roofHeatLoss) || 0;
    const wall = parseFloat(wallHeatLoss) || 0;
    const slab = parseFloat(slabUAValue) || 0;
    const window = parseFloat(windowUAValue) || 0;
    const door = parseFloat(doorUAValue) || 0;
    
    return roof + wall + slab + window + door;
  }