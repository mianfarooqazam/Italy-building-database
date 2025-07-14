// ProposedSheetCalculation.js
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register chart.js components once in your application
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Store imports
import useFloorPlanStore from "../../store/useFloorPlanStore";
import useBuildingInformationStore from "../../store/useBuildingInformationStore";
import useSolarGainStore from "../../store/proposed/useProposedSolarGainStore";
import useHlpStore from "../../store/proposed/useProposedHlpStore";
import useSheetCalculationStore from "../../store/proposed/useProposedSheetCalculationStore";
import useAppliancesLoadStore from "../../store/proposed/useProposedAppliancesLoadStore";
import useLightingStore from "../../store/proposed/useProposedLightingStore";

// Import constants
import { months, aValues, timeSlotToHourIndex } from "../../utils/Constants";

// Import temperature data
import IslamabadTemperature from "../../utils/temperature/IslamabadTemperature.json";
import MultanTemperature from "../../utils/temperature/MultanTemperature.json";
import KarachiTemperature from "../../utils/temperature/KarachiTemperature.json";
import LahoreTemperature from "../../utils/temperature/LahoreTemperature.json";
import PeshawarTemperature from "../../utils/temperature/PeshawarTemperature.json";

/** Safely convert a numeric value to float or return 0 if invalid. */
function safeNumber(val) {
  const num = parseFloat(val);
  return Number.isNaN(num) ? 0 : num;
}

/** Get temperature data for a given city */
const getTemperatureData = (city) => {
  switch (city) {
    case "Islamabad":
      return IslamabadTemperature;
    case "Multan":
      return MultanTemperature;
    case "Karachi":
      return KarachiTemperature;
    case "Lahore":
      return LahoreTemperature;
    case "Peshawar":
      return PeshawarTemperature;
    default:
      return [];
  }
};

