export type SpecCategory = {
  id: string;
  title: string;
  rows: {
    label: string;
    sport: string;
    performance: string;
    signature: string;
    'launch-edition': string;
  }[];
};

export const specCategories: SpecCategory[] = [
  {
    id: 'performance',
    title: 'Performance',
    rows: [
      {
        label: '0-100 km/h',
        sport: '4.2s',
        performance: '3.9s',
        signature: '3.7s',
        'launch-edition': '3.6s',
      },
      {
        label: 'Top Speed',
        sport: '240 km/h',
        performance: '255 km/h',
        signature: '265 km/h',
        'launch-edition': '270 km/h',
      },
      {
        label: 'Hybrid System Power',
        sport: '420 hp',
        performance: '476 hp',
        signature: '510 hp',
        'launch-edition': '540 hp',
      },
    ],
  },
  {
    id: 'dimensions',
    title: 'Dimensions',
    rows: [
      {
        label: 'Length',
        sport: '4,890 mm',
        performance: '4,890 mm',
        signature: '4,905 mm',
        'launch-edition': '4,905 mm',
      },
      {
        label: 'Width',
        sport: '1,920 mm',
        performance: '1,925 mm',
        signature: '1,930 mm',
        'launch-edition': '1,930 mm',
      },
      {
        label: 'Wheelbase',
        sport: '2,960 mm',
        performance: '2,960 mm',
        signature: '2,960 mm',
        'launch-edition': '2,960 mm',
      },
    ],
  },
  {
    id: 'technology',
    title: 'Technology',
    rows: [
      {
        label: 'AR Cockpit Display',
        sport: '20"',
        performance: '22"',
        signature: '24"',
        'launch-edition': '24" + Track HUD',
      },
      {
        label: 'Driver Assistance Suite',
        sport: 'Toyota Guardian 3.0',
        performance: 'Guardian 3.0 + Predictive',
        signature: 'Guardian 3.1',
        'launch-edition': 'Guardian 3.1 + Track Mentor',
      },
      {
        label: 'Audio',
        sport: '12-speaker JBL Quantum',
        performance: '16-speaker Mark Levinson',
        signature: '20-speaker Spatial Atmos',
        'launch-edition': '20-speaker + Track Mic',
      },
    ],
  },
];
