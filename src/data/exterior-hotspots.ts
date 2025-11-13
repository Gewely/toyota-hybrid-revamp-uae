import { Lightbulb, Disc, Droplets, Wind, Shield, Zap, Palette, Camera } from 'lucide-react';
import { Hotspot, HotspotMedia, HotspotSpec } from './interior-hotspots';

export const exteriorHotspots: Hotspot[] = [
  {
    id: 'led-headlights',
    position: { x: 15, y: 42 },
    category: 'technology',
    title: 'LED Matrix Headlights',
    icon: Lightbulb,
    description: 'Adaptive LED matrix headlights with automatic high-beam control and cornering assistance.',
    specs: [
      { label: 'Type', value: 'LED Matrix', highlight: true },
      { label: 'Adaptive', value: 'Auto High-Beam', highlight: true },
      { label: 'Cornering', value: 'Dynamic Steering', highlight: false },
      { label: 'Range', value: '600m Visibility', highlight: false }
    ],
    media: [
      { type: 'image', url: 'https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-007-1536.jpg' }
    ],
    gradeAvailability: ['Limited', 'Platinum'],
    glowColor: '#00f0ff',
    pulseSpeed: 2
  },
  {
    id: 'front-grille',
    position: { x: 28, y: 48 },
    category: 'design',
    title: 'Signature Grille Design',
    icon: Shield,
    description: 'Bold chrome-finished grille with active shutter system for improved aerodynamics and cooling.',
    specs: [
      { label: 'Finish', value: 'Chrome Plated', highlight: true },
      { label: 'Shutters', value: 'Active Aero', highlight: false },
      { label: 'Cooling', value: 'Optimized Flow', highlight: false },
      { label: 'Style', value: 'Heritage Design', highlight: false }
    ],
    media: [
      { type: 'image', url: 'https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-001-1440w.jpg' }
    ],
    gradeAvailability: ['Base', 'XLE', 'Limited', 'Platinum'],
    glowColor: '#c0c0c0',
    pulseSpeed: 1.8
  },
  {
    id: 'wheels',
    position: { x: 22, y: 72 },
    category: 'design',
    title: '20" Sport Alloy Wheels',
    icon: Disc,
    description: 'Lightweight forged alloy wheels with all-terrain tires and TPMS monitoring.',
    specs: [
      { label: 'Size', value: '20 inches', highlight: true },
      { label: 'Material', value: 'Forged Alloy', highlight: true },
      { label: 'Tires', value: 'All-Terrain', highlight: false },
      { label: 'TPMS', value: 'Real-time Monitor', highlight: false }
    ],
    media: [
      { type: 'image', url: 'https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-001-1536.jpg' }
    ],
    gradeAvailability: ['Limited', 'Platinum'],
    glowColor: '#ff6600',
    pulseSpeed: 1.5
  },
  {
    id: 'paint-color',
    position: { x: 50, y: 35 },
    category: 'design',
    title: 'Premium Paint Finish',
    icon: Palette,
    description: 'Triple-layer metallic paint with ceramic coating for enhanced durability and shine.',
    specs: [
      { label: 'Layers', value: 'Triple Coat', highlight: true },
      { label: 'Type', value: 'Metallic', highlight: false },
      { label: 'Protection', value: 'Ceramic Coating', highlight: true },
      { label: 'Colors', value: '8 Options', highlight: false }
    ],
    media: [
      { type: 'image', url: 'https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-007-1440w.jpg' }
    ],
    gradeAvailability: ['XLE', 'Limited', 'Platinum'],
    glowColor: '#00ffaa',
    pulseSpeed: 2.2
  },
  {
    id: 'mirrors',
    position: { x: 35, y: 45 },
    category: 'technology',
    title: 'Power-Folding Mirrors',
    icon: Camera,
    description: 'Auto-dimming side mirrors with integrated turn signals, heating, and blind-spot monitoring.',
    specs: [
      { label: 'Function', value: 'Power Fold', highlight: true },
      { label: 'Dimming', value: 'Auto Night', highlight: false },
      { label: 'Heating', value: 'Defrost Capable', highlight: false },
      { label: 'BSM', value: 'Blind Spot Alert', highlight: true }
    ],
    media: [
      { type: 'image', url: 'https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-007-1536.jpg' }
    ],
    gradeAvailability: ['XLE', 'Limited', 'Platinum'],
    glowColor: '#00ddff',
    pulseSpeed: 2
  },
  {
    id: 'roof-rails',
    position: { x: 55, y: 22 },
    category: 'design',
    title: 'Integrated Roof Rails',
    icon: Zap,
    description: 'Aerodynamic aluminum roof rails with 75kg load capacity for adventure gear.',
    specs: [
      { label: 'Material', value: 'Aluminum Alloy', highlight: true },
      { label: 'Capacity', value: '75 kg', highlight: true },
      { label: 'Design', value: 'Aero Profile', highlight: false },
      { label: 'Finish', value: 'Satin Silver', highlight: false }
    ],
    media: [
      { type: 'image', url: 'https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-001-1440w.jpg' }
    ],
    gradeAvailability: ['XLE', 'Limited', 'Platinum'],
    glowColor: '#888888',
    pulseSpeed: 1.8
  },
  {
    id: 'rear-lights',
    position: { x: 82, y: 48 },
    category: 'technology',
    title: 'LED Taillights',
    icon: Lightbulb,
    description: 'Sequential LED taillights with signature light pattern and rapid response braking.',
    specs: [
      { label: 'Type', value: 'LED Sequential', highlight: true },
      { label: 'Pattern', value: 'Signature Flow', highlight: false },
      { label: 'Response', value: '0.2s Brake Light', highlight: false },
      { label: 'Visibility', value: 'Enhanced Safety', highlight: false }
    ],
    media: [
      { type: 'image', url: 'https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-001-1536.jpg' }
    ],
    gradeAvailability: ['Base', 'XLE', 'Limited', 'Platinum'],
    glowColor: '#ff0044',
    pulseSpeed: 1.6
  },
  {
    id: 'liftgate',
    position: { x: 88, y: 58 },
    category: 'technology',
    title: 'Power Liftgate',
    icon: Zap,
    description: 'Hands-free power liftgate with kick sensor and programmable height memory.',
    specs: [
      { label: 'Activation', value: 'Kick Sensor', highlight: true },
      { label: 'Height', value: 'Programmable', highlight: false },
      { label: 'Speed', value: 'Variable Control', highlight: false },
      { label: 'Safety', value: 'Pinch Protection', highlight: false }
    ],
    media: [
      { type: 'image', url: 'https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-007-1440w.jpg' }
    ],
    gradeAvailability: ['Limited', 'Platinum'],
    glowColor: '#00ff88',
    pulseSpeed: 2
  },
  {
    id: 'aerodynamics',
    position: { x: 65, y: 38 },
    category: 'design',
    title: 'Aerodynamic Design',
    icon: Wind,
    description: 'Wind-tunnel optimized bodywork with active air management for 0.32 Cd coefficient.',
    specs: [
      { label: 'Cd Coefficient', value: '0.32', highlight: true },
      { label: 'Underbody', value: 'Smooth Panel', highlight: false },
      { label: 'Spoiler', value: 'Integrated Lip', highlight: false },
      { label: 'Noise', value: 'Reduced Wind', highlight: false }
    ],
    media: [
      { type: 'image', url: 'https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-007-1536.jpg' }
    ],
    gradeAvailability: ['Base', 'XLE', 'Limited', 'Platinum'],
    glowColor: '#00ccff',
    pulseSpeed: 2.5
  },
  {
    id: 'door-handles',
    position: { x: 58, y: 52 },
    category: 'technology',
    title: 'Smart Entry Handles',
    icon: Zap,
    description: 'Touch-sensitive door handles with keyless entry and auto-lock on departure.',
    specs: [
      { label: 'Type', value: 'Touch Sensitive', highlight: true },
      { label: 'Entry', value: 'Keyless System', highlight: true },
      { label: 'Auto-Lock', value: 'Walk-Away', highlight: false },
      { label: 'Lighting', value: 'LED Welcome', highlight: false }
    ],
    media: [
      { type: 'image', url: 'https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-001-1440w.jpg' }
    ],
    gradeAvailability: ['Limited', 'Platinum'],
    glowColor: '#ff00ff',
    pulseSpeed: 1.8
  },
  {
    id: 'underbody-protection',
    position: { x: 45, y: 82 },
    category: 'design',
    title: 'Underbody Protection',
    icon: Shield,
    description: 'Heavy-duty aluminum skid plates protecting engine, transmission, and fuel tank.',
    specs: [
      { label: 'Material', value: 'Aluminum Alloy', highlight: true },
      { label: 'Coverage', value: 'Full Underbody', highlight: false },
      { label: 'Thickness', value: '6mm Plate', highlight: false },
      { label: 'Protection', value: 'Rock & Debris', highlight: false }
    ],
    media: [
      { type: 'image', url: 'https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-001-1536.jpg' }
    ],
    gradeAvailability: ['XLE', 'Limited', 'Platinum'],
    glowColor: '#999999',
    pulseSpeed: 1.5
  },
  {
    id: 'cameras',
    position: { x: 75, y: 42 },
    category: 'safety',
    title: '360° Camera System',
    icon: Camera,
    description: 'Multi-angle camera system with bird\'s eye view and front/rear parking sensors.',
    specs: [
      { label: 'Cameras', value: '4 Wide-Angle', highlight: true },
      { label: 'Views', value: '360° + Bird\'s Eye', highlight: true },
      { label: 'Sensors', value: '8 Ultrasonic', highlight: false },
      { label: 'Guidelines', value: 'Dynamic Overlay', highlight: false }
    ],
    media: [
      { type: 'image', url: 'https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-007-1440w.jpg' }
    ],
    gradeAvailability: ['Limited', 'Platinum'],
    glowColor: '#00ffdd',
    pulseSpeed: 2
  },
  {
    id: 'exhaust',
    position: { x: 78, y: 68 },
    category: 'design',
    title: 'Dual Exhaust System',
    icon: Wind,
    description: 'Stainless steel dual exhaust with active sound control and chrome finishers.',
    specs: [
      { label: 'Outlets', value: 'Dual Chrome', highlight: true },
      { label: 'Material', value: 'Stainless Steel', highlight: false },
      { label: 'Sound', value: 'Active Control', highlight: false },
      { label: 'Emissions', value: 'Euro 6 Compliant', highlight: false }
    ],
    media: [
      { type: 'image', url: 'https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-007-1536.jpg' }
    ],
    gradeAvailability: ['Base', 'XLE', 'Limited', 'Platinum'],
    glowColor: '#cccccc',
    pulseSpeed: 1.8
  },
  {
    id: 'window-tint',
    position: { x: 48, y: 28 },
    category: 'design',
    title: 'Privacy Glass',
    icon: Droplets,
    description: 'Factory-tinted privacy glass with UV protection and heat rejection properties.',
    specs: [
      { label: 'Tint Level', value: '20% Rear', highlight: true },
      { label: 'UV Protection', value: '99% Blockage', highlight: true },
      { label: 'Heat Rejection', value: '65%', highlight: false },
      { label: 'Type', value: 'Factory Applied', highlight: false }
    ],
    media: [
      { type: 'image', url: 'https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-001-1440w.jpg' }
    ],
    gradeAvailability: ['XLE', 'Limited', 'Platinum'],
    glowColor: '#0088ff',
    pulseSpeed: 2
  }
];
