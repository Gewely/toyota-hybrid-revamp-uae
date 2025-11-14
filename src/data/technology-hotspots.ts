import { Smartphone, Wifi, Usb, Radio, Cloud, Bluetooth, Cpu, Battery, Headphones } from 'lucide-react';
import { Hotspot } from './performance-hotspots';

export const technologyHotspots: Hotspot[] = [
  {
    id: 'infotainment-screen',
    position: { x: 50, y: 40 },
    category: 'technology',
    title: '12.3" Touchscreen Display',
    icon: Smartphone,
    description: 'Crystal-clear HD touchscreen with lightning-fast response and intuitive interface for effortless control.',
    detailText: 'Anti-glare coating and auto-brightness adjustment ensure perfect visibility in all lighting conditions.',
    specs: [
      { label: 'Screen Size', value: '12.3 Inches' },
      { label: 'Resolution', value: '1920x720 HD' },
      { label: 'Touch', value: 'Capacitive' },
      { label: 'Processing', value: 'Quad-Core' }
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800' },
      { type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    gradeAvailability: ['Sport', 'Luxury', 'Hybrid'],
    glowColor: 'rgba(0, 240, 255, 0.6)',
    pulseSpeed: 1.8
  },
  {
    id: 'wireless-carplay',
    position: { x: 30, y: 50 },
    category: 'technology',
    title: 'Wireless Apple CarPlay',
    icon: Smartphone,
    description: 'Seamlessly connect your iPhone wirelessly for navigation, music, messages, and calls through the vehicle interface.',
    detailText: 'Automatic connection when you enter the vehicle. Access Siri, Apple Music, and all your favorite iOS apps hands-free.',
    specs: [
      { label: 'Connection', value: 'Wireless' },
      { label: 'Compatibility', value: 'iOS 14+' },
      { label: 'Auto Connect', value: 'Yes' },
      { label: 'Voice Control', value: 'Siri' }
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800' }
    ],
    gradeAvailability: ['Base', 'Sport', 'Luxury', 'Hybrid'],
    glowColor: 'rgba(255, 165, 0, 0.6)',
    pulseSpeed: 1.6
  },
  {
    id: 'android-auto',
    position: { x: 70, y: 50 },
    category: 'technology',
    title: 'Android Auto',
    icon: Radio,
    description: 'Connect your Android device for Google Maps, Google Assistant, and your favorite Android apps on the big screen.',
    detailText: 'Voice-activated controls keep your hands on the wheel and eyes on the road while staying connected.',
    specs: [
      { label: 'Connection', value: 'Wireless' },
      { label: 'Compatibility', value: 'Android 10+' },
      { label: 'Auto Connect', value: 'Yes' },
      { label: 'Voice Control', value: 'Google Asst' }
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800' }
    ],
    gradeAvailability: ['Base', 'Sport', 'Luxury', 'Hybrid'],
    glowColor: 'rgba(50, 205, 50, 0.6)',
    pulseSpeed: 1.6
  },
  {
    id: 'wifi-hotspot',
    position: { x: 50, y: 65 },
    category: 'technology',
    title: '4G LTE Wi-Fi Hotspot',
    icon: Wifi,
    description: 'Built-in Wi-Fi hotspot keeps up to 5 devices connected with fast 4G LTE speeds on the go.',
    detailText: 'Perfect for streaming, browsing, and video calls. Dedicated connection ensures stable performance.',
    specs: [
      { label: 'Network', value: '4G LTE' },
      { label: 'Devices', value: '5 Connected' },
      { label: 'Speed', value: '100 Mbps' },
      { label: 'Coverage', value: 'Nationwide' }
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800' }
    ],
    gradeAvailability: ['Luxury', 'Hybrid'],
    glowColor: 'rgba(138, 43, 226, 0.6)',
    pulseSpeed: 2.0
  },
  {
    id: 'usb-ports',
    position: { x: 40, y: 75 },
    category: 'technology',
    title: 'USB-C Fast Charging',
    icon: Usb,
    description: 'Four USB-C ports with Power Delivery for ultra-fast charging of phones, tablets, and laptops.',
    detailText: 'Front and rear USB-C ports provide up to 65W charging power for the fastest device charging.',
    specs: [
      { label: 'Ports', value: '4x USB-C' },
      { label: 'Power Output', value: '65W PD' },
      { label: 'Location', value: 'Front + Rear' },
      { label: 'Data Transfer', value: 'USB 3.2' }
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800' }
    ],
    gradeAvailability: ['Sport', 'Luxury', 'Hybrid'],
    glowColor: 'rgba(0, 191, 255, 0.6)',
    pulseSpeed: 1.5
  },
  {
    id: 'wireless-charging',
    position: { x: 60, y: 75 },
    category: 'technology',
    title: 'Wireless Phone Charging',
    icon: Battery,
    description: '15W Qi wireless charging pad keeps your phone topped up without cables.',
    detailText: 'Fast wireless charging compatible with all Qi-enabled devices. Anti-slip surface keeps phone secure.',
    specs: [
      { label: 'Standard', value: 'Qi Certified' },
      { label: 'Power', value: '15W Fast' },
      { label: 'Compatibility', value: 'Universal' },
      { label: 'Cooling', value: 'Active' }
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1591290619762-c588f8100d59?w=800' }
    ],
    gradeAvailability: ['Sport', 'Luxury', 'Hybrid'],
    glowColor: 'rgba(255, 69, 0, 0.6)',
    pulseSpeed: 1.7
  },
  {
    id: 'bluetooth',
    position: { x: 25, y: 35 },
    category: 'technology',
    title: 'Bluetooth 5.2',
    icon: Bluetooth,
    description: 'Latest Bluetooth 5.2 technology for stable connections and multi-device pairing.',
    detailText: 'Pair up to 5 devices simultaneously. Enhanced range and audio quality for crystal-clear calls and music.',
    specs: [
      { label: 'Version', value: 'Bluetooth 5.2' },
      { label: 'Devices', value: '5 Paired' },
      { label: 'Range', value: '30m' },
      { label: 'Codec', value: 'aptX HD' }
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800' }
    ],
    gradeAvailability: ['Base', 'Sport', 'Luxury', 'Hybrid'],
    glowColor: 'rgba(0, 255, 127, 0.6)',
    pulseSpeed: 1.4
  },
  {
    id: 'premium-audio',
    position: { x: 75, y: 35 },
    category: 'technology',
    title: 'JBL Premium Audio',
    icon: Headphones,
    description: '14-speaker JBL premium sound system with 1200W amplifier delivers concert-hall audio quality.',
    detailText: 'Strategically placed speakers create immersive 3D soundstage. Digital signal processing optimizes audio for cabin acoustics.',
    specs: [
      { label: 'Speakers', value: '14 Premium' },
      { label: 'Amplifier', value: '1200W' },
      { label: 'Subwoofer', value: 'Dual 10"' },
      { label: 'Processing', value: 'Clari-Fi DSP' }
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800' }
    ],
    gradeAvailability: ['Luxury', 'Hybrid'],
    glowColor: 'rgba(255, 0, 255, 0.6)',
    pulseSpeed: 1.9
  },
  {
    id: 'cloud-services',
    position: { x: 50, y: 25 },
    category: 'technology',
    title: 'Cloud Connect Services',
    icon: Cloud,
    description: 'Over-the-air updates, remote diagnostics, and cloud-based navigation keep your vehicle always up-to-date.',
    detailText: 'Automatic software updates add new features and improvements. Remote vehicle health monitoring alerts you to service needs.',
    specs: [
      { label: 'OTA Updates', value: 'Automatic' },
      { label: 'Remote Start', value: 'App Control' },
      { label: 'Diagnostics', value: 'Real-Time' },
      { label: 'Navigation', value: 'Live Traffic' }
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800' }
    ],
    gradeAvailability: ['Sport', 'Luxury', 'Hybrid'],
    glowColor: 'rgba(64, 224, 208, 0.6)',
    pulseSpeed: 1.3
  },
  {
    id: 'digital-assistant',
    position: { x: 15, y: 55 },
    category: 'technology',
    title: 'Voice Assistant',
    icon: Cpu,
    description: 'Intelligent AI voice assistant understands natural language for hands-free control of all vehicle functions.',
    detailText: 'Control climate, navigation, entertainment, and more with simple voice commands. Learns your preferences over time.',
    specs: [
      { label: 'AI Type', value: 'Neural Net' },
      { label: 'Languages', value: '30+ Langs' },
      { label: 'Activation', value: 'Wake Word' },
      { label: 'Learning', value: 'Adaptive' }
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=800' }
    ],
    gradeAvailability: ['Luxury', 'Hybrid'],
    glowColor: 'rgba(255, 215, 0, 0.6)',
    pulseSpeed: 2.2
  }
];
