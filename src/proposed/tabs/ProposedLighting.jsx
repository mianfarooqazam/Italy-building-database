// File: Lighting.jsx
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Modal,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from 'react-toastify';

// Import the dedicated lighting store
import useLightingStore from "../../store/proposed/useProposedLightingStore";
// Import fixture options from FixtureOptions.js (located in ../../utils/lighting/)
import fixtureOptions from "../../utils/lighting/FixtureOptions";

function ProposedLighting() {
  // Destructure lighting-related state from the lighting store
  const {
    lights: storedLights,
    totalWattage: storedTotalWattage,
    totalAnnualEnergy: storedTotalAnnualEnergy,
    setLights,
    setTotalWattage,
    setTotalAnnualEnergy,
  } = useLightingStore();

  // Local state for the lights table (not yet saved to store)
  const [lights, setLocalLights] = useState(storedLights || []);
  const [totalWattage, setLocalTotalWattage] = useState(storedTotalWattage || 0);
  const [totalAnnualEnergy, setLocalTotalAnnualEnergy] = useState(storedTotalAnnualEnergy || 0);

  // Local state for controlling the Add/Edit Lighting modal and inputs
  const [openLightModal, setOpenLightModal] = useState(false);
  const [newFixtureType, setNewFixtureType] = useState("");
  const [newLightOption, setNewLightOption] = useState("");
  const [wattage, setWattage] = useState("");
  const [quantity, setQuantity] = useState("");
  const [hoursOfUsage, setHoursOfUsage] = useState("");
  const [daysPerYear, setDaysPerYear] = useState("");
  const [customLightLabel, setCustomLightLabel] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // When fixture type changes, clear dependent selections
  const handleFixtureTypeChange = (e) => {
    setNewFixtureType(e.target.value);
    setNewLightOption("");
    setWattage("");
    setCustomLightLabel("");
  };

  // When the light option is selected, set the wattage (if available)
  const handleLightOptionChange = (e) => {
    const selectedLabel = e.target.value;
    setNewLightOption(selectedLabel);
    const option = fixtureOptions[newFixtureType].find(
      (item) => item.label === selectedLabel
    );
    if (option) {
      if (option.wattage !== null) {
        setWattage(option.wattage);
      } else {
        setWattage("");
      }
      if (!selectedLabel.startsWith("Other")) {
        setCustomLightLabel("");
      }
    }
  };

  // Open modal to add a new light
  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setEditIndex(null);
    setNewFixtureType("");
    setNewLightOption("");
    setWattage("");
    setQuantity("");
    setHoursOfUsage("");
    setDaysPerYear("365");
    setCustomLightLabel("");
    setOpenLightModal(true);
  };

  // Open modal to edit an existing light
  const handleEditLight = (index) => {
    const light = lights[index];
    setIsEditMode(true);
    setEditIndex(index);
    setNewFixtureType(light.fixtureType);
    setNewLightOption(light.lightType);
    setWattage(light.wattage.toString());
    setQuantity(light.quantity.toString());
    setHoursOfUsage(light.hoursOfUsage.toString());
    setDaysPerYear(light.daysPerYear?.toString() || "365");
    setCustomLightLabel(light.lightType.startsWith("Other") ? light.lightType : "");
    setOpenLightModal(true);
  };

  // Add/Update the light fixture in local state only (not in store)
  const handleSaveLight = () => {
    if (
      !newFixtureType ||
      !newLightOption ||
      wattage === "" ||
      !quantity ||
      !hoursOfUsage ||
      !daysPerYear
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const days = parseInt(daysPerYear, 10);
    const annualEnergyConsumption = (
      (parseFloat(wattage) * parseInt(quantity, 10) * parseFloat(hoursOfUsage) * days) / 1000
    ).toFixed(2);

    const lightData = {
      fixtureType: newFixtureType,
      // Use the custom light label if the option starts with "Other" and a label is provided
      lightType:
        newLightOption.startsWith("Other") && customLightLabel
          ? customLightLabel
          : newLightOption,
      wattage: parseFloat(wattage),
      quantity: parseInt(quantity, 10),
      hoursOfUsage: parseFloat(hoursOfUsage),
      daysPerYear: days,
      annualEnergyConsumption: parseFloat(annualEnergyConsumption)
    };
    
    let updatedLights;
    
    if (isEditMode && editIndex !== null) {
      // Update existing light
      updatedLights = [...lights];
      updatedLights[editIndex] = lightData;
      toast.success("Lighting fixture updated in table!");
    } else {
      // Add new light
      updatedLights = [...lights, lightData];
      toast.success("Lighting fixture added to table!");
    }
    
    setLocalLights(updatedLights);
    setOpenLightModal(false);
  };

  // Remove a light from the local list
  const handleRemoveLight = (index) => {
    const updatedLights = lights.filter((_, i) => i !== index);
    setLocalLights(updatedLights);
    // Toast message for light deletion removed
  };

  // Save all lighting data to the store
  const handleSaveToStore = () => {
    setLights(lights);
    setTotalWattage(totalWattage);
    setTotalAnnualEnergy(totalAnnualEnergy);
    toast.success("Lighting data saved successfully!");
  };

  // Calculate annual energy consumption for a single light fixture (in kWh)
  const calculateAnnualEnergy = (light) => {
    if (light.annualEnergyConsumption) {
      return light.annualEnergyConsumption.toFixed(2);
    }
    const days = light.daysPerYear || 365;
    return ((light.wattage * light.quantity * light.hoursOfUsage * days) / 1000).toFixed(2);
  };

  // Recalculate the total wattage and annual energy whenever the lights array changes
  useEffect(() => {
    // Calculate total wattage (quantity * wattage)
    const wattageTotal = lights.reduce(
      (acc, light) => acc + (light.wattage * light.quantity),
      0
    );
    
    // Calculate total annual energy consumption
    const energyTotal = lights.reduce(
      (acc, light) => {
        if (light.annualEnergyConsumption) {
          return acc + light.annualEnergyConsumption;
        }
        const days = light.daysPerYear || 365;
        return acc + (light.wattage * light.quantity * light.hoursOfUsage * days / 1000);
      },
      0
    );
    
    setLocalTotalWattage(wattageTotal);
    setLocalTotalAnnualEnergy(energyTotal);
  }, [lights]);

  // Initialize local state from store on component mount
  useEffect(() => {
    setLocalLights(storedLights || []);
    setLocalTotalWattage(storedTotalWattage || 0);
    setLocalTotalAnnualEnergy(storedTotalAnnualEnergy || 0);
  }, [storedLights, storedTotalWattage, storedTotalAnnualEnergy]);

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button variant="contained" onClick={handleOpenAddModal}>
          Add Lighting
        </Button>
       
      </Box>

      {/* Table displaying added lighting fixtures */}
      {lights.length > 0 && (
        <TableContainer component={Paper}  sx={{ 
          mb: 2,
          maxWidth: '100%',
          overflowX: 'auto' // Add horizontal scrolling
        }}  >
          <Table>
          <TableHead className="bg-blue-100">
  <TableRow>
    <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>S.No</TableCell>
    <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Fixture Type</TableCell>
    <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Light Type</TableCell>
    <TableCell align="center" sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
      Wattage
    </TableCell>
    <TableCell align="center" sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
      Quantity
    </TableCell>
    <TableCell align="center" sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
      Hours/Day
    </TableCell>
    <TableCell align="center" sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
      Days/Year
    </TableCell>
    <TableCell align="center" sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
      Annual Energy (kWh)
    </TableCell>
    <TableCell align="center" sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
      Actions
    </TableCell>
  </TableRow>
</TableHead>
            <TableBody>
              {lights.map((light, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{light.fixtureType}</TableCell>
                  <TableCell>{light.lightType}</TableCell>
                  <TableCell align="center">{light.wattage} W</TableCell>
                  <TableCell align="center">{light.quantity}</TableCell>
                  <TableCell align="center">{light.hoursOfUsage}</TableCell>
                  <TableCell align="center">{light.daysPerYear || 365}</TableCell>
                  <TableCell align="center">
                    {calculateAnnualEnergy(light)}
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" justifyContent="center">
                      <IconButton onClick={() => handleEditLight(index)} sx={{ mr: 1 }}>
                        <EditIcon color="primary" />
                      </IconButton>
                      <IconButton onClick={() => handleRemoveLight(index)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box p={2} bgcolor="#D9EAFD" borderRadius={2} textAlign="center" mb={2}>
        <Typography variant="body2" fontWeight="bold">
          Total Wattage: {totalWattage > 0 ? `${totalWattage.toFixed(2)} W` : "0 W"}
        </Typography>
      </Box>

      <Box p={2} bgcolor="#D9EAFD" borderRadius={2} textAlign="center">
        <Typography variant="body2" fontWeight="bold">
          Total Annual Energy Consumption: {totalAnnualEnergy > 0 ? `${totalAnnualEnergy.toFixed(2)} kWh` : "0 kWh"}
        </Typography>
      </Box>

      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button 
          variant="contained" 
          color="success" 
          onClick={handleSaveToStore}
          sx={{bgcolor:"#ccf462",color:"black"}}
        >
          Save Lighting 
        </Button>
      </Box>

      {/* Modal for adding/editing a lighting fixture */}
      <Modal open={openLightModal} onClose={() => setOpenLightModal(false)}>
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
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2} align="center">
            {isEditMode ? "Edit Lighting" : "Add Lighting"}
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Fixture Type</InputLabel>
            <Select
              label="Fixture Type"
              value={newFixtureType}
              onChange={handleFixtureTypeChange}
            >
              {Object.keys(fixtureOptions).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {newFixtureType && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Light Type</InputLabel>
              <Select
                label="Light Type"
                value={newLightOption}
                onChange={handleLightOptionChange}
              >
                {fixtureOptions[newFixtureType].map((option, index) => (
                  <MenuItem key={index} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {newLightOption && (
            <TextField
              label="Wattage (W)"
              fullWidth
              sx={{ mb: 2 }}
              type="number"
              value={wattage}
              onChange={(e) => setWattage(e.target.value)}
            />
          )}
          {newLightOption && newLightOption.startsWith("Other") && (
            <TextField
              label="Custom Light Type"
              fullWidth
              sx={{ mb: 2 }}
              value={customLightLabel}
              onChange={(e) => setCustomLightLabel(e.target.value)}
            />
          )}
          <TextField
            label="Quantity"
            fullWidth
            sx={{ mb: 2 }}
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          {/* <TextField
            label="Daily Hours of Usage"
            fullWidth
            sx={{ mb: 2 }}
            type="number"
            value={hoursOfUsage}
            onChange={(e) => setHoursOfUsage(e.target.value)}
            inputProps={{ min: 0, max: 24, step: 0.1 }}
          /> */}
          <TextField
            label="Daily Hours of Usage"
            fullWidth
            sx={{ mb: 2 }}
            type="number"
            value={hoursOfUsage}
            onChange={(e) => {
              const value = e.target.value;
              if (
                value === "" ||
                (parseFloat(value) >= 0 && parseFloat(value) <= 24)
              ) {
                setHoursOfUsage(value);
              }
            }}
            slotProps={{ input: { min: 1, max: 24 } }}
          />
          {/* <TextField
            label="Number of days per year"
            fullWidth
            sx={{ mb: 2 }}
            type="number"
            value={daysPerYear}
            onChange={(e) => setDaysPerYear(e.target.value)}
            inputProps={{ min: 1, max: 365, step: 1 }}
          /> */}
           <TextField
            label="Number of days per year"
            fullWidth
            sx={{ mb: 2 }}
            type="number"
            value={daysPerYear}
            onChange={(e) => {
              const value = e.target.value;
              if (
                value === "" ||
                (parseInt(value) > 0 && parseInt(value) <= 365)
              ) {
                setDaysPerYear(value);
              }
            }}
            slotProps={{ input: { min: 1, max: 365 } }}
          />
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="contained" onClick={handleSaveLight}>
              {isEditMode ? "Save Changes" : "Add"}
            </Button>
            <Button variant="outlined" onClick={() => setOpenLightModal(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default ProposedLighting;