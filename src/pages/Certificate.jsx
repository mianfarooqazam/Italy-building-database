import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import ReportTab from "./tabs/ReportTab";
import CertificateTab from "./tabs/CertificateTab";

function Certificate() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Tabs - now left-aligned */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Detailed Report" />
          <Tab label="Certificate" />
        </Tabs>
      </Box>
      
      {/* Tab Content */}
      <Box>
        {activeTab === 0 && <ReportTab />}
        {activeTab === 1 && <CertificateTab />}
      </Box>
    </Box>
  );
}

export default Certificate;