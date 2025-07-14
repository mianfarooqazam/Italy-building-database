// src/pages/Comparison.jsx
import { useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register ChartJS components once
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend,
  Filler
);

// Store hooks
import useSheetCalculationStore from "../store/useSheetCalculationStore";
import useProposedSheetCalculationStore from "../store/proposed/useProposedSheetCalculationStore";
import useBuildingInformationStore from "../store/useBuildingInformationStore";

// Constants
import { months } from "../utils/Constants";

const Comparison = () => {
  const selectedCity = useBuildingInformationStore(
    (state) => state.selectedCity
  );

  /** ------------ BASE VALUES ------------ */
  const baseMonthlyKWhCooling =
    useSheetCalculationStore((state) => state.monthlyKWhCoolingSelected) ||
    Array(12).fill(0);
  const baseMonthlyKWhHeating =
    useSheetCalculationStore((state) => state.monthlyKWhHeatingSelected) ||
    Array(12).fill(0);
  const baseEUI = useSheetCalculationStore((state) => state.eui) || 0;

  /** ------------ PROPOSED VALUES ------------ */
  const proposedMonthlyKWhCooling =
    useProposedSheetCalculationStore(
      (state) => state.monthlyKWhCoolingSelected
    ) || Array(12).fill(0);
  const proposedMonthlyKWhHeating =
    useProposedSheetCalculationStore(
      (state) => state.monthlyKWhHeatingSelected
    ) || Array(12).fill(0);
  const proposedEUI =
    useProposedSheetCalculationStore((state) => state.eui) || 0;

  /** ------------ CHART DATA ------------ */
  const chartData = useMemo(
    () => ({
      labels: months,
      datasets: [
        {
          label: "Base Cooling",
          data: baseMonthlyKWhCooling,
          borderColor: "#3498db",
          backgroundColor: "rgba(52,152,219,0.15)",
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: "#3498db",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
        },
        {
          label: "Base Heating",
          data: baseMonthlyKWhHeating,
          borderColor: "#e74c3c",
          backgroundColor: "rgba(231,76,60,0.15)",
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: "#e74c3c",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
        },
        {
          label: "Proposed Cooling",
          data: proposedMonthlyKWhCooling,
          borderColor: "#2ecc71",
          borderDash: [5, 5],
          backgroundColor: "rgba(46,204,113,0.15)",
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: "#2ecc71",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
        },
        {
          label: "Proposed Heating",
          data: proposedMonthlyKWhHeating,
          borderColor: "#f39c12",
          borderDash: [5, 5],
          backgroundColor: "rgba(243,156,18,0.15)",
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: "#f39c12",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
        },
      ],
    }),
    [
      baseMonthlyKWhCooling,
      baseMonthlyKWhHeating,
      proposedMonthlyKWhCooling,
      proposedMonthlyKWhHeating,
    ]
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { usePointStyle: true, padding: 20, font: { size: 12 } },
      },
      title: {
        display: true,
        text: `Monthly Energy Usage – ${selectedCity}`,
        font: { size: 16, weight: "normal" },
        padding: { bottom: 20 },
        color: "#333",
      },
      tooltip: {
        backgroundColor: "rgba(255,255,255,0.9)",
        titleColor: "#333",
        bodyColor: "#333",
        borderColor: "#ddd",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (ctx) =>
            `${ctx.dataset.label || ""}: ${ctx.parsed.y.toFixed(2)} kWh`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.05)", drawBorder: false },
        ticks: { font: { size: 11 } },
        title: {
          display: true,
          text: "Energy (kWh)",
          font: { size: 13, weight: "normal" },
          padding: 10,
          color: "#666",
        },
      },
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { font: { size: 11 } },
        title: {
          display: true,
          text: "Month",
          font: { size: 13, weight: "normal" },
          padding: 10,
          color: "#666",
        },
      },
    },
  };

  /** ------------ SAVINGS ARRAYS ------------ */
  const coolingDiff = months.map((_, i) =>
    Math.max(0, baseMonthlyKWhCooling[i] - proposedMonthlyKWhCooling[i])
  );
  const heatingDiff = months.map((_, i) =>
    Math.max(0, baseMonthlyKWhHeating[i] - proposedMonthlyKWhHeating[i])
  );

  const hasData =
    coolingDiff.some((v) => v > 0) || heatingDiff.some((v) => v > 0);

  /** ------------ SUMMARY ------------ */
  const improvementPercentage =
    baseEUI > 0 ? ((baseEUI - proposedEUI) / baseEUI) * 100 : 0;

  return (
    <div className="p-4">
      {selectedCity ? (
        hasData ? (
          <>
            {/* ---------- CHART CARD ---------- */}
            <Card
              elevation={3}
              sx={{
                borderRadius: "16px",
                mb: 4,
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ height: 360 }}>
                  <Line data={chartData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>

            {/* ---------- SUMMARY CARD ---------- */}
            <Card
              elevation={3}
              sx={{
                borderRadius: "16px",
                mb: 4,
                background: "linear-gradient(to right, #f8f9fa, #e9ecef)",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  p: 3,
                }}
              >
                {/* Base EUI */}
                <Box sx={{ textAlign: "center", width: "33%", p: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      color: "text.secondary",
                      mb: 2,
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Base&nbsp;EUI
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: "#3498db", fontWeight: 300 }}
                  >
                    {baseEUI.toFixed(2)}
                    <Typography
                      component="span"
                      sx={{
                        fontSize: "0.875rem",
                        ml: 0.5,
                        fontWeight: 400,
                      }}
                    >
                      kWh/m²
                    </Typography>
                  </Typography>
                </Box>

                {/* Proposed EUI */}
                <Box sx={{ textAlign: "center", width: "33%", p: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      color: "text.secondary",
                      mb: 2,
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Proposed&nbsp;EUI
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: "#2ecc71", fontWeight: 300 }}
                  >
                    {proposedEUI.toFixed(2)}
                    <Typography
                      component="span"
                      sx={{
                        fontSize: "0.875rem",
                        ml: 0.5,
                        fontWeight: 400,
                      }}
                    >
                      kWh/m²
                    </Typography>
                  </Typography>
                </Box>

                {/* Percentage Improvement */}
                <Box sx={{ textAlign: "center", width: "33%", p: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      color: "text.secondary",
                      mb: 2,
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Energy&nbsp;Savings
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      color:
                        improvementPercentage > 0 ? "#27ae60" : "#c0392b",
                      fontWeight: 300,
                    }}
                  >
                    {improvementPercentage.toFixed(2)}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* ---------- HORIZONTAL SCROLL TABLE CARD ---------- */}
            <Card
              elevation={3}
              sx={{
                borderRadius: "16px",
                mb: 4,
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Typography
                  variant="h6"
                  sx={{
                    px: 3,
                    py: 2,
                    borderBottom: "1px solid #e0e0e0",
                    textAlign:"center"
                  }}
                >
                Base Case & Proposed Case Difference
                </Typography>

                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    maxHeight: 300,        // vertical scroll if needed
                    overflowX: "auto",     // horizontal scroll
                  }}
                >
                  <Table stickyHeader aria-label="energy savings">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }} />
                        {months.map((m) => (
                          <TableCell
                            key={m}
                            align="right"
                            sx={{
                              fontWeight: 600,
                              backgroundColor: "#e3f2fd", // light blue
                            }}
                          >
                            {m}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Cooling Row */}
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>
                          Cooling 
                        </TableCell>
                        {coolingDiff.map((val, idx) => (
                          <TableCell
                            key={`c-${idx}`}
                            align="right"
                            sx={{
                              backgroundColor:
                                val > 0 ? "rgba(46,204,113,0.12)" : "transparent",
                              fontWeight: val > 0 ? 600 : 400,
                            }}
                          >
                            {val.toFixed(2)}
                          </TableCell>
                        ))}
                      </TableRow>

                      {/* Heating Row */}
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>
                        Heating
                        </TableCell>
                        {heatingDiff.map((val, idx) => (
                          <TableCell
                            key={`h-${idx}`}
                            align="right"
                            sx={{
                              backgroundColor:
                                val > 0 ? "rgba(46,204,113,0.12)" : "transparent",
                              fontWeight: val > 0 ? 600 : 400,
                            }}
                          >
                            {val.toFixed(2)}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </>
        ) : (
          /* ---------- NO DATA CARD ---------- */
          <Card
            elevation={2}
            sx={{
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
            }}
          >
            <CardContent className="text-center p-12">
              <Typography variant="h6" className="text-gray-600">
                No energy calculation data available.
                <br />
                Complete the building details, then calculate the base and
                proposed models to see a comparison.
              </Typography>
            </CardContent>
          </Card>
        )
      ) : (
        /* ---------- NO CITY CARD ---------- */
        <Card
          elevation={2}
          sx={{
            borderRadius: "12px",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
          }}
        >
          <CardContent className="text-center p-12">
            <Typography variant="h6" className="text-gray-600">
              Please select a city in Building Details and enter fabric details
              in both base and proposed cases to view the energy comparison.
            </Typography>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Comparison;
