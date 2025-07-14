// File: WallFabricDetails.jsx
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
} from "../../../utils/WallLayerData.js";

import {
  calculateRValue,
  calculateRTotal,
  calculateUValue,
  calculateKappaValue,
  calculateTotalKappa,
  calculateWallHeatLoss,
  calculateTotalFabricHeatLoss,
} from "../../../calculations/FabricDetailCal/WallCalculation.js";

// Import the stores
import useFloorPlanStore from "../../../store/useFloorPlanStore.js";
import useRoofFabricDetailsStore from "../../../store/proposed/useProposedRoofFabricDetailsStore.js";
import useWallFabricDetailsStore from "../../../store/proposed/useProposedWallFabricDetailsStore.js";
import useTotalFabricHeatLossStore from "../../../store/proposed/useProposedTotalFabricHeatLossStore.js";

function ProposedWallFabricDetails() {
  // Get netWallArea from floor plan store
  const { netWallArea } = useFloorPlanStore();
  const { totalFabricHeatLoss, setWallHeatLoss: setGlobalWallHeatLoss } = useTotalFabricHeatLossStore();

  // Get roof heat loss value from roof fabric details store
  const { roofHeatLoss } = useRoofFabricDetailsStore();

  // Get wall fabric details from the wall fabric details store
  const {
    wallOuterLayerMaterial,
    setWallOuterLayerMaterial,
    wallOuterLayerThickness,
    setWallOuterLayerThickness,
    wallCoreLayerMaterial,
    setWallCoreLayerMaterial,
    wallCoreLayerThickness,
    setWallCoreLayerThickness,
    wallInsulationLayerMaterial,
    setWallInsulationLayerMaterial,
    wallInsulationLayerThickness,
    setWallInsulationLayerThickness,
    wallInnerLayerMaterial,
    setWallInnerLayerMaterial,
    wallInnerLayerThickness,
    setWallInnerLayerThickness,
    uValue,
    setUValue,
    uaValue,
    setUAValue,
    kappaValue,
    setKappaValue,
    wallHeatLoss,
    setWallHeatLoss,
    fabricHeatLoss,
    setFabricHeatLoss,
  } = useWallFabricDetailsStore();

  // Need to get UA values for slab, window, door from their respective stores
  // For now, we'll use mock values
  const slabUAValue = 0;
  const windowUAValue = 0;
  const doorUAValue = 0;

  // Local state for form values
  const [localWallOuterLayerMaterial, setLocalWallOuterLayerMaterial] =
    useState(wallOuterLayerMaterial);
  const [localWallOuterLayerThickness, setLocalWallOuterLayerThickness] =
    useState(wallOuterLayerThickness);
  const [localWallCoreLayerMaterial, setLocalWallCoreLayerMaterial] = useState(
    wallCoreLayerMaterial
  );
  const [localWallCoreLayerThickness, setLocalWallCoreLayerThickness] =
    useState(wallCoreLayerThickness);
  const [
    localWallInsulationLayerMaterial,
    setLocalWallInsulationLayerMaterial,
  ] = useState(wallInsulationLayerMaterial);
  const [
    localWallInsulationLayerThickness,
    setLocalWallInsulationLayerThickness,
  ] = useState(wallInsulationLayerThickness);
  const [localWallInnerLayerMaterial, setLocalWallInnerLayerMaterial] =
    useState(wallInnerLayerMaterial);
  const [localWallInnerLayerThickness, setLocalWallInnerLayerThickness] =
    useState(wallInnerLayerThickness);

  const [localUValue, setLocalUValue] = useState("0.000");
  const [localUAValue, setLocalUAValue] = useState("0.000");
  const [localKappaValue, setLocalKappaValue] = useState("0.000");
  const [localWallHeatLoss, setLocalWallHeatLoss] = useState("0.000");
  const [localFabricHeatLoss, setLocalFabricHeatLoss] = useState("0.000");

  // Initialize local state from store
  useEffect(() => {
    setLocalWallOuterLayerMaterial(wallOuterLayerMaterial);
    setLocalWallOuterLayerThickness(wallOuterLayerThickness);
    setLocalWallCoreLayerMaterial(wallCoreLayerMaterial);
    setLocalWallCoreLayerThickness(wallCoreLayerThickness);
    setLocalWallInsulationLayerMaterial(wallInsulationLayerMaterial);
    setLocalWallInsulationLayerThickness(wallInsulationLayerThickness);
    setLocalWallInnerLayerMaterial(wallInnerLayerMaterial);
    setLocalWallInnerLayerThickness(wallInnerLayerThickness);
  }, [
    wallOuterLayerMaterial,
    wallOuterLayerThickness,
    wallCoreLayerMaterial,
    wallCoreLayerThickness,
    wallInsulationLayerMaterial,
    wallInsulationLayerThickness,
    wallInnerLayerMaterial,
    wallInnerLayerThickness,
  ]);

  // Save function to update store
  const handleSave = () => {
    setWallOuterLayerMaterial(localWallOuterLayerMaterial);
    setWallOuterLayerThickness(localWallOuterLayerThickness);
    setWallCoreLayerMaterial(localWallCoreLayerMaterial);
    setWallCoreLayerThickness(localWallCoreLayerThickness);
    setWallInsulationLayerMaterial(localWallInsulationLayerMaterial);
    setWallInsulationLayerThickness(localWallInsulationLayerThickness);
    setWallInnerLayerMaterial(localWallInnerLayerMaterial);
    setWallInnerLayerThickness(localWallInnerLayerThickness);

    // Update calculated values in store
    setUValue(localUValue);
    setUAValue(localUAValue);
    setKappaValue(localKappaValue);
    setWallHeatLoss(localWallHeatLoss);
    setFabricHeatLoss(localFabricHeatLoss);
    setGlobalWallHeatLoss(localWallHeatLoss);

    toast.success("Wall fabric details saved successfully!");
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
        const kappaVal = calculateKappaValue(thickness, shValue, dValue);
        layersArray.push({
          type: layerType,
          material: layerMaterial.name,
          thickness: thickness,
          rValue: rValue.toFixed(4),
          kappaValue: kappaVal.toFixed(4),
        });
        rValuesArray.push(parseFloat(rValue.toFixed(4)));
        kappaValuesArray.push(parseFloat(kappaVal.toFixed(4)));
      }
    };

    // Process each layer using local wall fabric values
    processLayer(
      localWallOuterLayerMaterial,
      localWallOuterLayerThickness,
      "Outer Layer"
    );
    processLayer(
      localWallCoreLayerMaterial,
      localWallCoreLayerThickness,
      "Core Layer"
    );
    processLayer(
      localWallInsulationLayerMaterial,
      localWallInsulationLayerThickness,
      "Insulation Layer"
    );
    processLayer(
      localWallInnerLayerMaterial,
      localWallInnerLayerThickness,
      "Inner Layer"
    );

    return {
      layers: layersArray,
      rValues: rValuesArray,
      kappaValues: kappaValuesArray,
    };
  }, [
    localWallOuterLayerMaterial,
    localWallOuterLayerThickness,
    localWallCoreLayerMaterial,
    localWallCoreLayerThickness,
    localWallInsulationLayerMaterial,
    localWallInsulationLayerThickness,
    localWallInnerLayerMaterial,
    localWallInnerLayerThickness,
  ]);

  // State variables for rTotal and calculationError
  const [rTotal, setRTotal] = useState(null);
  const [calculationError, setCalculationError] = useState(null);

  // useEffect to calculate rTotal, wallUValue, wallUAValue, and kappaValueWall when layers change
  useEffect(() => {
    if (layers.length > 0) {
      try {
        const totalRValue = calculateRTotal(rValues, hi, ho).toFixed(4);
        const calculatedUValue = calculateUValue(totalRValue).toFixed(3);
        setRTotal(totalRValue);
        setCalculationError(null);

        // Set local calculated values
        setLocalUValue(calculatedUValue);

        // Convert netWallArea from ft² to m²
        const areaInFt2 = parseFloat(netWallArea) || 0;
        const areaInM2 = areaInFt2 * 0.092903; // 1 ft² = 0.092903 m²

        // Calculate UA for the wall
        const ua = (parseFloat(calculatedUValue) * areaInM2).toFixed(3);
        setLocalUAValue(ua);

        // Calculate total Kappa value for the wall
        const calculatedTotalKappa =
          calculateTotalKappa(kappaValues).toFixed(4);
        setLocalKappaValue(calculatedTotalKappa);

        // Calculate wall heat loss
        const wallHeatLossValue = calculateWallHeatLoss(parseFloat(ua));
        setLocalWallHeatLoss(wallHeatLossValue.toFixed(3));

        // Calculate total fabric heat loss (combine with roof heat loss)
        const roofHeatLossValue = parseFloat(roofHeatLoss) || 0;
        const fabricHeatLossValue = calculateTotalFabricHeatLoss(
          roofHeatLossValue,
          parseFloat(ua) || 0,
          parseFloat(slabUAValue) || 0,
          parseFloat(windowUAValue) || 0,
          parseFloat(doorUAValue) || 0
        );
        setLocalFabricHeatLoss(fabricHeatLossValue.toFixed(3));
      } catch (error) {
        setCalculationError(error.message);
        setRTotal(null);
        setLocalUValue("0.000");
        setLocalUAValue("0.000");
        setLocalKappaValue("0.000");
        setLocalWallHeatLoss("0.000");
        setLocalFabricHeatLoss("0.000");
      }
    } else {
      setRTotal(null);
      setCalculationError(null);
      setLocalUValue("0.000");
      setLocalUAValue("0.000");
      setLocalKappaValue("0.000");
      setLocalWallHeatLoss("0.000");
      setLocalFabricHeatLoss("0.000");
    }
  }, [
    layers,
    rValues,
    kappaValues,
    hi,
    ho,
    netWallArea,
    roofHeatLoss,
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
                localWallOuterLayerMaterial
                  ? localWallOuterLayerMaterial.name
                  : ""
              }
              onChange={(e) => {
                const selectedMaterial = OuterLayer.find(
                  (material) => material.name === e.target.value
                );
                setLocalWallOuterLayerMaterial(selectedMaterial);
                if (selectedMaterial && selectedMaterial.name === "None") {
                  setLocalWallOuterLayerThickness("0");
                } else {
                  setLocalWallOuterLayerThickness("");
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
            fullWidth
            type='number'

            value={localWallOuterLayerThickness}
            onChange={(e) => setLocalWallOuterLayerThickness(e.target.value)}
            disabled={
              localWallOuterLayerMaterial &&
              localWallOuterLayerMaterial.name === "None"
            }
          />
        </Box>

        {/* Core Layer Inputs */}
        <Box display="flex" gap={2} alignItems="center">
          <FormControl fullWidth variant="outlined">
            <InputLabel>Core Layer</InputLabel>
            <Select
              label="Core Layer"
              value={
                localWallCoreLayerMaterial
                  ? localWallCoreLayerMaterial.name
                  : ""
              }
              onChange={(e) => {
                const selectedMaterial = CoreLayer.find(
                  (material) => material.name === e.target.value
                );
                setLocalWallCoreLayerMaterial(selectedMaterial);
                if (selectedMaterial && selectedMaterial.name === "None") {
                  setLocalWallCoreLayerThickness("0");
                } else {
                  setLocalWallCoreLayerThickness("");
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
            type='number'

            value={localWallCoreLayerThickness}
            onChange={(e) => setLocalWallCoreLayerThickness(e.target.value)}
            disabled={
              localWallCoreLayerMaterial &&
              localWallCoreLayerMaterial.name === "None"
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
                localWallInsulationLayerMaterial
                  ? localWallInsulationLayerMaterial.name
                  : ""
              }
              onChange={(e) => {
                const selectedMaterial = InsulationLayer.find(
                  (material) => material.name === e.target.value
                );
                setLocalWallInsulationLayerMaterial(selectedMaterial);
                if (selectedMaterial && selectedMaterial.name === "None") {
                  setLocalWallInsulationLayerThickness("0");
                } else {
                  setLocalWallInsulationLayerThickness("");
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
            type='number'

            value={localWallInsulationLayerThickness}
            onChange={(e) =>
              setLocalWallInsulationLayerThickness(e.target.value)
            }
            disabled={
              localWallInsulationLayerMaterial &&
              localWallInsulationLayerMaterial.name === "None"
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
                localWallInnerLayerMaterial
                  ? localWallInnerLayerMaterial.name
                  : ""
              }
              onChange={(e) => {
                const selectedMaterial = InnerLayer.find(
                  (material) => material.name === e.target.value
                );
                setLocalWallInnerLayerMaterial(selectedMaterial);
                if (selectedMaterial && selectedMaterial.name === "None") {
                  setLocalWallInnerLayerThickness("0");
                } else {
                  setLocalWallInnerLayerThickness("");
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
            fullWidth
            type='number'

            value={localWallInnerLayerThickness}
            onChange={(e) => setLocalWallInnerLayerThickness(e.target.value)}
            disabled={
              localWallInnerLayerMaterial &&
              localWallInnerLayerMaterial.name === "None"
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
            Save Wall Details
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

        {/* Wall Area Display */}
        <Box p={2} bgcolor="#D9EAFD" borderRadius={2} textAlign="center">
          <Typography variant="body2" fontWeight="bold">
            Wall Area (m²):{" "}
            {(parseFloat(netWallArea || 0) * 0.092903).toFixed(2) || "0.00"}
          </Typography>
        </Box>

        {/* UA Value Display */}
        <Box p={2} bgcolor="#D9EAFD" borderRadius={2} textAlign="center">
          <Typography variant="body2" fontWeight="bold">
            UA Value: {localUAValue}
          </Typography>
        </Box>

        {/* Wall Heat Loss Display */}
        <Box p={2} bgcolor="#D9EAFD" borderRadius={2} textAlign="center">
          <Typography variant="body2" fontWeight="bold">
            Wall Heat Loss: {localWallHeatLoss}
          </Typography>
        </Box>

        {/* Total Fabric Heat Loss Display */}
        <Box p={2} bgcolor="#D9EAFD" borderRadius={2} textAlign="center">
        <Typography variant="body2" fontWeight="bold">Total Fabric Heat Loss: {totalFabricHeatLoss}</Typography>

        </Box>
      </Box>
    </Box>
  );
}

export default ProposedWallFabricDetails;
