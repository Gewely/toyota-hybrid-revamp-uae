import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSwipeable } from '@/hooks/use-swipeable';

// ==================== TYPES ====================
interface ShowroomProps {
  vehicleImages: string[];
  vehicleName: string;
  onReserve?: () => void;
  onTestDrive?: () => void;
  onConfigure?: () => void;
}

type ModalType = 'interior' | 'exterior' | 'performance' | 'safety' | 'technology' | null;
type DriveMode = 'eco' | 'normal' | 'sport';
type InteriorStep = 0 | 1 | 2 | 3;
type ExteriorColor = 'white' | 'black' | 'red';

// ==================== MAIN COMPONENT ====================
const SeamlessCinematicShowroom: React.FC<ShowroomProps> = ({ 
  vehicleImages, 
  vehicleName,
  onReserve,
  onTestDrive,
  onConfigure 
}) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const openModal = (modal: ModalType) => setActiveModal(modal);
  const closeModal = () => setActiveModal(null);

  return (
    <section className="relative w-full bg-black">
      {/* ================= HERO SECTION ================= */}
      <HeroSection 
        vehicleImages={vehicleImages} 
        vehicleName={vehicleName}
        onReserve={onReserve}
        onTestDrive={onTestDrive}
        onConfigure={onConfigure}
      />

      {/* ================= JOURNEY CARDS ================= */}
      <JourneyCards openModal={openModal} />

      {/* ================= MODALS ================= */}
      <AnimatePresence mode="wait">
        {activeModal === 'interior' && <InteriorModal onClose={closeModal} onReserve={onReserve} onTestDrive={onTestDrive} />}
        {activeModal === 'exterior' && <ExteriorModal onClose={closeModal} onReserve={onReserve} onTestDrive={onTestDrive} />}
        {activeModal === 'performance' && <PerformanceModal onClose={closeModal} onReserve={onReserve} onTestDrive={onTestDrive} />}
        {activeModal === 'safety' && <SafetyModal onClose={closeModal} onReserve={onReserve} onTestDrive={onTestDrive} />}
        {activeModal === 'technology' && <TechnologyModal onClose={closeModal} onReserve={onReserve} onTestDrive={onTestDrive} />}
      </AnimatePresence>
    </section>
  );
};

