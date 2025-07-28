// src/components/Sidebar.jsx

import { Link, useLocation } from "react-router-dom";
import LayoutDashboard from "../assets/layout-dashboard.svg";
import School from "../assets/school.svg";
import ClipboardMinus from "../assets/clipboard-minus.svg";
import Bot from "../assets/bot.svg";
import Tutorial from "../assets/info.svg";
import Receipt from "../assets/receipt.svg";
import Logo from "../assets/new.png";
import BioHazard from "../assets/biohazard.svg";
import CompareIcon from "../assets/compare.svg"; 

function Sidebar() {
  const location = useLocation();

  const navItems = [
    {
      to: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      activePath: "/dashboard",
    },
    {
      to: "/building-details",
      icon: School,
      label: "Building Details",
      activePath: "/building-details",
    },
    {
      to: "/comparison",
      icon: CompareIcon,
      label: "Graphs Comparison",
      activePath: "/comparison",
    },
    {
      to: "/energy-bill",
      icon: Receipt,
      label: "Energy Bill",
      activePath: "/energy-bill",
    },
    {
      to: "/certificate",
      icon: ClipboardMinus,
      label: "Certificate",
      activePath: "/certificate",
    },
    {
      to: "/co2-emissions",
      icon: BioHazard,
      label: "CO₂ Emissions",
      activePath: "/co2-emissions",
    },
    
    {
      to: "/ai-component",
      icon: Bot,
      label: "Suggestions",
      activePath: "/ai-component",
    },
  ];

  const bottomItems = [
    {
      to: "/tool-tutorial",
      icon: Tutorial,
      label: "Tool Tutorial",
      activePath: "/tool-tutorial",
    },
  ];

  // Define the version number
  const version = "1.6";

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
                  isActive ? "bg-[#ccf462] rounded-[10px]" : ""
                }`}
              >
                <img
                  src={item.icon}
                  alt={`${item.label} Icon`}
                  className="mr-3 h-6 w-6 text-gray-700"
                />
                <span className="font-medium text-lg text-gray-700">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <ul>
        {bottomItems.map((item, index) => {
          const isActive = location.pathname === item.activePath;
          return (
            <li
              key={index}
              className="mb-2 transition-all duration-300 ease-in-out"
            >
              <Link
                to={item.to}
                className={`flex items-center px-6 py-4 w-full h-full relative ${
                  isActive ? "bg-[#ccf462] rounded-[20px]" : ""
                }`}
              >
                <img
                  src={item.icon}
                  alt={`${item.label} Icon`}
                  className="mr-3 h-6 w-6 text-gray-700"
                />
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