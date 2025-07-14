export function getWallInputs(orientation, OrientationSingleWindow, OrientationDoubleWindow) {
  let walls = [];
  if (!orientation) return walls;

  if (OrientationSingleWindow.includes(orientation)) {
    walls.push(`${orientation} Wall Length (ft)`);
    if (orientation === "North" || orientation === "South") {
      walls.push(`East Wall Length (ft)`);
    } else if (orientation === "East" || orientation === "West") {
      walls.push(`North Wall Length (ft)`);
    }
  } else if (OrientationDoubleWindow.includes(orientation)) {
    let wallsToShow = [];

    switch (orientation) {
      case "North-East":
        wallsToShow = ["North-East", "South-East"];
        break;
      case "North-West":
        wallsToShow = ["North-West", "South-West"];
        break;
      case "South-East":
        wallsToShow = ["South-East", "North-East"];
        break;
      case "South-West":
        wallsToShow = ["South-West", "North-West"];
        break;
      default:
        wallsToShow = [];
    }

    walls = wallsToShow.map((dir) => `${dir} Wall Length (ft)`);
  }
  return walls;
}

export function calculateArea(wallLengths, wallLabels) {
  if (wallLabels.length === 2) {
    const length1 = parseFloat(wallLengths[wallLabels[0]]) || 0;
    const length2 = parseFloat(wallLengths[wallLabels[1]]) || 0;
    return length1 * length2;
  }
  return 0;
}

export function calculateTotalWallArea(wallLengths, wallLabels, wallHeightPerFloor, numberOfFloors) {
  if (wallLabels.length === 2) {
    const length1 = parseFloat(wallLengths[wallLabels[0]]) || 0;
    const length2 = parseFloat(wallLengths[wallLabels[1]]) || 0;
    const perimeter = 2 * (length1 + length2);
    const height = parseFloat(wallHeightPerFloor) || 0;
    const floors = parseInt(numberOfFloors) || 1;
    return perimeter * height * floors;
  }
  return 0;
}

// New function to calculate window area from dimensions
export function calculateWindowArea(length, height) {
  return parseFloat(length || 0) * parseFloat(height || 0);
}

// New function to calculate door area from dimensions
export function calculateDoorArea(length, height) {
  return parseFloat(length || 0) * parseFloat(height || 0);
}

export function calculateTotalWindowArea(windows) {
  return windows.reduce((total, window) => total + (parseFloat(window.area) || 0), 0);
}

export function calculateTotalDoorArea(doors) {
  return doors.reduce((total, door) => total + (parseFloat(door.area) || 0), 0);
}

export function calculateNetWallArea(totalWallArea, totalWindowArea, totalDoorArea) {
  return totalWallArea - totalWindowArea - totalDoorArea;
}

export function calculateDwellingVolume(area, wallHeightPerFloor, numberOfFloors) {
  const height = parseFloat(wallHeightPerFloor) || 0;
  const floors = parseInt(numberOfFloors) || 1;
  return area * height * floors;
}

export function calculateTotalArea(floorArea, netWallArea, totalWindowArea, totalDoorArea) {
  const roofArea = floorArea; // Floor area is always the same as roof area
  return floorArea + roofArea + netWallArea + totalWindowArea + totalDoorArea;
}

// Add the unit conversion functions
export function convertSqFtToSqM(areaInSqFt) {
  return areaInSqFt * 0.092903;
}

export function convertCubicFtToCubicM(volumeInCubicFt) {
  return volumeInCubicFt * 0.0283168;
}

// Function to get max allowed windows based on sides connected
export function getMaxAllowedWindows(sidesConnected) {
  if (sidesConnected === 1) return 3;
  if (sidesConnected === 2) return 2;
  if (sidesConnected === 3) return 1;
  if (sidesConnected === 4) return 0;
  return 4; // Default if sidesConnected is 0 or null
}