// ==================== HERO SECTION ====================
const HeroSection: React.FC<{ 
  vehicleImages: string[]; 
  vehicleName: string;
  onReserve?: () => void;
  onTestDrive?: () => void;
  onConfigure?: () => void;
}> = ({ vehicleImages, vehicleName, onReserve, onTestDrive, onConfigure }) => {
  return (
    <div className="relative h-[90vh] sm:h-screen w-full overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <img
          src={vehicleImages[0] || 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1920&q=80'}
          alt={vehicleName}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-end px-4 pb-16 sm:px-6 md:pb-32">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4 text-center text-3xl font-bold text-white sm:text-5xl md:text-7xl"
        >
          Discover the {vehicleName}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 text-center text-base text-white/90 sm:text-lg md:mb-12 md:text-xl"
        >
          Exhilaration engineered for every journey
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row"
        >
          <Button
            size="lg"
            onClick={onReserve}
            className="w-full bg-[#EB0A1E] px-12 py-6 text-lg font-semibold text-white hover:bg-[#d0091a] sm:w-auto"
          >
            Reserve Now
          </Button>
          <Button
            size="lg"
            onClick={onTestDrive}
            variant="outline"
            className="w-full border-2 border-white bg-transparent px-12 py-6 text-lg font-semibold text-white hover:bg-white/10 sm:w-auto"
          >
            Book Test Drive
          </Button>
          <Button
            size="lg"
            onClick={onConfigure}
            variant="outline"
            className="w-full border-2 border-zinc-400 bg-transparent px-12 py-6 text-lg font-semibold text-zinc-300 hover:bg-zinc-800/50 sm:w-auto"
          >
            Configure
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

// ==================== JOURNEY CARDS ====================
const JourneyCards: React.FC<{ openModal: (modal: ModalType) => void }> = ({ openModal }) => {
  const cards = [
    {
      id: 'interior' as ModalType,
      title: 'Interior',
      description: 'Discover the refined and spacious cabin',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
    },
    {
      id: 'exterior' as ModalType,
      title: 'Exterior',
      description: 'Explore the bold and dynamic design',
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80',
    },
    {
      id: 'performance' as ModalType,
      title: 'Performance',
      description: 'Experience the impressive power and handling',
      image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80',
    },
    {
      id: 'safety' as ModalType,
      title: 'Safety',
      description: 'Learn about the advanced safety features',
      image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80',
    },
    {
      id: 'technology' as ModalType,
      title: 'Technology',
      description: 'Experience our advanced technology features',
      image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 bg-black p-4 sm:grid-cols-2 lg:grid-cols-5 lg:p-12">
      {cards.map((card, index) => (
        <motion.button
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          onClick={() => openModal(card.id)}
          className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 text-left transition-all hover:border-zinc-700 hover:bg-zinc-900"
        >
          <div className="mb-4 h-40 sm:h-48 overflow-hidden rounded-xl">
            <img
              src={card.image}
              alt={card.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <h3 className="mb-2 text-xl font-bold text-white sm:text-2xl">{card.title}</h3>
          <p className="mb-4 text-sm text-zinc-400 sm:text-base">{card.description}</p>
          <div className="flex items-center text-zinc-300">
            <span className="text-sm font-semibold">Learn More</span>
            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </motion.button>
      ))}
    </div>
  );
};
// ==================== INTERIOR MODAL ====================
const InteriorModal: React.FC<{ onClose: () => void; onReserve?: () => void; onTestDrive?: () => void }> = ({ 
  onClose, 
  onReserve, 
  onTestDrive 
}) => {
  const [currentStep, setCurrentStep] = useState<InteriorStep>(0);

  const steps = [
    {
      title: 'Interior Design',
      description: 'Premium materials, ambient lighting, and a driver-focused layout.',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&q=80'
    },
    {
      title: 'Dashboard',
      description: 'State-of-the-art digital cluster with customizable themes.',
      image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&q=80'
    },
    {
      title: 'Infotainment',
      description: '12.3" touchscreen, wireless CarPlay, premium JBL audio.',
      image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&q=80'
    },
    {
      title: 'Comfort',
      description: 'Ventilated leather seats, spacious rear, dual-zone climate.',
      image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200&q=80'
    },
  ];

  const swipeHandlers = useSwipeable({
    onSwipeLeft: () => currentStep < 3 && setCurrentStep((prev) => (prev + 1) as InteriorStep),
    onSwipeRight: () => currentStep > 0 && setCurrentStep((prev) => (prev - 1) as InteriorStep),
    threshold: 50,
  });

  return (
    <ModalWrapper onClose={onClose}>
      <div {...swipeHandlers} className="flex h-full flex-col">
        <ModalHeader title="INTERIOR" onClose={onClose} />
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-8 md:px-12">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-5xl"
          >
            <img src={steps[currentStep].image} alt={steps[currentStep].title} className="mb-6 w-full rounded-2xl" />
            <div className="mb-6 flex justify-center gap-3">
              {[0,1,2,3].map((step) => (
                <button
                  key={step}
                  onClick={() => setCurrentStep(step as InteriorStep)}
                  className={`h-3 w-10 rounded-full transition-all ${currentStep === step ? 'bg-[#EB0A1E]' : 'bg-zinc-600 hover:bg-zinc-400'}`}
                />
              ))}
            </div>
            <h2 className="mb-2 text-2xl font-bold text-white sm:text-3xl">{steps[currentStep].title}</h2>
            <p className="mb-6 text-base text-zinc-300 sm:text-lg">{steps[currentStep].description}</p>
            <Button
              onClick={() => currentStep < 3 ? setCurrentStep((prev) => (prev + 1) as InteriorStep) : onClose()}
              className="w-full border-2 border-white bg-transparent py-4 text-lg font-semibold text-white hover:bg-white/10 sm:w-auto sm:px-8"
            >
              {currentStep < 3 ? 'Next' : 'Finish'}
            </Button>
          </motion.div>
        </div>
        <ModalFooter onReserve={onReserve} onTestDrive={onTestDrive} />
      </div>
    </ModalWrapper>
  );
};

// ==================== EXTERIOR MODAL ====================
const ExteriorModal: React.FC<{ onClose: () => void; onReserve?: () => void; onTestDrive?: () => void }> = ({ 
  onClose, 
  onReserve, 
  onTestDrive 
}) => {
  const [selectedColor, setSelectedColor] = useState<ExteriorColor>('white');

  const colors = [
    { id: 'white', name: 'Pearl White', class: 'bg-zinc-100' },
    { id: 'black', name: 'Midnight Black', class: 'bg-zinc-900 border-zinc-600' },
    { id: 'red', name: 'Supersonic Red', class: 'bg-[#EB0A1E]' },
  ];

  const features = [
    { title: 'Stylish Design', image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&q=80' },
    { title: 'LED Lighting', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80' },
    { title: 'Roof Rails', image: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=600&q=80' },
  ];

  return (
    <ModalWrapper onClose={onClose}>
      <div className="flex h-full flex-col">
        <ModalHeader title="EXTERIOR" onClose={onClose} />
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-8 md:px-12">
          <motion.img
            key={selectedColor}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1400&q=80"
            alt="Exterior"
            className="mb-6 w-full rounded-2xl"
          />
          {/* Color Selector */}
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {colors.map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color.id as ExteriorColor)}
                className={`flex items-center gap-2 rounded-full border-2 px-4 py-2 ${selectedColor === color.id ? 'border-white bg-white/10' : 'border-zinc-700 hover:border-zinc-500'}`}
              >
                <div className={`h-5 w-5 rounded-full border ${color.class}`} />
                <span className="text-white">{color.name}</span>
              </button>
            ))}
          </div>
          {/* Features */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
                <img src={f.image} alt={f.title} className="h-40 w-full object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white">{f.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
        <ModalFooter onReserve={onReserve} onTestDrive={onTestDrive} />
      </div>
    </ModalWrapper>
  );
};

// ==================== PERFORMANCE MODAL ====================
const PerformanceModal: React.FC<{ onClose: () => void; onReserve?: () => void; onTestDrive?: () => void }> = ({ 
  onClose, 
  onReserve, 
  onTestDrive 
}) => {
  const [driveMode, setDriveMode] = useState<DriveMode>('sport');

  const stats = {
    eco: { hp: 200, torque: 240, acceleration: 8.5, topSpeed: 200 },
    normal: { hp: 225, torque: 265, acceleration: 7.2, topSpeed: 220 },
    sport: { hp: 300, torque: 300, acceleration: 6.5, topSpeed: 260 },
  };
  const current = stats[driveMode];

  return (
    <ModalWrapper onClose={onClose}>
      <div className="flex h-full flex-col">
        <ModalHeader title="PERFORMANCE" onClose={onClose} />
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-8 md:px-12">
          <p className="mb-6 text-center text-lg text-zinc-400">Exhilaration engineered for every journey</p>
          <div className="mb-6 flex flex-wrap justify-center gap-4">
            {(['eco','normal','sport'] as DriveMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setDriveMode(m)}
                className={`px-6 py-2 text-lg font-bold uppercase ${driveMode === m ? 'text-[#EB0A1E]' : 'text-zinc-600 hover:text-zinc-400'}`}
              >
                {m}
              </button>
            ))}
          </div>
          <motion.img key={driveMode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} src="https://images.unsplash.com/photo-1617654112368-307921291f42?w=1400&q=80" alt="Performance" className="mb-6 w-full rounded-2xl" />
          {/* Stats */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex justify-around">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{current.hp}</div>
                <div className="text-sm text-zinc-400">HP</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{current.torque}</div>
                <div className="text-sm text-zinc-400">Nm</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{current.acceleration}</div>
                <div className="text-sm text-zinc-400">Sec</div>
              </div>
            </div>
            {/* Speedometer */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <svg width="200" height="200" viewBox="0 0 280 280">
                  <circle cx="140" cy="140" r="110" fill="none" stroke="#27272a" strokeWidth="2" />
                  <motion.line
                    x1="140"
                    y1="140"
                    x2="140"
                    y2="50"
                    stroke="#EB0A1E"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ rotate: -135 }}
                    animate={{ rotate: (current.topSpeed/280)*270 -135 }}
                    style={{ transformOrigin: '140px 140px' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-white">{current.topSpeed}</div>
                  <div className="text-sm text-zinc-400">KM/H</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ModalFooter onReserve={onReserve} onTestDrive={onTestDrive} />
      </div>
    </ModalWrapper>
  );
};
// ==================== SAFETY MODAL ====================
const SafetyModal: React.FC<{ onClose: () => void; onReserve?: () => void; onTestDrive?: () => void }> = ({ 
  onClose, 
  onReserve, 
  onTestDrive 
}) => {
  const features = [
    { title: 'Pre-Collision System', description: 'Radar + camera detect potential collisions and apply brakes automatically.', icon: '🛡️' },
    { title: 'Blind Spot Monitor', description: 'Alerts you to vehicles in blind spots with visual + audible cues.', icon: '👁️' },
    { title: 'Lane Departure Alert', description: 'Keeps you centered with warnings when drifting lanes.', icon: '🛣️' },
    { title: 'Adaptive Cruise Control', description: 'Maintains distance and adjusts speed automatically.', icon: '🎯' },
  ];

  return (
    <ModalWrapper onClose={onClose}>
      <div className="flex h-full flex-col">
        <ModalHeader title="SAFETY" onClose={onClose} />
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-8 md:px-12">
          <h2 className="mb-6 text-center text-lg text-zinc-400 sm:text-xl">Advanced Toyota Safety Sense Features</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6"
              >
                <div className="mb-2 text-4xl">{f.icon}</div>
                <h3 className="mb-2 text-lg font-bold text-white">{f.title}</h3>
                <p className="text-sm text-zinc-400">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <ModalFooter onReserve={onReserve} onTestDrive={onTestDrive} />
      </div>
    </ModalWrapper>
  );
};

// ==================== TECHNOLOGY MODAL ====================
const TechnologyModal: React.FC<{ onClose: () => void; onReserve?: () => void; onTestDrive?: () => void }> = ({ 
  onClose, 
  onReserve, 
  onTestDrive 
}) => {
  const features = [
    { title: '12.3" Digital Cluster', description: 'Customizable high-resolution instrument display', image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80' },
    { title: 'Wireless CarPlay', description: 'Seamless smartphone integration with no cables', image: 'https://images.unsplash.com/photo-1517059224940-d4af9eec41e5?w=800&q=80' },
    { title: 'AI Navigation', description: 'Smart traffic-aware routing with 3D maps', image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80' },
    { title: 'Connected Services', description: 'Remote start, lock/unlock, and service reminders', image: 'https://images.unsplash.com/photo-1581093588401-22f82f2f09c2?w=800&q=80' },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <ModalWrapper onClose={onClose}>
      <div className="flex h-full flex-col bg-black">
        <ModalHeader title="TECHNOLOGY" onClose={onClose} />
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-8 md:flex-row md:gap-12 md:px-12">
          {/* Left: Device / Image */}
          <div className="w-full max-w-md mb-6 md:mb-0">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6 }}
              className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900"
            >
              <img src={features[activeIndex].image} alt={features[activeIndex].title} className="w-full object-cover" />
            </motion.div>
          </div>

          {/* Right: Feature Content */}
          <div className="flex w-full max-w-xl flex-col items-start">
            <h2 className="mb-4 text-2xl font-bold text-white sm:text-4xl">{features[activeIndex].title}</h2>
            <p className="mb-6 text-base text-zinc-300 sm:text-lg">{features[activeIndex].description}</p>

            {/* Carousel Controls */}
            <div className="mb-6 flex gap-2">
              {features.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-2 w-8 rounded-full transition-all ${activeIndex === i ? 'bg-[#EB0A1E]' : 'bg-zinc-600 hover:bg-zinc-400'}`}
                />
              ))}
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row">
              <Button className="w-full bg-[#EB0A1E] py-4 font-semibold text-white hover:bg-[#d0091a] sm:w-auto sm:px-12">Learn More</Button>
              <Button onClick={onReserve} className="w-full border-2 border-white bg-transparent py-4 font-semibold text-white hover:bg-white/10 sm:w-auto sm:px-12">Reserve Now</Button>
            </div>
          </div>
        </div>
        <ModalFooter onReserve={onReserve} onTestDrive={onTestDrive} />
      </div>
    </ModalWrapper>
  );
};

// ==================== REUSABLE COMPONENTS ====================
const ModalWrapper: React.FC<{ children: React.ReactNode; onClose: () => void }> = ({ children, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/95"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="min-h-screen">
        {children}
      </motion.div>
    </motion.div>
  );
};

const ModalHeader: React.FC<{ title: string; onClose: () => void }> = ({ title, onClose }) => {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-4 sm:px-6 md:px-12">
      <div className="flex items-center gap-2 sm:gap-4">
        <svg width="32" height="24" viewBox="0 0 40 32" fill="white">
          <ellipse cx="20" cy="16" rx="18" ry="10" fill="none" stroke="white" strokeWidth="2" />
          <ellipse cx="20" cy="16" rx="11" ry="7" fill="none" stroke="white" strokeWidth="2" />
          <ellipse cx="20" cy="16" rx="4" ry="10" fill="none" stroke="white" strokeWidth="2" />
        </svg>
        <span className="text-base font-bold text-white sm:text-xl">TOYOTA</span>
      </div>
      <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold text-white sm:text-2xl md:text-3xl">{title}</h1>
      <button onClick={onClose} className="rounded-full bg-zinc-900 p-2 hover:bg-zinc-800 sm:p-3">
        <X className="h-5 w-5 text-white sm:h-6 sm:w-6" />
      </button>
    </div>
  );
};

const ModalFooter: React.FC<{ onReserve?: () => void; onTestDrive?: () => void }> = ({ onReserve, onTestDrive }) => {
  return (
    <div className="flex flex-col gap-3 border-t border-zinc-800 px-4 py-6 sm:flex-row sm:justify-center sm:px-6 md:px-12">
      <Button
        size="lg"
        onClick={onTestDrive}
        variant="outline"
        className="w-full border-2 border-white bg-transparent py-4 font-semibold text-white hover:bg-white/10 sm:w-auto sm:px-10"
      >
        Book Test Drive
      </Button>
      <Button
        size="lg"
        onClick={onReserve}
        className="w-full bg-[#EB0A1E] py-4 font-semibold text-white hover:bg-[#d0091a] sm:w-auto sm:px-10"
      >
        Reserve Now
      </Button>
    </div>
  );
};

// ==================== EXPORT ====================
export default SeamlessCinematicShowroom;
