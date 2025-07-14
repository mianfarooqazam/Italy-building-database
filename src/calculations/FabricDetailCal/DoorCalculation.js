// File: DoorCalculation.js

export function calculateRValue(thicknessInches, kValue) {
  // Convert thickness from inches to meters
  const thicknessMeters = thicknessInches * 0.0254;

  // Calculate R-value
  const rValue = thicknessMeters / kValue;

  return rValue;
}

export function calculateRTotal(rValues, hi = 2.5, ho = 11.54) {
  // Ensure hi and ho are valid numbers greater than zero
  const hiValue = parseFloat(hi);
  const hoValue = parseFloat(ho);

  if (hiValue <= 0 || isNaN(hiValue)) {
    throw new Error("Invalid value for hi. It must be a number greater than zero.");
  }

  if (hoValue <= 0 || isNaN(hoValue)) {
    throw new Error("Invalid value for ho. It must be a number greater than zero.");
  }

  // Calculate surface resistances
  const rHi = 1 / hiValue;
  const rHo = 1 / hoValue;

  // Sum the R-values
  const sumRValues = rValues.reduce((sum, rValue) => sum + rValue, 0);

  // Add inverses of hi and ho
  const rTotal = sumRValues + rHi + rHo;

  return rTotal;
}

export function calculateUValue(rTotal) {
  // Calculate U-value
  const uValue = 1 / parseFloat(rTotal);
  return uValue;
}

export function calculateDoorHeatLoss(uaValue) {
  // Make sure we're working with a numeric value
  const numericUAValue = parseFloat(uaValue) || 0;
  return numericUAValue;
}

export function calculateTotalFabricHeatLoss(roofHeatLoss, wallHeatLoss, slabHeatLoss, windowHeatLoss, doorUAValue) {
  // Make sure we're working with numerical values
  const roof = parseFloat(roofHeatLoss) || 0;
  const wall = parseFloat(wallHeatLoss) || 0;
  const slab = parseFloat(slabHeatLoss) || 0;
  const window = parseFloat(windowHeatLoss) || 0;
  const door = parseFloat(doorUAValue) || 0;
  
  return roof + wall + slab + window + door;
}