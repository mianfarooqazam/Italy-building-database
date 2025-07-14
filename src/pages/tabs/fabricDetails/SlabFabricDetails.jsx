import { useEffect, useState } from "react";
import {
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Divider,
  Button,
  Typography,
} from "@mui/material";
import { toast } from 'react-toastify';

import { SlabLayer } from "../../../utils/SlabLayerData.js";
import {
  calculateSlabHeatLoss,
  calculateTotalFabricHeatLoss,
} from "../../../calculations/FabricDetailCal/SlabCalculation.js";
import useTotalFabricHeatLossStore from '../../../store/useTotalFabricHeatLossStore.js';

import useFloorPlanStore from "../../../store/useFloorPlanStore.js";
import useSlabFabricDetailsStore from "../../../store/useSlabFabricDetailsStore.js";
import useRoofFabricDetailsStore from "../../../store/useRoofFabricDetailsStore.js";
import useWallFabricDetailsStore from "../../../store/useWallFabricDetailsStore.js";

function SlabFabricDetails() {
  // Get totalFloorArea from floor plan store
  const { totalFloorArea } = useFloorPlanStore();
  const { totalFabricHeatLoss, setSlabHeatLoss: setGlobalSlabHeatLoss } = useTotalFabricHeatLossStore();

  // Get heat loss values from other component stores
  const { roofHeatLoss } = useRoofFabricDetailsStore();
  const { wallHeatLoss } = useWallFabricDetailsStore();

  // Need to get UA values for window and door from their respective stores
  // For now, we'll use mock values
  const windowUAValue = 0;
  const doorUAValue = 0;

  // Get slab details from the slab fabric details store
  const {
    selectedSlabType,
    setSelectedSlabType,
    uValue,
    setUValue,
    uaValue,
    setUAValue,
    slabHeatLoss,
    setSlabHeatLoss,
    fabricHeatLoss,
    setFabricHeatLoss,
  } = useSlabFabricDetailsStore();

  // Local state variables
  const [localSelectedSlabType, setLocalSelectedSlabType] = useState(selectedSlabType);
  const [localUValue, setLocalUValue] = useState('0.000');
  const [localUAValue, setLocalUAValue] = useState('0.000');
  const [localSlabHeatLoss, setLocalSlabHeatLoss] = useState('0.000');
  const [localFabricHeatLoss, setLocalFabricHeatLoss] = useState('0.000');
  const [calculationError, setCalculationError] = useState(null);

  // Initialize local state from store
  useEffect(() => {
    setLocalSelectedSlabType(selectedSlabType);
  }, [selectedSlabType]);

  // Save function to update store
  const handleSave = () => {
    setSelectedSlabType(localSelectedSlabType);
    setUValue(localUValue);
    setUAValue(localUAValue);
    setSlabHeatLoss(localSlabHeatLoss);
    setFabricHeatLoss(localFabricHeatLoss);
    setGlobalSlabHeatLoss(localSlabHeatLoss);

    toast.success('Slab fabric details saved successfully!');
  };

  useEffect(() => {
    if (localSelectedSlabType) {
      try {
        // Calculate U-value from the selected slab type
        const calculatedUValue = parseFloat(localSelectedSlabType.u_value).toFixed(3);
        setLocalUValue(calculatedUValue);

        const areaInFt2 = parseFloat(totalFloorArea) || 0;
        const areaInM2 = areaInFt2 * 0.092903; // Convert ft² to m²

        const ua = (parseFloat(calculatedUValue) * areaInM2).toFixed(3);
        setLocalUAValue(ua);
        
        // Calculate slab heat loss
        const slabHeatLossValue = calculateSlabHeatLoss(parseFloat(ua));
        setLocalSlabHeatLoss(slabHeatLossValue.toFixed(3));
        
        // Calculate total fabric heat loss
        const roofHeatLossValue = parseFloat(roofHeatLoss) || 0;
        const wallHeatLossValue = parseFloat(wallHeatLoss) || 0;
        const totalFabricHeatLoss = calculateTotalFabricHeatLoss(
          roofHeatLossValue,
          wallHeatLossValue,
          parseFloat(ua) || 0,
          parseFloat(windowUAValue) || 0,
          parseFloat(doorUAValue) || 0
        );
        setLocalFabricHeatLoss(totalFabricHeatLoss.toFixed(3));
        
        setCalculationError(null);
      } catch (error) {
        setCalculationError(error.message);
        setLocalUValue('0.000');
        setLocalUAValue('0.000');
        setLocalSlabHeatLoss('0.000');
        setLocalFabricHeatLoss('0.000');
      }
    } else {
      setLocalUValue('0.000');
      setLocalUAValue('0.000');
      setLocalSlabHeatLoss('0.000');
      setLocalFabricHeatLoss('0.000');
    }
  }, [
    localSelectedSlabType, 
    totalFloorArea,
    roofHeatLoss,
    wallHeatLoss,
    windowUAValue,
    doorUAValue
  ]);

  return (
    <Box p={3} display="flex" flexDirection="row" gap={2}>
      {/* Inputs Section */}
      <Box width="80%" display="flex" flexDirection="column" gap={2}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Slab Type</InputLabel>
          <Select
            label="Slab Type"
            value={localSelectedSlabType ? localSelectedSlabType.name : ""}
            onChange={(e) => {
              const selected = SlabLayer.find(
                (item) => item.name === e.target.value
              );
              setLocalSelectedSlabType(selected);
            }}
          >
            {SlabLayer.map((item) => (
              <MenuItem key={item.name} value={item.name}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Save Button */}
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button 
            variant="contained" 
            color="success" 
            sx={{bgcolor:"#ccf462",color:"black"}}
            onClick={handleSave}
          >
            Save Slab Details
          </Button>
        </Box>

        {calculationError && (
          <Box
            p={2}
            mt={2}
            bgcolor="lightcoral"
            borderRadius={2}
            fontWeight="bold"
            textAlign="center"
          >
            Error: {calculationError}
          </Box>
        )}
      </Box>

      {/* Divider */}
      <Divider orientation="vertical" flexItem />

      {/* Calculations Section */}
      <Box width="20%" display="flex" flexDirection="column" gap={1}>
        {/* R-Value Display */}
        <Box p={2} bgcolor="#D9EAFD" borderRadius={2} textAlign="center">
          <Typography variant="body2" fontWeight="bold">R-Value:  {localSelectedSlabType ? localSelectedSlabType.r_value : '0.000'}</Typography>
          
        </Box>
        
        {/* U-Value Display */}
        <Box p={2} bgcolor="#D9EAFD" borderRadius={2} textAlign="center">
          <Typography variant="body2" fontWeight="bold">U-Value: {localUValue}</Typography>
        </Box>
        
        {/* Floor Area Display */}
        <Box p={2} bgcolor="#D9EAFD" borderRadius={2} textAlign="center">
          <Typography variant="body2" fontWeight="bold">Floor Area (m²): {(parseFloat(totalFloorArea || 0) * 0.092903).toFixed(2) || '0.00'}</Typography>
          
        </Box>
        
        {/* UA Value Display */}
        <Box p={2} bgcolor="#D9EAFD" borderRadius={2} textAlign="center">
          <Typography variant="body2" fontWeight="bold">UA Value: {localUAValue}</Typography>
        </Box>
        
        {/* Slab Heat Loss Display */}
        <Box p={2} bgcolor="#D9EAFD" borderRadius={2} textAlign="center">
          <Typography variant="body2" fontWeight="bold">Slab Heat Loss: {localSlabHeatLoss}</Typography>
        </Box>
        
        {/* Total Fabric Heat Loss Display */}
        <Box p={2} bgcolor="#D9EAFD" borderRadius={2} textAlign="center">
          <Typography variant="body2" fontWeight="bold">Total Fabric Heat Loss: {totalFabricHeatLoss}</Typography>
          </Box>
      </Box>
    </Box>
  );
}

export default SlabFabricDetails;