const ProposedSheetCalculation = ({ showOnlyEnergyReport = false }) => {
  // Retrieve the selected city from store
  const selectedCity = useBuildingInformationStore(
    (state) => state.selectedCity
  );

  // Retrieve solar gain totals and total gains from store
  const { solarGainTotals, totalGains } = useSolarGainStore();

  // Retrieve heatTransferCoefficient from HLP store
  const { heatTransferCoefficient } = useHlpStore();

  // Retrieve coolingHours and heatingHours from FloorPlan store
  const { coolingHours, heatingHours, totalFloorArea, numberOfFloors } =
    useFloorPlanStore();

  // Retrieve appliances from store
  const { appliances } = useAppliancesLoadStore();

  // Retrieve lighting data from store - CHANGE: Get totalAnnualEnergy instead of totalWattage
  const { totalAnnualEnergy: lightingAnnualEnergy } = useLightingStore();

  // The main array storing per-hour calculations
  const [calculationResults, setCalculationResults] = useState([]);

  // Access the set functions from the store
  const setSheetSums = useSheetCalculationStore((state) => state.setSums);
  const setMonthlyKWhCooling = useSheetCalculationStore(
    (state) => state.setMonthlyKWhCooling
  );
  const setMonthlyKWhHeating = useSheetCalculationStore(
    (state) => state.setMonthlyKWhHeating
  );
  const setSheetEUI = useSheetCalculationStore((state) => state.setEUI);
  const setAppliancesEnergy = useSheetCalculationStore(
    (state) => state.setAppliancesEnergy
  );
  const setLightingEnergy = useSheetCalculationStore(
    (state) => state.setLightingEnergy
  );

  useEffect(() => {
    if (selectedCity && heatTransferCoefficient.length === 12) {
      const cityData = getTemperatureData(selectedCity) || [];

      const results = cityData.map((entry) => {
        const moIndex = entry.MO - 1; // 0..11
        const factor = safeNumber(heatTransferCoefficient[moIndex]);
        const a = safeNumber(aValues[entry.MO]);

        const monthName = months[moIndex];
        const totalGain = safeNumber(totalGains[monthName] || 0);

        // Basic calculation: (24 - T2M) * (U-value)
        const calc = safeNumber(24 - entry.T2M) * factor;

        // y-cooling / y-heating using totalGain
        const yCooling = calc !== 0 ? totalGain / calc : 0;
        const yHeating = calc !== 0 ? totalGain / calc : 0;

        // n-cooling
        let nCooling = 1;
        if (yCooling > 0 && yCooling !== 1) {
          nCooling =
            (1 - Math.pow(yCooling, -a)) / (1 - Math.pow(yCooling, -(a + 1)));
        } else if (yCooling === 1) {
          nCooling = a / (a + 1);
        }

        // n-heating
        let nHeating = 1;
        if (yHeating > 0 && yHeating !== 1) {
          nHeating =
            (1 - Math.pow(yHeating, a)) / (1 - Math.pow(yHeating, a + 1));
        } else if (yHeating === 1) {
          nHeating = a / (a + 1);
        }

        const coolingNxlm = nCooling * calc;
        const heatingNxgm = totalGain * nHeating;

        const heatingLoad = calc - heatingNxgm;
        const coolingLoad = totalGain - coolingNxlm;

        return {
          MO: entry.MO,
          DY: entry.DY,
          HR: entry.HR,
          T2M: safeNumber(entry.T2M),
          Calculation: parseFloat(calc.toFixed(2)),
          "Gamma-cool": parseFloat(yCooling.toFixed(5)),
          "Gamma-heat": parseFloat(yHeating.toFixed(5)),
          "n-cooling": parseFloat(nCooling.toFixed(5)),
          "n-heating": parseFloat(nHeating.toFixed(5)),
          "cooling nxlm": parseFloat(coolingNxlm.toFixed(5)),
          "heating nxgm": parseFloat(heatingNxgm.toFixed(5)),
          "heating load": parseFloat(heatingLoad.toFixed(5)),
          "cooling load": parseFloat(coolingLoad.toFixed(5)),
        };
      });

      setCalculationResults(results);
    } else {
      setCalculationResults([]);
    }
  }, [selectedCity, solarGainTotals, totalGains, heatTransferCoefficient]);

  // Create arrays for monthly summations
  const monthlyCoolingSums = Array(12).fill(0);
  const monthlyHeatingSums = Array(12).fill(0);
  const monthlySelectedCoolingSums = Array(12).fill(0);
  const monthlySelectedHeatingSums = Array(12).fill(0);

  // Convert user-selected cooling and heating timeslots -> hour indices
  const selectedCoolingHourIndices = (coolingHours || [])
    .map((slot) => timeSlotToHourIndex[slot])
    .filter((hr) => hr != null);

  const selectedHeatingHourIndices = (heatingHours || [])
    .map((slot) => timeSlotToHourIndex[slot])
    .filter((hr) => hr != null);

  // Accumulate
  calculationResults.forEach((row) => {
    const idx = row.MO - 1;
    const cLoad = safeNumber(row["cooling load"]);
    const hLoad = safeNumber(row["heating load"]);

    // All hours
    monthlyCoolingSums[idx] += cLoad;
    monthlyHeatingSums[idx] += hLoad;

    // Only for rows where row.HR is in cooling hours
    if (selectedCoolingHourIndices.includes(row.HR)) {
      monthlySelectedCoolingSums[idx] += cLoad;
    }

    // Only for rows where row.HR is in heating hours
    if (selectedHeatingHourIndices.includes(row.HR)) {
      monthlySelectedHeatingSums[idx] += hLoad;
    }
  });

  // Calculate the total kWh for selected cooling and heating
  const monthlyCoolingKWh = months.map((mName, idx) => {
    const selCooling = monthlySelectedCoolingSums[idx];
    return Math.max(selCooling / 3000, 0); // clamp negative to 0
  });

  const monthlyHeatingKWh = months.map((mName, idx) => {
    const selHeating = monthlySelectedHeatingSums[idx];
    return Math.max(selHeating / 3000, 0); // clamp negative to 0
  });

  const totalKWhCoolingSelected = monthlyCoolingKWh.reduce(
    (acc, val) => acc + val,
    0
  );
  const totalKWhHeatingSelected = monthlyHeatingKWh.reduce(
    (acc, val) => acc + val,
    0
  );

  // Update the Zustand store with the sums
  useEffect(() => {
    setSheetSums(totalKWhCoolingSelected, totalKWhHeatingSelected);
    setMonthlyKWhCooling(monthlyCoolingKWh); // Store month-wise cooling kWh
    setMonthlyKWhHeating(monthlyHeatingKWh); // Store month-wise heating kWh
  }, [
    totalKWhCoolingSelected,
    totalKWhHeatingSelected,
    setSheetSums,
    monthlyCoolingKWh,
    monthlyHeatingKWh,
    setMonthlyKWhCooling,
    setMonthlyKWhHeating,
  ]);

  // Convert floor area to square meters
  const floorAreaInM2 = Number(totalFloorArea) * 0.092903;

  // Calculate total annual energy from appliances - CHANGE: Renamed variable
  const appliancesAnnualEnergy = appliances.reduce(
    (total, item) => total + item.annualEnergy,
    0
  );

  // Calculate EUI - CHANGE: Use lightingAnnualEnergy instead of totalWattage
  const eui =
    (appliancesAnnualEnergy +
      totalKWhHeatingSelected +
      totalKWhCoolingSelected +
      lightingAnnualEnergy) /
    (floorAreaInM2 * Number(numberOfFloors));

  // Store EUI, appliances energy, and lighting energy in the Zustand store - CHANGE: Use correct variable names
  useEffect(() => {
    setSheetEUI(eui);
    setAppliancesEnergy(appliancesAnnualEnergy);
    setLightingEnergy(lightingAnnualEnergy);
  }, [
    eui,
    setSheetEUI,
    appliancesAnnualEnergy,
    lightingAnnualEnergy,
    setAppliancesEnergy,
    setLightingEnergy,
  ]);

  // Chart data
  const chartData = {
    labels: months,
    datasets: [
      {
        label: "kWh Cooling",
        data: monthlyCoolingKWh,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "kWh Heating",
        data: monthlyHeatingKWh,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Monthly kWh Heating & Cooling - ${selectedCity || ""}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "kWh",
        },
      },
    },
  };

  return (
    <Box>
      {selectedCity ? (
        <>
          <Box
            sx={{
              marginTop: showOnlyEnergyReport ? 0 : 4,
              padding: 2,
              backgroundColor: "#fff",
              borderRadius: "8px",
            }}
          >
            <Bar data={chartData} options={chartOptions} />
          </Box>
          <Box
            p={3}
            sx={{ marginTop: 4, backgroundColor: "#fff", borderRadius: "8px" }}
          >
            <Typography variant="h5" align="center" gutterBottom>
              Annual Energy Demand
            </Typography>

            <TableContainer sx={{ mt: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ backgroundColor: "#ADD8E6", fontWeight: "bold" }}
                    >
                      Category
                    </TableCell>
                    <TableCell
                      sx={{ backgroundColor: "#ADD8E6", fontWeight: "bold" }}
                      align="right"
                    >
                      Value
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Energy Utilization Index (EUI)
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      {eui.toFixed(2)} kWh / m²
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Annual Appliances Energy Demand</TableCell>
                    <TableCell align="right">
                      {appliancesAnnualEnergy.toFixed(2)} kWh
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Annual Heating Energy Demand</TableCell>
                    <TableCell align="right">
                      {totalKWhHeatingSelected.toFixed(2)} kWh
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Annual Cooling Energy Demand</TableCell>
                    <TableCell align="right">
                      {totalKWhCoolingSelected.toFixed(2)} kWh
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Annual Lighting Energy Demand</TableCell>
                    <TableCell align="right">
                      {lightingAnnualEnergy.toFixed(2)} kWh
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      ) : (
        <Typography variant="h6">
          Please select a city to view calculations.
        </Typography>
      )}
    </Box>
  );
};

export default ProposedSheetCalculation;
ProposedSheetCalculation.propTypes = {
  showOnlyEnergyReport: PropTypes.bool,
};