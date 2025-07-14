import React, { useRef } from "react";
import { Box, Typography, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import Logo from "../../assets/new.png";
import useLightingStore from "../../store/useLightingStore";
import useBuildingInformationStore from "../../store/useBuildingInformationStore";
import useFloorPlanStore from "../../store/useFloorPlanStore";
import useWallFabricDetailsStore from "../../store/useWallFabricDetailsStore";
import useRoofFabricDetailsStore from "../../store/useRoofFabricDetailsStore";
import useSlabFabricDetailsStore from "../../store/useSlabFabricDetailsStore";
import useWindowFabricDetailsStore from "../../store/useWindowFabricDetailsStore";
import useDoorFabricDetailsStore from "../../store/useDoorFabricDetailsStore";
import useAppliancesLoadStore from "../../store/useAppliancesLoadStore";
import useSheetCalculationStore from "../../store/useSheetCalculationStore";
import useVentilationStore from "../../store/useVentilationStore";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function ReportTab() {
  // Create a ref for the printable content
  const reportRef = useRef();

  // Format date as day-Month(in words)-year
  const formatDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const currentDate = formatDate();
  const certificateNo = "BERC-CERT-001";

  // Get values from various stores
  const { lights, totalWattage, totalAnnualEnergy } = useLightingStore();
  const { ownerName, address, selectedCity } = useBuildingInformationStore();

  const {
    buildingOrientation,
    numberOfFloors,
    totalFloorArea,
    dwellingVolume,
    totalWallArea,
    totalWindowArea,
    totalDoorArea,
    netWallArea,
    numberOfOccupants,
    selectedCoolingHours,
    selectedHeatingHours,
  } = useFloorPlanStore();

  const { uValue: wallUValue, wallHeatLoss } = useWallFabricDetailsStore();
  const { uValue: roofUValue, roofHeatLoss } = useRoofFabricDetailsStore();
  const { uValue: slabUValue, slabHeatLoss } = useSlabFabricDetailsStore();
  const { uValue: windowUValue, windowHeatLoss } =
    useWindowFabricDetailsStore();
  const { uValue: doorUValue, doorHeatLoss } = useDoorFabricDetailsStore();

  const { appliances } = useAppliancesLoadStore();

  // Get values from ventilation store
  const {
    numberOfFans,
    constructionType,
    lobbyType,
    percentageDraughtProofed,
    ventilationType,
  } = useVentilationStore();

  // Get values from sheet calculation store
  const {
    totalKWhCoolingSelected,
    totalKWhHeatingSelected,
    eui,
    monthlyKWhCoolingSelected,
    monthlyKWhHeatingSelected,
  } = useSheetCalculationStore();

  // Calculate total annual energy consumption
  const totalAnnualEnergyConsumption =
    (totalKWhCoolingSelected || 0) +
    (totalKWhHeatingSelected || 0) +
    (totalAnnualEnergy || 0);

  // Calculate total heat loss
  const totalHeatLoss =
    (wallHeatLoss || 0) +
    (roofHeatLoss || 0) +
    (slabHeatLoss || 0) +
    (windowHeatLoss || 0) +
    (doorHeatLoss || 0);

  // Helper function to safely format numbers
  const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined || isNaN(parseFloat(value))) {
      return "Not calculated";
    }
    return parseFloat(value).toFixed(decimals);
  };

  // Helper function to determine rating color
  const getRatingColor = (eui) => {
    if (!eui) return "text.primary";
    if (eui < 100) return "green";
    if (eui < 150) return "#4caf50";
    if (eui < 200) return "orange";
    return "red";
  };

  // Helper function to determine rating text
  const getRatingText = (eui) => {
    if (!eui) return "Not rated";
    if (eui < 100) return "Excellent";
    if (eui < 150) return "Good";
    if (eui < 200) return "Average";
    return "Poor";
  };

  // Building information data
  const buildingInfoData = [
    { label: "Owner", value: ownerName || "Not specified" },
    { label: "Address", value: address || "Not specified" },
    { label: "City", value: selectedCity || "Not specified" },
    { label: "Orientation", value: buildingOrientation || "Not specified" },
    { label: "Number of Floors", value: numberOfFloors || "Not specified" },
    { label: "Occupants", value: numberOfOccupants || "Not specified" },
  ];

  // Building dimensions data
  const buildingDimensionsData = [
    { 
      label: "Total Floor Area", 
      value: totalFloorArea ? `${formatNumber(totalFloorArea)} m²` : "Not calculated" 
    },
    { 
      label: "Total Wall Area", 
      value: totalWallArea ? `${formatNumber(totalWallArea)} m²` : "Not calculated" 
    },
    { 
      label: "Net Wall Area", 
      value: netWallArea ? `${formatNumber(netWallArea)} m²` : "Not calculated" 
    },
    { 
      label: "Total Window Area", 
      value: totalWindowArea ? `${formatNumber(totalWindowArea)} m²` : "Not calculated" 
    },
    { 
      label: "Total Door Area", 
      value: totalDoorArea ? `${formatNumber(totalDoorArea)} m²` : "Not calculated" 
    },
    { 
      label: "Building Volume", 
      value: dwellingVolume ? `${formatNumber(dwellingVolume)} m³` : "Not calculated" 
    },
  ];

  // Thermal performance data
  const thermalPerformanceData = [
    { 
      label: "Wall U-Value", 
      value: wallUValue ? `${formatNumber(wallUValue)} W/m²K` : "Not calculated" 
    },
    { 
      label: "Roof U-Value", 
      value: roofUValue ? `${formatNumber(roofUValue)} W/m²K` : "Not calculated" 
    },
    { 
      label: "Floor U-Value", 
      value: slabUValue ? `${formatNumber(slabUValue)} W/m²K` : "Not calculated" 
    },
    { 
      label: "Window U-Value", 
      value: windowUValue ? `${formatNumber(windowUValue)} W/m²K` : "Not calculated" 
    },
    { 
      label: "Door U-Value", 
      value: doorUValue ? `${formatNumber(doorUValue)} W/m²K` : "Not calculated" 
    },
    { 
      label: "Total Heat Loss", 
      value: `${formatNumber(totalHeatLoss)} W/K` 
    },
  ];

  // Ventilation details data
  const ventilationData = [
    { label: "Number of Fans", value: numberOfFans || "Not specified" },
    { label: "Construction Type", value: constructionType || "Not specified" },
    { label: "Lobby Type", value: lobbyType || "Not specified" },
    { label: "Ventilation Type", value: ventilationType || "Not specified" },
    { label: "Draught Proofed (%)", value: percentageDraughtProofed || "Not specified" },
  ];

  // Energy consumption data
  const energyConsumptionData = [
    { 
      label: "Annual Cooling Energy", 
      value: totalKWhCoolingSelected ? `${formatNumber(totalKWhCoolingSelected)} kWh` : "Not calculated" 
    },
    { 
      label: "Annual Heating Energy", 
      value: totalKWhHeatingSelected ? `${formatNumber(totalKWhHeatingSelected)} kWh` : "Not calculated" 
    },
    { 
      label: "Annual Lighting Energy", 
      value: totalAnnualEnergy ? `${formatNumber(totalAnnualEnergy)} kWh` : "Not calculated" 
    },
    { 
      label: "Total Annual Energy", 
      value: `${formatNumber(totalAnnualEnergyConsumption)} kWh` 
    },
    { 
      label: "Energy Utilization Index (EUI)", 
      value: eui ? `${formatNumber(eui)} kWh/m²/year` : "Not calculated" 
    },
    {
      label: "Rating",
      value: getRatingText(eui),
      color: getRatingColor(eui)
    }
  ];

  // Monthly data preparation
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  const monthlyData = months.map((month, index) => {
    let cooling = 0;
    let heating = 0;
    
    if (monthlyKWhCoolingSelected && monthlyKWhCoolingSelected.length === 12) {
      cooling = monthlyKWhCoolingSelected[index];
    }
    
    if (monthlyKWhHeatingSelected && monthlyKWhHeatingSelected.length === 12) {
      heating = monthlyKWhHeatingSelected[index];
    }
    
    return {
      month,
      cooling: formatNumber(cooling),
      heating: formatNumber(heating),
      total: formatNumber(cooling + heating)
    };
  });

  // Handle PDF download
  const handleDownloadPdf = () => {
    const input = reportRef.current;
    const fileName = `Energy_Report_${ownerName || 'Building'}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    html2canvas(input, { 
      scale: 1.5,
      logging: false,
      useCORS: true,
      allowTaint: true
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      // First page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(fileName);
    });
  };

  return (
    <Box sx={{ padding: 3, maxWidth: "1000px", margin: "0 auto" }}>
      {/* Download Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<DownloadIcon />}
          onClick={handleDownloadPdf}
        >
          Download Detailed Report
        </Button>
      </Box>

      {/* Content to be printed/downloaded */}
      <Box ref={reportRef}>
        {/* Header Section: Two Columns */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          {/* Left Column: Logo & Details */}
          <Box>
            <img src={Logo} alt="Company Logo" style={{ width: 200 }} />
            <Typography variant="subtitle1" sx={{ marginTop: 1 }}>
              Generated on: {currentDate}
            </Typography>
            <Typography variant="subtitle1">
              Certificate No: {certificateNo}
            </Typography>
          </Box>

          {/* Right Column: Heading */}
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="h4" fontWeight="bold" color="#53AE51">
              Energy Performance Report
            </Typography>
          </Box>
        </Box>

        {/* Divider */}
        <Divider sx={{ backgroundColor: "#53AE51", height: "2px", mb: 3 }} />

        {/* Building Information Section */}
        <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Typography
            variant="h5"
            color="#53AE51"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Building Information
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Property</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {buildingInfoData.map((row, index) => (
                  <TableRow 
                    key={index} 
                    sx={{ '&:nth-of-type(even)': { backgroundColor: "#fafafa" } }}
                  >
                    <TableCell component="th" scope="row">{row.label}</TableCell>
                    <TableCell>{row.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Areas and Volume Section */}
        <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Typography
            variant="h5"
            color="#53AE51"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Building Dimensions
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Dimension</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {buildingDimensionsData.map((row, index) => (
                  <TableRow 
                    key={index} 
                    sx={{ '&:nth-of-type(even)': { backgroundColor: "#fafafa" } }}
                  >
                    <TableCell component="th" scope="row">{row.label}</TableCell>
                    <TableCell>{row.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Thermal Performance Section */}
        <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Typography
            variant="h5"
            color="#53AE51"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Thermal Performance
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Property</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {thermalPerformanceData.map((row, index) => (
                  <TableRow 
                    key={index} 
                    sx={{ '&:nth-of-type(even)': { backgroundColor: "#fafafa" } }}
                  >
                    <TableCell component="th" scope="row">{row.label}</TableCell>
                    <TableCell>{row.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Ventilation Section */}
        <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Typography
            variant="h5"
            color="#53AE51"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Ventilation Details
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Property</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ventilationData.map((row, index) => (
                  <TableRow 
                    key={index} 
                    sx={{ '&:nth-of-type(even)': { backgroundColor: "#fafafa" } }}
                  >
                    <TableCell component="th" scope="row">{row.label}</TableCell>
                    <TableCell>{row.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Energy Consumption Section */}
        <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Typography
            variant="h5"
            color="#53AE51"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Energy Consumption
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Property</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {energyConsumptionData.map((row, index) => (
                  <TableRow 
                    key={index} 
                    sx={{ '&:nth-of-type(even)': { backgroundColor: "#fafafa" } }}
                  >
                    <TableCell component="th" scope="row">{row.label}</TableCell>
                    <TableCell sx={{ color: row.color || 'inherit', fontWeight: row.label === 'Rating' ? 'bold' : 'normal' }}>
                      {row.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Heating and Cooling Hours Section */}
        {/* Heating and Cooling Hours Section */}
        <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Typography
            variant="h5"
            color="#53AE51"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Heating and Cooling Schedule
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Hours</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{ '&:nth-of-type(even)': { backgroundColor: "#fafafa" } }}>
                  <TableCell component="th" scope="row">Cooling Hours</TableCell>
                  <TableCell>
                    {selectedCoolingHours && selectedCoolingHours.length > 0 
                      ? selectedCoolingHours.join(", ") 
                      : "Not specified"}
                  </TableCell>
                </TableRow>
                <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: "#fafafa" } }}>
                  <TableCell component="th" scope="row">Heating Hours</TableCell>
                  <TableCell>
                    {selectedHeatingHours && selectedHeatingHours.length > 0 
                      ? selectedHeatingHours.join(", ") 
                      : "Not specified"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Lighting Information Section */}
        <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Typography
            variant="h5"
            color="#53AE51"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Lighting Information
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Property</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{ '&:nth-of-type(even)': { backgroundColor: "#fafafa" } }}>
                  <TableCell component="th" scope="row">Total Lighting Wattage</TableCell>
                  <TableCell>{totalWattage ? `${formatNumber(totalWattage)} W` : "0 W"}</TableCell>
                </TableRow>
                <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: "#fafafa" } }}>
                  <TableCell component="th" scope="row">Total Lighting Annual Energy Consumption</TableCell>
                  <TableCell>{totalAnnualEnergy ? `${formatNumber(totalAnnualEnergy)} kWh` : "0 kWh"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {lights && lights.length > 0 ? (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Installed Lights</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell sx={{ fontWeight: "bold" }}>Fixture Type</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Light Type</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Wattage</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lights.map((light, index) => (
                      <TableRow 
                        key={index} 
                        sx={{ '&:nth-of-type(even)': { backgroundColor: "#fafafa" } }}
                      >
                        <TableCell>{light.fixtureType}</TableCell>
                        <TableCell>{light.lightType}</TableCell>
                        <TableCell>{light.wattage} W</TableCell>
                        <TableCell>{light.quantity} units</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            <Typography variant="subtitle1" sx={{ mt: 2, fontStyle: "italic" }}>
              No lighting data available
            </Typography>
          )}
        </Paper>

        {/* Appliances Section */}
        <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Typography
            variant="h5"
            color="#53AE51"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Appliances Information
          </Typography>

          {appliances && appliances.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: "bold" }}>Appliance</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Wattage</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Daily Usage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appliances.map((appliance, index) => (
                    <TableRow 
                      key={index} 
                      sx={{ '&:nth-of-type(even)': { backgroundColor: "#fafafa" } }}
                    >
                      <TableCell>{appliance.appliance}</TableCell>
                      <TableCell>{appliance.wattage} W</TableCell>
                      <TableCell>{appliance.quantity} units</TableCell>
                      <TableCell>{appliance.dailyHourUsage} hours/day</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="subtitle1" sx={{ fontStyle: "italic" }}>
              No appliances data available
            </Typography>
          )}
        </Paper>

        {/* Monthly Energy Breakdown */}
        <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Typography
            variant="h5"
            color="#53AE51"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Monthly Energy Consumption
          </Typography>

          {monthlyKWhCoolingSelected &&
          monthlyKWhHeatingSelected &&
          monthlyKWhCoolingSelected.length === 12 &&
          monthlyKWhHeatingSelected.length === 12 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: "bold" }}>Month</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Cooling (kWh)</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Heating (kWh)</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Total (kWh)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {monthlyData.map((data, index) => (
                    <TableRow 
                      key={index} 
                      sx={{ '&:nth-of-type(even)': { backgroundColor: "#fafafa" } }}
                    >
                      <TableCell>{data.month}</TableCell>
                      <TableCell>{data.cooling}</TableCell>
                      <TableCell>{data.heating}</TableCell>
                      <TableCell>{data.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="subtitle1" sx={{ fontStyle: "italic" }}>
              No monthly energy data available
            </Typography>
          )}
        </Paper>

        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            This report is based on the building information provided and energy
            calculations performed using standard methodologies.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            © {new Date().getFullYear()} Building Energy Rating Report
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default ReportTab;