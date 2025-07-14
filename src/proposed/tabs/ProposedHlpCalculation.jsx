import { useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import useFloorPlanStore from '../../store/useFloorPlanStore';
import useWallFabricDetailsStore from '../../store/proposed/useProposedWallFabricDetailsStore';
import useRoofFabricDetailsStore from '../../store/proposed/useProposedRoofFabricDetailsStore';
import useVentilationStore from '../../store/proposed/useProposedVentilationStore';
import useHlpStore from '../../store/proposed/useProposedHlpStore';
import useTotalFabricHeatLossStore from '../../store/proposed/useProposedTotalFabricHeatLossStore';

const ProposedHlpCalculation = () => {
  const ft2ToM2 = 0.092903;
  const ft3ToM3 = 0.0283168;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Floor Plan values from the floor plan store
  const netWallAreaFt2 = parseFloat(useFloorPlanStore((state) => state.netWallArea)) || 0;
  const totalFloorAreaFt2 = parseFloat(useFloorPlanStore((state) => state.totalFloorArea)) || 0;
  const totalAreaFt2 = parseFloat(useFloorPlanStore((state) => state.totalArea)) || 0;
  const dwellingVolume = parseFloat(useFloorPlanStore((state) => state.dwellingVolume)) || 0;

  const netWallAreaM2 = netWallAreaFt2 * ft2ToM2;
  const totalFloorAreaM2 = totalFloorAreaFt2 * ft2ToM2;
  const totalAreaM2 = totalAreaFt2 * ft2ToM2;
  const dwellingVolumeM3 = dwellingVolume * ft3ToM3;

  // Wall and Roof Fabric values from the wall and roof fabric stores
  const kappaValueWall = parseFloat(useWallFabricDetailsStore((state) => state.kappaValue)) || 0;
  const kappaValueRoof = parseFloat(useRoofFabricDetailsStore((state) => state.kappaValueRoof)) || 0;
  
  // Get the total fabric heat loss from the dedicated store
  const fabricHeatLoss = parseFloat(useTotalFabricHeatLossStore((state) => state.totalFabricHeatLoss)) || 0;

  const heatCapacity = netWallAreaM2 * kappaValueWall + totalFloorAreaM2 * kappaValueRoof;
  const thermalMassParameter = totalFloorAreaM2 !== 0 ? heatCapacity / totalFloorAreaM2 : 0;
  const thermalBridges = 0.2 * totalAreaM2;
  const totalFabricHeatLossTotal = fabricHeatLoss + thermalBridges;

  const calculationData = [
    { label: 'Fabric Heat Loss (Wall, Roof, Floor, Window, Door)', value: `${fabricHeatLoss.toFixed(2)}` },
    { label: 'Heat Capacity', value: `${heatCapacity.toFixed(2)}` },
    { label: 'Thermal Mass Parameter', value: `${thermalMassParameter.toFixed(2)}` },
    { label: 'Thermal Bridges', value: `${thermalBridges.toFixed(2)}` },
    { label: 'Total Fabric Heat Loss', value: `${totalFabricHeatLossTotal.toFixed(2)}` },
  ];

  // Ventilation values from the ventilation store
  const ventilationType = useVentilationStore((state) => state.ventilationType);
  const infiltrationValues = useVentilationStore((state) => state.ventilationDataArray);

  // Calculate ventilation heat loss data
  const ventilationHeatLossData = months.map((month, index) => {
    const finalInfiltrationRate = infiltrationValues && infiltrationValues.length > 0
      ? parseFloat(infiltrationValues[index]) || 0
      : 0;
    const ventHeatLoss = 0.33 * dwellingVolumeM3 * finalInfiltrationRate;
    return { month, ventHeatLoss };
  });

  const heatTransferCoefficientData = ventilationHeatLossData.map((row) => {
    const heatTransferCoefficient = totalFabricHeatLossTotal + row.ventHeatLoss;
    return { month: row.month, heatTransferCoefficient, ventHeatLoss: row.ventHeatLoss };
  });

  const heatLossParameterData = heatTransferCoefficientData.map((row) => {
    const heatLossParameter = totalFloorAreaM2 !== 0 ? row.heatTransferCoefficient / totalFloorAreaM2 : 0;
    return { month: row.month, ventHeatLoss: row.ventHeatLoss, heatTransferCoefficient: row.heatTransferCoefficient, heatLossParameter };
  });

  const averageHeatTransferCoefficient =
    heatTransferCoefficientData.reduce((acc, curr) => acc + curr.heatTransferCoefficient, 0) / months.length;
  const averageHeatLossParameter =
    heatLossParameterData.reduce((acc, curr) => acc + curr.heatLossParameter, 0) / months.length;

  // HLP store methods from the HLP store
  const setVentilationHeatLoss = useHlpStore((state) => state.setVentilationHeatLoss);
  const setHeatTransferCoefficient = useHlpStore((state) => state.setHeatTransferCoefficient);
  const setHeatLossParameter = useHlpStore((state) => state.setHeatLossParameter);

  useEffect(() => {
    setVentilationHeatLoss(ventilationHeatLossData.map((d) => d.ventHeatLoss));
    setHeatTransferCoefficient(heatTransferCoefficientData.map((d) => d.heatTransferCoefficient));
    setHeatLossParameter(heatLossParameterData.map((d) => d.heatLossParameter));
  }, [
    ventilationHeatLossData,
    heatTransferCoefficientData,
    heatLossParameterData,
    setVentilationHeatLoss,
    setHeatTransferCoefficient,
    setHeatLossParameter,
  ]);

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h6" gutterBottom>
        HLP Calculations
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table aria-label="calculation results">
          <TableHead>
            <TableRow>
              <TableCell><strong>Parameter</strong></TableCell>
              <TableCell><strong>Value</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {calculationData.map((row) => (
              <TableRow key={row.label}>
                <TableCell>{row.label}</TableCell>
                <TableCell>{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Monthly {ventilationType ? `(${ventilationType})` : ''}
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table aria-label="ventilation table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Month</strong></TableCell>
              <TableCell><strong>Ventilation Heat Loss (W)</strong></TableCell>
              <TableCell><strong>Heat Transfer Coefficient (W)</strong></TableCell>
              <TableCell><strong>Heat Loss Parameter (W/m²)</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {heatLossParameterData.map((row, index) => (
              <TableRow key={months[index]}>
                <TableCell align="center">{months[index]}</TableCell>
                <TableCell align="center">{row.ventHeatLoss.toFixed(2)}</TableCell>
                <TableCell align="center">{row.heatTransferCoefficient.toFixed(2)}</TableCell>
                <TableCell align="center">{row.heatLossParameter.toFixed(4)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Averages
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 2, maxWidth: 600 }}>
        <Table aria-label="averages table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Parameter</strong></TableCell>
              <TableCell><strong>Average Value</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Average Heat Transfer Coefficient (W)</TableCell>
              <TableCell>{averageHeatTransferCoefficient.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Average Heat Loss Parameter (W/m²)</TableCell>
              <TableCell>{averageHeatLossParameter.toFixed(4)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProposedHlpCalculation;