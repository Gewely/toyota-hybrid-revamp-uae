export type Grade = {
  id: string;
  name: string;
  price: string;
  power: string;
  range: string;
  highlights: string[];
};

export const grades: Grade[] = [
  {
    id: 'sport',
    name: 'Sport',
    price: '299,000 AED',
    power: '420 hp',
    range: '610 km',
    highlights: ['Adaptive GR Suspension', 'Semi-aniline Ultrasuede', '19" AeroForged Wheels'],
  },
  {
    id: 'performance',
    name: 'Performance',
    price: '336,500 AED',
    power: '476 hp',
    range: '595 km',
    highlights: ['e-AWD Torque Vectoring', 'Glass Panorama Roof', '21" Carbon Twist Wheels'],
  },
  {
    id: 'signature',
    name: 'Signature',
    price: '365,800 AED',
    power: '510 hp',
    range: '580 km',
    highlights: ['Executive Lounge Rear Suite', '24" AR Cockpit Display', 'Hand-finished Carbon Matte'],
  },
  {
    id: 'launch-edition',
    name: 'Launch Edition',
    price: '399,900 AED',
    power: '540 hp',
    range: '570 km',
    highlights: ['Track Mode Calibration', 'Neon Edge Styling Pack', 'Signature Concierge Access'],
  },
];
