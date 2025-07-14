import {
  Box,
  MenuItem,
  TextField,
  Select,
  Button,
  InputLabel,
  FormControl,
  Typography,
  Modal,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Orientation,
  OrientationSingleWindow,
  OrientationDoubleWindow,
  OrientationSingleDoor,
  OrientationDoubleDoor,
  Floors,
} from "../../utils/BuildingInformationData";
import useFloorPlanStore from "../../store/useFloorPlanStore";
import { useState, useEffect } from "react";
import {
  calculateArea,
  calculateDwellingVolume,
  getWallInputs,
  calculateTotalWallArea,
  calculateTotalWindowArea,
  calculateTotalDoorArea,
  calculateNetWallArea,
  calculateTotalArea,
  getMaxAllowedWindows,
  calculateWindowArea,
  calculateDoorArea,
} from "../../calculations/FloorPlanCal/FloorPlanCalculation";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

function FloorPlan() {
  // Extract values and actions from the floor plan store
  const {
    buildingOrientation,
    numberOfFloors,
    wallLengths,
    wallHeight,
    setBuildingOrientation,
    setNumberOfFloors,
    setWallLengths,
    setWallHeight,
    dwellingVolume,
    setDwellingVolume,
    sidesConnected,
    setSidesConnected,
    totalWallArea,
    setTotalWallArea,
    totalWindowArea,
    setTotalWindowArea,
    totalDoorArea,
    setTotalDoorArea,
    netWallArea,
    setNetWallArea,
    totalArea,
    setTotalArea,
    windows,
    setWindows,
    doors,
    setDoors,
    totalFloorArea,
    setTotalFloorArea,
    numberOfOccupants,
    setNumberOfOccupants,
    // Indoor Conditions variables
    setTemperature,
    setSetTemperature,
    coolingHours,
    setCoolingHours,
    heatingHours,
    setHeatingHours,
  } = useFloorPlanStore();

  // Local state variables to hold form values until save
  const [localBuildingOrientation, setLocalBuildingOrientation] = useState(
    buildingOrientation || ""
  );
  const [localNumberOfFloors, setLocalNumberOfFloors] = useState(
    numberOfFloors || ""
  );
  const [localWallLengths, setLocalWallLengths] = useState(wallLengths || {});
  const [localWallHeightPerFloor, setLocalWallHeightPerFloor] = useState(
    wallHeight || 0
  );
  const [localTotalWallHeight, setLocalTotalWallHeight] = useState(
    (wallHeight || 0) * (numberOfFloors || 1)
  );
  const [localSidesConnected, setLocalSidesConnected] = useState(
    sidesConnected || 0
  );
  const [localWindows, setLocalWindows] = useState(windows || []);
  const [localDoors, setLocalDoors] = useState(doors || []);
  const [localNumberOfOccupants, setLocalNumberOfOccupants] = useState(
    numberOfOccupants || ""
  );
  const [localSetTemperature, setLocalSetTemperature] = useState(
    setTemperature || ""
  );
  const [localCoolingHours, setLocalCoolingHours] = useState(
    coolingHours || []
  );
  const [localHeatingHours, setLocalHeatingHours] = useState(
    heatingHours || []
  );

  // Local state for calculated values
  const [localTotalFloorArea, setLocalTotalFloorArea] = useState(
    totalFloorArea || 0
  );
  const [localDwellingVolume, setLocalDwellingVolume] = useState(
    dwellingVolume || 0
  );
  const [localTotalWallArea, setLocalTotalWallArea] = useState(
    totalWallArea || 0
  );
  const [localTotalWindowArea, setLocalTotalWindowArea] = useState(
    totalWindowArea || 0
  );
  const [localTotalDoorArea, setLocalTotalDoorArea] = useState(
    totalDoorArea || 0
  );
  const [localNetWallArea, setLocalNetWallArea] = useState(netWallArea || 0);
  const [localTotalArea, setLocalTotalArea] = useState(totalArea || 0);

  // New state variables for window dimensions
  const [newWindowOrientation, setNewWindowOrientation] = useState("");
  const [newWindowLength, setNewWindowLength] = useState("");
  const [newWindowHeight, setNewWindowHeight] = useState("");

  // New state variables for door dimensions
  const [newDoorOrientation, setNewDoorOrientation] = useState("");
  const [newDoorLength, setNewDoorLength] = useState("");
  const [newDoorHeight, setNewDoorHeight] = useState("");

  // Indoor Conditions state
  const [openCoolingHourModal, setOpenCoolingHourModal] = useState(false);
  const [selectedCoolingHours, setSelectedCoolingHours] = useState([]);

  const [openHeatingHourModal, setOpenHeatingHourModal] = useState(false);
  const [selectedHeatingHours, setSelectedHeatingHours] = useState([]);

  // Calculate max allowed windows based on sides connected
  const maxAllowedWindows = getMaxAllowedWindows(localSidesConnected);

  // Initialize local state from global store
  useEffect(() => {
    setLocalBuildingOrientation(buildingOrientation || "");
    setLocalNumberOfFloors(numberOfFloors || "");
    setLocalWallLengths(wallLengths || {});
    setLocalWallHeightPerFloor(wallHeight || 0);
    setLocalSidesConnected(sidesConnected || 0);
    setLocalWindows(windows || []);
    setLocalDoors(doors || []);
    setLocalNumberOfOccupants(numberOfOccupants || "");
    setLocalSetTemperature(setTemperature || "");
    setLocalCoolingHours(coolingHours || []);
    setLocalHeatingHours(heatingHours || []);
    setLocalTotalFloorArea(totalFloorArea || 0);
    setLocalDwellingVolume(dwellingVolume || 0);
    setLocalTotalWallArea(totalWallArea || 0);
    setLocalTotalWindowArea(totalWindowArea || 0);
    setLocalTotalDoorArea(totalDoorArea || 0);
    setLocalNetWallArea(netWallArea || 0);
    setLocalTotalArea(totalArea || 0);
  }, [
    buildingOrientation,
    numberOfFloors,
    wallLengths,
    wallHeight,
    sidesConnected,
    windows,
    doors,
    numberOfOccupants,
    setTemperature,
    coolingHours,
    heatingHours,
    totalFloorArea,
    dwellingVolume,
    totalWallArea,
    totalWindowArea,
    totalDoorArea,
    netWallArea,
    totalArea,
  ]);

  const timeSlots = [
    "12am - 1am",
    "1am - 2am",
    "2am - 3am",
    "3am - 4am",
    "4am - 5am",
    "5am - 6am",
    "6am - 7am",
    "7am - 8am",
    "8am - 9am",
    "9am - 10am",
    "10am - 11am",
    "11am - 12pm",
    "12pm - 1pm",
    "1pm - 2pm",
    "2pm - 3pm",
    "3pm - 4pm",
    "4pm - 5pm",
    "5pm - 6pm",
    "6pm - 7pm",
    "7pm - 8pm",
    "8pm - 9pm",
    "9pm - 10pm",
    "10pm - 11pm",
    "11pm - 12am",
  ];

  function getWindowOrientations() {
    if (OrientationSingleWindow.includes(localBuildingOrientation)) {
      return OrientationSingleWindow;
    } else if (OrientationDoubleWindow.includes(localBuildingOrientation)) {
      return OrientationDoubleWindow;
    } else {
      return [];
    }
  }

  function getDoorOrientations() {
    if (OrientationSingleDoor.includes(localBuildingOrientation)) {
      return OrientationSingleDoor;
    } else if (OrientationDoubleDoor.includes(localBuildingOrientation)) {
      return OrientationDoubleDoor;
    } else {
      return [];
    }
  }

  useEffect(() => {
    // Update total wall height whenever localWallHeightPerFloor or localNumberOfFloors changes
    const totalHeight =
      (localWallHeightPerFloor || 0) * (localNumberOfFloors || 1);
    setLocalTotalWallHeight(totalHeight);
  }, [localWallHeightPerFloor, localNumberOfFloors]);

  useEffect(() => {
    const wallLabels = getWallInputs(
      localBuildingOrientation,
      OrientationSingleWindow,
      OrientationDoubleWindow
    );

    const area = calculateArea(localWallLengths, wallLabels) || 0;
    const volume =
      calculateDwellingVolume(
        area,
        localWallHeightPerFloor,
        localNumberOfFloors
      ) || 0;
    const totalWallAreaValue =
      calculateTotalWallArea(
        localWallLengths,
        wallLabels,
        localWallHeightPerFloor,
        localNumberOfFloors
      ) || 0;
    const totalWindowAreaValue = calculateTotalWindowArea(localWindows) || 0;
    const totalDoorAreaValue = calculateTotalDoorArea(localDoors) || 0;
    const netWallAreaValue =
      calculateNetWallArea(
        totalWallAreaValue,
        totalWindowAreaValue,
        totalDoorAreaValue
      ) || 0;
    const totalAreaValue =
      calculateTotalArea(
        area,
        netWallAreaValue,
        totalWindowAreaValue,
        totalDoorAreaValue
      ) || 0;

    // Update local calculated values for display
    setLocalTotalFloorArea(area);
    setLocalDwellingVolume(volume);
    setLocalTotalWallArea(totalWallAreaValue);
    setLocalTotalWindowArea(totalWindowAreaValue);
    setLocalTotalDoorArea(totalDoorAreaValue);
    setLocalNetWallArea(netWallAreaValue);
    setLocalTotalArea(totalAreaValue);
  }, [
    localWallLengths,
    localBuildingOrientation,
    localWallHeightPerFloor,
    localNumberOfFloors,
    localWindows,
    localDoors,
  ]);

  // Check if we need to remove windows when localSidesConnected changes
  useEffect(() => {
    if (localWindows.length > maxAllowedWindows) {
      // Remove excess windows
      setLocalWindows(localWindows.slice(0, maxAllowedWindows));
    }
  }, [localSidesConnected, localWindows, maxAllowedWindows]);

  const handleAddWindow = () => {
    if (
      localWindows.length < maxAllowedWindows &&
      newWindowOrientation &&
      newWindowLength &&
      newWindowHeight
    ) {
      // Calculate area from length and height
      const area = calculateWindowArea(newWindowLength, newWindowHeight);

      setLocalWindows([
        ...localWindows,
        {
          orientation: newWindowOrientation,
          length: parseFloat(newWindowLength),
          height: parseFloat(newWindowHeight),
          area: area,
        },
      ]);
      setNewWindowOrientation("");
      setNewWindowLength("");
      setNewWindowHeight("");
    }
  };

  const handleRemoveWindow = (index) => {
    setLocalWindows(localWindows.filter((_, i) => i !== index));
  };

  const handleAddDoor = () => {
    if (
      localDoors.length < 4 &&
      newDoorOrientation &&
      newDoorLength &&
      newDoorHeight
    ) {
      // Calculate area from length and height
      const area = calculateDoorArea(newDoorLength, newDoorHeight);

      setLocalDoors([
        ...localDoors,
        {
          orientation: newDoorOrientation,
          length: parseFloat(newDoorLength),
          height: parseFloat(newDoorHeight),
          area: area,
        },
      ]);
      setNewDoorOrientation("");
      setNewDoorLength("");
      setNewDoorHeight("");
    }
  };

  const handleRemoveDoor = (index) => {
    setLocalDoors(localDoors.filter((_, i) => i !== index));
  };

  const handleAddCoolingHours = () => {
    setSelectedCoolingHours(localCoolingHours);
    setOpenCoolingHourModal(true);
  };

  const handleAddHeatingHours = () => {
    setSelectedHeatingHours(localHeatingHours);
    setOpenHeatingHourModal(true);
  };

  // Save function to update the floor plan store
  const handleSave = () => {
    // Save form data to the store
    setBuildingOrientation(localBuildingOrientation);
    setNumberOfFloors(localNumberOfFloors);
    setWallLengths(localWallLengths);
    setWallHeight(localWallHeightPerFloor);
    setSidesConnected(localSidesConnected);
    setWindows(localWindows);
    setDoors(localDoors);
    setNumberOfOccupants(localNumberOfOccupants);
    setSetTemperature(localSetTemperature);
    setCoolingHours(localCoolingHours);
    setHeatingHours(localHeatingHours);
    setSelectedCoolingHours(localCoolingHours); // Store the selected time slots
    setSelectedHeatingHours(localHeatingHours); // Store the selected time slots

    // Save calculated values to the store
    setTotalFloorArea(localTotalFloorArea);
    setDwellingVolume(localDwellingVolume);
    setTotalWallArea(localTotalWallArea);
    setTotalWindowArea(localTotalWindowArea);
    setTotalDoorArea(localTotalDoorArea);
    setNetWallArea(localNetWallArea);
    setTotalArea(localTotalArea);

    // Show success toast notification
    toast.success("Floor plan data saved successfully!");
  };

  function DisplayArea({ label, areaInSqFt }) {
    return (
      <Box mb={2}>
        <Typography
          sx={{
            backgroundColor: "#D9EAFD",
            padding: "8px",
            borderRadius: "4px 4px 0 0",
            textAlign: "center",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{label} </span>
          <span>
            {typeof areaInSqFt === "number" && !isNaN(areaInSqFt)
              ? `${Number(areaInSqFt).toFixed(2)} ft²`
              : "N/A"}
          </span>
        </Typography>
      </Box>
    );
  }

  function DisplayVolume({ label, volumeInCubicFt }) {
    return (
      <Box mb={2}>
        <Typography
          sx={{
            backgroundColor: "#D9EAFD",
            padding: "8px",
            borderRadius: "4px 4px 0 0",
            textAlign: "center",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{label}</span>
          <span>
            {typeof volumeInCubicFt === "number" && !isNaN(volumeInCubicFt)
              ? `${Number(volumeInCubicFt).toFixed(2)} ft³`
              : "N/A"}
          </span>
        </Typography>
      </Box>
    );
  }

  function DisplayHours({ label, hours }) {
    return (
      <Box mb={2}>
        <Typography
          sx={{
            backgroundColor: "#D9EAFD",
            padding: "8px",
            borderRadius: "4px 4px 0 0",
            textAlign: "center",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{label}</span>
          <span>{hours} hour(s)</span>
        </Typography>
      </Box>
    );
  }

  DisplayArea.propTypes = {
    label: PropTypes.string.isRequired,
    areaInSqFt: PropTypes.number.isRequired,
  };

  DisplayVolume.propTypes = {
    label: PropTypes.string.isRequired,
    volumeInCubicFt: PropTypes.number.isRequired,
  };

  DisplayHours.propTypes = {
    label: PropTypes.string.isRequired,
    hours: PropTypes.number.isRequired,
  };

  return (
    <Box p={3} display="flex" flexDirection="column" gap={2} overflow="hidden">
      <Box display="flex" flexDirection="column" gap={2}>
        <h1 className="font-semibold text-2xl text-left">Wall Dimensions</h1>
        <Box display="flex" flexWrap="wrap" gap={2}>
          <FormControl fullWidth variant="outlined" sx={{ flex: 1 }}>
            <InputLabel>Building Orientation</InputLabel>
            <Select
              label="Building Orientation"
              value={localBuildingOrientation || ""}
              onChange={(e) => {
                setLocalBuildingOrientation(e.target.value);
                setLocalWallLengths({});
                setLocalWindows([]);
                setLocalDoors([]);
                // Reset cooling and heating hours if orientation changes
                setLocalCoolingHours([]);
                setLocalHeatingHours([]);
              }}
            >
              {Orientation.map((direction) => (
                <MenuItem key={direction} value={direction}>
                  {direction}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Wall Height (ft)"
            variant="outlined"
            fullWidth
            sx={{ flex: 1 }}
            value={localTotalWallHeight || ""}
            onChange={(e) => {
              const value = e.target.value;
              const perFloor = localNumberOfFloors
                ? parseFloat(value) / localNumberOfFloors
                : parseFloat(value);
              setLocalWallHeightPerFloor(isNaN(perFloor) ? 0 : perFloor);
            }}
            type="number"
          />
        </Box>

        {localBuildingOrientation && (
          <>
            <Box display="flex" flexWrap="wrap" gap={2}>
              {getWallInputs(
                localBuildingOrientation,
                OrientationSingleWindow,
                OrientationDoubleWindow
              ).map((label) => (
                <TextField
                  key={label}
                  label={label}
                  variant="outlined"
                  fullWidth
                  sx={{ flex: 1 }}
                  value={
                    localWallLengths[label] !== undefined
                      ? localWallLengths[label]
                      : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setLocalWallLengths({
                      ...localWallLengths,
                      [label]: value === "" ? "" : parseFloat(value),
                    });
                  }}
                  type="number"
                />
              ))}
            </Box>
            <Box display="flex" flexWrap="wrap" gap={2}>
              <FormControl fullWidth variant="outlined" sx={{ flex: 1 }}>
                <InputLabel>No. of Floors</InputLabel>
                <Select
                  label="No. of Floors"
                  value={
                    localNumberOfFloors !== null ? localNumberOfFloors : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setLocalNumberOfFloors(value === "" ? "" : parseInt(value));
                  }}
                >
                  {Floors.map((floor) => (
                    <MenuItem key={floor} value={floor}>
                      {floor}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth variant="outlined" sx={{ flex: 1 }}>
                <InputLabel>
                  No. of Sides Connected to Other Building
                </InputLabel>
                <Select
                  label="No. of Sides Connected to Other Building"
                  value={
                    localSidesConnected !== null ? localSidesConnected : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setLocalSidesConnected(value === "" ? "" : parseInt(value));
                  }}
                >
                  {[0, 1, 2, 3, 4].map((side) => (
                    <MenuItem key={side} value={side}>
                      {side}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </>
        )}

        <h1 className="font-semibold text-2xl text-left">Window Dimensions</h1>
        {maxAllowedWindows === 0 ? (
          <Box>
            <Typography color="error">
              Cannot add windows when all 4 sides are connected to other
              buildings.
            </Typography>
          </Box>
        ) : localWindows.length < maxAllowedWindows ? (
          <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
            <FormControl fullWidth variant="outlined" sx={{ flex: 1 }}>
              <InputLabel>Orientation</InputLabel>
              <Select
                label="Orientation"
                value={newWindowOrientation || ""}
                onChange={(e) => setNewWindowOrientation(e.target.value)}
                displayEmpty
              >
                {getWindowOrientations().map((direction) => (
                  <MenuItem key={direction} value={direction}>
                    {direction}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Window Length (ft)"
              variant="outlined"
              fullWidth
              sx={{ flex: 1 }}
              value={newWindowLength || ""}
              onChange={(e) => setNewWindowLength(e.target.value)}
              type="number"
            />
            <TextField
              label="Window Height (ft)"
              variant="outlined"
              fullWidth
              sx={{ flex: 1 }}
              value={newWindowHeight || ""}
              onChange={(e) => setNewWindowHeight(e.target.value)}
              type="number"
            />
            <Button variant="contained" onClick={handleAddWindow}>
              Add
            </Button>
          </Box>
        ) : (
          <Box>
            <Typography color="error">
              Maximum of {maxAllowedWindows} window
              {maxAllowedWindows !== 1 ? "s" : ""} can be added when{" "}
              {localSidesConnected} side
              {localSidesConnected !== 1 ? "s are" : " is"} connected to other
              buildings.
            </Typography>
          </Box>
        )}
        {localWindows.length > 0 && (
          <Box mt={2}>
            <TableContainer component={Paper}>
              <Table aria-label="windows table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ textAlign:"center",fontWeight: "bold", bgcolor: "#D9EAFD" }}>
                      Window
                    </TableCell>
                    <TableCell sx={{textAlign:"center", fontWeight: "bold", bgcolor: "#D9EAFD" }}>
                      Orientation
                    </TableCell>
                    <TableCell sx={{ textAlign:"center",fontWeight: "bold", bgcolor: "#D9EAFD" }}>
                      Length (ft)
                    </TableCell>
                    <TableCell sx={{textAlign:"center", fontWeight: "bold", bgcolor: "#D9EAFD" }}>
                      Height (ft)
                    </TableCell>
                    <TableCell sx={{textAlign:"center", fontWeight: "bold", bgcolor: "#D9EAFD" }}>
                      Area (ft²)
                    </TableCell>
                    <TableCell sx={{ textAlign:"center",fontWeight: "bold", bgcolor: "#D9EAFD" }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {localWindows.map((window, index) => (
                    <TableRow key={index}>
                      <TableCell  sx={{textAlign:"center"}}>{index + 1}</TableCell>
                      <TableCell  sx={{textAlign:"center"}}>{window.orientation}</TableCell>
                      <TableCell  sx={{textAlign:"center"}}>{window.length}</TableCell>
                      <TableCell  sx={{textAlign:"center"}}>{window.height}</TableCell>
                      <TableCell  sx={{textAlign:"center"}}>{Number(window.area).toFixed(2)}</TableCell>
                      <TableCell sx={{textAlign:"center"}}>
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveWindow(index)}
                          aria-label={`remove window ${index + 1}`}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        <h1 className="font-semibold text-2xl text-left">Door Dimensions</h1>
        {localDoors.length < 4 && (
          <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
            <FormControl fullWidth variant="outlined" sx={{ flex: 1 }}>
              <InputLabel>Orientation</InputLabel>
              <Select
                label="Orientation"
                value={newDoorOrientation || ""}
                onChange={(e) => setNewDoorOrientation(e.target.value)}
                displayEmpty
              >
                {getDoorOrientations().map((direction) => (
                  <MenuItem key={direction} value={direction}>
                    {direction}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Door Length (ft)"
              variant="outlined"
              fullWidth
              sx={{ flex: 1 }}
              value={newDoorLength || ""}
              onChange={(e) => setNewDoorLength(e.target.value)}
              type="number"
            />
            <TextField
              label="Door Height (ft)"
              variant="outlined"
              fullWidth
              sx={{ flex: 1 }}
              value={newDoorHeight || ""}
              onChange={(e) => setNewDoorHeight(e.target.value)}
              type="number"
            />
            <Button variant="contained" onClick={handleAddDoor}>
              Add
            </Button>
          </Box>
        )}
        
        {localDoors.length >= 4 && (
          <Box>
            <Typography color="error">
              Maximum of 4 doors can be added.
            </Typography>
          </Box>
        )}
       {localDoors.length > 0 && (
  <Box mt={2}>
    <TableContainer component={Paper}>
      <Table aria-label="doors table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ textAlign:"center" ,fontWeight: "bold", bgcolor: "#D9EAFD" }}>Door</TableCell>
            <TableCell sx={{ textAlign:"center" ,fontWeight: "bold", bgcolor: "#D9EAFD" }}>Orientation</TableCell>
            <TableCell sx={{ textAlign:"center" ,fontWeight: "bold", bgcolor: "#D9EAFD" }}>Length (ft)</TableCell>
            <TableCell sx={{ textAlign:"center" ,fontWeight: "bold", bgcolor: "#D9EAFD" }}>Height (ft)</TableCell>
            <TableCell sx={{ textAlign:"center" ,fontWeight: "bold", bgcolor: "#D9EAFD" }}>Area (ft²)</TableCell>
            <TableCell sx={{ textAlign:"center"  ,fontWeight: "bold", bgcolor: "#D9EAFD" }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {localDoors.map((door, index) => (
            <TableRow key={index}>
              <TableCell sx={{textAlign:"center"}}>{index + 1}</TableCell>
              <TableCell  sx={{textAlign:"center"}}>{door.orientation}</TableCell>
              <TableCell  sx={{textAlign:"center"}}>{door.length}</TableCell>
              <TableCell  sx={{textAlign:"center"}}>{door.height}</TableCell>
              <TableCell  sx={{textAlign:"center"}}>{Number(door.area).toFixed(2)}</TableCell>
              <TableCell sx={{textAlign:"center"}}>
                <IconButton
                  color="error"
                  onClick={() => handleRemoveDoor(index)}
                  aria-label={`remove door ${index + 1}`}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
)}

<h1 className="font-semibold text-2xl text-left">Other Details</h1>


        </Box>
        {/* Occupancy Section */}
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
            <TextField
              label="Number of Occupants"
              variant="outlined"
              sx={{ flex: 1 }}
              value={
                localNumberOfOccupants !== null ? localNumberOfOccupants : ""
              }
              onChange={(e) => {
                const value = e.target.value;
                setLocalNumberOfOccupants(value === "" ? "" : parseInt(value));
              }}
              type="number"
            />
            <TextField
              label="Set Temperature (°C)"
              variant="outlined"
              sx={{ flex: 1 }}
              value={localSetTemperature !== null ? localSetTemperature : ""}
              onChange={(e) => {
                const value = e.target.value;
                setLocalSetTemperature(value === "" ? "" : parseFloat(value));
              }}
              type="number"
            />
          </Box>

          <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
            <Button variant="contained" onClick={handleAddCoolingHours}>
              Set Cooling Hours
            </Button>
            <Button variant="contained" onClick={handleAddHeatingHours}>
              Set Heating Hours
            </Button>
          </Box>

        <Box mt={3}>
          <Typography
            variant="h6"
            fontWeight={"bold"}
            gutterBottom
            textAlign={"center"}
          >
            Summary
          </Typography>
          <TableContainer component={Paper}>
            <Table aria-label="area measurements table">
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: "#D9EAFD" }}>
                    Roof Area
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: "#D9EAFD" }}>
                    Floor Area
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: "#D9EAFD" }}>
                    Wall Area
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: "#D9EAFD" }}>
                    Door Area
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: "#D9EAFD" }}>
                    Window Area
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    {typeof localTotalFloorArea === "number" &&
                    !isNaN(localTotalFloorArea)
                      ? `${Number(localTotalFloorArea).toFixed(2)} ft²`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {typeof localTotalFloorArea === "number" &&
                    !isNaN(localTotalFloorArea)
                      ? `${Number(localTotalFloorArea).toFixed(2)} ft²`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {typeof localTotalWallArea === "number" &&
                    !isNaN(localTotalWallArea)
                      ? `${Number(localTotalWallArea).toFixed(2)} ft²`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {typeof localTotalDoorArea === "number" &&
                    !isNaN(localTotalDoorArea)
                      ? `${Number(localTotalDoorArea).toFixed(2)} ft²`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {typeof localTotalWindowArea === "number" &&
                    !isNaN(localTotalWindowArea)
                      ? `${Number(localTotalWindowArea).toFixed(2)} ft²`
                      : "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: "#D9EAFD" }}>
                    Net Wall Area
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: "#D9EAFD" }}>
                    Total Area (Σ)
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: "#D9EAFD" }}>
                    Dwelling Volume
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: "#D9EAFD" }}>
                    Cooling Hours
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: "#D9EAFD" }}>
                    Heating Hours
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    {typeof localNetWallArea === "number" &&
                    !isNaN(localNetWallArea)
                      ? `${Number(localNetWallArea).toFixed(2)} ft²`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {typeof localTotalArea === "number" &&
                    !isNaN(localTotalArea)
                      ? `${Number(localTotalArea).toFixed(2)} ft²`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {typeof localDwellingVolume === "number" &&
                    !isNaN(localDwellingVolume)
                      ? `${Number(localDwellingVolume).toFixed(2)} ft³`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {localCoolingHours
                      ? `${localCoolingHours.length} hour(s)`
                      : "0 hour(s)"}
                  </TableCell>
                  <TableCell>
                    {localHeatingHours
                      ? `${localHeatingHours.length} hour(s)`
                      : "0 hour(s)"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Save Button */}
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="success"
            sx={{ bgcolor: "#ccf462", color: "black" }}
            onClick={handleSave}
          >
            Save Floor Plan
          </Button>
        </Box>

        {/* Cooling Hours Modal */}
        <Modal
          open={openCoolingHourModal}
          onClose={() => setOpenCoolingHourModal(false)}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              maxWidth: 600,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
              maxHeight: "80vh",
              overflowY: "auto",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" component="h2" mb={2}>
              Select Cooling Hours of Operation
            </Typography>
            <Grid container spacing={2}>
              {timeSlots.map((slot, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          Array.isArray(selectedCoolingHours)
                            ? selectedCoolingHours.includes(slot)
                            : false
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCoolingHours(
                              Array.isArray(selectedCoolingHours)
                                ? [...selectedCoolingHours, slot]
                                : [slot]
                            );
                          } else {
                            setSelectedCoolingHours(
                              Array.isArray(selectedCoolingHours)
                                ? selectedCoolingHours.filter((s) => s !== slot)
                                : []
                            );
                          }
                        }}
                      />
                    }
                    label={slot}
                  />
                </Grid>
              ))}
            </Grid>
            <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
              <Button
                variant="contained"
                onClick={() => {
                  setLocalCoolingHours(selectedCoolingHours);
                  setOpenCoolingHourModal(false);
                }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={() => setOpenCoolingHourModal(false)}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Heating Hours Modal */}
        <Modal
          open={openHeatingHourModal}
          onClose={() => setOpenHeatingHourModal(false)}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              maxWidth: 600,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
              maxHeight: "80vh",
              overflowY: "auto",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" component="h2" mb={2}>
              Select Heating Hours of Operation
            </Typography>
            <Grid container spacing={2}>
              {timeSlots.map((slot, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          Array.isArray(selectedHeatingHours)
                            ? selectedHeatingHours.includes(slot)
                            : false
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedHeatingHours(
                              Array.isArray(selectedHeatingHours)
                                ? [...selectedHeatingHours, slot]
                                : [slot]
                            );
                          } else {
                            setSelectedHeatingHours(
                              Array.isArray(selectedHeatingHours)
                                ? selectedHeatingHours.filter((s) => s !== slot)
                                : []
                            );
                          }
                        }}
                      />
                    }
                    label={slot}
                  />
                </Grid>
              ))}
            </Grid>
            <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
              <Button
                variant="contained"
                onClick={() => {
                  setLocalHeatingHours(selectedHeatingHours);
                  setOpenHeatingHourModal(false);
                }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={() => setOpenHeatingHourModal(false)}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}

export default FloorPlan;
