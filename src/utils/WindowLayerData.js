// WindowLayerData.js

const WindowType = [
    { name: "Clear 1 Layer", u_value: 7.24, shgc: 0.75 },
    { name: "Clear 2 Layer", u_value: 4.62, shgc: 0.67 },
    { name: "Clear 3 Layer", u_value: 3.80, shgc: 0.6 },
    { name: "Low-e, low-solar 2 layer", u_value: 3.83, shgc: 0.37 },
    { name: "Low-e, low-solar 3 layer", u_value: 3.22, shgc: 0.25 },
    { name: "Low-e, high-solar 2 layer", u_value: 4.05, shgc: 0.62 },
    { name: "Low-e, high-solar 3 layer", u_value: 3.54, shgc: 0.55 },
    { name: "Heat-absorbing 1-layer", u_value: 7.24, shgc: 0.64 },
    { name: "Heat-absorbing 2-layer", u_value: 4.62, shgc: 0.55 },
    { name: "Heat-absorbing 3-layer", u_value: 3.80, shgc: 0.31 },
    { name: "Reflective 1-layer", u_value: 7.24, shgc: 0.28 },
    { name: "Reflective 2-layer", u_value: 4.62, shgc: 0.27 },
    { name: "Reflective 3-layer", u_value: 3.80, shgc: 0.31 }
  ];
  
  const FrameType = [
    { name: "Wood", frame_factor: 0.70 },
    { name: "Metal", frame_factor: 0.80 },
    { name: "PVC-U", frame_factor: 0.70 },
  ];
  
  const ShadingCover = [
    {
      type: "Heavy (>80%)",
      values: {
        winter: 0.30,
        summer: 0.50,
      }
    },
    {
      type: "More than average (>60%-80%)",
      values: {
        winter: 0.54,
        summer: 0.70,
      }
    },
    {
      type: "Average or unknown (20%-60%)",
      values: {
        winter: 0.77,
        summer: 0.90,
      }
    },
    {
      type: "Very little (<20%)",
      values: {
        winter: 1.00,
        summer: 1.00,
      }
    }
  ];
  
  export {
    WindowType,
    FrameType,
    ShadingCover,
  };
  