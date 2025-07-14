import { useState, useEffect, useMemo } from "react";
import {
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Divider,
  Button,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";

import { DoorType } from "../../../utils/DoorLayerData.js";

import {
  calculateRValue,
  calculateRTotal,
  calculateUValue,
  calculateDoorHeatLoss,
  calculateTotalFabricHeatLoss,
} from "../../../calculations/FabricDetailCal/DoorCalculation.js";

// Import all necessary stores
import useFloorPlanStore from "../../../store/useFloorPlanStore.js";
import useDoorFabricDetailsStore from "../../../store/useDoorFabricDetailsStore.js";
import useRoofFabricDetailsStore from "../../../store/useRoofFabricDetailsStore.js";
import useWallFabricDetailsStore from "../../../store/useWallFabricDetailsStore.js";
import useSlabFabricDetailsStore from "../../../store/useSlabFabricDetailsStore.js";
import useWindowFabricDetailsStore from "../../../store/useWindowFabricDetailsStore.js";
import useTotalFabricHeatLossStore from "../../../store/useTotalFabricHeatLossStore.js";

function DoorFabricDetails() {
  // Get door data from door fabric store
  const {
    doorMaterial,
    setDoorMaterial,
    doorThickness,
    setDoorThickness,
    uValue,
    setUValue,
    uaValue,
    setUAValue,
    doorHeatLoss,
    setDoorHeatLoss,
    fabricHeatLoss,
    setFabricHeatLoss,
  } = useDoorFabricDetailsStore();

  // Get totalDoorArea from floor plan store
  const { totalDoorArea } = useFloorPlanStore();
  const { totalFabricHeatLoss, setDoorHeatLoss: setGlobalDoorHeatLoss } =
    useTotalFabricHeatLossStore();

  // Get heat loss values from other component stores
  const { roofHeatLoss } = useRoofFabricDetailsStore();
  const { wallHeatLoss } = useWallFabricDetailsStore();
  const { slabHeatLoss } = useSlabFabricDetailsStore();
  const { windowHeatLoss } = useWindowFabricDetailsStore();

  // Local state for form values
  const [localDoorMaterial, setLocalDoorMaterial] = useState(doorMaterial);
  const [localDoorThickness, setLocalDoorThickness] = useState(doorThickness);
  const [localUValue, setLocalUValue] = useState("0.000");
  const [localUAValue, setLocalUAValue] = useState("0.000");
  const [localDoorHeatLoss, setLocalDoorHeatLoss] = useState("0.000");
  const [localFabricHeatLoss, setLocalFabricHeatLoss] = useState("0.000");
  const [calculationError, setCalculationError] = useState(null);

  // Initialize local state from stores
  useEffect(() => {
    setLocalDoorMaterial(doorMaterial);
    setLocalDoorThickness(doorThickness);
  }, [doorMaterial, doorThickness]);

  // Save function to update door fabric store
  const handleSave = () => {
    setDoorMaterial(localDoorMaterial);
    setDoorThickness(localDoorThickness);
    setUValue(localUValue);
    setUAValue(localUAValue);
    setDoorHeatLoss(localDoorHeatLoss);
    setFabricHeatLoss(localFabricHeatLoss);
    setGlobalDoorHeatLoss(localDoorHeatLoss);

    toast.success("Door fabric details saved successfully!");
  };

  // Default values for hi and ho
  const hi = 2.5;
  const ho = 11.54;

  // Memoize layers and rValues based on localDoorMaterial and localDoorThickness
  const { layers, rValues } = useMemo(() => {
    const layersArray = [];
    const rValuesArray = [];

    // Helper function to process the door layer
    const processDoorLayer = (material, thickness) => {
      if (material && thickness !== "") {
        const thicknessValue = parseFloat(thickness);
        const kValue = material.k_value;
        const rValue = calculateRValue(thicknessValue, kValue);
        layersArray.push({
          material: material.name,
          thickness: thicknessValue,
          kValue: kValue,
          rValue: Number(rValue).toFixed(4),
        });
        rValuesArray.push(parseFloat(Number(rValue).toFixed(4)));
      }
    };

    // Process the door layer
    processDoorLayer(localDoorMaterial, localDoorThickness);

    return { layers: layersArray, rValues: rValuesArray };
  }, [localDoorMaterial, localDoorThickness]);

  // Local state for rTotal
  const [rTotal, setRTotal] = useState(null);

  // Calculate rTotal, U-value, door heat loss, and total fabric heat loss when layers change
  useEffect(() => {
    if (layers.length > 0) {
      try {
        const totalRValue = calculateRTotal(rValues, hi, ho).toFixed(4);
        const calculatedUValue = calculateUValue(totalRValue).toFixed(3);
        setRTotal(totalRValue);
        setCalculationError(null);

        // Update local U-value
        setLocalUValue(calculatedUValue);

        // Convert totalDoorArea from ft² to m²
        const areaInFt2 = parseFloat(totalDoorArea) || 0;
        const areaInM2 = areaInFt2 * 0.092903; // 1 ft² = 0.092903 m²

        // Calculate UA
        const ua = (parseFloat(calculatedUValue) * areaInM2).toFixed(3);
        setLocalUAValue(ua);

        // Calculate door heat loss
        const doorHeatLossValue = calculateDoorHeatLoss(parseFloat(ua));
        setLocalDoorHeatLoss(doorHeatLossValue.toFixed(3));

        // Calculate total fabric heat loss
        const roofHeatLossValue = parseFloat(roofHeatLoss) || 0;
        const wallHeatLossValue = parseFloat(wallHeatLoss) || 0;
        const slabHeatLossValue = parseFloat(slabHeatLoss) || 0;
        const windowHeatLossValue = parseFloat(windowHeatLoss) || 0;

        const totalFabricHeatLoss = calculateTotalFabricHeatLoss(
          roofHeatLossValue,
          wallHeatLossValue,
          slabHeatLossValue,
          windowHeatLossValue,
          parseFloat(ua) || 0
        );
        setLocalFabricHeatLoss(Number(totalFabricHeatLoss).toFixed(3));
      } catch (error) {
        setCalculationError(error.message);
        setRTotal(null);
        setLocalUValue("0.000");
        setLocalUAValue("0.000");
        setLocalDoorHeatLoss("0.000");
        setLocalFabricHeatLoss("0.000");
      }
    } else {
      setRTotal(null);
      setCalculationError(null);
      setLocalUValue("0.000");
      setLocalUAValue("0.000");
      setLocalDoorHeatLoss("0.000");
      setLocalFabricHeatLoss("0.000");
    }
  }, [
    layers,
    rValues,
    hi,
    ho,
    totalDoorArea,
    roofHeatLoss,
    wallHeatLoss,
    slabHeatLoss,
    windowHeatLoss,
  ]);

  return (
    <Box p={3} display="flex" flexDirection="row" gap={2}>
      {/* Inputs Section */}
      <Box width="80%" display="flex" flexDirection="column" gap={2}>
        {/* Door Type Input */}
        <Box display="flex" gap={2} alignItems="center">
          <FormControl fullWidth variant="outlined">
            <InputLabel>Door Type</InputLabel>
            <Select
              label="Door Type"
              value={localDoorMaterial ? localDoorMaterial.name : ""}
              onChange={(e) => {
                const selectedMaterial = DoorType.find(
                  (material) => material.name === e.target.value
                );
                setLocalDoorMaterial(selectedMaterial);
                // If "None" is selected, set thickness to "0"
                if (selectedMaterial && selectedMaterial.name === "None") {
                  setLocalDoorThickness("0");
                } else {
                  setLocalDoorThickness("");
                }
              }}
            >
              {DoorType.map((material) => (
                <MenuItem key={material.name} value={material.name}>
                  {material.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Door Thickness (inches)"
            variant="outlined"
            fullWidth
            type='number'

            value={localDoorThickness}
            onChange={(e) => setLocalDoorThickness(e.target.value)}
            disabled={localDoorMaterial && localDoorMaterial.name === "None"}
          />
        </Box>

        {/* Save Button */}
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="success"
            sx={{ bgcolor: "#ccf462", color: "black" }}
            onClick={handleSave}
          >
            Save Door Details
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
        {/* R-Value Display */}
        <Box p={2} bgcolor="#D9EAFD" borderRadius={2} textAlign="center">
          <Typography variant="body2" fontWeight="bold">
            R-Value:{rTotal || "0.000"}{" "}
          </Typography>
        </Box>

        {/* U-Value Display */}
        <Box p={2} bgcolor="#D9EAFD" borderRadius={2} textAlign="center">
          <Typography variant="body2" fontWeight="bold">
            U-Value: {localUValue}
          </Typography>
        </Box>

        {/* UA Value Display */}
        <Box p={2} bgcolor="#D9EAFD" borderRadius={2} textAlign="center">
          <Typography variant="body2" fontWeight="bold">
            UA Value: {localUAValue}
          </Typography>
        </Box>

        {/* Door Area Display */}
        <Box p={2} bgcolor="#D9EAFD" borderRadius={2} textAlign="center">
          <Typography variant="body2" fontWeight="bold">
            Door Area (m²):{" "}
            {(parseFloat(totalDoorArea || 0) * 0.092903).toFixed(2) || "0.00"}
          </Typography>
        </Box>

        {/* Door Heat Loss Display */}
        <Box p={2} bgcolor="#D9EAFD" borderRadius={2} textAlign="center">
          <Typography variant="body2" fontWeight="bold">
            Door Heat Loss: {localDoorHeatLoss}
          </Typography>
        </Box>

        {/* Total Fabric Heat Loss Display */}
        <Box p={2} bgcolor="#D9EAFD" borderRadius={2} textAlign="center">
          <Typography variant="body2" fontWeight="bold">
            Total Fabric Heat Loss: {totalFabricHeatLoss}
          </Typography>
         
        </Box>
      </Box>
    </Box>
  );
}

export default DoorFabricDetails;
