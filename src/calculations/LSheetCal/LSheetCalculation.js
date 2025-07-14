import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import temperature data
const IslamabadTemperature = require('../../utils/temperature/IslamabadTemperature.json');
const MultanTemperature = require('../../utils/temperature/MultanTemperature.json');
const KarachiTemperature = require('../../utils/temperature/KarachiTemperature.json');
const LahoreTemperature = require('../../utils/temperature/LahoreTemperature.json');
const PeshawarTemperature = require('../../utils/temperature/PeshawarTemperature.json');

// Define month factors
const monthFactors = {
    1: 924.36,
    2: 925.43,
    3: 925.05,
    4: 925.09,
    5: 927.15,
    6: 925.43,
    7: 926.15,
    8: 923.95,
    9: 922.95,
    10: 924.36,
    11: 925.13,
    12: 924.00
};

// Define Gamma-cool values per month
const gammaCoolValues = {
    1: 285.90,
    2: 316.83,
    3: 375.00,
    4: 518.23,
    5: 532.45,
    6: 558.94,
    7: 500.20,
    8: 463.40,
    9: 422.24,
    10: 331.67,
    11: 297.33,
    12: 268.60
};

// Define Gamma-heat values per month
const gammaHeatValues = {
    1: 564.84,
    2: 595.77,
    3: 653.95,
    4: 797.17,
    5: 811.38,
    6: 837.87,
    7: 779.13,
    8: 742.32,
    9: 701.15,
    10: 610.58,
    11: 576.23,
    12: 547.50
};

// Define 'a' values per month
const aValues = {
    1: 2.17486,  
    2: 2.17342,  
    3: 2.17394, 
    4: 2.17388,  
    5: 2.17111,  
    6: 2.17342,  
    7: 2.17246,  
    8: 2.17542,  
    9: 2.17677, 
    10: 2.17486, 
    11: 2.17383, 
    12: 2.17481  
};

const calculateAndLog = (cityData, cityName) => {
    const result = cityData.map(entry => {
        const factor = monthFactors[entry.MO];
        const gammaCool = gammaCoolValues[entry.MO]; 
        const gammaHeat = gammaHeatValues[entry.MO]; 
        const a = aValues[entry.MO]; // Retrieve 'a' value for the month
        const calculation = (24 - entry.T2M) * factor;

        // Calculate y values
        const yCooling = gammaCool / calculation;
        const yHeating = gammaHeat / calculation;

        // Calculate n-cooling
        let nCooling;
        if (yCooling > 0 && yCooling !== 1) {
            nCooling = (1 - (yCooling ** (-a))) / (1 - (yCooling ** -(a + 1)));
        } else if (yCooling === 1) {
            nCooling = a / (a + 1);
        } else {
            nCooling = 1;
        }

        // Calculate n-heating
        let nHeating;
        if (yHeating > 0 && yHeating !== 1) {
            nHeating = (1 - (yHeating ** a)) / (1 - (yHeating ** (a + 1)));
        } else if (yHeating === 1) {
            nHeating = a / (a + 1);
        } else {
            nHeating = 1;
        }

        // Calculate cooling nxlm 
        const coolingNxlm = nCooling * calculation;

        // Calculate heating nxgm
        const heatingnxgm = gammaHeat * nHeating;

        //  Calculation: heatingLoad
        const heatingLoad = calculation - heatingnxgm;

        // Calculation: coolingLoad
        const coolingLoad = gammaCool - coolingNxlm;

        return {
            MO: entry.MO,
            DY: entry.DY,
            HR: entry.HR,
            T2M: entry.T2M,
            Calculation: parseFloat(calculation.toFixed(2)),
            "Gamma-cool": parseFloat(yCooling.toFixed(5)),
            "Gamma-heat": parseFloat(yHeating.toFixed(5)),
            "n-cooling": parseFloat(nCooling.toFixed(5)),
            "n-heating": parseFloat(nHeating.toFixed(5)),
            "cooling nxlm": parseFloat(coolingNxlm.toFixed(5)),
            "heating nxgm": parseFloat(heatingnxgm.toFixed(5)),
            "heating load": parseFloat(heatingLoad.toFixed(5)),
            "cooling load": parseFloat(coolingLoad.toFixed(5)) 
        };
    });

    console.log(`Calculations for ${cityName}:`);
    const first10 = result.slice(0, 10);
    const last2 = result.slice(-2);
    console.table(first10);
    console.table(last2);
};

// Process all cities as per original script
calculateAndLog(IslamabadTemperature, 'Islamabad');
calculateAndLog(MultanTemperature, 'Multan');
calculateAndLog(LahoreTemperature, 'Lahore');
calculateAndLog(KarachiTemperature, 'Karachi');
calculateAndLog(PeshawarTemperature, 'Peshawar');
