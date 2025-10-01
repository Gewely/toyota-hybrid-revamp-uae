import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play, Gauge, Navigation, Wind, Mountain, Building, Palmtree } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSwipeable } from '@/hooks/use-swipeable';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { cn } from '@/lib/utils';

type SceneType = 'hero' | 'performance' | 'design' | 'interior' | 'safety' | 'lifestyle';

interface SeamlessCinematicShowroomProps {
  vehicleName: string;
  onReserve: () => void;
  onTestDrive: () => void;
  onConfigure: () => void;
}

const SCENES: SceneType[] = ['hero', 'performance', 'design', 'interior', 'safety', 'lifestyle'];

type DriveMode = 'eco' | 'sport' | 'sand';
type LifestyleMode = 'desert' | 'city' | 'weekend';

export default function SeamlessCinematicShowroom({
  vehicleName,
  onReserve,
  onTestDrive,
  onConfigure,
}: SeamlessCinematicShowroomProps) {
  const [currentScene, setCurrentScene] = useState<SceneType>('hero');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [driveMode, setDriveMode] = useState<DriveMode>('eco');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [lifestyleMode, setLifestyleMode] = useState<LifestyleMode>('desert');
  const prefersReducedMotion = useReducedMotionSafe();

  const currentIndex = SCENES.indexOf(currentScene);

  const nextScene = () => {
    if (currentIndex < SCENES.length - 1) {
      setCurrentScene(SCENES[currentIndex + 1]);
    }
  };

  const prevScene = () => {
    if (currentIndex > 0) {
      setCurrentScene(SCENES[currentIndex - 1]);
    }
  };

  const swipeRef = useSwipeable({
    onSwipeLeft: nextScene,
    onSwipeRight: prevScene,
  });

  const openModal = (content: React.ReactNode) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setModalContent(null), 300);
  };

  // Performance Gauge Animation
  const gaugeValue = driveMode === 'eco' ? 30 : driveMode === 'sport' ? 85 : 60;
  const gaugeRotation = useTransform(useMotionValue(gaugeValue), [0, 100], [-135, 135]);

  return (
    <div ref={swipeRef} className="relative w-full h-screen overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        {/* Scene: Hero / Cinematic Intro */}
        {currentScene === 'hero' && (
          <motion.section
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('https://media.cdntoyota.co.za/toyotacms23/attachments/clpslz0vh04i6zbak5vbxi2gx-lc-300-design-hero-1920x1080.desktop.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="text-center text-white space-y-8 px-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="text-6xl md:text-8xl font-bold tracking-wider"
              >
                {vehicleName}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="text-3xl md:text-5xl font-light tracking-widest"
              >
                409 HP / 650 Nm
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <Button
                  onClick={() =>
                    openModal(
                      <HeroModal
                        vehicleName={vehicleName}
                        onClose={closeModal}
                      />
                    )
                  }
                  className="text-lg px-8 py-6 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white"
                >
                  Explore Design →
                </Button>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Scene: Performance Gauges */}
        {currentScene === 'performance' && (
          <motion.section
            key="performance"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('https://media.cdntoyota.co.za/toyotacms23/attachments/clp5594z201l0okak4xj2z22v-lc-300-power-hero-1920x1080.desktop.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="text-center space-y-12 px-4">
              <motion.div
                className="relative w-64 h-64 mx-auto"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="12"
                  />
                  <motion.circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="white"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${(gaugeValue / 100) * 502} 502`}
                    initial={{ strokeDasharray: '0 502' }}
                    animate={{ strokeDasharray: `${(gaugeValue / 100) * 502} 502` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <Gauge className="w-12 h-12 mb-2" />
                  <p className="text-4xl font-bold">409</p>
                  <p className="text-sm uppercase tracking-wider">HP</p>
                </div>
              </motion.div>

              <div className="flex gap-4 justify-center">
                {(['eco', 'sport', 'sand'] as DriveMode[]).map((mode) => (
                  <Button
                    key={mode}
                    onClick={() => setDriveMode(mode)}
                    className={cn(
                      'px-6 py-3 capitalize backdrop-blur-md transition-all',
                      driveMode === mode
                        ? 'bg-white text-black'
                        : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                    )}
                  >
                    {mode}
                  </Button>
                ))}
              </div>

              <Button
                onClick={() =>
                  openModal(
                    <PerformanceModal
                      driveMode={driveMode}
                      onClose={closeModal}
                    />
                  )
                }
                className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-8 py-4"
              >
                View Full Specs
              </Button>
            </div>
          </motion.section>
        )}

        {/* Scene: Interactive Design Slider */}
        {currentScene === 'design' && (
          <motion.section
            key="design"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center bg-black"
          >
            <div className="relative w-full h-full">
              <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-1080w.jpg')`,
                  }}
                />
              </div>
              <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}>
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-001-2160.jpg')`,
                  }}
                />
              </div>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="absolute h-full w-1 bg-white shadow-lg pointer-events-auto cursor-ew-resize"
                  style={{ left: `${sliderPosition}%` }}
                  onMouseDown={(e) => {
                    const handleMove = (moveEvent: MouseEvent) => {
                      const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                      if (rect) {
                        const newPosition = ((moveEvent.clientX - rect.left) / rect.width) * 100;
                        setSliderPosition(Math.max(0, Math.min(100, newPosition)));
                      }
                    };
                    const handleUp = () => {
                      document.removeEventListener('mousemove', handleMove);
                      document.removeEventListener('mouseup', handleUp);
                    };
                    document.addEventListener('mousemove', handleMove);
                    document.addEventListener('mouseup', handleUp);
                  }}
                  onTouchMove={(e) => {
                    const touch = e.touches[0];
                    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                    if (rect) {
                      const newPosition = ((touch.clientX - rect.left) / rect.width) * 100;
                      setSliderPosition(Math.max(0, Math.min(100, newPosition)));
                    }
                  }}
                >
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
                    <ChevronLeft className="w-5 h-5 absolute left-1" />
                    <ChevronRight className="w-5 h-5 absolute right-1" />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 pointer-events-auto">
                <Button
                  onClick={() =>
                    openModal(
                      <DesignModal onClose={closeModal} />
                    )
                  }
                  className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-8 py-4"
                >
                  Explore Design Details
                </Button>
              </div>
            </div>
          </motion.section>
        )}

        {/* Scene: Interior Showcase */}
        {currentScene === 'interior' && (
          <motion.section
            key="interior"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('https://media.cdntoyota.co.za/toyotacms23/attachments/clpgsz9zr06due4akk95h6lhl-lc-300-tech-side-by-side-02-682x460.desktop.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Hotspot: Steering */}
              <motion.button
                className="absolute top-1/3 left-1/4 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full border-2 border-white flex items-center justify-center text-white hover:scale-110 transition-transform"
                whileHover={{ scale: 1.2 }}
                animate={{ scale: activeHotspot === 'steering' ? 1.2 : 1 }}
                onClick={() =>
                  openModal(
                    <InteriorModal
                      feature="Steering"
                      description="Leather-wrapped multi-function steering wheel with intuitive controls"
                      onClose={closeModal}
                    />
                  )
                }
              >
                <Navigation className="w-6 h-6" />
              </motion.button>

              {/* Hotspot: Infotainment */}
              <motion.button
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full border-2 border-white flex items-center justify-center text-white hover:scale-110 transition-transform"
                whileHover={{ scale: 1.2 }}
                animate={{ scale: activeHotspot === 'infotainment' ? 1.2 : 1 }}
                onClick={() =>
                  openModal(
                    <InteriorModal
                      feature="Infotainment"
                      description="12.3-inch touchscreen with advanced connectivity and navigation"
                      onClose={closeModal}
                    />
                  )
                }
              >
                <Play className="w-6 h-6" />
              </motion.button>

              {/* Hotspot: Seats */}
              <motion.button
                className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full border-2 border-white flex items-center justify-center text-white hover:scale-110 transition-transform"
                whileHover={{ scale: 1.2 }}
                animate={{ scale: activeHotspot === 'seats' ? 1.2 : 1 }}
                onClick={() =>
                  openModal(
                    <InteriorModal
                      feature="Seats"
                      description="Premium leather seats with heating, cooling, and memory functions"
                      onClose={closeModal}
                    />
                  )
                }
              >
                <Wind className="w-6 h-6" />
              </motion.button>

              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
                <p className="text-white text-xl font-light tracking-wider">Tap hotspots to explore</p>
              </div>
            </div>
          </motion.section>
        )}

        {/* Scene: Safety / Tech Highlights */}
        {currentScene === 'safety' && (
          <motion.section
            key="safety"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 grid md:grid-cols-2 items-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('https://media.cdntoyota.co.za/toyotacms23/attachments/clsojuxxrb5bwcyak1ignyxsb-lc-300-safety-hero-1920x1080-desktop-with-disclaimer.desktop.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="p-12 text-white space-y-6">
              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl font-bold"
              >
                Safety First
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl font-light leading-relaxed"
              >
                Advanced Toyota Safety Sense with Pre-Collision System, Lane Departure Alert, and Adaptive Cruise Control.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  onClick={() =>
                    openModal(
                      <SafetyModal onClose={closeModal} />
                    )
                  }
                  className="bg-white text-black hover:bg-white/90 px-8 py-4"
                >
                  Explore Safety Features
                </Button>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Scene: Lifestyle Cinematic */}
        {currentScene === 'lifestyle' && (
          <motion.section
            key="lifestyle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('https://media.cdntoyota.co.za/toyotacms23/attachments/clpgtbm92002gg6aktgguhnjg-lc-300-tech-side-by-side-01-682x460.desktop.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="text-center space-y-12 px-4">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-bold text-white"
              >
                {lifestyleMode === 'desert' && 'Desert Escape'}
                {lifestyleMode === 'city' && 'Urban Explorer'}
                {lifestyleMode === 'weekend' && 'Weekend Adventure'}
              </motion.h2>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => setLifestyleMode('desert')}
                  className={cn(
                    'backdrop-blur-md transition-all',
                    lifestyleMode === 'desert'
                      ? 'bg-white text-black'
                      : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                  )}
                >
                  <Mountain className="w-5 h-5 mr-2" />
                  Desert
                </Button>
                <Button
                  onClick={() => setLifestyleMode('city')}
                  className={cn(
                    'backdrop-blur-md transition-all',
                    lifestyleMode === 'city'
                      ? 'bg-white text-black'
                      : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                  )}
                >
                  <Building className="w-5 h-5 mr-2" />
                  City
                </Button>
                <Button
                  onClick={() => setLifestyleMode('weekend')}
                  className={cn(
                    'backdrop-blur-md transition-all',
                    lifestyleMode === 'weekend'
                      ? 'bg-white text-black'
                      : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                  )}
                >
                  <Palmtree className="w-5 h-5 mr-2" />
                  Weekend
                </Button>
              </div>

              <Button
                onClick={() =>
                  openModal(
                    <LifestyleModal mode={lifestyleMode} onClose={closeModal} />
                  )
                }
                className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-8 py-4"
              >
                Explore Lifestyle Gallery
              </Button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Scene Navigation Dots */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {SCENES.map((scene, index) => (
          <button
            key={scene}
            onClick={() => setCurrentScene(scene)}
            className={cn(
              'w-3 h-3 rounded-full transition-all',
              currentScene === scene ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/60'
            )}
            aria-label={`Go to ${scene} scene`}
          />
        ))}
      </div>

      {/* Floating CTA Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-0 left-0 right-0 h-20 bg-black/40 backdrop-blur-xl border-t border-white/10 flex items-center justify-center gap-4 px-4 z-20"
      >
        <Button onClick={onReserve} className="bg-white text-black hover:bg-white/90 px-8">
          Reserve
        </Button>
        <Button onClick={onTestDrive} className="bg-white/10 border border-white/20 text-white hover:bg-white/20 px-8">
          Test Drive
        </Button>
        <Button onClick={onConfigure} className="bg-white/10 border border-white/20 text-white hover:bg-white/20 px-8">
          Configure
        </Button>
      </motion.div>

      {/* Modal System */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-4xl w-full max-h-[90vh] overflow-auto bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              {modalContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Modal Components
function HeroModal({ vehicleName, onClose }: { vehicleName: string; onClose: () => void }) {
  return (
    <div className="p-8 text-white space-y-6">
      <img
        src="https://media.cdntoyota.co.za/toyotacms23/attachments/clpslz0vh04i6zbak5vbxi2gx-lc-300-design-hero-1920x1080.desktop.jpg"
        alt={vehicleName}
        className="w-full rounded-lg"
      />
      <h2 className="text-4xl font-bold">{vehicleName} Design</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Engine Power</h3>
          <p className="text-zinc-400">3.5L V6 Twin-Turbo delivering 409 HP and 650 Nm of torque</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Performance</h3>
          <p className="text-zinc-400">0-100 km/h in 6.7 seconds with exceptional off-road capability</p>
        </div>
      </div>
    </div>
  );
}

function PerformanceModal({ driveMode, onClose }: { driveMode: DriveMode; onClose: () => void }) {
  const specs = {
    eco: { hp: 409, torque: 650, efficiency: '95%', mode: 'Maximum Efficiency' },
    sport: { hp: 409, torque: 650, efficiency: '100%', mode: 'Maximum Performance' },
    sand: { hp: 409, torque: 650, efficiency: '85%', mode: 'Off-Road Optimized' },
  };

  const current = specs[driveMode];

  return (
    <div className="p-8 text-white space-y-8">
      <h2 className="text-4xl font-bold capitalize">{driveMode} Mode Specifications</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {Object.entries(current).map(([key, value]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 text-center"
          >
            <p className="text-zinc-400 uppercase text-sm mb-2">{key}</p>
            <p className="text-3xl font-bold">{value}</p>
          </motion.div>
        ))}
      </div>
      <p className="text-zinc-400 leading-relaxed">
        The {driveMode} drive mode optimizes power delivery, throttle response, and transmission behavior for the perfect balance of performance and efficiency.
      </p>
    </div>
  );
}

function DesignModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-8 text-white space-y-6">
      <h2 className="text-4xl font-bold">Exterior Design Evolution</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <img
            src="https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-1080w.jpg"
            alt="Design 1"
            className="w-full rounded-lg"
          />
          <h3 className="text-xl font-semibold">Bold Front Fascia</h3>
          <p className="text-zinc-400">Aggressive styling with signature LED headlights</p>
        </div>
        <div className="space-y-4">
          <img
            src="https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-001-2160.jpg"
            alt="Design 2"
            className="w-full rounded-lg"
          />
          <h3 className="text-xl font-semibold">Athletic Profile</h3>
          <p className="text-zinc-400">Sculpted body lines and muscular proportions</p>
        </div>
      </div>
    </div>
  );
}

function InteriorModal({ feature, description, onClose }: { feature: string; description: string; onClose: () => void }) {
  return (
    <div className="p-8 text-white space-y-6">
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src="https://media.cdntoyota.co.za/toyotacms23/attachments/clpgsz9zr06due4akk95h6lhl-lc-300-tech-side-by-side-02-682x460.desktop.jpg"
          alt={feature}
          className="w-full rounded-lg mb-6"
        />
      </motion.div>
      <h2 className="text-4xl font-bold">{feature}</h2>
      <p className="text-xl text-zinc-300 leading-relaxed">{description}</p>
      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="bg-white/5 p-4 rounded-lg">
          <p className="text-zinc-400 text-sm">Material</p>
          <p className="text-lg font-semibold">Premium Leather</p>
        </div>
        <div className="bg-white/5 p-4 rounded-lg">
          <p className="text-zinc-400 text-sm">Technology</p>
          <p className="text-lg font-semibold">Smart Integration</p>
        </div>
      </div>
    </div>
  );
}

function SafetyModal({ onClose }: { onClose: () => void }) {
  const features = [
    { title: 'Pre-Collision System', desc: 'Detects pedestrians and vehicles ahead' },
    { title: 'Lane Departure Alert', desc: 'Warns when drifting from lane' },
    { title: 'Adaptive Cruise Control', desc: 'Maintains safe distance automatically' },
    { title: 'Blind Spot Monitor', desc: 'Alerts to vehicles in blind spots' },
  ];

  return (
    <div className="p-8 text-white space-y-8">
      <h2 className="text-4xl font-bold">Toyota Safety Sense</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-zinc-400">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function LifestyleModal({ mode, onClose }: { mode: LifestyleMode; onClose: () => void }) {
  return (
    <div className="p-8 text-white space-y-6">
      <h2 className="text-4xl font-bold capitalize">{mode} Lifestyle</h2>
      <img
        src="https://media.cdntoyota.co.za/toyotacms23/attachments/clpgtbm92002gg6aktgguhnjg-lc-300-tech-side-by-side-01-682x460.desktop.jpg"
        alt={mode}
        className="w-full rounded-lg"
      />
      <p className="text-xl text-zinc-300 leading-relaxed">
        {mode === 'desert' && 'Conquer sand dunes and desert trails with unmatched capability and comfort.'}
        {mode === 'city' && 'Navigate urban environments with refined luxury and advanced technology.'}
        {mode === 'weekend' && 'Escape to nature with family and friends in ultimate comfort and style.'}
      </p>
    </div>
  );
}
