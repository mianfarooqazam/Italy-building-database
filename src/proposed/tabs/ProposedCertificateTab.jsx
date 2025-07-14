import React, { useRef } from "react";
import { Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import Logo from "../../assets/new.png";
import useBuildingInformationStore from "../../store/useBuildingInformationStore";
import useFloorPlanStore from "../../store/useFloorPlanStore";
import useSheetCalculationStore from "../../store/useSheetCalculationStore";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function CertificateTab() {
  // Create a ref for the printable content
  const certificateRef = useRef();

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
  
  // Get values from stores
  const { ownerName, address, plotNo, streetNo, selectedCity } = useBuildingInformationStore();
  const { totalFloorArea } = useFloorPlanStore();
  const { eui } = useSheetCalculationStore();
  
  // Helper function to safely format numbers
  const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined || isNaN(parseFloat(value))) {
      return "Not calculated";
    }
    return parseFloat(value).toFixed(decimals);
  };
  
  // Function to determine rating and color
  const getRating = () => {
    if (!eui) return { rating: "Not rated", color: "text.primary" };
    
    if (eui < 100) return { rating: "Excellent", color: "green" };
    if (eui < 150) return { rating: "Good", color: "#4caf50" };
    if (eui < 200) return { rating: "Average", color: "orange" };
    return { rating: "Poor", color: "red" };
  };
  
  const { rating, color } = getRating();

  // Handle PDF download
  const handleDownloadPdf = () => {
    const input = certificateRef.current;
    const fileName = `Energy_Certificate_${ownerName || 'Building'}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(fileName);
    });
  };

  return (
    <Box sx={{ padding: 3, maxWidth: "800px", margin: "0 auto" }}>
      {/* Download Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<DownloadIcon />}
          onClick={handleDownloadPdf}
        >
          Download Certificate
        </Button>
      </Box>
      
      {/* Certificate Paper */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          border: '1px solid #53AE51',
          position: 'relative',
          overflow: 'hidden'
        }}
        ref={certificateRef}
      >
        {/* Watermark */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-30deg)',
            opacity: 0.07,
            pointerEvents: 'none',
            zIndex: 0
          }}
        >
          <img src={Logo} alt="Watermark" style={{ width: '500px' }} />
        </Box>
        
        {/* Content */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
            <img src={Logo} alt="Company Logo" style={{ width: 150 }} />
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="h4" fontWeight="bold" color="#53AE51">
                Energy Performance Certificate
              </Typography>
            </Box>
          </Box>
          
          {/* Certificate Number and Date */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h6">Certificate No: {certificateNo}</Typography>
            <Typography variant="subtitle1">Issue Date: {currentDate}</Typography>
          </Box>
          
          {/* Building Details in Horizontal Tabular Form */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" color="#53AE51" fontWeight="bold" sx={{ mb: 2 }}>
              Building Details
            </Typography>
            
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Owner</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Plot No.</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Street No.</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>City</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Floor Area</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{ownerName || "-"}</TableCell>
                    <TableCell>{plotNo || "-"}</TableCell>
                    <TableCell>{streetNo || "-"}</TableCell>
                    <TableCell>{selectedCity || "-"}</TableCell>
                    <TableCell>{totalFloorArea ? `${formatNumber(totalFloorArea)} m²` : "Not calculated"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }} colSpan={1}>Address</TableCell>
                    <TableCell colSpan={4}>{address || "-"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          
          {/* Energy Rating */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h5" color="#53AE51" fontWeight="bold" sx={{ mb: 3 }}>
              Energy Performance Rating
            </Typography>
            
            <Box 
              sx={{ 
                width: '300px', 
                margin: '0 auto',
                padding: 3,
                borderRadius: 2
              }}
            >
              <Typography variant="h4" fontWeight="bold" color={color}>
                {rating}
              </Typography>
              {eui && (
                <Typography variant="h6" color={color} sx={{ mt: 1 }}>
                  EUI: {formatNumber(eui)} kWh/m²/year
                </Typography>
              )}
            </Box>
          </Box>
          
          {/* Rating Scale */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 20, height: 20, backgroundColor: 'green', mr: 1 }}></Box>
                <Typography>Excellent: Less than 100 kWh/m²/year</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 20, height: 20, backgroundColor: '#4caf50', mr: 1 }}></Box>
                <Typography>Good: 100-150 kWh/m²/year</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 20, height: 20, backgroundColor: 'orange', mr: 1 }}></Box>
                <Typography>Average: 150-200 kWh/m²/year</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 20, height: 20, backgroundColor: 'red', mr: 1 }}></Box>
                <Typography>Poor: More than 200 kWh/m²/year</Typography>
              </Box>
            </Box>
          </Box>
          
          {/* Official Seal and Signature */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
            <Box sx={{ textAlign: 'center', width: '45%' }}>
              <Box 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  border: '2px solid #53AE51',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 1
                }}
              >
                <Typography variant="body2" fontWeight="bold">SEAL</Typography>
              </Box>
              <Typography variant="subtitle2">Official Seal</Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center', width: '45%' }}>
              <Box sx={{ borderBottom: '1px solid #000', height: 40, mb: 1 }}></Box>
              <Typography variant="subtitle2">Authorized Signature</Typography>
            </Box>
          </Box>
          
          {/* Footer */}
          <Box sx={{ mt: 6, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              This certificate is valid for *** years from the date of issue.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              © {new Date().getFullYear()} Building Energy Rating Certificate
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default CertificateTab;