import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  InputAdornment,
  Button,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { toast } from 'react-toastify'; // Import toast from react-toastify

import {
  calculateM3PerHr,
  calculateACH,
  calculateAdditionalInfiltration,
  constructionTypeValue,
  calculateWindowInfiltration,
  calculateInfiltrationRate,
  calculateShelterFactor,
  calculateWindFactor,
  calculateAdjustedInfiltrationRate,
  calculateFinalInfiltrationRate,
  calculateLobbyTypeValue,
} from "../../calculations/VentilationCal/VentilationCalculation.js";

// Import wind data
import IslamabadWind from "../../utils/wind/IslamabadWind.json";
import KarachiWind from "../../utils/wind/KarachiWind.json";
import LahoreWind from "../../utils/wind/LahoreWind.json";
import MultanWind from "../../utils/wind/MultanWind.json";
import PeshawarWind from "../../utils/wind/PeshawarWind.json";

// Import the individual stores instead of the global store
import useBuildingInformationStore from "../../store/useBuildingInformationStore.js";
import useFloorPlanStore from "../../store/useFloorPlanStore.js";
import useVentilationStore from "../../store/proposed/useProposedVentilationStore.js";

import { useEffect, useState } from "react";

function ProposedVentilation() {
  // Get data from Ventilation Store
  const {
    numberOfFans,
    constructionType,
    lobbyType,
    percentageDraughtProofed,
    ventilationType,
    ventilationDataArray,
    setNumberOfFans,
    setConstructionType,
    setLobbyType,
    setPercentageDraughtProofed,
    setVentilationType,
    setVentilationDataArray,
  } = useVentilationStore();

  // Local state for form values before saving
  const [localNumberOfFans, setLocalNumberOfFans] = useState(numberOfFans);
  const [localConstructionType, setLocalConstructionType] = useState(constructionType);
  const [localLobbyType, setLocalLobbyType] = useState(lobbyType);
  const [localPercentageDraughtProofed, setLocalPercentageDraughtProofed] = useState(percentageDraughtProofed);
  const [localVentilationType, setLocalVentilationType] = useState(ventilationType);

  // Get data from Floor Plan Store
  const {
    dwellingVolume,
    numberOfFloors,
    sidesConnected,
  } = useFloorPlanStore();

  // Get data from Building Information Store
  const {
    selectedCity,
  } = useBuildingInformationStore();

  const windData = {
    Islamabad: IslamabadWind,
    Karachi: KarachiWind,
    Lahore: LahoreWind,
    Multan: MultanWind,
    Peshawar: PeshawarWind,
  };

  const cityWindData = selectedCity ? windData[selectedCity] : null;
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

  let m3PerHr = null;
  let ACH = null;
  let additionalInfiltration = null;
  let constructionValue = null;
  let windowInfiltration = null;
  let lobbyTypeValue = null;
  let infiltrationRate = null;
  let dwellingVolumeM3 = null;
  let shelterFactor = null;
  let infiltrationRateWithShelterFactor = null;
  let windFactor = null;
  let adjustedInfiltrationRate = null;
  let finalInfiltrationRateArray = null;

  // Update local state when store values change
  useEffect(() => {
    setLocalNumberOfFans(numberOfFans);
    setLocalConstructionType(constructionType);
    setLocalLobbyType(lobbyType);
    setLocalPercentageDraughtProofed(percentageDraughtProofed);
    setLocalVentilationType(ventilationType);
  }, [numberOfFans, constructionType, lobbyType, percentageDraughtProofed, ventilationType]);

  try {
    // Convert dwelling volume from ft³ to m³
    if (dwellingVolume) {
      dwellingVolumeM3 = dwellingVolume * 0.0283168;
    }

    // Compute additional infiltration and construction value
    if (numberOfFloors) {
      additionalInfiltration = calculateAdditionalInfiltration(
        parseFloat(numberOfFloors)
      );
    }
    if (constructionType) {
      constructionValue = constructionTypeValue(constructionType);
    }
    if (percentageDraughtProofed !== "") {
      windowInfiltration = calculateWindowInfiltration(
        parseFloat(percentageDraughtProofed)
      );
    }
    if (lobbyType) {
      lobbyTypeValue = calculateLobbyTypeValue(lobbyType);
    }

    // Compute ACH and infiltrationRate based on ventilation type:
    if (ventilationType === "Mechanical Ventilation") {
      // For mechanical, use the fans input to compute m³/hr and ACH.
      if (numberOfFans !== "" && parseFloat(numberOfFans) >= 2) {
        m3PerHr = calculateM3PerHr(parseFloat(numberOfFans));
        if (dwellingVolumeM3 && dwellingVolumeM3 !== 0) {
          ACH = calculateACH(m3PerHr, dwellingVolumeM3);
        }
      }
      // Total infiltration rate for mechanical ventilation includes ACH plus other factors.
      if (
        ACH !== null &&
        additionalInfiltration !== null &&
        constructionValue !== null &&
        windowInfiltration !== null &&
        lobbyTypeValue !== null
      ) {
        infiltrationRate = calculateInfiltrationRate(
          ACH,
          additionalInfiltration,
          constructionValue,
          windowInfiltration,
          lobbyTypeValue
        );
      }
    } else if (ventilationType === "Natural Ventilation") {
      // For natural ventilation, fans input is not used.
      // ACH is set to 0.55
      ACH = 0.55;
      infiltrationRate = ACH;
    }

    if (sidesConnected !== null && sidesConnected !== undefined) {
      shelterFactor = calculateShelterFactor(sidesConnected);
    }

    if (infiltrationRate !== null && shelterFactor !== null) {
      infiltrationRateWithShelterFactor = infiltrationRate * shelterFactor;
    }

    if (cityWindData) {
      const windDataArray = months.map((month) => cityWindData[month]);
      windFactor = calculateWindFactor(windDataArray);
    }

    if (windFactor && infiltrationRateWithShelterFactor !== null) {
      adjustedInfiltrationRate = calculateAdjustedInfiltrationRate(
        windFactor,
        infiltrationRateWithShelterFactor
      );
    }

    if (adjustedInfiltrationRate && ventilationType) {
      finalInfiltrationRateArray = calculateFinalInfiltrationRate(
        adjustedInfiltrationRate,
        ventilationType
      );
    }
  } catch (error) {
    console.error(error.message);
  }

  // Update ventilation data array in the store if needed
  useEffect(() => {
    if (
      finalInfiltrationRateArray &&
      Array.isArray(finalInfiltrationRateArray) &&
      finalInfiltrationRateArray.length > 0
    ) {
      const isDifferent =
        finalInfiltrationRateArray.length !== ventilationDataArray.length ||
        finalInfiltrationRateArray.some(
          (val, idx) => val !== ventilationDataArray[idx]
        );

      if (isDifferent) {
        setVentilationDataArray(finalInfiltrationRateArray);
      }
    }
  }, [finalInfiltrationRateArray, ventilationDataArray, setVentilationDataArray]);

  const handleNumberOfFansChange = (e) => {
    const value = e.target.value;
    if (value === "" || parseFloat(value) >= 2) {
      setLocalNumberOfFans(value);
    }
  };

  const handlePercentageChange = (e) => {
    const value = e.target.value;
    if (
      value === "" ||
      (parseFloat(value) >= 0 && parseFloat(value) <= 100)
    ) {
      setLocalPercentageDraughtProofed(value);
    }
  };

  // Save all form values to the store
  const handleSaveData = () => {
    setNumberOfFans(localNumberOfFans);
    setConstructionType(localConstructionType);
    setLobbyType(localLobbyType);
    setPercentageDraughtProofed(localPercentageDraughtProofed);
    setVentilationType(localVentilationType);
    
    // Show success toast notification
    toast.success('Ventilation data saved successfully!');
  };

  return (
    <Box p={3}>
      {/* Form inputs - arranged in two rows, two inputs per row */}
      <Stack spacing={2}>
        {/* First Row: Construction Type and Draught Proofed % */}
        <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
          <Box flex={1}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Building Construction Type</InputLabel>
              <Select
                label="Building Construction Type"
                value={localConstructionType}
                onChange={(e) => setLocalConstructionType(e.target.value)}
              >
                <MenuItem value="masonry">Masonry</MenuItem>
                <MenuItem value="steel">Steel</MenuItem>
                <MenuItem value="timber">Timber</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box flex={1}>
            <TextField
              label="Building Draught Proofed %"
              variant="outlined"
              fullWidth
              value={localPercentageDraughtProofed}
              onChange={handlePercentageChange}
              type="number"
              error={
                localPercentageDraughtProofed !== "" &&
                (parseFloat(localPercentageDraughtProofed) < 0 ||
                  parseFloat(localPercentageDraughtProofed) > 100)
              }
              helperText={
                localPercentageDraughtProofed !== "" &&
                (parseFloat(localPercentageDraughtProofed) < 0 ||
                  parseFloat(localPercentageDraughtProofed) > 100)
                  ? "Value must be between 0 and 100"
                  : ""
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip
                      title="Draught proofing is measurement of how well a building is sealed against air leaks. Higher the draught proofing value, lower will be the ACH and vice versa."
                      arrow
                    >
                      <IconButton size="small" edge="end">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Stack>

        {/* Second Row: Lobby Type and Ventilation Type */}
        <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
          <Box flex={1}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Lobby Type</InputLabel>
              <Select
                label="Lobby Type"
                value={localLobbyType}
                onChange={(e) => setLocalLobbyType(e.target.value)}
              >
                <MenuItem value="draught">Draught</MenuItem>
                <MenuItem value="no-draught">No Draught</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box flex={1}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Ventilation Type</InputLabel>
              <Select
                label="Ventilation Type"
                value={localVentilationType}
                onChange={(e) => setLocalVentilationType(e.target.value)}
              >
                <MenuItem value="Natural Ventilation">
                  Natural Ventilation
                </MenuItem>
                <MenuItem value="Mechanical Ventilation">
                  Mechanical Ventilation
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>

        {/* Conditionally show the Number of Ventilation Fans field for Mechanical Ventilation */}
        {localVentilationType === "Mechanical Ventilation" && (
          <Stack spacing={2} direction={{ xs: "column", sm: "row" }} alignItems="center">
            <Box maxWidth="50%">
              <TextField
                label="Number of Ventilation Fans"
                variant="outlined"
                fullWidth
                value={localNumberOfFans}
                onChange={handleNumberOfFansChange}
                type="number"
                error={localNumberOfFans !== "" && parseFloat(localNumberOfFans) < 2}
                helperText={
                  localNumberOfFans !== "" && parseFloat(localNumberOfFans) < 2
                    ? "Minimum number of intermittent fans required are 2"
                    : ""
                }
              />
            </Box>
          </Stack>
        )}


        {/* Save Button */}
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button 
           variant="contained" 
           color="success" 
           sx={{bgcolor:"#ccf462",color:"black"}}
            onClick={handleSaveData}
          >
            Save Ventilation
          </Button>
        </Box>
      </Stack>

      {/* Output Display Section */}
      {/* Horizontal Table Display */}
      <Box mt={4}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{ backgroundColor: "#add8e6" }}>
              <TableRow>
                {m3PerHr !== null && ventilationType === "Mechanical Ventilation" && (
                  <TableCell align="center" style={{ fontWeight: "bold" }}>Ventilation Rate (m³/hr)</TableCell>
                )}
                {dwellingVolumeM3 !== null && (
                  <TableCell align="center" style={{ fontWeight: "bold" }}>Dwelling Volume (m³)</TableCell>
                )}
                {ACH !== null && (
                  <TableCell align="center" style={{ fontWeight: "bold" }}>ACH</TableCell>
                )}
                {additionalInfiltration !== null && (
                  <TableCell align="center" style={{ fontWeight: "bold" }}>Additional Infiltration</TableCell>
                )}
                {windowInfiltration !== null && (
                  <TableCell align="center" style={{ fontWeight: "bold" }}>Window Infiltration</TableCell>
                )}
                {lobbyTypeValue !== null && (
                  <TableCell align="center" style={{ fontWeight: "bold" }}>Lobby Type Value</TableCell>
                )}
                {infiltrationRate !== null && (
                  <TableCell align="center" style={{ fontWeight: "bold" }}>Infiltration Rate</TableCell>
                )}
                {shelterFactor !== null && (
                  <TableCell align="center" style={{ fontWeight: "bold" }}>Shelter Factor</TableCell>
                )}
                {infiltrationRateWithShelterFactor !== null && (
                  <TableCell align="center" style={{ fontWeight: "bold" }}>Infiltration Rate w/ Shelter</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {m3PerHr !== null && ventilationType === "Mechanical Ventilation" && (
                  <TableCell align="center">{m3PerHr}</TableCell>
                )}
                {dwellingVolumeM3 !== null && (
                  <TableCell align="center">{dwellingVolumeM3.toFixed(2)}</TableCell>
                )}
                {ACH !== null && (
                  <TableCell align="center">{ACH.toFixed(2)}</TableCell>
                )}
                {additionalInfiltration !== null && (
                  <TableCell align="center">{additionalInfiltration.toFixed(1)}</TableCell>
                )}
                {windowInfiltration !== null && (
                  <TableCell align="center">{windowInfiltration.toFixed(2)}</TableCell>
                )}
                {lobbyTypeValue !== null && (
                  <TableCell align="center">{lobbyTypeValue.toFixed(2)}</TableCell>
                )}
                {infiltrationRate !== null && (
                  <TableCell align="center">{infiltrationRate.toFixed(2)}</TableCell>
                )}
                {shelterFactor !== null && (
                  <TableCell align="center">{shelterFactor.toFixed(2)}</TableCell>
                )}
                {infiltrationRateWithShelterFactor !== null && (
                  <TableCell align="center">{infiltrationRateWithShelterFactor.toFixed(2)}</TableCell>
                )}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {cityWindData && (
        <Box mt={4}>
          <Typography
            variant="h6"
            gutterBottom
            textAlign="center"
            fontWeight="bold"
          >
            Wind Data and Calculations
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead style={{ backgroundColor: "#add8e6" }}>
                <TableRow>
                  <TableCell align="center" style={{ fontWeight: "bold" }}>
                    Month
                  </TableCell>
                  <TableCell align="center" style={{ fontWeight: "bold" }}>
                    Selected City Wind Data
                  </TableCell>
                  <TableCell align="center" style={{ fontWeight: "bold" }}>
                    Wind Factor
                  </TableCell>
                  <TableCell align="center" style={{ fontWeight: "bold" }}>
                    Adjusted Infiltration Rate
                  </TableCell>
                  <TableCell align="center" style={{ fontWeight: "bold" }}>
                    Final Infiltration Rate:{" "}
                    {ventilationType
                      ? `${ventilationType} Calculation`
                      : "Calculation"}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {months.map((month, index) => {
                  const windValue = cityWindData[month];
                  const windFactorValue = windFactor ? windFactor[index] : null;
                  const adjustedInfiltrationValue = adjustedInfiltrationRate
                    ? adjustedInfiltrationRate[index]
                    : null;
                  const finalInfiltrationValue = finalInfiltrationRateArray
                    ? finalInfiltrationRateArray[index]
                    : null;

                  return (
                    <TableRow key={month}>
                      <TableCell align="center">{month}</TableCell>
                      <TableCell align="center">
                        {windValue !== undefined ? windValue : "-"}
                      </TableCell>
                      <TableCell align="center">
                        {windFactorValue !== null
                          ? windFactorValue.toFixed(2)
                          : "-"}
                      </TableCell>
                      <TableCell align="center">
                        {adjustedInfiltrationValue !== null
                          ? adjustedInfiltrationValue.toFixed(4)
                          : "-"}
                      </TableCell>
                      <TableCell align="center">
                        {finalInfiltrationValue !== null
                          ? finalInfiltrationValue.toFixed(4)
                          : "-"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
}

export default ProposedVentilation;