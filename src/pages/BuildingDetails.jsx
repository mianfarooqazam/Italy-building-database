import { Tabs, Tab, Box } from "@mui/material";
import { useState } from "react";
// base case tabs
import BuildingInformation from "./tabs/BuildingInformation";
import FloorPlan from "./tabs/FloorPlan";
import FabricDetails from "./tabs/FabricDetails";
import Lighting from "./tabs/Lighting"; 
import Ventilation from "./tabs/Ventilation";
import AppliancesLoad from "./tabs/AppliancesLoad";
import HlpCalculation from "./tabs/HlpCalculation";
import SolarGainCalculation from "./tabs/SolarGainCalculation";
import LSheetCalculation from "./tabs/LSheetCalculation";
// proposed case tabs
import ProposedFabricDetails from "../proposed/tabs/ProposedFabricDetails";
import ProposedLighting from "../proposed/tabs/ProposedLighting"; 
import ProposedVentilation from "../proposed/tabs/ProposedVentilation";
import ProposedAppliancesLoad from "../proposed/tabs/ProposedAppliancesLoad";
import ProposedHlpCalculation from "../proposed/tabs/ProposedHlpCalculation";
import ProposedSolarGainCalculation from "../proposed/tabs/ProposedSolarGainCalculation";
import ProposedLSheetCalculation from "../proposed/tabs/ProposedLSheetCalculation";

