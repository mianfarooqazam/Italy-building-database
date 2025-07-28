// src/components/Sidebar.jsx

import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const navItems = [
    {
      to: "/dashboard",
      label: "Dashboard",
      activePath: "/dashboard",
    },
    {
      to: "/building-details",
      label: "Building Details",
      activePath: "/building-details",
    },
    {
      to: "/comparison",
      label: "Graphs Comparison",
      activePath: "/comparison",
    },
    {
      to: "/energy-bill",
      label: "Energy Bill",
      activePath: "/energy-bill",
    },
    {
      to: "/certificate",
      label: "Certificate",
      activePath: "/certificate",
    },
    {
      to: "/co2-emissions",
      label: "CO₂ Emissions",
      activePath: "/co2-emissions",
    },
  ];

  // Define the version number
  const version = "1.0.0";

  return (
    <div
      className="w-64 h-screen fixed shadow-lg border-r border-gray-200 flex flex-col"
      style={{ backgroundColor: "#fff" }}
    >
    
      <hr className="my-4 border-white" />

      <ul className="mt-8 flex-1">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.activePath;
          return (
            <li
              key={index}
              className="mb-2 transition-all duration-300 ease-in-out"
            >
              <Link
                to={item.to}
                className={`flex items-center px-6 py-4 w-full h-full relative ${
                  isActive ? "bg-blue-300 rounded-[10px]" : ""
                }`}
              >
                <span className="font-medium text-lg text-gray-700">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto mb-4 px-6">
        <p className="text-left text-gray-500 text-sm">Version {version}</p>
      </div>
    </div>
  );
}

export default Sidebar;