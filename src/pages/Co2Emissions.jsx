import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import useSheetCalculationStore from "../store/useSheetCalculationStore";

// Register the required Chart.js components for Bar charts
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const CO2EmissionDashboard = () => {
  // Define the months
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

  // Retrieve the monthly data from the sheet calculation store
  const monthlyKWhCoolingSelected = useSheetCalculationStore(
    (state) => state.monthlyKWhCoolingSelected
  );
  const monthlyKWhHeatingSelected = useSheetCalculationStore(
    (state) => state.monthlyKWhHeatingSelected
  );

  // Compute the combined values for each month (Cooling + Heating)
  const combinedData = months.map((_, index) => {
    const cooling = monthlyKWhCoolingSelected[index] || 0;
    const heating = monthlyKWhHeatingSelected[index] || 0;
    return cooling + heating;
  });

  // Calculate the final values by multiplying the combined value with 0.478
  const finalData = combinedData.map((value) =>
    parseFloat((value * 0.478).toFixed(2))
  );

  // Prepare data for the Bar chart using the final values
  const barData = {
    labels: months,
    datasets: [
      {
        label: "CO₂ Emission (kg)",
        data: finalData,
        backgroundColor: "#FF91A6",
        borderColor: "#FF91A6",
        borderWidth: 1,
      },
    ],
  };

  // Bar chart options for responsiveness
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: "100%", padding: "2rem", boxSizing: "border-box" }}>
     

      <TableContainer
        component={Paper}
        style={{ width: "100%", marginBottom: "2rem" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {months.map((month) => (
                <TableCell key={month} align="center" className="bg-blue-100" sx={{fontWeight:"bold"}}>
                  {month}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {finalData.map((value, index) => (
                <TableCell key={months[index]} align="center">
                  {value.toFixed(2)}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Bar Chart below the table displaying the final values */}
      <Paper style={{ width: "100%", padding: "1rem", height: 400 }}>
        <Bar data={barData} options={barOptions} />
      </Paper>
    </div>
  );
};

export default CO2EmissionDashboard;