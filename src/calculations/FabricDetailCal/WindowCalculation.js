// File: WindowCalculation.js

export function calculateEffectiveUValue(uValue) {
  if (uValue === 0) {
    throw new Error("U-value cannot be zero.");
  }
  const effectiveUValue = 1 / ((1 / uValue) + 0.04);
  return effectiveUValue;
}

export function calculateWindowHeatLoss(uaValue) {
  // Make sure we're working with a numeric value
  const numericUAValue = parseFloat(uaValue) || 0;
  return numericUAValue;
}

export function calculateTotalFabricHeatLoss(roofHeatLoss, wallHeatLoss, slabHeatLoss, windowUAValue, doorUAValue) {
  // Make sure we're working with numerical values
  const roof = parseFloat(roofHeatLoss) || 0;
  const wall = parseFloat(wallHeatLoss) || 0;
  const slab = parseFloat(slabHeatLoss) || 0;
  const window = parseFloat(windowUAValue) || 0;
  const door = parseFloat(doorUAValue) || 0;
  
  return roof + wall + slab + window + door;
}