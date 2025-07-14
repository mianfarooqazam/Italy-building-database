/* Updated Calculation Functions */

// For Mechanical Ventilation: m³/hr is based on number of fans.
export const calculateM3PerHr = (numberOfFans) => {
  if (numberOfFans < 2) {
    throw new Error("Minimum number of intermittent fans is 2.");
  }
  return numberOfFans * 10;
};

export const calculateACH = (m3PerHr, dwellingVolumeM3) => {
  if (dwellingVolumeM3 === 0) {
    throw new Error("Dwelling volume cannot be zero for ACH calculation.");
  }
  return m3PerHr / dwellingVolumeM3;
};

export const calculateAdditionalInfiltration = (numberOfFloors) => {
  return (numberOfFloors - 1) * 0.1;
};

export const constructionTypeValue = (constructionType) => {
  switch (constructionType) {
    case "masonry":
      return 0.35;
    case "steel":
    case "timber":
      return 0.25;
    default:
      throw new Error("Invalid construction type.");
  }
};

// New function to determine lobby type value
export const calculateLobbyTypeValue = (lobbyType) => {
  switch (lobbyType) {
    case "draught":
      return 0;
    case "no-draught":
      return 0.05;
    default:
      throw new Error("Invalid lobby type.");
  }
};

/*
  New logic for window infiltration:
  - If the draught proofed percentage is 0, return 0.
  - Otherwise, return the user's input 
*/
export const calculateWindowInfiltration = (percentageDraughtProofed) => {
  if (percentageDraughtProofed === 0) {
    return 0;
  } else {
    return 0.25 - (0.2 * percentageDraughtProofed / 100);
  }
};

/*
  Updated infiltration rate calculation.
  For Mechanical Ventilation, infiltration rate is the sum of:
    ACH (from fans) + additional infiltration + construction value + window infiltration + lobbyTypeValue.
  For Natural Ventilation, ACH is fixed (set earlier) and used as the infiltration rate.
*/
export const calculateInfiltrationRate = (
  ACH,
  additionalInfiltration,
  constructionValue,
  windowInfiltration,
  lobbyTypeValue
) => {
  return ACH + additionalInfiltration + constructionValue + windowInfiltration + lobbyTypeValue;
};

export const calculateShelterFactor = (sidesConnected) => {
  if (sidesConnected < 0 || sidesConnected > 4) {
    throw new Error("Number of sides connected must be between 0 and 4.");
  }
  return 1 - (0.075 * sidesConnected);
};

export const calculateWindFactor = (windDataArray) => {
  return windDataArray.map((value) => value / 4);
};

export const calculateAdjustedInfiltrationRate = (
  windFactorArray,
  infiltrationRateWithShelterFactor
) => {
  return windFactorArray.map(
    (value) => value * infiltrationRateWithShelterFactor
  );
};

export const calculateFinalInfiltrationRate = (
  adjustedInfiltrationRateArray,
  ventilationType
) => {
  if (ventilationType === "Mechanical Ventilation") {
    // Example mechanical ventilation calculation:
    return adjustedInfiltrationRateArray.map(
      (value) => value + 0.5 * 0.5
    );
  } else if (ventilationType === "Natural Ventilation") {
    // Example natural ventilation calculation:
    return adjustedInfiltrationRateArray.map(
      (value) => 0.5 + value * value * 0.5
    );
  } else {
    throw new Error("Invalid ventilation type.");
  }
};