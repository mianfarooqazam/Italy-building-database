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

import {
  WindowType,
  FrameType,
  ShadingCover,
} from "../../../utils/WindowLayerData.js";
import { 
  calculateEffectiveUValue,
  calculateWindowHeatLoss,
  calculateTotalFabricHeatLoss 
} from "../../../calculations/FabricDetailCal/WindowCalculation.js";

// Import all necessary stores
import useFloorPlanStore from "../../../store/useFloorPlanStore.js";
import useWindowFabricDetailsStore from "../../../store/useWindowFabricDetailsStore.js";
import useRoofFabricDetailsStore from "../../../store/useRoofFabricDetailsStore.js";
import useWallFabricDetailsStore from "../../../store/useWallFabricDetailsStore.js";
import useSlabFabricDetailsStore from "../../../store/useSlabFabricDetailsStore.js";
import useTotalFabricHeatLossStore from '../../../store/useTotalFabricHeatLossStore.js';

function WindowFabricDetails() {
  // Get window data from window fabric store
  const {
    selectedWindowType,
    setSelectedWindowType,
    selectedFrameType,
    setSelectedFrameType,
    selectedShadingCover,
    setSelectedShadingCover,
    uValue,
    setUValue,
    uaValue,
    setUAValue,
    windowHeatLoss,
    setWindowHeatLoss,
    fabricHeatLoss,
    setFabricHeatLoss,
  } = useWindowFabricDetailsStore();
  const { totalFabricHeatLoss, setWindowHeatLoss: setGlobalWindowHeatLoss } = useTotalFabricHeatLossStore();

  // Get totalWindowArea from floor plan store
  const { totalWindowArea } = useFloorPlanStore();

  // Get heat loss values from other component stores
  const { roofHeatLoss } = useRoofFabricDetailsStore();
  const { wallHeatLoss } = useWallFabricDetailsStore();
  const { slabHeatLoss } = useSlabFabricDetailsStore();

  // Need to get UA values for door from its store
  // For now, we'll use mock values
  const doorUAValue = 0;

  // Local state variables
  const [localSelectedWindowType, setLocalSelectedWindowType] = useState(selectedWindowType);
  const [localSelectedFrameType, setLocalSelectedFrameType] = useState(selectedFrameType);
  const [localSelectedShadingCover, setLocalSelectedShadingCover] = useState(selectedShadingCover);
  const [localUValue, setLocalUValue] = useState('0.000');
  const [localUAValue, setLocalUAValue] = useState('0.000');
  const [localWindowHeatLoss, setLocalWindowHeatLoss] = useState('0.000');
  const [localFabricHeatLoss, setLocalFabricHeatLoss] = useState('0.000');
  const [calculationError, setCalculationError] = useState(null);

  // Initialize local state from store
  useEffect(() => {
    setLocalSelectedWindowType(selectedWindowType);
    setLocalSelectedFrameType(selectedFrameType);
    setLocalSelectedShadingCover(selectedShadingCover);
  }, [
    selectedWindowType,
    selectedFrameType,
    selectedShadingCover,
  ]);

  // Save function to update window fabric store
  const handleSave = () => {
    setSelectedWindowType(localSelectedWindowType);
    setSelectedFrameType(localSelectedFrameType);
    setSelectedShadingCover(localSelectedShadingCover);
    setUValue(localUValue);
    setUAValue(localUAValue);
    setWindowHeatLoss(localWindowHeatLoss);
    setFabricHeatLoss(localFabricHeatLoss);
    setGlobalWindowHeatLoss(localWindowHeatLoss);

    toast.success('Window fabric details saved successfully!');
  };

  // Calculate U-value, UA-value, and heat loss when window type or area changes
  useEffect(() => {
    if (localSelectedWindowType) {
      try {
        const effectiveU = calculateEffectiveUValue(
          localSelectedWindowType.u_value
        ).toFixed(3);
        setLocalUValue(effectiveU);

        const areaInFt2 = parseFloat(totalWindowArea) || 0;
        const areaInM2 = areaInFt2 * 0.092903; // Convert ft² to m²

        const ua = (parseFloat(effectiveU) * areaInM2).toFixed(3);
        setLocalUAValue(ua);
        
        // Calculate window heat loss
        const windowHeatLossValue = calculateWindowHeatLoss(parseFloat(ua));
        setLocalWindowHeatLoss(windowHeatLossValue.toFixed(3));
        
        // Calculate total fabric heat loss
        const roofHeatLossValue = parseFloat(roofHeatLoss) || 0;
        const wallHeatLossValue = parseFloat(wallHeatLoss) || 0;
        const slabHeatLossValue = parseFloat(slabHeatLoss) || 0;
        const totalFabricHeatLoss = calculateTotalFabricHeatLoss(
          roofHeatLossValue,
          wallHeatLossValue,
          slabHeatLossValue,
          parseFloat(ua) || 0,
          parseFloat(doorUAValue) || 0
        );
        setLocalFabricHeatLoss(totalFabricHeatLoss.toFixed(3));
        
        setCalculationError(null);
      } catch (error) {
        setCalculationError(error.message);
        setLocalUValue('0.000');
        setLocalUAValue('0.000');
        setLocalWindowHeatLoss('0.000');
        setLocalFabricHeatLoss('0.000');
      }
    } else {
      setLocalUValue('0.000');
      setLocalUAValue('0.000');
      setLocalWindowHeatLoss('0.000');
      setLocalFabricHeatLoss('0.000');
    }
  }, [
    localSelectedWindowType, 
    totalWindowArea,
    roofHeatLoss,
    wallHeatLoss,
    slabHeatLoss,
    doorUAValue
  ]);

  return (
    <Box p={3} display="flex" flexDirection="row" gap={2}>
      {/* Inputs Section */}
      <Box width="80%" display="flex" flexDirection="column" gap={2}>
        {/* Window Type Selection */}
        <FormControl fullWidth variant="outlined">
          <InputLabel>Window Type</InputLabel>
          <Select
            label="Window Type"
            value={localSelectedWindowType ? localSelectedWindowType.name : ""}
            onChange={(e) => {
              const selected = WindowType.find(
                (item) => item.name === e.target.value
              );
              setLocalSelectedWindowType(selected);
            }}
          >
            {WindowType.map((item) => (
              <MenuItem key={item.name} value={item.name}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Frame Type Selection */}
        <FormControl fullWidth variant="outlined">
          <InputLabel>Frame Type</InputLabel>
          <Select
            label="Frame Type"
            value={localSelectedFrameType ? localSelectedFrameType.name : ""}
            onChange={(e) => {
              const selected = FrameType.find(
                (item) => item.name === e.target.value
              );
              setLocalSelectedFrameType(selected);
            }}
          >
            {FrameType.map((item) => (
              <MenuItem key={item.name} value={item.name}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Shading Cover Selection */}
        <FormControl fullWidth variant="outlined">
          <InputLabel>Shading Cover</InputLabel>
          <Select
            label="Shading Cover"
            value={localSelectedShadingCover ? localSelectedShadingCover.type : ""}
            onChange={(e) => {
              const selected = ShadingCover.find(
                (item) => item.type === e.target.value
              );
              setLocalSelectedShadingCover(selected);
            }}
          >
            {ShadingCover.map((item) => (
              <MenuItem key={item.type} value={item.type}>
                {item.type}
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
            Save Window Details
          </Button>
        </Box>

        {/* Calculation Error Display */}
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
        {/* U-Value Display */}
        <Box p={2} bgcolor="#D9EAFD" borderRadius={2} textAlign="center">
          <Typography variant="body2" fontWeight="bold">U-Value: {localUValue}</Typography>
        </Box>

        {/* UA Value Display */}
        <Box p={2} bgcolor="#D9EAFD" borderRadius={2} textAlign="center">
          <Typography variant="body2" fontWeight="bold">UA Value: {localUAValue}</Typography>
        </Box>

        {/* Window Area Display */}
        <Box p={2} bgcolor="#D9EAFD" borderRadius={2} textAlign="center">
          <Typography variant="body2" fontWeight="bold">Window Area (m²):             {(parseFloat(totalWindowArea || 0) * 0.092903).toFixed(2) || "0.00"}
          </Typography>
          
        </Box>

        {/* Window Heat Loss Display */}
        <Box p={2} bgcolor="#D9EAFD" borderRadius={2} textAlign="center">
          <Typography variant="body2" fontWeight="bold">Window Heat Loss: {localWindowHeatLoss}</Typography>
        </Box>

        {/* Total Fabric Heat Loss Display */}
        <Box p={2} bgcolor="#D9EAFD" borderRadius={2} textAlign="center">
          <Typography variant="body2" fontWeight="bold">Total Fabric Heat Loss: {totalFabricHeatLoss}</Typography>
          </Box>
      </Box>
    </Box>
  );
}

export default WindowFabricDetails;