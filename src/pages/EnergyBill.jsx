import { useEffect, useState } from "react";
import {
  CircularProgress,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";
import useSheetCalculationStore from "../store/useSheetCalculationStore";

// Import Chart.js components
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

const EnergyBill = () => {
  const [loading, setLoading] = useState(true);

  // Access month-wise kWh values from sheet calculation store
  const monthlyKWhCoolingSelected = useSheetCalculationStore(
    (state) => state.monthlyKWhCoolingSelected
  );
  const monthlyKWhHeatingSelected = useSheetCalculationStore(
    (state) => state.monthlyKWhHeatingSelected
  );

  // Define the months array
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // State for Tariff
  const [tariff, setTariff] = useState("");

  // Handler for Tariff Input Change
  const handleTariffChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and decimal
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setTariff(value);
    }
  };

  useEffect(() => {
    // Simulate data fetching delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Prepare data for the chart (Only Total Cost)
  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Total Cost (PKR)",
        data: months.map((month, idx) => {
          if (
            monthlyKWhCoolingSelected.length === 12 &&
            monthlyKWhHeatingSelected.length === 12
          ) {
            const coolingKWh = monthlyKWhCoolingSelected[idx];
            const heatingKWh = monthlyKWhHeatingSelected[idx];
            const costCooling = coolingKWh * (parseFloat(tariff) || 0);
            const costHeating = heatingKWh * (parseFloat(tariff) || 0);
            const totalCost = costCooling + costHeating;

            return parseFloat(totalCost.toFixed(2));
          }
          return 0;
        }),
        borderColor: "rgba(153, 102, 255, 1)", // Purple line
        backgroundColor: "rgba(153, 102, 255, 0.2)", // Light purple fill
        tension: 0.4, // Curved lines
        fill: true, // Enable filling under the line
        pointRadius: 5, // Size of data points
        pointHoverRadius: 7, // Size on hover
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Position of the legend
      },
      title: {
        display: true,
        text: "Total Energy Cost per Month (PKR)",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Cost (PKR)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Box
        className="flex flex-col items-center justify-center w-full max-w-5xl"
        sx={{ textAlign: "center" }}
      >
        {loading ? (
          <>
            <CircularProgress color="primary" />
            <Typography variant="h6" className="mt-5 text-xl">
              Collecting Data...
            </Typography>
          </>
        ) : (
          <>
            {/* ------ TARIFF INPUT FIELD ------ */}
            <Box
              className="w-full max-w-md mb-6"
              sx={{ display: "flex", justifyContent: "center", gap: 2 }}
            >
              <TextField
                label="Tariff (PKR per kWh)"
                variant="outlined"
                value={tariff}
                onChange={handleTariffChange}
                fullWidth
                InputProps={{
                  inputProps: { min: 0, step: "0.01" },
                }}
              />
            </Box>

           
            <Box className="w-full mb-6" sx={{ maxWidth: "100%", height: 500 }}>
              <Line data={chartData} options={chartOptions} />
            </Box>

            {/* ------ Month-wise kWh Cooling & Heating Table ------ */}
            <TableContainer component={Paper} className="w-full">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      className="bg-blue-100"
                      sx={{ fontWeight: "bold" }}
                    >
                      Month
                    </TableCell>
                    <TableCell
                      className="bg-blue-100"
                      sx={{ fontWeight: "bold" }}
                      align="right"
                    >
                      kWh Cooling
                    </TableCell>
                    <TableCell
                      className="bg-blue-100"
                      sx={{ fontWeight: "bold" }}
                      align="right"
                    >
                      Cost Cooling (PKR)
                    </TableCell>
                    <TableCell
                      className=" bg-blue-100"
                      sx={{ fontWeight: "bold" }}
                      align="right"
                    >
                      kWh Heating
                    </TableCell>
                    <TableCell
                      className="bg-blue-100"
                      sx={{ fontWeight: "bold" }}
                      align="right"
                    >
                      Cost Heating (PKR)
                    </TableCell>
                    <TableCell
                      className="bg-blue-100"
                      sx={{ fontWeight: "bold" }}
                      align="right"
                    >
                      Total Cost (PKR)
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {monthlyKWhCoolingSelected.length === 12 &&
                  monthlyKWhHeatingSelected.length === 12 ? (
                    months.map((month, idx) => {
                      const coolingKWh = monthlyKWhCoolingSelected[idx];
                      const heatingKWh = monthlyKWhHeatingSelected[idx];
                      const costCooling =
                        coolingKWh * (parseFloat(tariff) || 0);
                      const costHeating =
                        heatingKWh * (parseFloat(tariff) || 0);
                      const totalCost = costCooling + costHeating;

                      return (
                        <TableRow key={month}>
                          <TableCell component="th" scope="row">
                            {month}
                          </TableCell>
                          <TableCell align="right">
                            {coolingKWh.toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            {costCooling.toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            {heatingKWh.toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            {costHeating.toFixed(2)}
                          </TableCell>
                          {/* Display Total Cost */}
                          <TableCell align="right">
                            {isNaN(totalCost) ? "N/A" : totalCost.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        Loading month-wise kWh data...
                      </TableCell>
                    </TableRow>
                  )}
                  {/* Optional: Total Row */}
                  {monthlyKWhCoolingSelected.length === 12 &&
                    monthlyKWhHeatingSelected.length === 12 && (
                      <TableRow>
                        <TableCell className=" bg-blue-100" sx={{fontWeight:"bold"}}>
                          Total
                        </TableCell>
                        <TableCell
                        sx={{fontWeight:"bold"}}
                          align="right"
                          className="bg-blue-100"
                        > 
                          {monthlyKWhCoolingSelected
                            .reduce((acc, val) => acc + val, 0)
                            .toFixed(2)}
                        </TableCell>
                        <TableCell
                        sx={{fontWeight:"bold"}}
                          align="right"
                          className=" bg-blue-100"
                        >
                          {(
                            monthlyKWhCoolingSelected.reduce(
                              (acc, val) => acc + val,
                              0
                            ) * (parseFloat(tariff) || 0)
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell
                        sx={{fontWeight:"bold"}}
                          align="right"
                          className=" bg-blue-100"
                        >
                          {monthlyKWhHeatingSelected
                            .reduce((acc, val) => acc + val, 0)
                            .toFixed(2)}
                        </TableCell>
                        <TableCell
                        sx={{fontWeight:"bold"}}
                          align="right"
                          className=" bg-blue-100"
                        >
                          {(
                            monthlyKWhHeatingSelected.reduce(
                              (acc, val) => acc + val,
                              0
                            ) * (parseFloat(tariff) || 0)
                          ).toFixed(2)}
                        </TableCell>
                        {/* Total Cost */}
                        <TableCell
                        
                          align="right"
                          className=" bg-blue-100" sx={{fontWeight:"bold"}}
                        >
                          {isNaN(tariff)
                            ? "N/A"
                            : (
                                (monthlyKWhCoolingSelected.reduce(
                                  (acc, val) => acc + val,
                                  0
                                ) +
                                  monthlyKWhHeatingSelected.reduce(
                                    (acc, val) => acc + val,
                                    0
                                  )) *
                                (parseFloat(tariff) || 0)
                              ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </div>
  );
};

export default EnergyBill;