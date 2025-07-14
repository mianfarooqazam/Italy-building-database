// File: RoofFabricDetails.jsx
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

import {
  OuterLayer,
  CoreLayer,
  InsulationLayer,
  InnerLayer,
} from "../../../utils/RoofLayerData.js";

import {
  calculateRValue,
  calculateRTotal,
  calculateUValue,
  calculateKappaValue,
  calculateTotalKappa,
  calculateRoofHeatLoss,
  calculateTotalFabricHeatLoss,
} from "../../../calculations/FabricDetailCal/RoofCalculation.js";
import useTotalFabricHeatLossStore from "../../../store/useTotalFabricHeatLossStore.js";
import useFloorPlanStore from "../../../store/useFloorPlanStore.js";
import useRoofFabricDetailsStore from "../../../store/useRoofFabricDetailsStore.js";

function RoofFabricDetails() {
  // Get floor plan data from useFloorPlanStore
  const { totalFloorArea } = useFloorPlanStore();
  const { totalFabricHeatLoss, setRoofHeatLoss: setGlobalRoofHeatLoss } =
    useTotalFabricHeatLossStore();

  // Get roof fabric details from useRoofFabricDetailsStore
  const {
    outerLayerMaterial,
    outerLayerThickness,
    coreLayerMaterial,
    coreLayerThickness,
    insulationLayerMaterial,
    insulationLayerThickness,
    innerLayerMaterial,
    innerLayerThickness,
    setOuterLayerMaterial,
    setOuterLayerThickness,
    setCoreLayerMaterial,
    setCoreLayerThickness,
    setInsulationLayerMaterial,
    setInsulationLayerThickness,
    setInnerLayerMaterial,
    setInnerLayerThickness,
    setUValue,
    setUAValue,
    setFabricHeatLoss,
    setKappaValueRoof,
    setRoofHeatLoss,
  } = useRoofFabricDetailsStore();

  // Need to get UA values for wall, slab, window, door from their respective stores
  // For now, we'll use mock values
  const wallUAValue = 0;
  const slabUAValue = 0;
  const windowUAValue = 0;
  const doorUAValue = 0;

  // Local state for form values
  const [localOuterLayerMaterial, setLocalOuterLayerMaterial] =
    useState(outerLayerMaterial);
  const [localOuterLayerThickness, setLocalOuterLayerThickness] =
    useState(outerLayerThickness);
  const [localCoreLayerMaterial, setLocalCoreLayerMaterial] =
    useState(coreLayerMaterial);
  const [localCoreLayerThickness, setLocalCoreLayerThickness] =
    useState(coreLayerThickness);
  const [localInsulationLayerMaterial, setLocalInsulationLayerMaterial] =
    useState(insulationLayerMaterial);
  const [localInsulationLayerThickness, setLocalInsulationLayerThickness] =
    useState(insulationLayerThickness);
  const [localInnerLayerMaterial, setLocalInnerLayerMaterial] =
    useState(innerLayerMaterial);
  const [localInnerLayerThickness, setLocalInnerLayerThickness] =
    useState(innerLayerThickness);

  // Initialize local state from store
  useEffect(() => {
    setLocalOuterLayerMaterial(outerLayerMaterial);
    setLocalOuterLayerThickness(outerLayerThickness);
    setLocalCoreLayerMaterial(coreLayerMaterial);
    setLocalCoreLayerThickness(coreLayerThickness);
    setLocalInsulationLayerMaterial(insulationLayerMaterial);
    setLocalInsulationLayerThickness(insulationLayerThickness);
    setLocalInnerLayerMaterial(innerLayerMaterial);
    setLocalInnerLayerThickness(innerLayerThickness);
  }, [
    outerLayerMaterial,
    outerLayerThickness,
    coreLayerMaterial,
    coreLayerThickness,
    insulationLayerMaterial,
    insulationLayerThickness,
    innerLayerMaterial,
    innerLayerThickness,
  ]);

  // Save function to update store (only when save button is pressed)
  const handleSave = () => {
    // Update the roof fabric store with local state values
    setOuterLayerMaterial(localOuterLayerMaterial);
    setOuterLayerThickness(localOuterLayerThickness);
    setCoreLayerMaterial(localCoreLayerMaterial);
    setCoreLayerThickness(localCoreLayerThickness);
    setInsulationLayerMaterial(localInsulationLayerMaterial);
    setInsulationLayerThickness(localInsulationLayerThickness);
    setInnerLayerMaterial(localInnerLayerMaterial);
    setInnerLayerThickness(localInnerLayerThickness);

    // Save calculated values
    setUValue(localUValue);
    setUAValue(localUAValue);
    setKappaValueRoof(localKappaValue);
    setRoofHeatLoss(localRoofHeatLoss);
    setFabricHeatLoss(localFabricHeatLoss);
    setGlobalRoofHeatLoss(localRoofHeatLoss);

    toast.success("Roof fabric details saved successfully!");
  };

  // Default values for hi and ho.
  const hi = 2.5;
  const ho = 11.54;

  // Memoized layers, rValues and kappaValues
  const { layers, rValues, kappaValues } = useMemo(() => {
    const layersArray = [];
    const rValuesArray = [];
    const kappaValuesArray = [];

    // Helper function to process each layer
    const processLayer = (layerMaterial, layerThickness, layerType) => {
      if (layerMaterial && layerThickness !== "") {
        const thickness = parseFloat(layerThickness);
        const kValue = layerMaterial.k_value;
        const rValue = calculateRValue(thickness, kValue);
        const shValue = layerMaterial.sh_value;
        const dValue = layerMaterial.d_value;
        const kappaValue = calculateKappaValue(thickness, shValue, dValue);
        layersArray.push({
          type: layerType,
          material: layerMaterial.name,
          thickness: thickness,
          rValue: Number(rValue).toFixed(4),
          kappaValue: Number(kappaValue).toFixed(4),
        });
        rValuesArray.push(parseFloat(rValue.toFixed(4)));
        kappaValuesArray.push(parseFloat(kappaValue.toFixed(4)));
      }
    };

    // Process each roof layer using the local state values
    processLayer(
      localOuterLayerMaterial,
      localOuterLayerThickness,
      "Outer Layer"
    );
    processLayer(localCoreLayerMaterial, localCoreLayerThickness, "Core Layer");
    processLayer(
      localInsulationLayerMaterial,
      localInsulationLayerThickness,
      "Insulation Layer"
    );
    processLayer(
      localInnerLayerMaterial,
      localInnerLayerThickness,
      "Inner Layer"
    );

    return {
      layers: layersArray,
      rValues: rValuesArray,
      kappaValues: kappaValuesArray,
    };
  }, [
    localOuterLayerMaterial,
    localOuterLayerThickness,
    localCoreLayerMaterial,
    localCoreLayerThickness,
    localInsulationLayerMaterial,
    localInsulationLayerThickness,
    localInnerLayerMaterial,
    localInnerLayerThickness,
  ]);

  // State variables for rTotal, calculation results and errors
  const [rTotal, setRTotal] = useState(null);
  const [calculationError, setCalculationError] = useState(null);
  const [localUValue, setLocalUValue] = useState("0.000");
  const [localUAValue, setLocalUAValue] = useState("0.000");
  const [localKappaValue, setLocalKappaValue] = useState("0.000");
  const [localRoofHeatLoss, setLocalRoofHeatLoss] = useState("0.000");
  const [localFabricHeatLoss, setLocalFabricHeatLoss] = useState("0.000");

  // Calculate rTotal, localUValue, localUAValue, localKappaValue, localRoofHeatLoss and localFabricHeatLoss when layers change
  useEffect(() => {
    if (layers.length > 0) {
      try {
        const totalRValue = calculateRTotal(rValues, hi, ho).toFixed(4);
        const calculatedUValue = calculateUValue(totalRValue).toFixed(3);
        setRTotal(totalRValue);
        setCalculationError(null);

        // Set local U-Value
        setLocalUValue(calculatedUValue);

        // Convert totalFloorArea from ft² to m²
        const areaInFt2 = parseFloat(totalFloorArea) || 0;
        const areaInM2 = areaInFt2 * 0.092903; // 1 ft² = 0.092903 m²

        // Calculate UA for the roof
        const ua = (parseFloat(calculatedUValue) * areaInM2).toFixed(3);
        setLocalUAValue(ua);

        // Calculate total Kappa value
        const calculatedTotalKappa =
          calculateTotalKappa(kappaValues).toFixed(4);
        setLocalKappaValue(calculatedTotalKappa);

        // Calculate Roof Heat Loss (individual component heat loss)
        const roofHeatLossValue = calculateRoofHeatLoss(parseFloat(ua));
        setLocalRoofHeatLoss(Number(roofHeatLossValue).toFixed(3));

        // Calculate Fabric Heat Loss combining roof and related elements' UA values
        const fabricHeatLossValue = calculateTotalFabricHeatLoss(
          parseFloat(ua) || 0,
          parseFloat(wallUAValue) || 0,
          parseFloat(slabUAValue) || 0,
          parseFloat(windowUAValue) || 0,
          parseFloat(doorUAValue) || 0
        );
        setLocalFabricHeatLoss(Number(fabricHeatLossValue).toFixed(3));
      } catch (error) {
        setCalculationError(error.message);
        setRTotal(null);
        setLocalUValue("0.000");
        setLocalUAValue("0.000");
        setLocalKappaValue("0.000");
        setLocalRoofHeatLoss("0.000");
        setLocalFabricHeatLoss("0.000");
      }
    } else {
      setRTotal(null);
      setCalculationError(null);
      setLocalUValue("0.000");
      setLocalUAValue("0.000");
      setLocalKappaValue("0.000");
      setLocalRoofHeatLoss("0.000");
      setLocalFabricHeatLoss("0.000");
    }
  }, [
    layers,
    rValues,
    kappaValues,
    hi,
    ho,
    totalFloorArea,
    wallUAValue,
    slabUAValue,
    windowUAValue,
    doorUAValue,
  ]);

  return (
    <Box p={3} display="flex" flexDirection="row" gap={2}>
      {/* Inputs Section */}
      <Box width="80%" display="flex" flexDirection="column" gap={2}>
        {/* Outer Layer Inputs */}
        <Box display="flex" gap={2} alignItems="center">
          <FormControl fullWidth variant="outlined">
            <InputLabel>Outer Layer</InputLabel>
            <Select
              label="Outer Layer"
              value={
                localOuterLayerMaterial ? localOuterLayerMaterial.name : ""
              }
              onChange={(e) => {
                const selectedMaterial = OuterLayer.find(
                  (material) => material.name === e.target.value
                );
                setLocalOuterLayerMaterial(selectedMaterial);
                if (selectedMaterial && selectedMaterial.name === "None") {
                  setLocalOuterLayerThickness("0");
                } else {
                  setLocalOuterLayerThickness("");
                }
              }}
            >
              {OuterLayer.map((material) => (
                <MenuItem key={material.name} value={material.name}>
                  {material.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Outer Layer Thickness (inches)"
            variant="outlined"
            type="number"
            fullWidth
            value={localOuterLayerThickness}
            onChange={(e) => setLocalOuterLayerThickness(e.target.value)}
            disabled={
              localOuterLayerMaterial && localOuterLayerMaterial.name === "None"
            }
          />
        </Box>

        {/* Core Layer Inputs */}
        <Box display="flex" gap={2} alignItems="center">
          <FormControl fullWidth variant="outlined">
            <InputLabel>Core Layer</InputLabel>
            <Select
              label="Core Layer"
              value={localCoreLayerMaterial ? localCoreLayerMaterial.name : ""}
              onChange={(e) => {
                const selectedMaterial = CoreLayer.find(
                  (material) => material.name === e.target.value
                );
                setLocalCoreLayerMaterial(selectedMaterial);
                if (selectedMaterial && selectedMaterial.name === "None") {
                  setLocalCoreLayerThickness("0");
                } else {
                  setLocalCoreLayerThickness("");
                }
              }}
            >
              {CoreLayer.map((material) => (
                <MenuItem key={material.name} value={material.name}>
                  {material.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Core Layer Thickness (inches)"
            variant="outlined"
            fullWidth
            type="number"
            value={localCoreLayerThickness}
            onChange={(e) => setLocalCoreLayerThickness(e.target.value)}
            disabled={
              localCoreLayerMaterial && localCoreLayerMaterial.name === "None"
            }
          />
        </Box>

        {/* Insulation Layer Inputs */}
        <Box display="flex" gap={2} alignItems="center">
          <FormControl fullWidth variant="outlined">
            <InputLabel>Insulation Layer</InputLabel>
            <Select
              label="Insulation Layer"
              value={
                localInsulationLayerMaterial
                  ? localInsulationLayerMaterial.name
                  : ""
              }
              onChange={(e) => {
                const selectedMaterial = InsulationLayer.find(
                  (material) => material.name === e.target.value
                );
                setLocalInsulationLayerMaterial(selectedMaterial);
                if (selectedMaterial && selectedMaterial.name === "None") {
                  setLocalInsulationLayerThickness("0");
                } else {
                  setLocalInsulationLayerThickness("");
                }
              }}
            >
              {InsulationLayer.map((material) => (
                <MenuItem key={material.name} value={material.name}>
                  {material.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Insulation Layer Thickness (inches)"
            variant="outlined"
            fullWidth
            type="number"
            value={localInsulationLayerThickness}
            onChange={(e) => setLocalInsulationLayerThickness(e.target.value)}
            disabled={
              localInsulationLayerMaterial &&
              localInsulationLayerMaterial.name === "None"
            }
          />
        </Box>

        {/* Inner Layer Inputs */}
        <Box display="flex" gap={2} alignItems="center">
          <FormControl fullWidth variant="outlined">
            <InputLabel>Inner Layer</InputLabel>
            <Select
              label="Inner Layer"
              value={
                localInnerLayerMaterial ? localInnerLayerMaterial.name : ""
              }
              onChange={(e) => {
                const selectedMaterial = InnerLayer.find(
                  (material) => material.name === e.target.value
                );
                setLocalInnerLayerMaterial(selectedMaterial);
                if (selectedMaterial && selectedMaterial.name === "None") {
                  setLocalInnerLayerThickness("0");
                } else {
                  setLocalInnerLayerThickness("");
                }
              }}
            >
              {InnerLayer.map((material) => (
                <MenuItem key={material.name} value={material.name}>
                  {material.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Inner Layer Thickness (inches)"
            variant="outlined"
            type="number"
            fullWidth
            value={localInnerLayerThickness}
            onChange={(e) => setLocalInnerLayerThickness(e.target.value)}
            disabled={
              localInnerLayerMaterial && localInnerLayerMaterial.name === "None"
            }
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
            Save Roof Details
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
      <Box width="20%" display="flex" flexDirection="column" gap={2}>
        {/* rTotal Display */}
        <Box p={2} bgcolor="#D9EAFD" borderRadius={2} textAlign="center">
          <Typography variant="body2" fontWeight="bold">
            R-Value: {rTotal || "0.000"}
          </Typography>
        </Box>

        {/* U-Value Display */}
        <Box p={2} bgcolor="#D9EAFD" borderRadius={2} textAlign="center">
          <Typography variant="body2" fontWeight="bold">
            U-Value: {localUValue}
          </Typography>
        </Box>

        {/* Kappa Value Display */}
        <Box p={2} bgcolor="#D9EAFD" borderRadius={2} textAlign="center">
          <Typography variant="body2" fontWeight="bold">
            Kappa Value: {localKappaValue}
          </Typography>
        </Box>

        {/* Roof Area Display */}
        <Box p={2} bgcolor="#D9EAFD" borderRadius={2} textAlign="center">
          <Typography variant="body2" fontWeight="bold">
            Roof Area (m²):{" "}
            {(parseFloat(totalFloorArea || 0) * 0.092903).toFixed(2) || "0.00"}
          </Typography>
        </Box>

        {/* UA Value Display */}
        <Box p={2} bgcolor="#D9EAFD" borderRadius={2} textAlign="center">
          <Typography variant="body2" fontWeight="bold">
            UA Value: {localUAValue}
          </Typography>
        </Box>

        {/* Roof Heat Loss Display */}
        <Box p={2} bgcolor="#D9EAFD" borderRadius={2} textAlign="center">
          <Typography variant="body2" fontWeight="bold">
            Roof Heat Loss: {localRoofHeatLoss}
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

export default RoofFabricDetails;
