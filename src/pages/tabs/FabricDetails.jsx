import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import RoofFabricDetails from "../tabs/fabricDetails/RoofFabricDetails";
import WallFarbricDetails from "../tabs/fabricDetails/WallFabricDetails";
import WindowFarbricDetails from "../tabs/fabricDetails/WindowFabricDetails";
import DoorFarbricDetails from "../tabs/fabricDetails/DoorFabricDetails";
import SlabFabricDetails from "../tabs/fabricDetails/SlabFabricDetails";


function FabricDetails() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box p={3}>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label="Roof Details" />
        <Tab label="Wall Details" />
        <Tab label="Slab Floor on Grade Details" />
        <Tab label="Window Details" />
        <Tab label="Door Details" />

      </Tabs>
      {selectedTab === 0 && <RoofFabricDetails />}
      {selectedTab === 1 && <WallFarbricDetails />}
      {selectedTab === 2 && <SlabFabricDetails />}
      {selectedTab === 3 && <WindowFarbricDetails />}
      {selectedTab === 4 && <DoorFarbricDetails />}
    </Box>
  );
}

export default FabricDetails;
