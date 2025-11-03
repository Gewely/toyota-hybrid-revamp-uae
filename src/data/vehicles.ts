
import { VehicleModel, PreOwnedVehicle } from "@/types/vehicle";

export const vehicles: VehicleModel[] = [
  {
    id: "camry-hybrid",
    name: "Toyota Camry Hybrid",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/19d9b6ba-2cee-4d91-b3b3-621f72452918/renditions/9c9119d9-d77c-4c13-a2aa-b0f9e55219cb?binary=true&mformat=true",
    mmeUrl: "https://www.toyota.ae/en/new-cars/camry",
    configureUrl: "/configure/camry-hybrid",
    price: 129900,
    category: "Hybrid",
    features: ["2.5L Hybrid Engine", "Advanced Safety", "Apple CarPlay/Android Auto"],
    specifications: {
      engine: "2.5L Dynamic Force 4-Cylinder Hybrid",
      transmission: "ECVT (Electronically Controlled Continuously Variable Transmission)",
      fuelEconomy: "4.5L/100km",
      safetyRating: "5-Star",
      warranty: "8-year Hybrid Battery Warranty"
    }
  },
  {
    id: "corolla-hybrid",
    name: "Toyota Corolla Hybrid",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/39010272-941c-4ba8-810e-1f34eec272f1/items/d8fdd9cf-9215-48c7-8792-b46d1af14525/renditions/be031a02-6cdc-43a0-a02b-317e95f1c2f1?binary=true&mformat=true",
    mmeUrl: "https://www.toyota.ae/en/new-cars/corolla",
    configureUrl: "/configure/corolla-hybrid",
    price: 94500,
    category: "Hybrid",
    features: ["1.8L Hybrid Engine", "Toyota Safety Sense", "Smart Connectivity"],
    specifications: {
      engine: "1.8L 4-Cylinder Hybrid",
      transmission: "ECVT",
      fuelEconomy: "3.8L/100km",
      safetyRating: "5-Star",
      warranty: "8-year Hybrid Battery Warranty"
    }
  },
  {
    id: "rav4-hybrid",
    name: "Toyota RAV4 Hybrid",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b617024c-790e-4264-99ad-b567a5abd42f/items/cd05c792-558c-4965-b5e9-1d734faed831/renditions/871690a1-a2ce-40d3-a376-0a1a8f734ac3?binary=true&mformat=true",
    mmeUrl: "https://www.toyota.ae/en/new-cars/rav4",
    configureUrl: "/configure/rav4-hybrid",
    price: 139900,
    category: "SUV",
    features: ["2.5L Hybrid Engine", "AWD System", "Panoramic Roof"],
    specifications: {
      engine: "2.5L Dynamic Force 4-Cylinder Hybrid",
      transmission: "ECVT with AWD",
      fuelEconomy: "4.7L/100km",
      safetyRating: "5-Star",
      warranty: "8-year Hybrid Battery Warranty"
    }
  },
  {
    id: "highlander-hybrid",
    name: "Toyota Highlander Hybrid",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/2639ecd9-9b31-445a-8d10-edcd954fd37c/items/b097e09d-0b05-46d1-864c-479c822035d4/renditions/61c23fc5-751b-4a4b-a8c3-12435c5192fa?binary=true&mformat=true",
    mmeUrl: "https://www.toyota.ae/en/new-cars/highlander",
    configureUrl: "/configure/highlander-hybrid",
    price: 179900,
    category: "SUV",
    features: ["3.5L Hybrid V6", "7-Seater", "Premium Interior"],
    specifications: {
      engine: "3.5L V6 Hybrid",
      transmission: "ECVT with AWD",
      fuelEconomy: "6.7L/100km",
      safetyRating: "5-Star",
      warranty: "8-year Hybrid Battery Warranty"
    }
  },
  {
    id: "land-cruiser",
    name: "Toyota Land Cruiser",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
    mmeUrl: "https://www.toyota.ae/en/new-cars/land-cruiser",
    configureUrl: "/configure/land-cruiser",
    price: 249900,
    priceFrom: 249900,
    modelYear: 2024,
    videoId: "E-TmuQuQwVI",
    category: "SUV",
    features: ["5.7L V8 Engine", "Off-Road Technology", "Premium Comfort"],
    specifications: {
      engine: "5.7L V8",
      transmission: "8-Speed Automatic",
      fuelEconomy: "14.2L/100km",
      safetyRating: "5-Star",
      warranty: "5-year/100,000km"
    }
  },
  {
    id: "sequoia",
    name: "Toyota Sequoia",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/cb46a669-bb45-4187-802f-a1b7df056946/items/29dbd0d5-7ff1-41d6-86f3-f10da4b22864/renditions/709ae40d-9f5e-4f6d-a110-3357dae5b127?binary=true&mformat=true",
    mmeUrl: "https://www.toyota.ae/en/new-cars/sequoia",
    configureUrl: "/configure/sequoia",
    price: 219900,
    category: "SUV",
    features: ["5.7L V8 Engine", "8-Seater", "Premium Audio System"],
    specifications: {
      engine: "5.7L V8",
      transmission: "6-Speed Automatic",
      fuelEconomy: "15.7L/100km",
      safetyRating: "5-Star",
      warranty: "5-year/100,000km"
    }
  },
  {
    id: "prado",
    name: "Toyota Prado",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/84a5ee19-6b54-4789-88b9-6feae59e9c7c/items/e297897c-d579-4179-bfde-b50e8d188a4f/renditions/4207c19f-2697-416d-8538-e03f27b77846?binary=true&mformat=true",
    mmeUrl: "https://www.toyota.ae/en/new-cars/prado",
    configureUrl: "/configure/prado",
    price: 189900,
    category: "SUV",
    features: ["4.0L V6 Engine", "Multi-Terrain Select", "Kinetic Dynamic Suspension"],
    specifications: {
      engine: "4.0L V6",
      transmission: "6-Speed Automatic",
      fuelEconomy: "11.2L/100km",
      safetyRating: "5-Star",
      warranty: "5-year/100,000km"
    }
  },
  {
    id: "fortuner",
    name: "Toyota Fortuner",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/110f4b82-7af5-47ef-b7b9-4c2c24d25f5f/items/2c4dd486-7220-4166-98e6-3b9fe06e9660/renditions/6010c7e7-7fb5-4077-b8e1-46fa8a7b9a2c?binary=true&mformat=true",
    mmeUrl: "https://www.toyota.ae/en/new-cars/fortuner",
    configureUrl: "/configure/fortuner",
    price: 149900,
    category: "SUV",
    features: ["2.7L Engine", "7-Seater", "Robust Construction"],
    specifications: {
      engine: "2.7L 4-Cylinder",
      transmission: "6-Speed Automatic",
      fuelEconomy: "10.2L/100km",
      safetyRating: "5-Star",
      warranty: "5-year/100,000km"
    }
  },
  {
    id: "avalon",
    name: "Toyota Avalon",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/19d9b6ba-2cee-4d91-b3b3-621f72452918/renditions/9c9119d9-d77c-4c13-a2aa-b0f9e55219cb?binary=true&mformat=true",
    mmeUrl: "https://www.toyota.ae/en/new-cars/avalon",
    configureUrl: "/configure/avalon",
    price: 159900,
    category: "Sedan",
    features: ["3.5L V6 Engine", "Luxury Interior", "JBL Audio System"],
    specifications: {
      engine: "3.5L V6",
      transmission: "8-Speed Automatic",
      fuelEconomy: "9.4L/100km",
      safetyRating: "5-Star",
      warranty: "5-year/100,000km"
    }
  },
  {
    id: "camry",
    name: "Toyota Camry",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/19d9b6ba-2cee-4d91-b3b3-621f72452918/renditions/9c9119d9-d77c-4c13-a2aa-b0f9e55219cb?binary=true&mformat=true",
    mmeUrl: "https://www.toyota.ae/en/new-cars/camry",
    configureUrl: "/configure/camry",
    price: 119900,
    category: "Sedan",
    features: ["2.5L Engine", "Dynamic Design", "Advanced Safety Features"],
    specifications: {
      engine: "2.5L 4-Cylinder",
      transmission: "8-Speed Automatic",
      fuelEconomy: "7.2L/100km",
      safetyRating: "5-Star",
      warranty: "5-year/100,000km"
    }
  },
  {
    id: "corolla",
    name: "Toyota Corolla",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/032cc51f-3261-47ee-85cf-18b234d3c89c/items/12ede41f-eb4f-4f60-9e41-156a2f05fc2d/renditions/2aad8165-6bb6-4c4b-99d6-148d713b57ba?binary=true&mformat=true",
    mmeUrl: "https://www.toyota.ae/en/new-cars/corolla",
    configureUrl: "/configure/corolla",
    price: 84900,
    category: "Sedan",
    features: ["1.6L Engine", "Efficient Fuel Economy", "Spacious Interior"],
    specifications: {
      engine: "1.6L 4-Cylinder",
      transmission: "CVT",
      fuelEconomy: "6.0L/100km",
      safetyRating: "5-Star",
      warranty: "5-year/100,000km"
    }
  },
  {
    id: "yaris",
    name: "Toyota Yaris",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/993df02a-2bfb-49d0-9e40-677499d5ce97/items/6e32c9e9-51dd-456f-95ed-342ccb42036c/renditions/d61189d9-108c-408c-b1e2-f26b055d58c0?binary=true&mformat=true",
    mmeUrl: "https://www.toyota.ae/en/new-cars/yaris",
    configureUrl: "/configure/yaris",
    price: 69900,
    category: "Sedan",
    features: ["1.5L Engine", "Compact Design", "Smart Technology"],
    specifications: {
      engine: "1.5L 4-Cylinder",
      transmission: "CVT",
      fuelEconomy: "5.8L/100km",
      safetyRating: "5-Star",
      warranty: "5-year/100,000km"
    }
  },
  {
    id: "gr-supra",
    name: "Toyota GR Supra",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/62cfa484-93ad-4230-821a-8096c177027e/items/c43523ad-0eeb-4ed1-adef-a74ed6c80844/renditions/0547a7c4-44f7-44af-804a-e01f3fb22543?binary=true&mformat=true",
    mmeUrl: "https://www.toyota.ae/en/new-cars/gr-supra",
    configureUrl: "/configure/gr-supra",
    price: 249900,
    category: "GR",
    features: ["3.0L Turbocharged Engine", "Sport-Tuned Suspension", "Racing Heritage"],
    specifications: {
      engine: "3.0L Turbocharged Inline-6",
      transmission: "8-Speed Sport Automatic",
      fuelEconomy: "8.2L/100km",
      safetyRating: "5-Star",
      warranty: "3-year/unlimited km"
    }
  },
  {
    id: "gr-yaris",
    name: "Toyota GR Yaris",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/993df02a-2bfb-49d0-9e40-677499d5ce97/items/6e32c9e9-51dd-456f-95ed-342ccb42036c/renditions/d61189d9-108c-408c-b1e2-f26b055d58c0?binary=true&mformat=true",
    mmeUrl: "https://www.toyota.ae/en/new-cars/gr-yaris",
    configureUrl: "/configure/gr-yaris",
    price: 149900,
    category: "GR Performance",
    features: ["1.6L Turbocharged Engine", "All-Wheel Drive", "Rally Inspired"],
    specifications: {
      engine: "1.6L Turbocharged 3-Cylinder",
      transmission: "6-Speed Manual",
      fuelEconomy: "7.6L/100km",
      safetyRating: "5-Star",
      warranty: "3-year/unlimited km"
    }
  },
  {
    id: "hiace",
    name: "Toyota Hiace",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/602bfc54-fc17-4d79-a2e7-fc72d012b665/items/d1df7b73-2715-412e-8ee3-78d16dbead74/renditions/c47a94ec-e785-46ec-9043-0a5eac6b1a12?binary=true&mformat=true",
    mmeUrl: "https://www.toyota.ae/en/new-cars/hiace",
    configureUrl: "/configure/hiace",
    price: 109900,
    category: "Commercial",
    features: ["2.7L Engine", "Versatile Cargo Space", "Comfortable Seating"],
    specifications: {
      engine: "2.7L 4-Cylinder",
      transmission: "6-Speed Automatic",
      fuelEconomy: "10.4L/100km",
      safetyRating: "4-Star",
      warranty: "3-year/100,000km"
    }
  },
  {
    id: "hilux",
    name: "Toyota Hilux",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/74a44416-2a53-4604-9076-d7ef0367f3d9/items/a002b208-ddf7-4cff-ad15-c659f025bc50/renditions/04617d28-3f4b-491f-b830-a0ee689b98fd?binary=true&mformat=true",
    mmeUrl: "https://www.toyota.ae/en/new-cars/hilux",
    configureUrl: "/configure/hilux",
    price: 99900,
    category: "Commercial",
    features: ["2.4L Diesel Engine", "Tough Construction", "Advanced 4x4 Capability"],
    specifications: {
      engine: "2.4L Diesel",
      transmission: "6-Speed Automatic",
      fuelEconomy: "8.4L/100km",
      safetyRating: "5-Star",
      warranty: "5-year/100,000km"
    }
  },
  {
    id: "bz4x",
    name: "Toyota bZ4X",
    image: "",
    mmeUrl: "https://www.toyota.ae/en/new-cars/bz4x",
    configureUrl: "/configure/bz4x",
    price: 159900,
    category: "Electric",
    features: ["Electric Powertrain", "Fast Charging", "Advanced Tech"],
    specifications: {
      engine: "Electric Motor",
      transmission: "Single-Speed",
      fuelEconomy: "Electric Range 450km",
      safetyRating: "5-Star",
      warranty: "8-year Battery Warranty"
    }
  },
  {
    id: "crown",
    name: "Toyota Crown",
    image: "",
    mmeUrl: "https://www.toyota.ae/en/new-cars/crown",
    configureUrl: "/configure/crown",
    price: 189900,
    category: "Hybrid",
    features: ["2.4L Hybrid Turbo", "AWD System", "Premium Experience"],
    specifications: {
      engine: "2.4L Turbocharged Hybrid",
      transmission: "ECVT with AWD",
      fuelEconomy: "5.7L/100km",
      safetyRating: "5-Star",
      warranty: "8-year Hybrid Battery Warranty"
    }
  },
  {
    id: "mirai",
    name: "Toyota Mirai",
    image: "",
    mmeUrl: "https://www.toyota.ae/en/new-cars/mirai",
    configureUrl: "/configure/mirai",
    price: 219900,
    category: "Hydrogen",
    features: ["Hydrogen Fuel Cell", "Zero Emissions", "Future Technology"],
    specifications: {
      engine: "Hydrogen Fuel Cell Electric",
      transmission: "Single-Speed",
      fuelEconomy: "Hydrogen Range 650km",
      safetyRating: "5-Star",
      warranty: "8-year Fuel Cell Warranty"
    }
  },
  {
    id: "venza",
    name: "Toyota Venza",
    image: "",
    mmeUrl: "https://www.toyota.ae/en/new-cars/venza",
    configureUrl: "/configure/venza",
    price: 149900,
    category: "Hybrid",
    features: ["2.5L Hybrid Engine", "Star Gaze Panoramic Roof", "Luxury Crossover"],
    specifications: {
      engine: "2.5L 4-Cylinder Hybrid",
      transmission: "ECVT with AWD",
      fuelEconomy: "5.2L/100km",
      safetyRating: "5-Star",
      warranty: "8-year Hybrid Battery Warranty"
    }
  },
  {
    id: "gr86",
    name: "Toyota GR86",
    image: "",
    mmeUrl: "https://www.toyota.ae/en/new-cars/gr86",
    configureUrl: "/configure/gr86",
    price: 139900,
    category: "GR Performance",
    features: ["2.4L Boxer Engine", "Rear-Wheel Drive", "Sports Car Handling"],
    specifications: {
      engine: "2.4L Boxer 4-Cylinder",
      transmission: "6-Speed Manual/Automatic",
      fuelEconomy: "8.8L/100km",
      safetyRating: "5-Star",
      warranty: "3-year/unlimited km"
    }
  }
];

