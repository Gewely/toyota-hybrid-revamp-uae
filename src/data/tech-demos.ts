export const INFOTAINMENT_SCREENS = [
  {
    id: 'home',
    title: 'Home Screen',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80',
    features: ['Quick access widgets', 'Customizable layout', 'Voice shortcuts']
  },
  {
    id: 'navigation',
    title: 'Navigation',
    image: 'https://images.unsplash.com/photo-1551731409-43eb3e517a1a?w=800&q=80',
    features: ['Real-time traffic', '3D landmarks', 'Route optimization']
  },
  {
    id: 'media',
    title: 'Media',
    image: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=800&q=80',
    features: ['Streaming apps', 'Premium audio', 'Multi-zone control']
  },
  {
    id: 'climate',
    title: 'Climate',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',
    features: ['Dual-zone AC', 'Air purification', 'Heated/cooled seats']
  },
];

export const CONNECTIVITY_FEATURES = [
  {
    icon: '📱',
    title: 'Apple CarPlay',
    description: 'Wireless connection for iPhone',
    status: 'Standard'
  },
  {
    icon: '🤖',
    title: 'Android Auto',
    description: 'Seamless Android integration',
    status: 'Standard'
  },
  {
    icon: '📡',
    title: 'WiFi Hotspot',
    description: 'Connect up to 5 devices',
    status: 'Available'
  },
  {
    icon: '🔋',
    title: 'Wireless Charging',
    description: 'Qi-compatible charging pad',
    status: 'Standard'
  },
  {
    icon: '🎵',
    title: 'Premium Audio',
    description: 'JBL 14-speaker system',
    status: 'Upgrade'
  },
  {
    icon: '🔊',
    title: 'Voice Control',
    description: 'Hey Toyota assistant',
    status: 'Standard'
  },
];

export const SAFETY_LAYERS = [
  {
    layer: 'active',
    title: 'Active Safety',
    color: '#3B82F6',
    features: [
      'Pre-Collision System with Pedestrian Detection',
      'Dynamic Radar Cruise Control',
      'Lane Departure Alert with Steering Assist',
      'Automatic High Beams',
      'Road Sign Assist'
    ]
  },
  {
    layer: 'passive',
    title: 'Passive Safety',
    color: '#10B981',
    features: [
      '10 Advanced Airbags',
      'Reinforced Safety Cell',
      'Energy-Absorbing Crumple Zones',
      'Whiplash-Injury Lessening Seats',
      'Child Safety Seat Anchors'
    ]
  },
  {
    layer: 'driver-assist',
    title: 'Driver Assistance',
    color: '#8B5CF6',
    features: [
      'Blind Spot Monitor with Rear Cross-Traffic Alert',
      '360° Parking Camera with Guidelines',
      'Parking Sensors Front & Rear',
      'Adaptive Front Lighting System',
      'Hill Start Assist Control'
    ]
  },
];

export const CRASH_TEST_RATINGS = [
  { test: 'Overall Rating', score: 5, maxScore: 5, org: 'IIHS' },
  { test: 'Frontal Impact', score: 5, maxScore: 5, org: 'NHTSA' },
  { test: 'Side Impact', score: 5, maxScore: 5, org: 'NHTSA' },
  { test: 'Rollover', score: 4, maxScore: 5, org: 'NHTSA' },
];

export const PERFORMANCE_METRICS = {
  horsepower: 295,
  torque: 263,
  acceleration: 6.8, // 0-60 mph
  topSpeed: 130,
  fuelEconomy: {
    city: 13,
    highway: 17,
    combined: 15
  },
  driveModes: [
    { id: 'eco', name: 'Eco', icon: '🌱', description: 'Maximum efficiency' },
    { id: 'normal', name: 'Normal', icon: '🚗', description: 'Balanced performance' },
    { id: 'sport', name: 'Sport', icon: '⚡', description: 'Dynamic response' },
    { id: 'off-road', name: 'Off-Road', icon: '🏔️', description: 'Terrain capability' },
  ],
  powerDistribution: {
    front: 40,
    rear: 60
  }
};
