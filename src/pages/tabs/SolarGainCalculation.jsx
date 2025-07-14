// File: SolarGainCalculation.jsx
import { useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import {
  Orientation_k_values,
  Solar_declination,
  City_latitude,
  City_solar_irradiance,
} from "../../utils/solargain/CitiesValues.js";
import useFloorPlanStore from "../../store/useFloorPlanStore";
import useWindowFabricDetailsStore from "../../store/useWindowFabricDetailsStore";
import useLightingStore from "../../store/useLightingStore";
import useSolarGainStore from "../../store/useSolarGainStore";
import useBuildingInformationStore from "../../store/useBuildingInformationStore";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const winterMonths = [
  "January",
  "February",
  "March",
  "October",
  "November",
  "December",
];

const daysInMonth = {
  January: 31,
  February: 28,
  March: 31,
  April: 30,
  May: 31,
  June: 30,
  July: 31,
  August: 31,
  September: 30,
  October: 31,
  November: 30,
  December: 31,
};

const FT2_TO_M2 = 0.092903;

// Calculate A, B, C
const calculateABC = (k, sin_pbytwo, sin_pbytwo_sq, sin_pbytwo_cub) => {
  const A = k.k1 * sin_pbytwo_cub + k.k2 * sin_pbytwo_sq + k.k3 * sin_pbytwo;
  const B = k.k4 * sin_pbytwo_cub + k.k5 * sin_pbytwo_sq + k.k6 * sin_pbytwo;
  const C =
    k.k7 * sin_pbytwo_cub + k.k8 * sin_pbytwo_sq + k.k9 * sin_pbytwo + 1;
  return { A, B, C };
};

const SolarGainCalculation = () => {
  // Retrieve state values from separate stores
  const selectedCity = useBuildingInformationStore((state) => state.selectedCity);
  const windows = useFloorPlanStore((state) => state.windows);
  const numberOfOccupants = useFloorPlanStore((state) => state.numberOfOccupants);
  const totalWattage = useLightingStore((state) => state.totalWattage);
  
  const selectedWindowType = useWindowFabricDetailsStore(
    (state) => state.selectedWindowType
  );
  const selectedFrameType = useWindowFabricDetailsStore(
    (state) => state.selectedFrameType
  );
  const selectedShadingCover = useWindowFabricDetailsStore(
    (state) => state.selectedShadingCover
  );
  
  const setSolarGainTotals = useSolarGainStore(
    (state) => state.setSolarGainTotals
  );
  const setTotalGains = useSolarGainStore(
    (state) => state.setTotalGains
  );

  // Precompute angles
  const pbytwo = 0.785398163; // 45 deg in radians
  const sin_pbytwo = Math.sin(pbytwo);
  const sin_pbytwo_sq = sin_pbytwo * sin_pbytwo;
  const sin_pbytwo_cub = sin_pbytwo_sq * sin_pbytwo;

  // Calculate ABC for each orientation
  const ABC_table = useMemo(() => {
    return Object.keys(Orientation_k_values).map((orientation) => {
      const kValues = Orientation_k_values[orientation];
      const { A, B, C } = calculateABC(
        kValues,
        sin_pbytwo,
        sin_pbytwo_sq,
        sin_pbytwo_cub
      );
      return {
        Orientation: orientation,
        A,
        B,
        C,
      };
    });
  }, [sin_pbytwo, sin_pbytwo_sq, sin_pbytwo_cub]);

  // Phi value (latitude in radians)
  const phiValue = useMemo(() => {
    if (!selectedCity) return null;
    return City_latitude[selectedCity];
  }, [selectedCity]);

  // Solar Irradiance values
  const solarIrradianceValues = useMemo(() => {
    const solarIrradiance = {};
    if (!selectedCity || phiValue === null) return solarIrradiance;

    solarIrradiance[selectedCity] = {};
    for (const month in Solar_declination) {
      solarIrradiance[selectedCity][month] =
        phiValue - Solar_declination[month];
    }

    return solarIrradiance;
  }, [selectedCity, phiValue]);

  // Rhnic values
  const rhnicValues = useMemo(() => {
    const rhnic = {};
    if (!selectedCity || !solarIrradianceValues[selectedCity]) return rhnic;

    rhnic[selectedCity] = {};
    ABC_table.forEach(({ Orientation, A, B, C }) => {
      rhnic[selectedCity][Orientation] = {};
      for (const month in Solar_declination) {
        const solarIrradiance = solarIrradianceValues[selectedCity][month];
        const cosSolarIrradiance = Math.cos(solarIrradiance);
        const rhnicCalc =
          A * cosSolarIrradiance ** 2 + B * cosSolarIrradiance + C;
        rhnic[selectedCity][Orientation][month] = rhnicCalc;
      }
    });

    return rhnic;
  }, [ABC_table, solarIrradianceValues, selectedCity]);

  // Sorient values
  const sorientValues = useMemo(() => {
    const sorient = {};
    if (!selectedCity) return sorient;

    sorient[selectedCity] = {};
    ABC_table.forEach(({ Orientation }) => {
      sorient[selectedCity][Orientation] = {};
      for (const month in City_solar_irradiance[selectedCity]) {
        const irradiance = City_solar_irradiance[selectedCity][month];
        const rhnic = rhnicValues[selectedCity]?.[Orientation]?.[month];
        if (typeof rhnic === "number") {
          sorient[selectedCity][Orientation][month] = irradiance * rhnic;
        } else {
          sorient[selectedCity][Orientation][month] = null;
        }
      }
    });

    return sorient;
  }, [ABC_table, rhnicValues, selectedCity]);

  // Calculate window areas by orientation
  const orientationWindowAreas = useMemo(() => {
    const orientations = ABC_table.map((o) => o.Orientation);
    const areaMap = {};
    orientations.forEach((orientation) => {
      areaMap[orientation] = 0;
    });

    windows.forEach((window) => {
      const winOrientation = window.orientation;
      if (winOrientation in areaMap) {
        const windowAreaFt2 = parseFloat(window.area);
        if (!isNaN(windowAreaFt2)) {
          const windowAreaM2 = windowAreaFt2 * FT2_TO_M2;
          areaMap[winOrientation] += windowAreaM2;
        }
      }
    });

    return areaMap;
  }, [ABC_table, windows]);

  // Table1 values
  const table1Values = useMemo(() => {
    const table1 = {};
    if (
      !selectedCity ||
      !selectedWindowType ||
      !selectedFrameType ||
      !selectedShadingCover
    ) {
      return table1;
    }

    table1[selectedCity] = {};
    const windowSHGC = selectedWindowType.shgc;
    const frameFactor = selectedFrameType.frame_factor;

    const cityOrientations = sorientValues[selectedCity]
      ? Object.keys(sorientValues[selectedCity])
      : [];

    cityOrientations.forEach((orientation) => {
      table1[selectedCity][orientation] = {};
      const orientationArea = orientationWindowAreas[orientation] || 0;

      months.forEach((month) => {
        const isWinter = winterMonths.includes(month);
        const shadingCoverValue = isWinter
          ? selectedShadingCover.values.winter
          : selectedShadingCover.values.summer;

        const sorientValue =
          sorientValues[selectedCity][orientation][month] ?? 0;

        const value =
          0.9 *
          orientationArea *
          shadingCoverValue *
          windowSHGC *
          frameFactor *
          sorientValue;

        table1[selectedCity][orientation][month] = value;
      });
    });

    return table1;
  }, [
    selectedCity,
    selectedWindowType,
    selectedFrameType,
    selectedShadingCover,
    orientationWindowAreas,
    sorientValues,
  ]);

  // Sum for Solar Gain (Watt) per month
  const solarGainTotals = useMemo(() => {
    const totals = {};
    if (!selectedCity || !table1Values[selectedCity]) {
      months.forEach((month) => {
        totals[month] = 0;
      });
      return totals;
    }

    months.forEach((month) => {
      let sum = 0;
      Object.keys(table1Values[selectedCity]).forEach((orientation) => {
        const value = table1Values[selectedCity][orientation][month];
        if (typeof value === "number") {
          sum += value;
        }
      });
      totals[month] = sum;
    });

    return totals;
  }, [selectedCity, table1Values]);

  // Store solarGainTotals in the solar gain store
  useEffect(() => {
    setSolarGainTotals(solarGainTotals);
  }, [solarGainTotals, setSolarGainTotals]);

  // Table2 E(kWh)
  const table2Values = useMemo(() => {
    const table2 = {};
    months.forEach((month, index) => {
      const monthNumber = index + 1;
      const nd = daysInMonth[month] || 30;
      const radians = (degrees) => degrees * (Math.PI / 180);

      const E =
        (totalWattage *
          (1 +
            0.5 *
              Math.cos(radians(30 * (monthNumber - 0.2)))) *
          nd) /
        365;

      table2[month] = E;
    });
    return table2;
  }, [totalWattage]);

  // Lighting Gains(W) = (E(kWh) * 0.85 * 1000)/(24 * daysInMonth)
  const lightingGains = useMemo(() => {
    const gains = {};
    months.forEach((month) => {
      const E = table2Values[month] || 0;
      const nd = daysInMonth[month] || 30;
      const calc = (E * 0.85 * 1000) / (24 * nd);
      gains[month] = calc;
    });
    return gains;
  }, [table2Values]);

  // Metabolic Gains(W) = 20 * numberOfOccupants
  const metabolicGains = useMemo(() => {
    const occupantCount = parseFloat(numberOfOccupants || 0);
    return occupantCount * 20;
  }, [numberOfOccupants]);

  // Cooking (W) = 35 + 7 * numberOfOccupants
  const cookingGains = useMemo(() => {
    const occupantCount = parseFloat(numberOfOccupants || 0);
    return 35 + 7 * occupantCount;
  }, [numberOfOccupants]);

  // Compute total internal gains for each month
  const totalInternalGains = useMemo(() => {
    const totals = {};
    months.forEach((month) => {
      const lg = lightingGains[month] || 0;
      const metabolic = metabolicGains;
      const cooking = cookingGains;
      totals[month] = lg + metabolic + cooking;
    });
    return totals;
  }, [lightingGains, metabolicGains, cookingGains]);

  // Calculate Total Gains (Solar Gain + Internal Gain)
  const totalGains = useMemo(() => {
    const gains = {};
    months.forEach((month) => {
      const solar = solarGainTotals[month] || 0;
      const internal = totalInternalGains[month] || 0;
      gains[month] = solar + internal;
    });
    return gains;
  }, [solarGainTotals, totalInternalGains]);

  // Store totalGains in the solar gain store
  useEffect(() => {
    setTotalGains(totalGains);
  }, [totalGains, setTotalGains]);

  if (!selectedCity) {
    return (
      <Typography variant="h6" align="center">
        Please select a city from Building Information.
      </Typography>
    );
  }

  return (
    <Box>
      {/* ABC Values */}
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Typography variant="h6" align="center" gutterBottom>
          ABC Values
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "lightblue", fontWeight: "bold" }}>
                Orientation
              </TableCell>
              <TableCell sx={{ backgroundColor: "lightblue", fontWeight: "bold" }} align="right">
                A
              </TableCell>
              <TableCell sx={{ backgroundColor: "lightblue", fontWeight: "bold" }} align="right">
                B
              </TableCell>
              <TableCell sx={{ backgroundColor: "lightblue", fontWeight: "bold" }} align="right">
                C
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ABC_table.map((row) => (
              <TableRow key={row.Orientation}>
                <TableCell component="th" scope="row">
                  {row.Orientation}
                </TableCell>
                <TableCell align="right">{Number(row.A).toFixed(2)}</TableCell>
                <TableCell align="right">{Number(row.B).toFixed(2)}</TableCell>
                <TableCell align="right">{Number(row.C).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phi Value Table */}
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Phi Value (in radians) for {selectedCity}
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "lightblue", fontWeight: "bold" }}>
                Phi (radians)
              </TableCell>
              <TableCell
                align="right"
                sx={{ backgroundColor: "lightblue", fontWeight: "bold" }}
              >
                {phiValue !== null ? phiValue.toFixed(5) : "-"}
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>

      {/* Solar Irradiance Table */}
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Solar Irradiance for {selectedCity}
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "lightblue", fontWeight: "bold" }}>
                Month
              </TableCell>
              <TableCell sx={{ backgroundColor: "lightblue", fontWeight: "bold" }} align="right">
                Solar Irradiance (radians)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {months.map((month) => (
              <TableRow key={month}>
                <TableCell component="th" scope="row">
                  {month}
                </TableCell>
                <TableCell align="right">
                  {solarIrradianceValues[selectedCity] &&
                  solarIrradianceValues[selectedCity][month] !== undefined
                    ? solarIrradianceValues[selectedCity][month].toFixed(5)
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Rhnic Values */}
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Rhnic Values for {selectedCity}
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "lightblue", fontWeight: "bold" }}>
                Orientation
              </TableCell>
              {months.map((month) => (
                <TableCell
                  key={month}
                  align="right"
                  sx={{ backgroundColor: "lightblue", fontWeight: "bold" }}
                >
                  {month}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rhnicValues[selectedCity] &&
              Object.keys(rhnicValues[selectedCity]).map((orientation) => (
                <TableRow key={orientation}>
                  <TableCell component="th" scope="row">
                    {orientation}
                  </TableCell>
                  {months.map((month) => (
                    <TableCell key={month} align="right">
                      {rhnicValues[selectedCity][orientation][month] !== undefined
                        ? rhnicValues[selectedCity][orientation][month].toFixed(8)
                        : "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Sorient Values */}
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Sorient Values for {selectedCity}
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "lightblue", fontWeight: "bold" }}>
                Orientation
              </TableCell>
              {months.map((month) => (
                <TableCell
                  key={month}
                  align="right"
                  sx={{ backgroundColor: "lightblue", fontWeight: "bold" }}
                >
                  {month}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sorientValues[selectedCity] &&
              Object.keys(sorientValues[selectedCity]).map((orientation) => (
                <TableRow key={orientation}>
                  <TableCell component="th" scope="row">
                    {orientation}
                  </TableCell>
                  {months.map((month) => (
                    <TableCell key={month} align="right">
                      {sorientValues[selectedCity][orientation][month] !== undefined &&
                      sorientValues[selectedCity][orientation][month] !== null
                        ? sorientValues[selectedCity][orientation][month].toFixed(5)
                        : "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Table1 Values */}
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Table1 Values for {selectedCity}
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "lightblue", fontWeight: "bold" }}>
                Orientation
              </TableCell>
              {months.map((month) => (
                <TableCell
                  key={month}
                  align="right"
                  sx={{ backgroundColor: "lightblue", fontWeight: "bold" }}
                >
                  {month}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {table1Values[selectedCity] &&
              Object.keys(table1Values[selectedCity]).map((orientation) => (
                <TableRow key={orientation}>
                  <TableCell component="th" scope="row">
                    {orientation}
                  </TableCell>
                  {months.map((month) => (
                    <TableCell key={month} align="right">
                      {table1Values[selectedCity][orientation][month] !== undefined
                        ? table1Values[selectedCity][orientation][month].toFixed(5)
                        : "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            <TableRow>
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                Solar Gain (Watt)
              </TableCell>
              {months.map((month) => (
                <TableCell key={month} align="right" sx={{ fontWeight: "bold" }}>
                  {solarGainTotals[month].toFixed(5)}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Table 2 for E(kWh), Lighting Gains(W), Metabolic Gains(W), Cooking(W), Total Internal Gains(W) */}
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Table2 Values
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "lightblue", fontWeight: "bold" }}>
                Month
              </TableCell>
              <TableCell sx={{ backgroundColor: "lightblue", fontWeight: "bold" }} align="right">
                E (kWh)
              </TableCell>
              <TableCell sx={{ backgroundColor: "lightblue", fontWeight: "bold" }} align="right">
                Lighting Gains (W)
              </TableCell>
              <TableCell sx={{ backgroundColor: "lightblue", fontWeight: "bold" }} align="right">
                Metabolic Gains (W)
              </TableCell>
              <TableCell sx={{ backgroundColor: "lightblue", fontWeight: "bold" }} align="right">
                Cooking (W)
              </TableCell>
              <TableCell sx={{ backgroundColor: "lightblue", fontWeight: "bold" }} align="right">
                Total Internal Gains (W)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {months.map((month) => {
              const eValue = table2Values[month] || 0;
              const gainsW = lightingGains[month] || 0;
              const occupantMetabolic = metabolicGains;
              const occupantCooking = cookingGains;
              const totalIntGains = totalInternalGains[month] || 0;
              return (
                <TableRow key={month}>
                  <TableCell component="th" scope="row">
                    {month}
                  </TableCell>
                  <TableCell align="right">{Number(eValue).toFixed(5)}</TableCell>
                  <TableCell align="right">{Number(gainsW).toFixed(5)}</TableCell>
                  <TableCell align="right">{Number(occupantMetabolic).toFixed(5)}</TableCell>
                  <TableCell align="right">{Number(occupantCooking).toFixed(5)}</TableCell>
                  <TableCell align="right">{Number(totalIntGains).toFixed(5)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Total Gains (Solar Gain + Internal Gain) */}
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Total Gains (W) for {selectedCity}
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "lightgreen", fontWeight: "bold" }}>
                Month
              </TableCell>
              <TableCell sx={{ backgroundColor: "lightgreen", fontWeight: "bold" }} align="right">
                Solar Gain (W)
              </TableCell>
              <TableCell sx={{ backgroundColor: "lightgreen", fontWeight: "bold" }} align="right">
                Internal Gain (W)
              </TableCell>
              <TableCell sx={{ backgroundColor: "lightgreen", fontWeight: "bold" }} align="right">
                Total Gains (W)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {months.map((month) => {
              const solar = solarGainTotals[month] || 0;
              const internal = totalInternalGains[month] || 0;
              const total = totalGains[month] || 0;
              return (
                <TableRow key={month}>
                  <TableCell component="th" scope="row">
                    {month}
                  </TableCell>
                  <TableCell align="right">{Number(solar).toFixed(5)}</TableCell>
                  <TableCell align="right">{Number(internal).toFixed(5)}</TableCell>
                  <TableCell align="right">{Number(total).toFixed(5)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SolarGainCalculation;