function BuildingDetails() {
  // State for main tabs (Base Case vs Proposed Case)
  const [mainTab, setMainTab] = useState(0);
  
  // State for sub-tabs within each main tab
  const [baseTabValue, setBaseTabValue] = useState(0);
  const [proposedTabValue, setProposedTabValue] = useState(0);

  const handleMainTabChange = (event, newValue) => {
    setMainTab(newValue);
  };

  const handleBaseTabChange = (event, newValue) => {
    setBaseTabValue(newValue);
  };

  const handleProposedTabChange = (event, newValue) => {
    setProposedTabValue(newValue);
  };

  // Function to programmatically change base tabs
  const changeBaseTab = (newValue) => {
    setBaseTabValue(newValue);
  };
  
  // Define the tabs for Base Case
  const baseSubTabs = [
    { 
      id: 0, 
      label: "Building Information",
    },
    { 
      id: 1, 
      label: "Floor Plan",
    },
    { 
      id: 2, 
      label: "Fabric Details",
    },
    { 
      id: 3, 
      label: "Lighting Load",
    },
    { 
      id: 4, 
      label: "Appliances Load",
    },
    { 
      id: 5, 
      label: "Ventilation",
    },
    { 
      id: 6, 
      label: "Energy Report",
    }
  ];

  // Define the tabs for Proposed Case (without Building Information and Floor Plan)
  const proposedSubTabs = [
    { 
      id: 0, 
      label: "Fabric Details",
    },
    { 
      id: 1, 
      label: "Lighting Load",
    },
    { 
      id: 2, 
      label: "Appliances Load",
    },
    { 
      id: 3, 
      label: "Ventilation",
    },
    { 
      id: 4, 
      label: "Energy Report",
    }
  ];

  // Get the component for a base case tab
  const getBaseTabComponent = (tabId) => {
    switch(tabId) {
      case 0: return <BuildingInformation onTabChange={changeBaseTab} isBaseCase={true} />;
      case 1: return <FloorPlan isBaseCase={true} />;
      case 2: return <FabricDetails isBaseCase={true} />;
      case 3: return <Lighting isBaseCase={true} />;
      case 4: return <AppliancesLoad isBaseCase={true} />;
      case 5: return <Ventilation isBaseCase={true} />;
      case 6: return <LSheetCalculation showOnlyEnergyReport={true} isBaseCase={true} />;
      default: return null;
    }
  };

  // Get the component for a proposed case tab
  const getProposedTabComponent = (tabId) => {
    // Map the tab indices to the correct components
    // Since we removed Building Information and Floor Plan, we need to offset the indices
    switch(tabId) {
      case 0: return <ProposedFabricDetails isBaseCase={false} />;
      case 1: return <ProposedLighting isBaseCase={false} />;
      case 2: return <ProposedAppliancesLoad isBaseCase={false} />;
      case 3: return <ProposedVentilation isBaseCase={false} />;
      case 4: return <ProposedLSheetCalculation showOnlyEnergyReport={true} isBaseCase={false} />;
      default: return null;
    }
  };

  return (
    <div className="p-4" style={{backgroundColor:"#eff3f4"}}>
      {/* Main Tabs: Base Case vs Proposed Case */}
      <div className="p-2 rounded-lg" style={{ backgroundColor: "#fff" }}>
        <Tabs
          value={mainTab}
          onChange={handleMainTabChange}
          aria-label="Case Selection Tabs"
          indicatorColor="primary"
          variant="fullWidth"
          TabIndicatorProps={{ style: { display: "none" } }}
        >
          <Tab 
            label="Base Case" 
            sx={{
              color: "black",
              fontWeight: "bold",
              backgroundColor: mainTab === 0 ? "#e6f0ff" : "transparent",
              borderRadius: mainTab === 0 ? "8px 8px 0 0" : "0",
              "&.Mui-selected": {
                color: "primary",
              },
            }}
          />
          <Tab 
            label="Proposed Case" 
            sx={{
              color: "black",
              fontWeight: "bold",
              backgroundColor: mainTab === 1 ? "#e6f0ff" : "transparent",
              borderRadius: mainTab === 1 ? "8px 8px 0 0" : "0",
              "&.Mui-selected": {
                color: "primary",
              },
            }}
          />
        </Tabs>
      </div>

      {/* Base Case Content */}
      <div role="tabpanel" hidden={mainTab !== 0}>
        {mainTab === 0 && (
          <div className="mt-4">
            {/* Base Case Sub-Tabs */}
            <div className="p-2 rounded-lg" style={{ backgroundColor: "#fff" }}>
              <Tabs
                value={baseTabValue}
                onChange={handleBaseTabChange}
                aria-label="Base Case Building Details Tabs"
                indicatorColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                TabIndicatorProps={{ style: { display: "none" } }}
              >
                {baseSubTabs.map((tab) => (
                  <Tab
                    key={tab.id}
                    label={tab.label}
                    sx={{
                      color: "black",
                      borderRadius: baseTabValue === tab.id ? "8px" : "0",
                      "&.Mui-selected": {
                        color: "primary",
                      },
                    }}
                  />
                ))}
              </Tabs>
            </div>

            {/* Base Case Tab Content */}
            <Box
              sx={{
                padding: 2,
                marginTop: 2,
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                flexGrow: 1,
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              {baseSubTabs.map((tab) => (
                <Box key={tab.id} role="tabpanel" hidden={baseTabValue !== tab.id}>
                  {baseTabValue === tab.id && (
                    <div className="overflow-x-auto">
                      {getBaseTabComponent(tab.id)}
                    </div>
                  )}
                </Box>
              ))}

              {/* Hidden components for calculations */}
              <div style={{ display: 'none' }}>
                <HlpCalculation isBaseCase={true} />
                <SolarGainCalculation isBaseCase={true} />
              </div>
            </Box>
          </div>
        )}
      </div>

      {/* Proposed Case Content */}
      <div role="tabpanel" hidden={mainTab !== 1}>
        {mainTab === 1 && (
          <div className="mt-4">
            {/* Proposed Case Sub-Tabs */}
            <div className="p-2 rounded-lg" style={{ backgroundColor: "#fff" }}>
              <Tabs
                value={proposedTabValue}
                onChange={handleProposedTabChange}
                aria-label="Proposed Case Building Details Tabs"
                indicatorColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                TabIndicatorProps={{ style: { display: "none" } }}
              >
                {proposedSubTabs.map((tab) => (
                  <Tab
                    key={tab.id}
                    label={tab.label}
                    sx={{
                      color: "black",
                      borderRadius: proposedTabValue === tab.id ? "8px" : "0",
                      "&.Mui-selected": {
                        color: "primary",
                      },
                    }}
                  />
                ))}
              </Tabs>
            </div>

            {/* Proposed Case Tab Content */}
            <Box
              sx={{
                padding: 2,
                marginTop: 2,
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                flexGrow: 1,
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              {proposedSubTabs.map((tab) => (
                <Box key={tab.id} role="tabpanel" hidden={proposedTabValue !== tab.id}>
                  {proposedTabValue === tab.id && (
                    <div className="overflow-x-auto">
                      {getProposedTabComponent(tab.id)}
                    </div>
                  )}
                </Box>
              ))}

              {/* Hidden components for calculations */}
              <div style={{ display: 'none' }}>
                <ProposedHlpCalculation isBaseCase={false} />
                <ProposedSolarGainCalculation isBaseCase={false} />
              </div>
            </Box>
          </div>
        )}
      </div>
    </div>
  );
}

export default BuildingDetails;