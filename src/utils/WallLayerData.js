const OuterLayer = [
  { name: "None", k_value: 1, sh_value: 0, d_value: 0 },
  { name: "Plywood", k_value: 0.26, sh_value: 1420, d_value: 700 },
  { name: "Wood", k_value: 0.15, sh_value: 2300, d_value: 650 },
  { name: "Brick Tile", k_value: 1.31, sh_value: 880, d_value: 1890 },
  { name: "Plaster", k_value: 0.72, sh_value: 840, d_value: 1760 },
  { name: "Soil ( Earth Common ) ", k_value: 0.83, sh_value: 880, d_value: 1460 },
];
const CoreLayer = [
  { name: "None", k_value: 1, sh_value: 0, d_value: 0 },
  { name: " Brick Common", k_value: 0.80, sh_value: 840, d_value: 1920 },
  { name: " Concrete / Solid block", k_value: 1.32, sh_value: 840, d_value: 540 },
  { name: "Fly ash Brick", k_value: 0.75, sh_value: 880, d_value: 1730 },
  { name: "Hollow Block", k_value: 1.18, sh_value: 837, d_value: 1218 },
  { name: "Rammed Earth", k_value: 0.26, sh_value: 3300, d_value: 700 },
  { name: "Mud", k_value: 1.44, sh_value: 880, d_value: 1460 },
  { name: "Concrete", k_value: 2.27, sh_value: 837.36, d_value: 2321.4 },
  { name: "Glass Block", k_value: 0.21, sh_value: 837, d_value: 2500 },
  { name: "Steel", k_value: 32.05, sh_value: 450, d_value: 7800 },
];
const InsulationLayer = [
  { name: "None", k_value: 1, sh_value: 0, d_value: 0 },
  { name: "EPS", k_value: 0.04, sh_value: 1400, d_value: 25 },
  { name: "Wool", k_value: 0.04, sh_value: 670, d_value: 200 },
  { name: "Fiber Glass", k_value: 0.04, sh_value: 840, d_value: 12 },
  { name: "Gypsum Board", k_value: 0.16, sh_value: 840, d_value: 950 },
  { name: "Mineral Wool ( Rock Wool )", k_value: 0.05, sh_value: 710, d_value: 100 },
  { name: "Glass Wool", k_value: 0.06, sh_value: 670, d_value: 200 },
  { name: "Foam", k_value: 0.04, sh_value: 1400, d_value: 10 },
  { name: "Compressed Fiber", k_value: 0.04, sh_value: 840, d_value: 12 },
  { name: "Cellulose", k_value: 0.05, sh_value: 1381, d_value: 48 },
  { name: "Polyurethane Foam", k_value: 0.03, sh_value: 1470, d_value: 30 },
  { name: "Earth", k_value: 0.85, sh_value: 880, d_value: 1460 },
  ];
const InnerLayer = [
  { name: "None", k_value: 1, sh_value: 0, d_value: 0 },
  { name: "Plywood", k_value: 0.26, sh_value: 1420, d_value: 700 },
  { name: "Wood", k_value: 0.15, sh_value: 2300, d_value: 650 },
  { name: "Brick Tile", k_value: 1.31, sh_value: 880, d_value: 1890 },
  { name: "Plaster", k_value: 0.72, sh_value: 840, d_value: 1760 },
  { name: "Soil ( Earth Common ) ", k_value: 0.83, sh_value: 880, d_value: 1460 },
];
export {
  OuterLayer,
  CoreLayer,
  InsulationLayer,
  InnerLayer
};