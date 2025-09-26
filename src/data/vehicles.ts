export type HeroMedia = {
  id: string;
  type: 'image' | 'video';
  src: string;
  poster?: string;
  headline: string;
  subheadline: string;
};

export type VehicleHighlight = {
  id: string;
  title: string;
  description: string;
  image: string;
  ctaLabel: string;
  modalId: string;
};

export type CarouselItem = {
  id: string;
  title: string;
  description: string;
  media: string;
  specs: string[];
};

export type BuilderOption = {
  id: string;
  label: string;
  preview: string;
  priceImpact?: string;
};

export type BuilderStep = {
  id: 'grade' | 'color' | 'wheels' | 'interior' | 'summary';
  title: string;
  options: BuilderOption[];
};

export const heroMedia: HeroMedia = {
  id: 'gr-hybrid',
  type: 'video',
  src: 'https://cdn.coverr.co/videos/coverr-driving-through-the-tunnel-4435/1080p.mp4',
  poster: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1b?auto=format&fit=crop&w=1600&q=80',
  headline: 'GR Hybrid Concept',
  subheadline: 'A new dimension of electrified performance, sculpted with Japanese precision and European poise.',
};

export const vehicleHighlights: VehicleHighlight[] = [
  {
    id: 'carbon-aero',
    title: 'Carbon Aero Silhouette',
    description: 'Active aero vanes and sculpted lines manage airflow while the carbon matte finish absorbs the spotlight.',
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=80',
    ctaLabel: 'Explore Aero Suite',
    modalId: 'feature1',
  },
  {
    id: 'e-hybrid',
    title: 'E-Hybrid Performance',
    description: 'Dual-motor intelligence orchestrates instant torque with grand-touring serenity.',
    image: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1400&q=80',
    ctaLabel: 'View Power Metrics',
    modalId: 'feature2',
  },
  {
    id: 'immersive-cockpit',
    title: 'Immersive Cockpit',
    description: 'A cinematic glass cockpit with AR overlays and haptic controls, tuned for grand tours.',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=80',
    ctaLabel: 'Open Cockpit Studio',
    modalId: 'feature3',
  },
  {
    id: 'synced-services',
    title: 'Synced Services',
    description: 'Cloud-personalised concierge and performance telemetry available on every drive.',
    image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1400&q=80',
    ctaLabel: 'Discover Concierge',
    modalId: 'feature4',
  },
  {
    id: 'ownership-faq',
    title: 'Ownership Concierge',
    description: 'Dedicated GR specialists simplify every touchpoint with curated responses and proactive updates.',
    image: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=1400&q=80',
    ctaLabel: 'View Concierge FAQ',
    modalId: 'feature5',
  },
  {
    id: 'immersive-360',
    title: '360° Grand Tour',
    description: 'Rotate through cinematic exterior frames to appreciate the GR silhouette from every angle.',
    image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=1400&q=80',
    ctaLabel: 'Launch 360° Viewer',
    modalId: 'feature6',
  },
];

export const carouselItems: CarouselItem[] = [
  {
    id: 'performance',
    title: 'Gran Turismo Dynamics',
    description: 'Adaptive torque vectoring with AI road preview ensures every apex feels effortless.',
    media: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1600&q=80',
    specs: ['0-100 km/h in 3.8s', 'Range 620 km WLTP', 'Active Air Suspension'],
  },
  {
    id: 'design',
    title: 'Athletic Minimalism',
    description: 'Floating blade lights and etched carbon weave emphasise the GR lineage.',
    media: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80',
    specs: ['Matrix LED Lighting', 'Glass Roof Canopy', 'Carbon Ceramic Brakes'],
  },
  {
    id: 'craft',
    title: 'Crafted Interior',
    description: 'Hand-finished Ultrasuede with laser-etched ambient light motifs.',
    media: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=80',
    specs: ['Adaptive Ambient Suite', 'Dual-Zone Climate Lounge', 'Executive Rear Seating'],
  },
];

export const builderSteps: BuilderStep[] = [
  {
    id: 'grade',
    title: 'Select Your Grade',
    options: [
      { id: 'sport', label: 'Sport', preview: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=800&q=80', priceImpact: 'Included' },
      { id: 'performance', label: 'Performance', preview: 'https://images.unsplash.com/photo-1471479917193-f00955256257?auto=format&fit=crop&w=800&q=80', priceImpact: '+18,500 AED' },
      { id: 'signature', label: 'Signature', preview: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80', priceImpact: '+36,000 AED' },
    ],
  },
  {
    id: 'color',
    title: 'Exterior Finish',
    options: [
      { id: 'carbon-matte', label: 'Carbon Matte', preview: '#1C1C20', priceImpact: 'Signature' },
      { id: 'pearl-white', label: 'Pearl White', preview: '#F6F6F9', priceImpact: '+2,800 AED' },
      { id: 'midnight', label: 'Midnight Abyss', preview: '#040507', priceImpact: 'Included' },
    ],
  },
  {
    id: 'wheels',
    title: 'Wheel Design',
    options: [
      { id: 'aero-forged', label: 'AeroForged 21"', preview: 'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?auto=format&fit=crop&w=800&q=80', priceImpact: 'Included' },
      { id: 'carbon-twist', label: 'Carbon Twist 22"', preview: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80', priceImpact: '+9,900 AED' },
      { id: 'neon-edge', label: 'Neon Edge 21"', preview: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80', priceImpact: '+5,500 AED' },
    ],
  },
  {
    id: 'interior',
    title: 'Interior Mood',
    options: [
      { id: 'storm', label: 'Storm Black', preview: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=80', priceImpact: 'Included' },
      { id: 'ice', label: 'Ice Quartz', preview: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=80', priceImpact: '+6,200 AED' },
      { id: 'ember', label: 'Ember Red', preview: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80', priceImpact: '+8,400 AED' },
    ],
  },
  {
    id: 'summary',
    title: 'Crafted Summary',
    options: [],
  },
];
