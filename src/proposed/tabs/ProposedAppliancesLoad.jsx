import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Button,
  IconButton,
  Typography,
  Slider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import useAppliancesLoadStore from "../../store/proposed/useProposedAppliancesLoadStore.js";

const applianceOptions = [
  "Fan",
  "Oven",
  "Computer",
  "Washing Machine",
  "Refrigerator",
  "Vacuum",
  // "Heater",
  "Iron",
  "TV",
  "Water Pump",
];

function ProposedAppliancesLoad() {
  const {
    appliance,
    setAppliance,
    quantity,
    setQuantity,
    dailyHourUsage,
    setDailyHourUsage,
    daysUsage,
    setDaysUsage,
    wattage,
    setWattage,
    refrigeratorType,
    setRefrigeratorType,
    appliances,
    addAppliance,
    removeAppliance,
  } = useAppliancesLoadStore();

  // Format the time display for the slider
  const formatTimeDisplay = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins} min`;
    } else if (mins === 0) {
      return `${hours} hr`;
    } else {
      return `${hours} hr ${mins} min`;
    }
  };

  // Convert minutes to decimal hours for calculation
  const minutesToDecimalHours = (minutes) => {
    return minutes / 60;
  };

  const handleAddAppliance = () => {
    if (appliance === "Refrigerator") {
      if (refrigeratorType && quantity && daysUsage) {
        const qty = parseInt(quantity);
        const typeValue = parseInt(refrigeratorType);
        const days = parseInt(daysUsage);
        if (qty > 0 && days > 0 && days <= 365) {
          // Adjust refrigerator energy calculation to account for days used
          const yearFraction = days / 365;
          const annualEnergy = qty * typeValue * yearFraction;
          const newAppliance = {
            appliance,
            quantity: qty,
            daysUsage: days,
            annualEnergy: parseFloat(annualEnergy.toFixed(2)),
          };
          addAppliance(newAppliance);

          // Reset input fields
          setAppliance("");
          setQuantity("");
          setDaysUsage("");
          setRefrigeratorType("");
        }
      }
    } else {
      if (
        appliance &&
        quantity &&
        dailyHourUsage &&
        daysUsage &&
        wattage
      ) {
        const qty = parseInt(quantity);
        const watt = parseFloat(wattage);
        const days = parseInt(daysUsage);
        // Convert minutes to decimal hours for calculation
        const usage = minutesToDecimalHours(dailyHourUsage);
        
        if (qty > 0 && watt > 0 && days > 0 && days <= 365) {
          // Corrected calculation: quantity * wattage * hours * days / 1000
          const energyKwh = (qty * watt * usage * days) / 1000;
          const newAppliance = {
            appliance,
            quantity: qty,
            daysUsage: days,
            annualEnergy: parseFloat(energyKwh.toFixed(2)),
          };
          addAppliance(newAppliance);

          // Reset input fields
          setAppliance("");
          setQuantity("");
          setDailyHourUsage("");
          setDaysUsage("");
          setWattage("");
        }
      }
    }
  };

  // Calculate total energy
  const totalEnergy = appliances
    .reduce((total, item) => total + item.annualEnergy, 0)
    .toFixed(2);

  return (
    <Box p={3} maxWidth={1200} margin="0 auto">
      <Box display="flex" gap={2}>
        {/* Inputs Section */}
        <Box width="45%">
          <Box display="flex" flexDirection="column" gap={2}>
            {/* Appliance Input */}
            <FormControl fullWidth>
              <InputLabel id="appliance-label">Appliance</InputLabel>
              <Select
                labelId="appliance-label"
                value={appliance}
                label="Appliance"
                onChange={(e) => {
                  setAppliance(e.target.value);
                  setQuantity("");
                  setDailyHourUsage("");
                  setDaysUsage("");
                  setWattage("");
                  setRefrigeratorType("");
                }}
              >
                {applianceOptions.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Conditional Inputs */}
            {appliance === "Refrigerator" ? (
              <>
                {/* Refrigerator Type Input */}
                <FormControl fullWidth>
                  <InputLabel id="refrigerator-type-label">
                    Refrigerator Type
                  </InputLabel>
                  <Select
                    labelId="refrigerator-type-label"
                    value={refrigeratorType || ""}
                    label="Refrigerator Type"
                    onChange={(e) => setRefrigeratorType(e.target.value)}
                  >
                    <MenuItem value="360">Star Rating (360 kWh)</MenuItem>
                    <MenuItem value="420">Conventional (420 kWh)</MenuItem>
                  </Select>
                </FormControl>

                {/* Quantity Input */}
                <TextField
                  label="Quantity"
                  variant="outlined"
                  fullWidth
                  type="number"
                  slotProps={{ input: { min: 1 } }}
                  value={quantity}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || parseInt(value) > 0) {
                      setQuantity(value);
                    }
                  }}
                />
                
                {/* Days Usage Input */}
                <TextField
                  label="Days Used per Year"
                  variant="outlined"
                  fullWidth
                  type="number"
                  slotProps={{ input: { min: 1, max: 365 } }}
                  value={daysUsage}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || (parseInt(value) > 0 && parseInt(value) <= 365)) {
                      setDaysUsage(value);
                    }
                  }}
                />

                {/* Info Icon with Text */}
                <Box display="flex" alignItems="center" gap={1}>
                  <InfoIcon color="info" />
                  <Typography variant="body2">
                    Conventional and star rating for refrigerator only
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                {/* Quantity Input */}
                <TextField
                  label="Quantity"
                  variant="outlined"
                  fullWidth
                  type="number"
                  slotProps={{ input: { min: 1 } }}
                  value={quantity}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || parseInt(value) > 0) {
                      setQuantity(value);
                    }
                  }}
                />

                {/* Daily Usage Slider */}
                <Box>
                  <Typography id="daily-usage-slider" gutterBottom>
                    Daily Usage Time: {formatTimeDisplay(dailyHourUsage || 0)}
                  </Typography>
                  <Slider
                    value={dailyHourUsage || 0}
                    onChange={(e, newValue) => setDailyHourUsage(newValue)}
                    aria-labelledby="daily-usage-slider"
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => formatTimeDisplay(value)}
                    step={1}
                    min={1}
                    max={24 * 60} // 24 hours in minutes (1440 minutes)
                    marks={[
                      { value: 1, label: '1m' },
                      { value: 60, label: '1h' },
                      { value: 12 * 60, label: '12h' },
                      { value: 24 * 60, label: '24h' }
                    ]}
                  />
                </Box>
                
                {/* Days Usage Input */}
                <TextField
                  label="Days Used per Year"
                  variant="outlined"
                  fullWidth
                  type="number"
                  slotProps={{ input: { min: 1, max: 365 } }}
                  value={daysUsage}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || (parseInt(value) > 0 && parseInt(value) <= 365)) {
                      setDaysUsage(value);
                    }
                  }}
                />

                {/* Wattage Input */}
                <TextField
                  label="Wattage (W)"
                  variant="outlined"
                  fullWidth
                  type="number"
                  slotProps={{ input: { min: 1 } }}
                  value={wattage}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || parseFloat(value) > 0) {
                      setWattage(value);
                    }
                  }}
                />
              </>
            )}

            {/* Add Button */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddAppliance}
              disabled={
                appliance === "Refrigerator"
                  ? !quantity || !refrigeratorType || !daysUsage
                  : !appliance ||
                    !quantity ||
                    !dailyHourUsage ||
                    !daysUsage ||
                    !wattage
              }
            >
              Add Appliance
            </Button>
          </Box>
        </Box>

        {/* Vertical Divider */}
        <Divider orientation="vertical" flexItem />

        {/* Table Section */}
        <Box width="55%">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      backgroundColor: "lightblue",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    S.No
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "lightblue",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Appliances
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "lightblue",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Quantity
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "lightblue",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Days/Year
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "lightblue",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Energy (kWh)
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "lightblue",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appliances.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ textAlign: "center" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: "center" }}
                      component="th"
                      scope="row"
                    >
                      {item.appliance}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {item.quantity}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {item.daysUsage}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {item.annualEnergy}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <IconButton
                        color="error"
                        onClick={() => removeAppliance(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            p={2}
            mt={2}
            bgcolor="lightblue"
            borderRadius={2}
            fontWeight="bold"
            textAlign="center"
          >
            Total Energy: {totalEnergy} kWh
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ProposedAppliancesLoad;