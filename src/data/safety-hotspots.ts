import { Shield, Eye, AlertCircle, Camera, Radio, Car, Radar, Waves, Bell } from 'lucide-react';
import { Hotspot } from './performance-hotspots';

export const safetyHotspots: Hotspot[] = [
  {
    id: 'pre-collision',
    position: { x: 50, y: 30 },
    category: 'safety',
    title: 'Pre-Collision System',
    icon: Eye,
    description: 'Advanced sensors detect vehicles and pedestrians ahead, automatically applying brakes if collision is imminent.',
    detailText: 'Multi-mode radar and camera fusion technology provides 360° awareness. System works day and night, in various weather conditions.',
    specs: [
      { label: 'Detection Range', value: '100m' },
      { label: 'Response Time', value: '0.5s' },
      { label: 'Brake Force', value: 'Full Auto' },
      { label: 'Pedestrian Detection', value: 'Yes' }
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800' }
    ],
    gradeAvailability: ['Base', 'Sport', 'Luxury', 'Hybrid'],
    glowColor: 'rgba(0, 240, 255, 0.6)',
    pulseSpeed: 2.0
  },
  {
    id: 'lane-departure',
    position: { x: 30, y: 50 },
    category: 'safety',
    title: 'Lane Departure Alert',
    icon: AlertCircle,
    description: 'Camera-based system warns you if drifting from your lane and gently steers you back on track.',
    detailText: 'Intelligent algorithm distinguishes between intentional lane changes and unintended drift for precise assistance.',
    specs: [
      { label: 'Detection', value: 'Camera-Based' },
      { label: 'Warning Type', value: 'Visual + Audio' },
      { label: 'Correction', value: 'Gentle Steering' },
      { label: 'Speed Range', value: '50+ km/h' }
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800' }
    ],
    gradeAvailability: ['Base', 'Sport', 'Luxury', 'Hybrid'],
    glowColor: 'rgba(255, 165, 0, 0.6)',
    pulseSpeed: 1.8
  },
  {
    id: 'adaptive-cruise',
    position: { x: 70, y: 50 },
    category: 'safety',
    title: 'Adaptive Cruise Control',
    icon: Radio,
    description: 'Maintains safe distance from vehicles ahead, automatically adjusting speed in traffic.',
    detailText: 'Full-range adaptive cruise with stop-and-go capability makes highway driving effortless and reduces fatigue.',
    specs: [
      { label: 'Range', value: '0-180 km/h' },
      { label: 'Distance Levels', value: '4 Settings' },
      { label: 'Stop & Go', value: 'Full Range' },
      { label: 'Traffic Jam', value: 'Assisted' }
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800' }
    ],
    gradeAvailability: ['Base', 'Sport', 'Luxury', 'Hybrid'],
    glowColor: 'rgba(0, 255, 127, 0.6)',
    pulseSpeed: 1.5
  },
  {
    id: '360-camera',
    position: { x: 50, y: 70 },
    category: 'safety',
    title: '360° Panoramic Camera',
    icon: Camera,
    description: 'Bird\'s-eye view from four cameras gives you complete awareness when parking and maneuvering.',
    detailText: 'High-resolution cameras with dynamic guidelines make parking in tight spaces effortless and stress-free.',
    specs: [
      { label: 'Cameras', value: '4 HD Cameras' },
      { label: 'Resolution', value: '1080p' },
      { label: 'View Modes', value: '6 Angles' },
      { label: 'Guidelines', value: 'Dynamic' }
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800' }
    ],
    gradeAvailability: ['Luxury', 'Hybrid'],
    glowColor: 'rgba(138, 43, 226, 0.6)',
    pulseSpeed: 1.7
  },
  {
    id: 'blind-spot',
    position: { x: 20, y: 60 },
    category: 'safety',
    title: 'Blind Spot Monitor',
    icon: Car,
    description: 'Radar sensors detect vehicles in your blind spots, warning you with visual and audio alerts.',
    detailText: 'Rear cross-traffic alert also warns when backing out of parking spaces, preventing collisions.',
    specs: [
      { label: 'Detection Range', value: '10m' },
      { label: 'Warning', value: 'Mirror + Audio' },
      { label: 'RCTA', value: 'Included' },
      { label: 'Speed Active', value: '10+ km/h' }
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800' }
    ],
    gradeAvailability: ['Sport', 'Luxury', 'Hybrid'],
    glowColor: 'rgba(255, 69, 0, 0.6)',
    pulseSpeed: 2.2
  },
  {
    id: 'road-sign',
    position: { x: 80, y: 60 },
    category: 'safety',
    title: 'Road Sign Assist',
    icon: Shield,
    description: 'Camera recognizes traffic signs and displays them on your instrument cluster for awareness.',
    detailText: 'Intelligent system reads speed limits, no-entry signs, and temporary road signs, keeping you informed.',
    specs: [
      { label: 'Recognition', value: 'AI-Powered' },
      { label: 'Sign Types', value: '20+ Types' },
      { label: 'Display', value: 'Cluster HUD' },
      { label: 'Night Vision', value: 'Infrared' }
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800' }
    ],
    gradeAvailability: ['Sport', 'Luxury', 'Hybrid'],
    glowColor: 'rgba(0, 191, 255, 0.6)',
    pulseSpeed: 1.6
  },
  {
    id: 'parking-sensors',
    position: { x: 50, y: 85 },
    category: 'safety',
    title: 'Parking Sensors',
    icon: Radar,
    description: 'Front and rear ultrasonic sensors provide audio and visual warnings when approaching obstacles.',
    detailText: 'Progressive beeping intensity increases as you get closer, making parallel parking simple and stress-free.',
    specs: [
      { label: 'Sensors', value: '8 Ultrasonic' },
      { label: 'Coverage', value: 'Front + Rear' },
      { label: 'Range', value: '2.5m' },
      { label: 'Warning', value: 'Audio + Visual' }
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800' }
    ],
    gradeAvailability: ['Luxury', 'Hybrid'],
    glowColor: 'rgba(50, 205, 50, 0.6)',
    pulseSpeed: 1.4
  },
  {
    id: 'airbag-system',
    position: { x: 35, y: 40 },
    category: 'safety',
    title: 'Advanced Airbag System',
    icon: Waves,
    description: '10 airbags including driver, passenger, side curtain, and knee airbags for comprehensive protection.',
    detailText: 'Multi-stage deployment system adjusts airbag inflation based on crash severity and occupant position.',
    specs: [
      { label: 'Total Airbags', value: '10 Airbags' },
      { label: 'Front', value: 'Dual-Stage' },
      { label: 'Side Curtain', value: 'Full Length' },
      { label: 'Knee Airbags', value: 'Driver + Pass' }
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdfcb0?w=800' }
    ],
    gradeAvailability: ['Base', 'Sport', 'Luxury', 'Hybrid'],
    glowColor: 'rgba(255, 0, 255, 0.6)',
    pulseSpeed: 1.3
  },
  {
    id: 'emergency-brake',
    position: { x: 65, y: 40 },
    category: 'safety',
    title: 'Emergency Brake Assist',
    icon: Bell,
    description: 'Detects emergency braking and automatically applies maximum brake force for shortest stopping distance.',
    detailText: 'Intelligent system recognizes panic braking patterns and ensures maximum brake pressure is applied instantly.',
    specs: [
      { label: 'Detection', value: 'Pressure Sensor' },
      { label: 'Response', value: 'Instant' },
      { label: 'Force', value: 'Max Boost' },
      { label: 'Activation', value: 'Automatic' }
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800' }
    ],
    gradeAvailability: ['Base', 'Sport', 'Luxury', 'Hybrid'],
    glowColor: 'rgba(255, 215, 0, 0.6)',
    pulseSpeed: 2.5
  }
];
