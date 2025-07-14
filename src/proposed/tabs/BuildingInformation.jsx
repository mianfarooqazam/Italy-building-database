import {
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button
} from "@mui/material";
import { useState, useEffect } from "react";
import useBuildingInformationStore from "../../store/useBuildingInformationStore";
import { toast } from 'react-toastify';

function BuildingInformation({ onTabChange }) {
  // Get the store values and setters
  const {
    ownerName,
    address,
    plotNo,
    streetNo,
    postalCode,
    selectedCity,
    setOwnerName,
    setAddress,
    setPlotNo,
    setStreetNo,
    setPostalCode,
    setSelectedCity,
  } = useBuildingInformationStore();

  // Create local state to hold form values until save
  const [localOwnerName, setLocalOwnerName] = useState(ownerName);
  const [localAddress, setLocalAddress] = useState(address);
  const [localPlotNo, setLocalPlotNo] = useState(plotNo);
  const [localStreetNo, setLocalStreetNo] = useState(streetNo);
  const [localPostalCode, setLocalPostalCode] = useState(postalCode);
  const [localSelectedCity, setLocalSelectedCity] = useState(selectedCity);

  // Update local state when store changes (e.g., on initial load)
  useEffect(() => {
    setLocalOwnerName(ownerName);
    setLocalAddress(address);
    setLocalPlotNo(plotNo);
    setLocalStreetNo(streetNo);
    setLocalPostalCode(postalCode);
    setLocalSelectedCity(selectedCity);
  }, [ownerName, address, plotNo, streetNo, postalCode, selectedCity]);

  const cities = [
    "Peshawar",
    "Lahore",
    "Islamabad",
    "Karachi",
    "Multan",
    "Charsadda",
    "DI Khan",
    "Gilgit",
    "Muzzafarabad",
    "Quetta",
    "Swat",
  ];

  // Save function to update the store and navigate to next tab
  const handleSave = () => {
    // Update the store with local values
    setOwnerName(localOwnerName);
    setAddress(localAddress);
    setPlotNo(localPlotNo);
    setStreetNo(localStreetNo);
    setPostalCode(localPostalCode);
    setSelectedCity(localSelectedCity);
    
    // Show success toast notification
    toast.success('Building Information saved successfully!');
    
    // Navigate to the Floor Plan tab (index 1)
    if (typeof onTabChange === 'function') {
      onTabChange(1);
    }
  };

  return (
    <Box p={3} display="flex" flexDirection="column" gap={2}>
      <Box display="flex" gap={2}>
        <TextField
          label="Owner Name"
          variant="outlined"
          fullWidth
          type=""
          value={localOwnerName}
          onChange={(e) => setLocalOwnerName(e.target.value)}
        />
        <TextField
          label="Address"
          variant="outlined"
          fullWidth
          value={localAddress}
          onChange={(e) => setLocalAddress(e.target.value)}
        />
      </Box>

      <Box display="flex" gap={2}>
        <TextField
          label="Plot No."
          variant="outlined"
          fullWidth
          value={localPlotNo}
          onChange={(e) => setLocalPlotNo(e.target.value)}
        />
        <TextField
          label="Street No."
          variant="outlined"
          fullWidth
          value={localStreetNo}
          onChange={(e) => setLocalStreetNo(e.target.value)}
        />
      </Box>

      <Box display="flex" gap={2}>
        <TextField
          label="Postal Code"
          variant="outlined"
          fullWidth
          type="number"
          value={localPostalCode}
          onChange={(e) => setLocalPostalCode(e.target.value)}
        />
        <FormControl fullWidth variant="outlined">
          <InputLabel>City</InputLabel>
          <Select
            value={localSelectedCity}
            onChange={(e) => setLocalSelectedCity(e.target.value)}
            label="City"
          >
            {cities.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button 
          variant="contained"
          color="success" 
          sx={{bgcolor:"#ccf462",color:"black"}}
          onClick={handleSave}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}

export default BuildingInformation;