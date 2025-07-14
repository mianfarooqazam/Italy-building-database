import { useState } from "react";

const glossaryData = [
  {
    property: "R-Value",
    description:
      "A measure of the thermal resistance of a material or assembly. It indicates how well a material resists the flow of heat. Higher R-values mean better insulation performance.",
  },
  {
    property: "U-Value",
    description:
      "U-values measure how effective a material is an insulator. Lesser the value, more effective material is.",
  },
  {
    property: "Dwelling Volume",
    description:
      "The total internal volume of a building or dwelling, which is important for assessing heating and cooling needs. It represents the space within the structure that must be conditioned.",
  },
  {
    property: "Fabric Heat Loss",
    description:
      "The rate at which heat escapes through the building envelope (walls, roof, floor, windows, etc.). This value helps in evaluating the overall energy efficiency of a building's construction materials",
  },
  {
    property: "Shading Cover",
    description:
      "Refers to the extent and effectiveness of external shading applied to windows. It reduces solar heat gain by limiting direct sunlight, thereby helping to control internal temperatures.",
  },
  {
    property: "Lobby Type",
    description:
      "Describes the design and performance of a building's lobby area with respect to air leakage. A Draught lobby may allow unintended air infiltration, while a No Draught lobby is designed to minimize such losses.",
  },
  {
    property: "Draught/No Draught",
    description:
      "Indicates whether an area or component experiences unwanted air movement (draught) or is protected against it. This is critical for maintaining comfort and energy efficiency.",
  },
  {
    property: "Percentage of Windows/Doors Draught Proofed (%)",
    description:
      "Represents the proportion of windows and doors that have been sealed or upgraded to prevent air leakage. A higher percentage suggests improved insulation and reduced energy loss.",
  },
  {
    property: "Base Case",
    description:
      "The current or existing condition of a building used as a reference point for energy performance assessments.",
  },
  {
    property: "Proposed Case",
    description:
      "The planned or improved design scenario aimed at enhancing energy efficiency, reducing heat loss, or achieving other performance targets compared to the base case.",
  },
];

const ToolTutorial = () => {
  const [activeTab, setActiveTab] = useState("glossary");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter the data based on property name only
  const filteredData = glossaryData.filter((item) =>
    item.property.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to highlight the search term in the property name
  const highlightText = (text, highlight) => {
    if (!highlight) return text;
    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="p-8">
      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 mr-2 ${
            activeTab === "glossary" 
              ? "border-b-2 border-blue-500 text-blue-600 font-medium" 
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("glossary")}
        >
          Glossary
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === "textInputGuide" 
              ? "border-b-2 border-blue-500 text-blue-600 font-medium" 
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("textInputGuide")}
        >
          Text Input Guide
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "glossary" && (
        <>
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by property..."
              className="w-full p-3   shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full bg-white rounded-lg shadow p-6">
            <table className="w-full divide-y divide-gray-200">
              <thead >
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left font-bold text-lg  uppercase tracking-wider"
                  >
                    Property
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-lg font-bold  uppercase tracking-wider"
                  >
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {highlightText(item.property, searchTerm)}
                    </td>
                    <td className="px-6 py-4 text-gray-700 whitespace-normal">
                      {item.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === "textInputGuide" && (
        <div className="w-full bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">This tab will be updated in upcoming version.</h2>
        </div>
      )}
    </div>
  );
};

export default ToolTutorial;