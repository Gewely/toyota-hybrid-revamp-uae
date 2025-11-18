export const EXTERIOR_COLORS = [
  { id: 'white', name: 'Super White', hex: '#F8F8F8', category: 'solid' },
  { id: 'silver', name: 'Silver Metallic', hex: '#C0C0C0', category: 'metallic' },
  { id: 'black', name: 'Attitude Black Mica', hex: '#1C1C1C', category: 'mica' },
  { id: 'gray', name: 'Dark Gray Metallic', hex: '#4A4A4A', category: 'metallic' },
  { id: 'blue', name: 'Precious Blue Pearl', hex: '#1B3F73', category: 'pearl' },
  { id: 'red', name: 'Emotional Red', hex: '#8B1A1A', category: 'metallic' },
];

export const WHEEL_OPTIONS = [
  { 
    id: '18-standard', 
    size: '18"', 
    name: 'Standard Alloy',
    image: 'https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-001-1536.jpg',
    price: 0
  },
  { 
    id: '20-sport', 
    size: '20"', 
    name: 'GR Sport Black',
    image: 'https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-1536.jpg',
    price: 2500
  },
  { 
    id: '22-premium', 
    size: '22"', 
    name: 'Premium Chrome',
    image: 'https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-005-1536.jpg',
    price: 4500
  },
];

// Simulated 360° rotation frames (24 angles for smooth rotation)
export const ROTATION_FRAMES_360 = Array.from({ length: 24 }, (_, i) => {
  const angle = (i * 15); // 15° increments
  return {
    angle,
    image: `https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-00${(i % 7) + 1}-1536.jpg`
  };
});

export const EXTERIOR_ZONES = [
  {
    id: 'grille',
    name: 'Signature Grille',
    position: { x: 50, y: 35 },
    description: 'Bold, aerodynamic design with chrome accents',
    specs: ['Adaptive LED headlights', 'Auto-dimming high beams', 'Daytime running lights']
  },
  {
    id: 'wheels',
    name: 'Alloy Wheels',
    position: { x: 25, y: 70 },
    description: 'Performance-tuned suspension and brake system',
    specs: ['18" to 22" options', 'Ventilated disc brakes', 'Active traction control']
  },
  {
    id: 'lights',
    name: 'LED Lighting',
    position: { x: 75, y: 30 },
    description: 'Advanced illumination technology',
    specs: ['Sequential turn signals', 'Automatic high beams', 'Cornering assist lights']
  },
  {
    id: 'paint',
    name: 'Premium Paint',
    position: { x: 50, y: 50 },
    description: 'Multi-layer finish with UV protection',
    specs: ['6 premium colors', 'Metallic & pearl options', '10-year warranty']
  },
];

export const DESIGN_PHILOSOPHY = [
  {
    title: 'Aerodynamic Efficiency',
    description: 'Every curve optimized for minimal drag and maximum fuel economy',
    icon: '💨',
  },
  {
    title: 'Signature LED Lighting',
    description: 'Distinctive front and rear light signatures that turn heads',
    icon: '💡',
  },
  {
    title: 'Sculpted Body Lines',
    description: 'Athletic proportions combining elegance with rugged capability',
    icon: '🎨',
  },
  {
    title: 'Premium Materials',
    description: 'High-quality paint finishes and chrome accents that last',
    icon: '✨',
  },
];
