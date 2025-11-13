import { Zap, Gauge, Smartphone, Wind, Sun, Speaker, Settings, Shield, Package } from 'lucide-react';

export interface HotspotMedia {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

export interface HotspotSpec {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface Hotspot {
  id: string;
  position: { x: number; y: number }; // percentage-based positioning
  category: 'comfort' | 'technology' | 'safety' | 'design';
  title: string;
  icon: any;
  description: string;
  specs: HotspotSpec[];
  media: HotspotMedia[];
  gradeAvailability: string[];
  glowColor: string;
  pulseSpeed: number;
}

export const interiorHotspots: Hotspot[] = [
  {
    id: 'steering-wheel',
    position: { x: 35, y: 45 },
    category: 'technology',
    title: 'Multi-Function Steering Wheel',
    icon: Settings,
    description: 'Leather-wrapped with integrated controls for audio, phone, and cruise control. Heated function available in premium grades.',
    specs: [
      { label: 'Material', value: 'Premium Leather', highlight: true },
      { label: 'Heating', value: 'Available', highlight: false },
      { label: 'Controls', value: '14-Button Layout', highlight: false },
      { label: 'Grip', value: 'Ergonomic Design', highlight: false }
    ],
    media: [
      { type: 'image', url: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/42f030ab-e6fa-444c-8233-aad8aa428a71/items/14a16f35-b752-4b2e-b91a-42d981935cea/renditions/30455a3f-116c-4371-a1db-ddb7a42a2e16?binary=true' }
    ],
    gradeAvailability: ['Base', 'XLE', 'Limited', 'Platinum'],
    glowColor: '#00f0ff',
    pulseSpeed: 2
  },
  {
    id: 'instrument-cluster',
    position: { x: 48, y: 38 },
    category: 'technology',
    title: 'Digital Instrument Cluster',
    icon: Gauge,
    description: '12.3" full-color TFT display with customizable layouts and real-time vehicle information.',
    specs: [
      { label: 'Display Size', value: '12.3 inches', highlight: true },
      { label: 'Resolution', value: '1920x720 HD', highlight: false },
      { label: 'Modes', value: '4 Layout Styles', highlight: false },
      { label: 'Brightness', value: 'Auto-Adjusting', highlight: false }
    ],
    media: [
      { type: 'image', url: 'https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-1440w.jpg' }
    ],
    gradeAvailability: ['XLE', 'Limited', 'Platinum'],
    glowColor: '#ff00ff',
    pulseSpeed: 1.8
  },
  {
    id: 'infotainment',
    position: { x: 58, y: 48 },
    category: 'technology',
    title: 'Premium Infotainment System',
    icon: Smartphone,
    description: '14" touchscreen with wireless Apple CarPlay, Android Auto, and premium JBL sound system.',
    specs: [
      { label: 'Screen Size', value: '14 inches', highlight: true },
      { label: 'Connectivity', value: 'Wireless CarPlay/Auto', highlight: true },
      { label: 'Audio', value: 'JBL 14-Speaker', highlight: true },
      { label: 'Navigation', value: 'Real-time Traffic', highlight: false }
    ],
    media: [
      { type: 'image', url: 'https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-003-1440w.jpg' }
    ],
    gradeAvailability: ['Limited', 'Platinum'],
    glowColor: '#00ff88',
    pulseSpeed: 2.2
  },
  {
    id: 'climate-control',
    position: { x: 55, y: 62 },
    category: 'comfort',
    title: 'Tri-Zone Climate Control',
    icon: Wind,
    description: 'Independent temperature control for driver, passenger, and rear cabin with air quality monitoring.',
    specs: [
      { label: 'Zones', value: '3 Independent', highlight: true },
      { label: 'Air Quality', value: 'PM2.5 Filter', highlight: false },
      { label: 'Humidity', value: 'Auto Control', highlight: false },
      { label: 'Defog', value: 'Rapid Clear', highlight: false }
    ],
    media: [
      { type: 'image', url: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/42f030ab-e6fa-444c-8233-aad8aa428a71/items/14a16f35-b752-4b2e-b91a-42d981935cea/renditions/30455a3f-116c-4371-a1db-ddb7a42a2e16?binary=true' }
    ],
    gradeAvailability: ['XLE', 'Limited', 'Platinum'],
    glowColor: '#00ddff',
    pulseSpeed: 2
  },
  {
    id: 'front-seats',
    position: { x: 42, y: 58 },
    category: 'comfort',
    title: 'Power-Adjustable Front Seats',
    icon: Zap,
    description: '12-way power adjustment with memory function, heating, and ventilation for ultimate comfort.',
    specs: [
      { label: 'Adjustment', value: '12-Way Power', highlight: true },
      { label: 'Memory', value: '3 Positions', highlight: false },
      { label: 'Heating', value: '3 Levels', highlight: false },
      { label: 'Ventilation', value: 'Active Cooling', highlight: true }
    ],
    media: [
      { type: 'image', url: 'https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-1440w.jpg' }
    ],
    gradeAvailability: ['Limited', 'Platinum'],
    glowColor: '#ff6600',
    pulseSpeed: 1.5
  },
  {
    id: 'ambient-lighting',
    position: { x: 25, y: 55 },
    category: 'design',
    title: 'Ambient LED Lighting',
    icon: Sun,
    description: '64-color customizable ambient lighting system throughout the cabin with multiple mood presets.',
    specs: [
      { label: 'Colors', value: '64 Options', highlight: true },
      { label: 'Zones', value: '8 Areas', highlight: false },
      { label: 'Brightness', value: '10 Levels', highlight: false },
      { label: 'Presets', value: '6 Moods', highlight: false }
    ],
    media: [
      { type: 'image', url: 'https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-003-1440w.jpg' }
    ],
    gradeAvailability: ['Platinum'],
    glowColor: '#ff00aa',
    pulseSpeed: 2.5
  },
  {
    id: 'audio-system',
    position: { x: 18, y: 48 },
    category: 'technology',
    title: 'Premium JBL Audio',
    icon: Speaker,
    description: '14-speaker JBL premium sound system with 1200W amplifier and concert hall acoustics.',
    specs: [
      { label: 'Speakers', value: '14 Premium', highlight: true },
      { label: 'Power', value: '1200W Amplifier', highlight: true },
      { label: 'Subwoofer', value: 'Dual 10-inch', highlight: false },
      { label: 'Tuning', value: 'Concert Hall Mode', highlight: false }
    ],
    media: [
      { type: 'image', url: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/42f030ab-e6fa-444c-8233-aad8aa428a71/items/14a16f35-b752-4b2e-b91a-42d981935cea/renditions/30455a3f-116c-4371-a1db-ddb7a42a2e16?binary=true' }
    ],
    gradeAvailability: ['Limited', 'Platinum'],
    glowColor: '#aa00ff',
    pulseSpeed: 1.8
  },
  {
    id: 'panoramic-roof',
    position: { x: 50, y: 15 },
    category: 'design',
    title: 'Panoramic Sunroof',
    icon: Sun,
    description: 'Dual-panel power sunroof with tilt/slide function and power sunshade for an open-air experience.',
    specs: [
      { label: 'Panels', value: 'Dual Power', highlight: true },
      { label: 'Opening Area', value: '1.2 m²', highlight: false },
      { label: 'Sunshade', value: 'Power Retract', highlight: false },
      { label: 'Tint', value: 'UV Protection', highlight: false }
    ],
    media: [
      { type: 'image', url: 'https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-1440w.jpg' }
    ],
    gradeAvailability: ['Limited', 'Platinum'],
    glowColor: '#ffaa00',
    pulseSpeed: 2
  },
  {
    id: 'rear-entertainment',
    position: { x: 50, y: 70 },
    category: 'technology',
    title: 'Rear Seat Entertainment',
    icon: Smartphone,
    description: 'Dual 11.6" HD touchscreens with wireless headphones and HDMI connectivity.',
    specs: [
      { label: 'Screens', value: 'Dual 11.6" HD', highlight: true },
      { label: 'Headphones', value: '2 Wireless Sets', highlight: false },
      { label: 'Inputs', value: 'HDMI + USB-C', highlight: false },
      { label: 'Streaming', value: 'Wi-Fi Enabled', highlight: false }
    ],
    media: [
      { type: 'image', url: 'https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-003-1440w.jpg' }
    ],
    gradeAvailability: ['Platinum'],
    glowColor: '#00ffdd',
    pulseSpeed: 1.6
  },
  {
    id: 'cargo-space',
    position: { x: 75, y: 65 },
    category: 'design',
    title: 'Flexible Cargo System',
    icon: Package,
    description: '621L of cargo space with 60:40 split-folding rear seats and underfloor storage compartments.',
    specs: [
      { label: 'Volume', value: '621 Liters', highlight: true },
      { label: 'Split', value: '60:40 Folding', highlight: false },
      { label: 'Underfloor', value: 'Hidden Storage', highlight: false },
      { label: 'Power Liftgate', value: 'Hands-Free', highlight: false }
    ],
    media: [
      { type: 'image', url: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/42f030ab-e6fa-444c-8233-aad8aa428a71/items/14a16f35-b752-4b2e-b91a-42d981935cea/renditions/30455a3f-116c-4371-a1db-ddb7a42a2e16?binary=true' }
    ],
    gradeAvailability: ['Base', 'XLE', 'Limited', 'Platinum'],
    glowColor: '#ff9900',
    pulseSpeed: 1.8
  },
  {
    id: 'airbags',
    position: { x: 28, y: 42 },
    category: 'safety',
    title: '10 SRS Airbags',
    icon: Shield,
    description: 'Comprehensive airbag system including driver/passenger, side, curtain, and knee airbags.',
    specs: [
      { label: 'Total Count', value: '10 Airbags', highlight: true },
      { label: 'Front', value: 'Driver + Passenger', highlight: false },
      { label: 'Side', value: 'Front + Rear', highlight: false },
      { label: 'Curtain', value: 'Full-Length', highlight: false }
    ],
    media: [
      { type: 'image', url: 'https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-1440w.jpg' }
    ],
    gradeAvailability: ['Base', 'XLE', 'Limited', 'Platinum'],
    glowColor: '#ff0044',
    pulseSpeed: 1.5
  },
  {
    id: 'materials',
    position: { x: 65, y: 58 },
    category: 'design',
    title: 'Premium Materials',
    icon: Sun,
    description: 'Hand-stitched leather upholstery with contrast stitching and sustainable wood trim accents.',
    specs: [
      { label: 'Upholstery', value: 'Semi-Aniline Leather', highlight: true },
      { label: 'Stitching', value: 'Hand-Crafted', highlight: false },
      { label: 'Trim', value: 'Sustainable Wood', highlight: false },
      { label: 'Accents', value: 'Brushed Aluminum', highlight: false }
    ],
    media: [
      { type: 'image', url: 'https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-003-1440w.jpg' }
    ],
    gradeAvailability: ['Platinum'],
    glowColor: '#ffd700',
    pulseSpeed: 2
  }
];
