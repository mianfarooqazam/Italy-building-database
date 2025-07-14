import { 
    Orientation_k_values, 
    Solar_declination, 
    City_latitude,
    City_solar_irradiance
} from '../../utils/solargain/CitiesValues.js'; 

// Define the angle pbytwo in radians
const pbytwo = 0.785;

// Precompute sine values
const sin_pbytwo = Math.sin(pbytwo);
const sin_pbytwo_sq = Math.pow(sin_pbytwo, 2);
const sin_pbytwo_cub = Math.pow(sin_pbytwo, 3);

// Function to calculate A, B, C for a given set of k-values
const calculateABC = (k) => {
    const A = k.k1 * sin_pbytwo_cub + k.k2 * sin_pbytwo_sq + k.k3 * sin_pbytwo;
    const B = k.k4 * sin_pbytwo_cub + k.k5 * sin_pbytwo_sq + k.k6 * sin_pbytwo;
    const C = k.k7 * sin_pbytwo_cub + k.k8 * sin_pbytwo_sq + k.k9 * sin_pbytwo + 1; 
    return { A, B, C };
};

// Convert ABC_values to an array of objects for console.table
const ABC_table = Object.keys(Orientation_k_values).map(orientation => {
    const kValues = Orientation_k_values[orientation];
    const { A, B, C } = calculateABC(kValues);
    return {
        Orientation: orientation,
        A: A.toFixed(5),
        B: B.toFixed(5),
        C: C.toFixed(5)
    };
});

// Log ABC_values as a table
console.log("ABC Values:");
console.table(ABC_table);

// Function to convert degrees to radians
const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180);
};

// Function to calculate phi for each city and each month
const calculatePhi = () => {
    const City_phi = {}; 

    for (const city in City_latitude) {
        const latitude = City_latitude[city];
        City_phi[city] = {};

        for (const month in Solar_declination) {
            const declination = Solar_declination[month];
            const phi_degrees = latitude - declination;
            const phi_radians = degreesToRadians(phi_degrees);
            City_phi[city][month] = phi_radians; // Store as number for calculations
        }
    }

    return City_phi;
};

// Calculate phi values
const phiValues = calculatePhi();

// Convert phiValues to array format suitable for console.table
const phiTable = Object.keys(phiValues).map(city => {
    const row = { City: city };
    for (const month in phiValues[city]) {
        row[month] = phiValues[city][month].toFixed(5);
    }
    return row;
});

// Log phi values as a table
console.log("Phi Values (in radians):");
console.table(phiTable);

// Function to calculate rhnic values
const calculateRhnic = () => {
    const rhnicValues = {};

    for (const city in phiValues) {
        rhnicValues[city] = {};

        for (const orientationObj of ABC_table) {
            const orientation = orientationObj.Orientation;
            const A = parseFloat(orientationObj.A);
            const B = parseFloat(orientationObj.B);
            const C = parseFloat(orientationObj.C);
            rhnicValues[city][orientation] = {};

            for (const month in phiValues[city]) {
                const phi = phiValues[city][month];
                const cos_phi = Math.cos(phi);
                const rhnic = (A * Math.pow(cos_phi, 2)) + (B * cos_phi) + C;
                rhnicValues[city][orientation][month] = rhnic.toFixed(8);
            }
        }
    }

    return rhnicValues;
};

// Calculate rhnic values
const rhnic = calculateRhnic();

// Log rhnic values as tables per city
console.log("Rhnic Values:\n");

for (const city in rhnic) {
    const cityTable = Object.keys(rhnic[city]).map(orientation => {
        const row = { Orientation: orientation };
        for (const month in rhnic[city][orientation]) {
            row[month] = rhnic[city][orientation][month];
        }
        return row;
    });
    console.log(`Rhnic Values for ${city}:`);
    console.table(cityTable);
}

// --- New Section: Calculation of Sorient ---

// Function to calculate sorient values
const calculateSorient = () => {
    const sorientValues = {};

    for (const city in City_solar_irradiance) {
        sorientValues[city] = {};

        for (const orientation in rhnic[city]) {
            sorientValues[city][orientation] = {};

            for (const month in City_solar_irradiance[city]) {
                const irradiance = City_solar_irradiance[city][month];
                const rhnicValue = parseFloat(rhnic[city][orientation][month]);
                const sorient = irradiance * rhnicValue;
                sorientValues[city][orientation][month] = sorient.toFixed(5);
            }
        }
    }

    return sorientValues;
};

// Calculate sorient values
const sorient = calculateSorient();

// Log sorient values as tables per city
console.log("Sorient Values:\n");

for (const city in sorient) {
    const cityTable = Object.keys(sorient[city]).map(orientation => {
        const row = { Orientation: orientation };
        for (const month in sorient[city][orientation]) {
            row[month] = sorient[city][orientation][month];
        }
        return row;
    });
    console.log(`Sorient Values for ${city}:`);
    console.table(cityTable);
}
