import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSwipeable } from '@/hooks/use-swipeable';

interface ShowroomProps {
  vehicleImages: string[];
  vehicleName: string;
  onReserve?: () => void;
  onTestDrive?: () => void;
  onConfigure?: () => void;
}

// ==================== MODAL TYPES ====================
type ModalType = 'interior' | 'exterior' | 'performance' | 'safety' | 'technology' | null;
type DriveMode = 'eco' | 'normal' | 'sport';
type InteriorStep = 0 | 1 | 2 | 3;
type ExteriorColor = 'white' | 'black' | 'red';

// ==================== MAIN COMPONENT ====================
export const SeamlessCinematicShowroom: React.FC<ShowroomProps> = ({ 
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
      {/* ==================== HERO SECTION ==================== */}
      <HeroSection 
        vehicleImages={vehicleImages} 
        vehicleName={vehicleName}
        onReserve={onReserve}
        onTestDrive={onTestDrive}
        onConfigure={onConfigure}
      />

      {/* ==================== JOURNEY CARDS ==================== */}
      <JourneyCards openModal={openModal} />

      {/* ==================== MODALS ==================== */}
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
    <div className="relative h-screen w-full overflow-hidden">
      {/* Hero Image */}
      <div className="absolute inset-0">
        <img
          src={vehicleImages[0] || 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1920&q=80'}
          alt={vehicleName}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-24 md:pb-32">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4 text-center text-5xl font-bold text-white md:text-7xl"
        >
          Discover the {vehicleName}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12 text-center text-lg text-white/90 md:text-xl"
        >
          Exhilaration engineered for every journey
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <Button
            size="lg"
            onClick={onReserve}
            className="bg-[#EB0A1E] px-12 py-6 text-lg font-semibold text-white hover:bg-[#d0091a]"
          >
            Reserve Now
          </Button>
          <Button
            size="lg"
            onClick={onTestDrive}
            variant="outline"
            className="border-2 border-white bg-transparent px-12 py-6 text-lg font-semibold text-white hover:bg-white/10"
          >
            Book Test Drive
          </Button>
          <Button
            size="lg"
            onClick={onConfigure}
            variant="outline"
            className="border-2 border-zinc-400 bg-transparent px-12 py-6 text-lg font-semibold text-zinc-300 hover:bg-zinc-800/50"
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
    <div className="grid grid-cols-1 gap-6 bg-black p-6 md:grid-cols-2 lg:grid-cols-4 lg:p-12">
      {cards.map((card, index) => (
        <motion.button
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          onClick={() => openModal(card.id)}
          className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-left transition-all hover:border-zinc-700 hover:bg-zinc-900"
        >
          <div className="mb-4 h-48 overflow-hidden rounded-xl">
            <img
              src={card.image}
              alt={card.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <h3 className="mb-2 text-2xl font-bold text-white">{card.title}</h3>
          <p className="mb-4 text-zinc-400">{card.description}</p>
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
      description: 'Explore the refined and spacious design of interior. Enjoy premium materials, advanced technology, and intuitive controls.',
    },
    {
      title: 'Dashboard',
      description: 'State-of-the-art digital instrument cluster with customizable displays and real-time vehicle information.',
    },
    {
      title: 'Infotainment',
      description: '12.3" touchscreen with wireless connectivity, premium audio system, and seamless smartphone integration.',
    },
    {
      title: 'Comfort',
      description: 'Premium leather seats with heating and ventilation, ambient lighting, and spacious cargo area.',
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
        {/* Header */}
        <ModalHeader title="INTERIOR" onClose={onClose} />

        {/* Content */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 md:px-12">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-5xl"
          >
            <img
              src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&q=80"
              alt="Interior"
              className="mb-8 w-full rounded-2xl"
            />

            {/* Step Indicators */}
            <div className="mb-8 flex justify-center gap-4">
              {[0, 1, 2, 3].map((step) => (
                <button
                  key={step}
                  onClick={() => setCurrentStep(step as InteriorStep)}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
                    currentStep === step
                      ? 'border-white bg-white text-black'
                      : 'border-zinc-600 text-zinc-400 hover:border-zinc-400'
                  }`}
                >
                  {step + 1}
                </button>
              ))}
            </div>

            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              {steps[currentStep].title}
            </h2>
            <p className="mb-8 text-lg text-zinc-300 md:text-xl">
              {steps[currentStep].description}
            </p>

            <Button
              onClick={() => currentStep < 3 ? setCurrentStep((prev) => (prev + 1) as InteriorStep) : onClose()}
              className="border-2 border-white bg-transparent px-8 py-6 text-lg font-semibold text-white hover:bg-white/10"
            >
              {currentStep < 3 ? 'Next' : 'Finish'}
            </Button>
          </motion.div>
        </div>

        {/* Footer CTAs */}
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

  const colors: { id: ExteriorColor; name: string; class: string }[] = [
    { id: 'white', name: 'Pearl White', class: 'bg-zinc-100' },
    { id: 'black', name: 'Midnight Black', class: 'bg-zinc-900 border-zinc-600' },
    { id: 'red', name: 'Supersonic Red', class: 'bg-[#EB0A1E]' },
  ];

  const features = [
    { title: 'Stylish Design', image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&q=80' },
    { title: 'Advanced Lighting', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80' },
    { title: 'Versatile Roof Rails', image: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=600&q=80' },
  ];

  return (
    <ModalWrapper onClose={onClose}>
      <div className="flex h-full flex-col">
        <ModalHeader title="Exterior" onClose={onClose} />

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 md:px-12">
          <div className="w-full max-w-6xl">
            <h2 className="mb-8 text-2xl font-medium text-zinc-400">
              Explore the captivating exterior features.
            </h2>

            <motion.img
              key={selectedColor}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1400&q=80"
              alt="Exterior"
              className="mb-8 w-full rounded-2xl"
            />

            {/* Color Selector */}
            <div className="mb-12 flex flex-wrap gap-4">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.id)}
                  className={`flex items-center gap-3 rounded-full border-2 px-6 py-3 transition-all ${
                    selectedColor === color.id
                      ? 'border-white bg-white/10'
                      : 'border-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  <div className={`h-8 w-8 rounded-full border-2 ${color.class}`} />
                  <span className="font-semibold text-white">{color.name}</span>
                </button>
              ))}
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50"
                >
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="mb-2 text-lg font-bold text-white">{feature.title}</h3>
                    <ChevronRight className="h-5 w-5 text-zinc-400 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>
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

  const currentStats = stats[driveMode];

  return (
    <ModalWrapper onClose={onClose}>
      <div className="flex h-full flex-col">
        <ModalHeader title="PERFORMANCE UNLEASHED" onClose={onClose} />

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 md:px-12">
          <div className="w-full max-w-6xl">
            <p className="mb-8 text-center text-xl text-zinc-400">
              Exhilaration engineered for every journey
            </p>

            {/* Drive Mode Toggle */}
            <div className="mb-8 flex justify-center gap-6">
              {(['eco', 'normal', 'sport'] as DriveMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setDriveMode(mode)}
                  className={`px-8 py-3 text-xl font-bold uppercase transition-all ${
                    driveMode === mode
                      ? 'text-[#EB0A1E]'
                      : 'text-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <motion.img
              key={driveMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src="https://images.unsplash.com/photo-1617654112368-307921291f42?w=1400&q=80"
              alt="Performance"
              className="mb-12 w-full rounded-2xl"
            />

            {/* Stats Grid */}
            <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Left: Stats */}
              <div>
                <div className="mb-6 flex items-end justify-center gap-8">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-white">{currentStats.hp}</div>
                    <div className="text-sm text-zinc-400">HP</div>
                  </div>
                  <div className="text-center">
                    <div className="text-6xl font-bold text-white">{currentStats.torque}</div>
                    <div className="text-sm text-zinc-400">Nm</div>
                  </div>
                  <div className="text-center">
                    <div className="text-6xl font-bold text-white">{currentStats.acceleration}</div>
                    <div className="text-xs text-zinc-400">SECONDS</div>
                  </div>
                </div>

                {/* Torque Bar */}
                <div className="mb-4">
                  <div className="mb-2 text-sm font-semibold text-zinc-400">TORQUE</div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentStats.torque / 300) * 100}%` }}
                      className="h-full bg-zinc-400"
                    />
                  </div>
                </div>
              </div>

              {/* Right: Speedometer */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  <svg width="280" height="280" viewBox="0 0 280 280">
                    <circle
                      cx="140"
                      cy="140"
                      r="110"
                      fill="none"
                      stroke="#27272a"
                      strokeWidth="2"
                    />
                    {[60, 100, 120, 180, 220, 240, 260, 280].map((speed, i) => (
                      <text
                        key={speed}
                        x={140 + Math.cos((i * 45 - 135) * (Math.PI / 180)) * 85}
                        y={140 + Math.sin((i * 45 - 135) * (Math.PI / 180)) * 85}
                        textAnchor="middle"
                        fill="#71717a"
                        fontSize="14"
                      >
                        {speed}
                      </text>
                    ))}
                    <motion.line
                      x1="140"
                      y1="140"
                      x2="140"
                      y2="50"
                      stroke="#EB0A1E"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ rotate: -135 }}
                      animate={{ rotate: (currentStats.topSpeed / 280) * 270 - 135 }}
                      style={{ transformOrigin: '140px 140px' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-white">{currentStats.topSpeed}</div>
                    <div className="text-sm text-zinc-400">KM/H</div>
                  </div>
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
    {
      title: 'Pre-Collision System',
      description: 'Advanced radar and camera system that detects potential collisions and applies brakes automatically.',
      icon: '🛡️',
    },
    {
      title: 'Blind Spot Monitor',
      description: 'Radar sensors detect vehicles in blind spots and alert you with visual and audible warnings.',
      icon: '👁️',
    },
    {
      title: 'Lane Departure Alert',
      description: 'Monitors lane markings and alerts you if the vehicle begins to drift without signaling.',
      icon: '🛣️',
    },
    {
      title: 'Adaptive Cruise Control',
      description: 'Maintains a preset distance from the vehicle ahead and adjusts speed automatically.',
      icon: '🎯',
    },
  ];

  return (
    <ModalWrapper onClose={onClose}>
      <div className="flex h-full flex-col">
        <ModalHeader title="Safety" onClose={onClose} />

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 md:px-12">
          <div className="w-full max-w-6xl">
            <h2 className="mb-12 text-center text-2xl text-zinc-400">
              Learn about the advanced safety features
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8"
                >
                  <div className="mb-4 text-5xl">{feature.icon}</div>
                  <h3 className="mb-4 text-2xl font-bold text-white">{feature.title}</h3>
                  <p className="text-zinc-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
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
    { title: '12.3" Digital Cluster', description: 'High-resolution customizable display' },
    { title: 'Wireless CarPlay', description: 'Seamless smartphone integration' },
    { title: 'Advanced Navigation', description: 'Real-time traffic and route optimization' },
    { title: 'Connected Services', description: 'Remote control and monitoring' },
  ];

  return (
    <ModalWrapper onClose={onClose}>
      <div className="flex h-full flex-col">
        <ModalHeader title="Technology" onClose={onClose} />

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 md:px-12">
          <div className="w-full max-w-4xl">
            <img
              src="https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&q=80"
              alt="Technology"
              className="mb-8 w-full rounded-2xl"
            />

            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              12.3" Touchscreen and Connected Services
            </h2>
            <p className="mb-8 text-lg text-zinc-300">
              Experience our advanced technology, including a large touchscreen and
              digital instrument cluster.
            </p>

            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6"
                >
                  <h3 className="mb-2 font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-zinc-400">{feature.description}</p>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              className="w-full bg-[#EB0A1E] py-6 text-lg font-semibold text-white hover:bg-[#d0091a] md:w-auto md:px-16"
            >
              LEARN MORE
            </Button>
          </div>
        </div>

        <ModalFooter onReserve={onReserve} onTestDrive={onTestDrive} />
      </div>
    </ModalWrapper>
  );
};

// ==================== REUSABLE COMPONENTS ====================
const ModalWrapper: React.FC<{ children: React.ReactNode; onClose: () => void }> = ({
  children,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

const ModalHeader: React.FC<{ title: string; onClose: () => void }> = ({ title, onClose }) => {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-6 md:px-12">
      <div className="flex items-center gap-4">
        <svg width="40" height="32" viewBox="0 0 40 32" fill="white">
          <ellipse cx="20" cy="16" rx="18" ry="10" fill="none" stroke="white" strokeWidth="2" />
          <ellipse cx="20" cy="16" rx="11" ry="7" fill="none" stroke="white" strokeWidth="2" />
          <ellipse cx="20" cy="16" rx="4" ry="10" fill="none" stroke="white" strokeWidth="2" />
        </svg>
        <span className="text-xl font-bold text-white">TOYOTA</span>
      </div>
      <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-white md:text-4xl">
        {title}
      </h1>
      <button
        onClick={onClose}
        className="rounded-full bg-zinc-900 p-3 transition-colors hover:bg-zinc-800"
        aria-label="Close"
      >
        <X className="h-6 w-6 text-white" />
      </button>
    </div>
  );
};

const ModalFooter: React.FC<{ onReserve?: () => void; onTestDrive?: () => void }> = ({ 
  onReserve, 
  onTestDrive 
}) => {
  return (
    <div className="flex flex-col gap-4 border-t border-zinc-800 px-6 py-8 sm:flex-row sm:justify-center md:px-12">
      <Button
        size="lg"
        onClick={onTestDrive}
        variant="outline"
        className="border-2 border-white bg-transparent px-12 py-6 text-lg font-semibold text-white hover:bg-white/10"
      >
        Book a Test Drive
      </Button>
      <Button
        size="lg"
        onClick={onReserve}
        className="bg-[#EB0A1E] px-12 py-6 text-lg font-semibold text-white hover:bg-[#d0091a]"
      >
        Reserve Now
      </Button>
    </div>
  );
};

export default SeamlessCinematicShowroom;
