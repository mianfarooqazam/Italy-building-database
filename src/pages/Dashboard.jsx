import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import useBuildingInformationStore from "../store/useBuildingInformationStore";
import useFloorPlanStore from "../store/useFloorPlanStore";
import useWallFabricDetailsStore from "../store/useWallFabricDetailsStore";
import useRoofFabricDetailsStore from "../store/useRoofFabricDetailsStore";
import useWindowFabricDetailsStore from "../store/useWindowFabricDetailsStore";
import useSlabFabricDetailsStore from "../store/useSlabFabricDetailsStore";
import useDoorFabricDetailsStore from "../store/useDoorFabricDetailsStore";
import useSheetCalculationStore from "../store/useSheetCalculationStore";
import useProposedSheetCalculationStore from "../store/proposed/useProposedSheetCalculationStore";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  Title
);

const Dashboard = () => {
  // Access values from the building information store
  const selectedCity = useBuildingInformationStore(
    (state) => state.selectedCity
  );

  // Access values from the floor plan store
  const setTemperature = useFloorPlanStore((state) => state.setTemperature);
  const doors = useFloorPlanStore((state) => state.doors);
  const windows = useFloorPlanStore((state) => state.windows);
  const numberOfFloors = useFloorPlanStore((state) => state.numberOfFloors);
  const sidesConnected = useFloorPlanStore((state) => state.sidesConnected);

  // Get U-values from individual fabric stores
  const wallUValue = useWallFabricDetailsStore((state) => state.uValue);
  const roofUValue = useRoofFabricDetailsStore((state) => state.uValue);
  const windowUValue = useWindowFabricDetailsStore((state) => state.uValue);
  const slabUValue = useSlabFabricDetailsStore((state) => state.uValue);
  const doorUValue = useDoorFabricDetailsStore((state) => state.uValue);

  // Get heat loss values for chart from individual fabric stores
  const wallHeatLoss = useWallFabricDetailsStore(
    (state) => state.wallHeatLoss || state.uaValue || 0
  );
  const roofHeatLoss = useRoofFabricDetailsStore(
    (state) => state.roofHeatLoss || state.uaValue || 0
  );
  const windowHeatLoss = useWindowFabricDetailsStore(
    (state) => state.windowHeatLoss || state.uaValue || 0
  );
  const slabHeatLoss = useSlabFabricDetailsStore(
    (state) => state.slabHeatLoss || state.uaValue || 0
  );
  const doorHeatLoss = useDoorFabricDetailsStore(
    (state) => state.doorHeatLoss || state.uaValue || 0
  );

  // Get values from the sheet calculation store
  const eui = useSheetCalculationStore((state) => state.eui);
  const proposed_eui = useProposedSheetCalculationStore((state) => state.eui);

  // Get values from the proposed EUI store

  // Compute counts
  const numberOfDoors = doors.length;
  const numberOfWindows = windows.length;

  // Summary Data for Building Specifications and EUI values
  const summaryData = {
    location: selectedCity || "N/A",
    temperature: setTemperature || "N/A",
    numberOfDoors: numberOfDoors || 0,
    numberOfWindows: numberOfWindows || 0,
    numberOfFloors: numberOfFloors || 0,
    sidesConnected: sidesConnected || 0,
    fabricHeatLoss: "1500 kWh",
    annualEnergyIndex: `${eui} kWh/m²`, // Annual eui
  };

  // Calculate improvement percentage
  const improvementPercentage =
    eui > 0 ? ((eui - proposed_eui) / eui) * 100 : 0;

  // Data for the Heat Loss Bar Chart
  const heatLossData = {
    labels: ["Walls", "Windows", "Doors", "Roof", "Floor (Slab)"],
    datasets: [
      {
        label: "Fabric Heat Loss",
        data: [
          wallHeatLoss,
          windowHeatLoss,
          doorHeatLoss,
          roofHeatLoss,
          slabHeatLoss,
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)", // Walls
          "rgba(255, 206, 86, 0.6)", // Windows
          "rgba(75, 192, 192, 0.6)", // Doors
          "rgba(153, 102, 255, 0.6)", // Roof
          "rgba(255, 159, 64, 0.6)", // Slab
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Options for the Heat Loss Bar Chart
  const heatLossOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Heat Loss Breakdown" },
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce(
              (acc, val) => acc + val,
              0
            );
            const percentage = total
              ? ((context.parsed / total) * 100).toFixed(2)
              : 0;
            return `${context.label}: ${context.parsed} UA (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Heat Loss (W/K)" },
      },
      x: {
        title: { display: true, text: "Fabric Components" },
      },
    },
  };

  // Pakistan city markers (example data)
  const cities = [
    {
      name: "Peshawar",
      position: [34.015, 71.5805],
      climate: "2B (Hot and Dry)",
    },
    {
      name: "Lahore",
      position: [31.5497, 74.3436],
      climate: "1B (Very Hot and Dry)",
    },
    {
      name: "Islamabad",
      position: [33.7294, 73.0931],
      climate: "2A (Hot and Humid)",
    },
    {
      name: "Karachi",
      position: [24.8607, 67.0011],
      climate: "0B (Extremely Hot and Dry)",
    },
    {
      name: "Multan",
      position: [30.1575, 71.5249],
      climate: "0B (Extremely Hot and Dry)",
    },
    {
      name: "Gilgit",
      position: [35.918, 74.3039],
      climate: "7B (Very Cold and Dry)",
    },
    {
      name: "Abbottabad",
      position: [34.149, 73.2113],
      climate: "3A (Warm and Humid)",
    },
    {
      name: "Charsadda",
      position: [34.18, 71.73],
      climate: "2A (Hot and Humid)",
    },
    { name: "Swat", position: [35.27, 72.44], climate: "4A (Mixed and Humid)" },
    {
      name: "Dera Ismail Khan",
      position: [31.8236, 70.9078],
      climate: "1B (Very Hot and Dry)",
    },
    {
      name: "Muzaffarabad",
      position: [34.37, 73.47],
      climate: "4A (Mixed and Humid)",
    },
    {
      name: "Quetta",
      position: [30.1798, 66.975],
      climate: "3B (Warm and Dry)",
    },
  ];

  return (
    <div className="p-6">
      {/* Title Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Italy Building Performance Database
        </h1>
        <p className="text-gray-600 text-lg">
          Energy Efficiency Analysis and Optimization Platform
        </p>
      </div>

      {/* EUI Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
       
        <div className="bg-[#E9EFF3] shadow-md rounded-lg w-45 h-50 flex flex-col items-center justify-center">
          <span className="text-lg ">Base EUI</span>
          <span className="text-xl font-bold">{Number(eui).toFixed(2)} kWh/m²</span>
        </div>
        <div className="bg-[#E9EFF3] shadow-md rounded-lg w-45 h-60 flex flex-col items-center justify-center">
          <span className="text-lg">Proposed EUI</span>
          <span className="text-xl font-bold">
            {Number(proposed_eui).toFixed(2)} kWh/m²
          </span>
        </div>
        
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Building Specifications */}
        <div className="bg-[#E9EFF3] shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">
            Building Specifications
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left text-gray-700">
                    Specification
                  </th>
                  <th className="py-2 px-4 border-b text-left text-gray-700">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b">Location</td>
                  <td className="py-2 px-4 border-b">{summaryData.location}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Temperature</td>
                  <td className="py-2 px-4 border-b">
                    {summaryData.temperature} °C
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Number of Doors</td>
                  <td className="py-2 px-4 border-b">
                    {summaryData.numberOfDoors}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Number of Windows</td>
                  <td className="py-2 px-4 border-b">
                    {summaryData.numberOfWindows}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Number of Floors</td>
                  <td className="py-2 px-4 border-b">
                    {summaryData.numberOfFloors}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Sides Connected</td>
                  <td className="py-2 px-4 border-b">
                    {summaryData.sidesConnected}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Thermal Properties */}
        <div className="bg-[#E9EFF3] shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Thermal Properties</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left text-gray-700">
                    Component
                  </th>
                  <th className="py-2 px-4 border-b text-left text-gray-700">
                    U-Value (W/m²K)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b">Roof</td>
                  <td className="py-2 px-4 border-b">
                    {roofUValue !== null ? `${roofUValue} W/m²K` : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Floor (Slab)</td>
                  <td className="py-2 px-4 border-b">
                    {slabUValue !== null ? `${slabUValue} W/m²K` : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Wall</td>
                  <td className="py-2 px-4 border-b">
                    {wallUValue !== null ? `${wallUValue} W/m²K` : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Window</td>
                  <td className="py-2 px-4 border-b">
                    {windowUValue !== null ? `${windowUValue} W/m²K` : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Door</td>
                  <td className="py-2 px-4 border-b">
                    {doorUValue !== null ? `${doorUValue} W/m²K` : "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default Dashboard;
