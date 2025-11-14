import { Gauge, Zap, Fuel, TrendingUp, Mountain, Settings, Wind, Rocket } from 'lucide-react';

export type HotspotCategory = 'comfort' | 'design' | 'safety' | 'technology' | 'performance' | 'engine' | 'drivetrain' | 'efficiency' | 'control';

export interface Hotspot {
  id: string;
  position: { x: number; y: number };
  category: HotspotCategory;
  title: string;
  icon: any;
  description: string;
  detailText: string;
  specs: { label: string; value: string | number }[];
  media: { type: 'image' | 'video'; url: string }[];
  gradeAvailability: string[];
  glowColor: string;
  pulseSpeed: number;
}

export const performanceHotspots: Hotspot[] = [
  {
    id: 'engine-block',
    position: { x: 35, y: 45 },
    category: 'performance',
    title: 'Twin-Turbo V6 Engine',
    icon: Rocket,
    description: 'Experience raw power with our 3.5L twin-turbocharged V6 engine, delivering explosive acceleration and smooth power delivery across the entire RPM range.',
    detailText: 'The advanced twin-turbo system provides instant throttle response while maintaining exceptional fuel efficiency. Variable valve timing optimizes performance across all driving conditions.',
    specs: [
      { label: 'Max Power', value: '268 HP' },
      { label: 'Max Torque', value: '420 Nm' },
      { label: 'Engine Type', value: 'V6 Twin-Turbo' },
      { label: 'Displacement', value: '3.5L' }
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800' },
      { type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    gradeAvailability: ['Base', 'Sport', 'Luxury', 'Hybrid'],
    glowColor: 'rgba(255, 69, 0, 0.6)',
    pulseSpeed: 2
  },
  {
    id: 'transmission',
    position: { x: 50, y: 55 },
    category: 'drivetrain',
    title: '10-Speed Automatic',
    icon: Settings,
    description: 'Lightning-fast shifts with our intelligent 10-speed automatic transmission for seamless power delivery.',
    detailText: 'Advanced shift logic learns your driving style and adapts gear changes for optimal performance and efficiency.',
    specs: [
      { label: 'Gears', value: '10-Speed' },
      { label: 'Type', value: 'Automatic' },
      { label: 'Shift Time', value: '0.2s' },
      { label: 'Technology', value: 'Adaptive Logic' }
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800' }
    ],
    gradeAvailability: ['Base', 'Sport', 'Luxury', 'Hybrid'],
    glowColor: 'rgba(0, 191, 255, 0.6)',
    pulseSpeed: 1.8
  },
  {
    id: 'acceleration',
    position: { x: 25, y: 35 },
    category: 'performance',
    title: '0-100 km/h Performance',
    icon: Gauge,
    description: 'Achieve 0-100 km/h in just 7.1 seconds with explosive acceleration that pins you to your seat.',
    detailText: 'Launch control system optimizes traction and power delivery for consistent, repeatable acceleration runs.',
    specs: [
      { label: '0-100 km/h', value: '7.1s' },
      { label: '50-100 km/h', value: '4.2s' },
      { label: 'Quarter Mile', value: '15.3s' },
      { label: 'Launch Control', value: 'Available' }
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800' }
    ],
    gradeAvailability: ['Sport', 'Luxury', 'Hybrid'],
    glowColor: 'rgba(255, 0, 255, 0.6)',
    pulseSpeed: 2.5
  },
  {
    id: 'top-speed',
    position: { x: 70, y: 40 },
    category: 'performance',
    title: 'Maximum Velocity',
    icon: TrendingUp,
    description: 'Reach a top speed of 180 km/h with confidence and stability at high speeds.',
    detailText: 'Aerodynamic design and electronic stability control ensure planted handling even at maximum velocity.',
    specs: [
      { label: 'Top Speed', value: '180 km/h' },
      { label: 'Speed Limiter', value: 'Electronic' },
      { label: 'Stability', value: 'ESP+' },
      { label: 'Aerodynamics', value: 'Optimized' }
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800' }
    ],
    gradeAvailability: ['Base', 'Sport', 'Luxury', 'Hybrid'],
    glowColor: 'rgba(0, 255, 127, 0.6)',
    pulseSpeed: 2.2
  },
  {
    id: 'fuel-economy',
    position: { x: 55, y: 70 },
    category: 'efficiency',
    title: 'Fuel Efficiency',
    icon: Fuel,
    description: 'Achieve an impressive 8.5L/100km combined fuel economy without sacrificing performance.',
    detailText: 'Cylinder deactivation and intelligent stop-start system maximize efficiency in real-world driving.',
    specs: [
      { label: 'Combined', value: '8.5 L/100km' },
      { label: 'City', value: '10.2 L/100km' },
      { label: 'Highway', value: '7.1 L/100km' },
      { label: 'Range', value: '800+ km' }
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800' }
    ],
    gradeAvailability: ['Base', 'Sport', 'Luxury', 'Hybrid'],
    glowColor: 'rgba(50, 205, 50, 0.6)',
    pulseSpeed: 1.5
  },
  {
    id: 'awd-system',
    position: { x: 45, y: 80 },
    category: 'drivetrain',
    title: 'AWD with Torque Vectoring',
    icon: Mountain,
    description: 'Intelligent all-wheel-drive system with active torque vectoring for superior traction and handling.',
    detailText: 'Dynamic torque distribution sends power to wheels with the most grip, enhancing cornering and stability.',
    specs: [
      { label: 'Drive Type', value: 'AWD' },
      { label: 'Torque Split', value: 'Variable' },
      { label: 'Vectoring', value: 'Active' },
      { label: 'Modes', value: '4 Terrain' }
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800' }
    ],
    gradeAvailability: ['Sport', 'Luxury', 'Hybrid'],
    glowColor: 'rgba(255, 165, 0, 0.6)',
    pulseSpeed: 1.7
  },
  {
    id: 'drive-modes',
    position: { x: 65, y: 60 },
    category: 'control',
    title: 'Multi-Mode Drive Selector',
    icon: Settings,
    description: 'Choose from ECO, Normal, Sport, and Off-Road modes to match any driving condition.',
    detailText: 'Each mode adjusts throttle response, transmission mapping, and suspension settings for optimized performance.',
    specs: [
      { label: 'Modes', value: '4 Drive Modes' },
      { label: 'ECO Mode', value: 'Max Efficiency' },
      { label: 'Sport Mode', value: 'Performance' },
      { label: 'Off-Road', value: 'Terrain' }
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800' }
    ],
    gradeAvailability: ['Base', 'Sport', 'Luxury', 'Hybrid'],
    glowColor: 'rgba(138, 43, 226, 0.6)',
    pulseSpeed: 1.9
  },
  {
    id: 'cooling-system',
    position: { x: 20, y: 50 },
    category: 'engine',
    title: 'Advanced Cooling',
    icon: Wind,
    description: 'High-performance cooling system maintains optimal temperatures even during spirited driving.',
    detailText: 'Triple radiator design with active cooling fans ensures consistent engine performance in all conditions.',
    specs: [
      { label: 'Radiator Type', value: 'Triple Core' },
      { label: 'Fans', value: 'Dual Active' },
      { label: 'Intercooler', value: 'Air-to-Air' },
      { label: 'Oil Cooler', value: 'Integrated' }
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800' }
    ],
    gradeAvailability: ['Sport', 'Luxury', 'Hybrid'],
    glowColor: 'rgba(64, 224, 208, 0.6)',
    pulseSpeed: 1.6
  },
  {
    id: 'turbo-boost',
    position: { x: 80, y: 50 },
    category: 'engine',
    title: 'Turbocharger System',
    icon: Zap,
    description: 'Twin sequential turbochargers eliminate lag and provide instant power across the rev range.',
    detailText: 'Variable geometry technology optimizes boost pressure for maximum efficiency and performance.',
    specs: [
      { label: 'Boost Pressure', value: '18 PSI Max' },
      { label: 'Spooling', value: 'Sequential' },
      { label: 'Response Time', value: '<0.3s' },
      { label: 'Technology', value: 'Variable Geo' }
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdfcb0?w=800' }
    ],
    gradeAvailability: ['Sport', 'Luxury'],
    glowColor: 'rgba(255, 215, 0, 0.6)',
    pulseSpeed: 2.8
  }
];
