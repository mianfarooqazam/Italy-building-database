// File: AIComponent.jsx

import { useEffect, useState } from "react";
import {
  CircularProgress,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Alert,
} from "@mui/material";

// Zustand stores for wall and roof details
import useWallFabricDetailsStore from "../store/useWallFabricDetailsStore";
import useRoofFabricDetailsStore from "../store/useRoofFabricDetailsStore";
import useSheetCalculationStore from "../store/useSheetCalculationStore";

const defaultMessages = [
  "Analyzing Building Envelope...",
  "Calculating Energy Efficiency...",
  "Generating Recommendations...",
];

const AIComponent = () => {
  // 1) Pull wall, roof and EUI data
  const {
    insulationLayerMaterial: wallInsMaterial,
    insulationLayerThickness: wallInsThickness,
  } = useWallFabricDetailsStore();

  const {
    insulationLayerMaterial: roofInsMaterial,
    insulationLayerThickness: roofInsThickness,
  } = useRoofFabricDetailsStore();

  // Get EUI from store
  const eui = useSheetCalculationStore((state) => state.eui);

  // 2) State for rotating AI messages
  const [messages] = useState(defaultMessages);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // 3) Suggestions are kept separately
  const [suggestions, setSuggestions] = useState([]);

  // 4) EUI rating
  const [euiRating, setEuiRating] = useState({
    rating: "",
    color: "",
    message: "",
  });

  // 4) Collect suggestions but DO NOT add them to messages
  useEffect(() => {
    const noWallInsulation =
      !wallInsMaterial ||
      wallInsMaterial === "0" ||
      !wallInsThickness ||
      wallInsThickness === "0";

    const noRoofInsulation =
      !roofInsMaterial ||
      roofInsMaterial === "0" ||
      !roofInsThickness ||
      roofInsThickness === "0";

    const newSuggestions = [];

    // A) Suggest adding wall insulation
    if (noWallInsulation) {
      newSuggestions.push({
        element: "Wall",
        recommendation:
          "No insulation detected. Consider adding wall insulation with at least 2 inches thickness to improve thermal performance and reduce energy costs by up to 25%.",
      });
    }

    // B) Suggest adding roof insulation
    if (noRoofInsulation) {
      newSuggestions.push({
        element: "Roof",
        recommendation:
          "No insulation detected. Adding roof insulation with at least 4 inches thickness can reduce heat gain/loss by up to 35% and significantly improve overall building efficiency.",
      });
    }

    // C) Additional recommendations based on current values
    if (
      wallInsThickness &&
      parseInt(wallInsThickness) < 2 &&
      wallInsMaterial !== "0"
    ) {
      newSuggestions.push({
        element: "Wall",
        recommendation: `Current insulation thickness (${wallInsThickness} inches) is below optimal levels. Consider increasing to at least 3 inches for better thermal performance.`,
      });
    }

    if (
      roofInsThickness &&
      parseInt(roofInsThickness) < 4 &&
      roofInsMaterial !== "0"
    ) {
      newSuggestions.push({
        element: "Roof",
        recommendation: `Current insulation thickness (${roofInsThickness} inches) is below optimal levels. Consider increasing to at least 6 inches for better thermal performance.`,
      });
    }

    // Update suggestions if needed
    if (newSuggestions.length > 0) {
      setSuggestions(newSuggestions);
    }

    // Set EUI rating
    if (eui) {
      if (eui < 100) {
        setEuiRating({
          rating: "Excellent",
          color: "success.main",
          message: "Your building has exceptional energy efficiency.",
        });
      } else if (eui < 150) {
        setEuiRating({
          rating: "Good",
          color: "#4caf50",
          message: "Your building has good energy efficiency.",
        });
      } else if (eui < 200) {
        setEuiRating({
          rating: "Average",
          color: "#ff9800",
          message:
            "Your building has average energy efficiency with room for improvement.",
        });
      } else {
        setEuiRating({
          rating: "Poor",
          color: "#f44336",
          message:
            "Your building has poor energy efficiency. Consider implementing the recommendations below.",
        });
      }
    }
  }, [
    wallInsMaterial,
    wallInsThickness,
    roofInsMaterial,
    roofInsThickness,
    eui,
  ]);

  // 5) Cycle through default messages (2-second interval)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= messages.length) {
          clearInterval(intervalId);
          return prevIndex; // stay at the last message
        }
        return nextIndex;
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, [messages]);

  // 6) Determine if we should still show the spinner
  const isLastMessage = currentMessageIndex === messages.length - 1;
  const showSpinner = !isLastMessage;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6">
      {/* 7) If we're at the last message, show the EUI rating */}
      {isLastMessage && (
        <Box sx={{ width: "90%", maxWidth: "1000px", mb: 4, mt: 2 }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: "#fafafa",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Alert
              severity={euiRating.rating === "Poor" ? "warning" : "success"}
              sx={{ mb: 2 }}
            >
              <Typography variant="body1">
                <strong>Rating: {euiRating.rating}</strong> -{" "}
                {euiRating.message}
              </Typography>
            </Alert>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ mr: 1 }}>
                Energy Utilization Index (EUI):
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: euiRating.color,
                }}
              >
                {eui ? `${eui.toFixed(2)} kWh/m²/year` : "Calculating..."}
              </Typography>
            </Box>
          </Paper>
        </Box>
      )}

      {/* 8) After the final message, display a bigger, nicely styled table if there are suggestions */}
      {isLastMessage && suggestions.length > 0 && (
        <Box sx={{ width: "90%", maxWidth: "1000px", mb: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ ml: 1 }}>
            Recommendations
          </Typography>

          <TableContainer
            component={Paper}
            elevation={3}
            sx={{
              borderRadius: 2,
              backgroundColor: "#fafafa",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Table>
              <TableHead className="bg-blue-100">
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      borderBottom: "2px solid #ccc",
                      width: "20%",
                    }}
                  >
                    Element
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      borderBottom: "2px solid #ccc",
                    }}
                  >
                    Recommendation
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {suggestions.map((item, idx) => (
                  <TableRow
                    key={idx}
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: "#f9f9f9",
                      },
                      "&:hover": {
                        backgroundColor: "#f1f1f1",
                      },
                    }}
                  >
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {item.element}
                    </TableCell>
                    <TableCell>{item.recommendation}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* If no insulation issues but we're at the last message */}
      {isLastMessage && suggestions.length === 0 && (
        <Box sx={{ width: "90%", maxWidth: "1000px", mb: 6, mt: 4 }}>
          <Alert severity="success" sx={{ p: 2 }}>
            <Typography variant="body1">
              <strong>Good job!</strong> No insulation issues detected. Your
              building has appropriate insulation in walls and roof.
            </Typography>
          </Alert>
        </Box>
      )}

      {/* 9) Show rotating messages (and spinner) if we're not at the last message */}
      {!isLastMessage && (
        <Box sx={{ textAlign: "center", mt: 6 }}>
          {showSpinner && <CircularProgress color="primary" />}
          <Typography variant="h6" className="mt-5 text-xl">
            {messages[currentMessageIndex]}
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default AIComponent;