export const preOwnedVehicles: PreOwnedVehicle[] = [
  {
    id: "po-001",
    model: "Toyota Land Cruiser",
    make: "Toyota",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
    description: "Well-maintained Toyota Land Cruiser with full service history",
    year: 2021,
    price: 198000,
    mileage: 35000,
    certified: true,
    bodyType: "SUV",
    color: "White",
    transmission: "Automatic",
    features: ["Leather Seats", "Navigation System", "Parking Sensors", "Bluetooth", "Sunroof"]
  },
  {
    id: "po-002",
    model: "Toyota Camry",
    make: "Toyota",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/19d9b6ba-2cee-4d91-b3b3-621f72452918/renditions/9c9119d9-d77c-4c13-a2aa-b0f9e55219cb?binary=true&mformat=true",
    description: "Low mileage Toyota Camry in excellent condition",
    year: 2022,
    price: 89000,
    mileage: 22000,
    certified: true,
    bodyType: "Sedan",
    color: "Silver",
    transmission: "Automatic",
    features: ["Backup Camera", "Bluetooth", "Keyless Entry", "Cruise Control"]
  },
  {
    id: "po-003",
    model: "Toyota Prado",
    make: "Toyota",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/84a5ee19-6b54-4789-88b9-6feae59e9c7c/items/e297897c-d579-4179-bfde-b50e8d188a4f/renditions/4207c19f-2697-416d-8538-e03f27b77846?binary=true&mformat=true",
    description: "Toyota Prado with premium package and additional features",
    year: 2020,
    price: 145000,
    mileage: 48000,
    certified: true,
    bodyType: "SUV",
    color: "Black",
    transmission: "Automatic",
    features: ["Leather Seats", "Navigation System", "Parking Sensors", "Sunroof", "Third Row Seating"]
  },
  {
    id: "po-004",
    model: "Toyota Corolla",
    make: "Toyota",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/032cc51f-3261-47ee-85cf-18b234d3c89c/items/12ede41f-eb4f-4f60-9e41-156a2f05fc2d/renditions/2aad8165-6bb6-4c4b-99d6-148d713b57ba?binary=true&mformat=true",
    description: "Fuel-efficient Toyota Corolla with original paint",
    year: 2022,
    price: 72000,
    mileage: 18000,
    certified: true,
    bodyType: "Sedan",
    color: "Blue",
    transmission: "Automatic",
    features: ["Bluetooth", "Backup Camera", "USB Ports", "Apple CarPlay"]
  },
  {
    id: "po-005",
    model: "Toyota RAV4",
    make: "Toyota",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b617024c-790e-4264-99ad-b567a5abd42f/items/cd05c792-558c-4965-b5e9-1d734faed831/renditions/871690a1-a2ce-40d3-a376-0a1a8f734ac3?binary=true&mformat=true",
    description: "One-owner Toyota RAV4 with warranty remaining",
    year: 2021,
    price: 95000,
    mileage: 30000,
    certified: false,
    bodyType: "Crossover",
    color: "Red",
    transmission: "Automatic",
    features: ["All-Wheel Drive", "Parking Sensors", "Heated Seats", "Lane Departure Warning"]
  },
  {
    id: "po-006",
    model: "Toyota Fortuner",
    make: "Toyota",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/110f4b82-7af5-47ef-b7b9-4c2c24d25f5f/items/2c4dd486-7220-4166-98e6-3b9fe06e9660/renditions/6010c7e7-7fb5-4077-b8e1-46fa8a7b9a2c?binary=true&mformat=true",
    description: "Toyota Fortuner with dealer service history and extras",
    year: 2020,
    price: 112000,
    mileage: 42000,
    certified: true,
    bodyType: "SUV",
    color: "White",
    transmission: "Automatic",
    features: ["7-Seater", "Parking Sensors", "Roof Rails", "Alloy Wheels"]
  },
  {
    id: "po-007",
    model: "Toyota Highlander",
    make: "Toyota",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/2639ecd9-9b31-445a-8d10-edcd954fd37c/items/b097e09d-0b05-46d1-864c-479c822035d4/renditions/61c23fc5-751b-4a4b-a8c3-12435c5192fa?binary=true&mformat=true",
    description: "Toyota Highlander with premium features and third-row seating",
    year: 2019,
    price: 105000,
    mileage: 55000,
    certified: false,
    bodyType: "SUV",
    color: "Gray",
    transmission: "Automatic",
    features: ["Third Row Seating", "Leather Interior", "Panoramic Roof", "Premium Sound System"]
  },
  {
    id: "po-008",
    model: "Toyota Yaris",
    make: "Toyota",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/993df02a-2bfb-49d0-9e40-677499d5ce97/items/6e32c9e9-51dd-456f-95ed-342ccb42036c/renditions/d61189d9-108c-408c-b1e2-f26b055d58c0?binary=true&mformat=true",
    description: "Economical Toyota Yaris in great condition",
    year: 2021,
    price: 58000,
    mileage: 25000,
    certified: true,
    bodyType: "Hatchback",
    color: "White",
    transmission: "Automatic",
    features: ["Bluetooth", "USB Ports", "Keyless Entry", "Fuel Efficient"]
  },
  {
    id: "po-009",
    model: "Toyota Hilux",
    make: "Toyota",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/74a44416-2a53-4604-9076-d7ef0367f3d9/items/a002b208-ddf7-4cff-ad15-c659f025bc50/renditions/04617d28-3f4b-491f-b830-a0ee689b98fd?binary=true&mformat=true",
    description: "Rugged Toyota Hilux with 4x4 capability",
    year: 2020,
    price: 88000,
    mileage: 38000,
    certified: true,
    bodyType: "Pickup",
    color: "Silver",
    transmission: "Automatic",
    features: ["4x4 System", "Tow Package", "Bed Liner", "Running Boards"]
  },
  {
    id: "po-010",
    model: "Toyota Camry Hybrid",
    make: "Toyota",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/19d9b6ba-2cee-4d91-b3b3-621f72452918/renditions/9c9119d9-d77c-4c13-a2aa-b0f9e55219cb?binary=true&mformat=true",
    description: "Eco-friendly Camry Hybrid with excellent fuel economy",
    year: 2022,
    price: 98000,
    mileage: 15000,
    certified: true,
    bodyType: "Sedan",
    color: "Blue",
    transmission: "CVT",
    features: ["Hybrid Engine", "Apple CarPlay", "Adaptive Cruise Control", "Lane Keep Assist"]
  }
];

export const heroSlides = [
  {
    id: "hero-1",
    title: "Experience Hybrid Innovation",
    subtitle: "Driving towards a greener future with Toyota Hybrid technology",
    image: "",
    ctaText: "Explore Hybrid Models",
    ctaLink: "/hybrid",
    isHybrid: true
  },
  {
    id: "hero-2",
    title: "The All-New Land Cruiser",
    subtitle: "Legendary capability, reimagined for modern adventure",
    image: "",
    ctaText: "Discover More",
    ctaLink: "/land-cruiser"
  },
  {
    id: "hero-3",
    title: "Summer Offers",
    subtitle: "Special deals across the Toyota range for a limited time",
    image: "",
    ctaText: "View Offers",
    ctaLink: "/offers"
  },
  {
    id: "hero-4",
    title: "All-Electric bZ4X",
    subtitle: "Experience the future of mobility with Toyota's first all-electric SUV",
    image: "",
    ctaText: "Explore Electric",
    ctaLink: "/electric"
  },
  {
    id: "hero-5",
    title: "GR Performance Series",
    subtitle: "Toyota's racing DNA brought to the streets with Gazoo Racing",
    image: "",
    ctaText: "Discover GR",
    ctaLink: "/gr"
  }
];

