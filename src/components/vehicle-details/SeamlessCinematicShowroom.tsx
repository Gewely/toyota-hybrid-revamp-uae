import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, Gauge, Palette, Shield, Car, Heart, Zap, Wind, Lock, Camera, Eye, Compass, Play, Pause, RotateCcw, ZoomIn, Info, Circle } from 'lucide-react';
import { useSwipeable } from '@/hooks/use-swipeable';

interface SeamlessCinematicShowroomProps {
  vehicleName: string;
  onReserve: () => void;
  onTestDrive: () => void;
  onConfigure: () => void;
}

type SceneType = 'hero' | 'performance' | 'design' | 'interior' | 'safety' | 'lifestyle';
type DriveMode = 'eco' | 'normal' | 'sport';
type LifestyleMode = 'city' | 'highway' | 'offroad';

const scenes: SceneType[] = ['hero', 'performance', 'design', 'interior', 'safety', 'lifestyle'];

const SeamlessCinematicShowroom: React.FC<SeamlessCinematicShowroomProps> = ({
  vehicleName,
  onReserve,
  onTestDrive,
  onConfigure,
}) => {
  const [currentScene, setCurrentScene] = useState<SceneType>('hero');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<SceneType | null>(null);
  const [driveMode, setDriveMode] = useState<DriveMode>('normal');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [lifestyleMode, setLifestyleMode] = useState<LifestyleMode>('city');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [is360Playing, setIs360Playing] = useState(false);
  const [rotation360, setRotation360] = useState(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const heroX = useTransform(mouseX, [-1, 1], [-10, 10]);
  const heroY = useTransform(mouseY, [-1, 1], [-10, 10]);

  const nextScene = () => {
    const currentIndex = scenes.indexOf(currentScene);
    if (currentIndex < scenes.length - 1) {
      setCurrentScene(scenes[currentIndex + 1]);
    }
  };

  const prevScene = () => {
    const currentIndex = scenes.indexOf(currentScene);
    if (currentIndex > 0) {
      setCurrentScene(scenes[currentIndex - 1]);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipeLeft: nextScene,
    onSwipeRight: prevScene,
  });

  const openModal = (scene: SceneType) => {
    setModalContent(scene);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setModalContent(null), 300);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (is360Playing) {
      interval = setInterval(() => {
        setRotation360(prev => (prev + 2) % 360);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [is360Playing]);

  const sceneVariants = {
    enter: {
      opacity: 0,
      scale: 0.98,
      y: 20,
    },
    center: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }
    },
    exit: {
      opacity: 0,
      scale: 1.02,
      y: -20,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }
    },
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-[hsl(var(--neutral-950))]" 
      {...swipeHandlers}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left - rect.width / 2) / 50);
        mouseY.set((e.clientY - rect.top - rect.height / 2) / 50);
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          variants={sceneVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          {/* Hero Scene */}
          {currentScene === 'hero' && (
            <motion.div 
              className="relative w-full h-full"
              style={{
                x: heroX,
                y: heroY,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1920&auto=format&fit=crop"
                alt={vehicleName}
                className="w-full h-full object-cover"
                onLoad={() => setImageLoaded(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--neutral-950))]/95 via-[hsl(var(--neutral-950))]/20 to-transparent" />
              
              {/* Floating Info Cards */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute top-24 left-8 md:left-16 backdrop-blur-xl bg-white/5 border border-[hsl(var(--toyota-platinum))]/20 rounded-2xl p-6 max-w-xs"
              >
                <Zap className="h-8 w-8 text-[hsl(var(--toyota-platinum))] mb-3" />
                <h3 className="text-white font-semibold text-lg mb-2">Performance</h3>
                <p className="text-[hsl(var(--toyota-stone))] text-sm">0-100 km/h in 6.8s</p>
              </motion.div>

              <div className="absolute bottom-32 left-8 right-8 md:left-16 md:right-auto md:max-w-2xl text-white">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="text-5xl md:text-7xl font-bold mb-4 tracking-tight"
                  style={{ 
                    background: 'linear-gradient(135deg, hsl(var(--toyota-pearl)) 0%, hsl(var(--toyota-platinum)) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {vehicleName}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-xl md:text-2xl text-[hsl(var(--toyota-stone))] mb-8 font-light"
                >
                  Where luxury meets performance
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  <Button
                    onClick={() => openModal('hero')}
                    variant="outline"
                    size="lg"
                    className="border-[hsl(var(--toyota-platinum))]/30 bg-white/5 text-white hover:bg-white/10 hover:border-[hsl(var(--toyota-platinum))] backdrop-blur-xl transition-all duration-300"
                  >
                    <Eye className="mr-2 h-5 w-5" /> Explore 360° View
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Performance Scene */}
          {currentScene === 'performance' && (
            <div className="relative w-full h-full">
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&auto=format&fit=crop"
                alt="Performance"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--neutral-950))]/85 via-[hsl(var(--neutral-950))]/40 to-transparent" />
              
              {/* Drive Mode Selector - Premium Design */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute top-24 right-8 md:right-16 backdrop-blur-2xl bg-[hsl(var(--toyota-graphite))]/40 rounded-3xl p-6 border border-[hsl(var(--toyota-platinum))]/20 shadow-2xl"
              >
                <h3 className="text-white text-sm font-semibold mb-4 tracking-wider uppercase text-[hsl(var(--toyota-stone))]">Drive Mode</h3>
                <div className="flex flex-col space-y-2">
                  {(['eco', 'normal', 'sport'] as DriveMode[]).map((mode, idx) => (
                    <motion.button
                      key={mode}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      onClick={() => setDriveMode(mode)}
                      className={`px-8 py-3 rounded-2xl transition-all duration-300 text-sm font-medium ${
                        driveMode === mode
                          ? 'bg-gradient-to-r from-[hsl(var(--toyota-platinum))] to-[hsl(var(--toyota-pearl))] text-[hsl(var(--toyota-graphite))] shadow-xl scale-105'
                          : 'bg-white/5 text-[hsl(var(--toyota-stone))] hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Performance Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 space-y-4"
              >
                {[
                  { label: 'Power', value: '302 HP', icon: Zap },
                  { label: 'Torque', value: '361 Nm', icon: Gauge },
                  { label: 'Top Speed', value: '220 km/h', icon: Wind },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + idx * 0.1 }}
                    className="backdrop-blur-2xl bg-white/5 rounded-2xl p-4 border border-[hsl(var(--toyota-platinum))]/10 min-w-[160px]"
                  >
                    <stat.icon className="h-5 w-5 text-[hsl(var(--toyota-platinum))] mb-2" />
                    <p className="text-[hsl(var(--toyota-stone))] text-xs mb-1">{stat.label}</p>
                    <p className="text-white text-2xl font-bold">{stat.value}</p>
                  </motion.div>
                ))}
              </motion.div>

              <div className="absolute bottom-32 left-8 md:left-16 text-white max-w-lg">
                <motion.h2 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-5xl font-bold mb-4"
                >
                  Unleash Power
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-[hsl(var(--toyota-stone))] text-lg mb-6 font-light"
                >
                  Experience exhilarating acceleration and refined handling
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    onClick={() => openModal('performance')}
                    variant="outline"
                    size="lg"
                    className="border-[hsl(var(--toyota-platinum))]/30 bg-white/5 text-white hover:bg-white/10 hover:border-[hsl(var(--toyota-platinum))] backdrop-blur-xl"
                  >
                    <Gauge className="mr-2 h-5 w-5" /> Real-time Performance
                  </Button>
                </motion.div>
              </div>
            </div>
          )}

          {/* Design Scene */}
          {currentScene === 'design' && (
            <div className="relative w-full h-full">
              {/* Before/After Slider - Enhanced */}
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1617654112368-307921291f42?w=1920&auto=format&fit=crop"
                  alt="Exterior"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <motion.div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                  animate={{ opacity: [0.95, 1, 0.95] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=1920&auto=format&fit=crop"
                    alt="Interior"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </motion.div>
                
                {/* Premium Slider Handle */}
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{ left: `${sliderPosition}%`, width: '2px' }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--toyota-platinum))] to-[hsl(var(--toyota-pearl))] shadow-2xl flex items-center justify-center pointer-events-auto cursor-ew-resize border-4 border-white/20"
                  >
                    <ChevronLeft className="h-4 w-4 text-[hsl(var(--toyota-graphite))] -mr-1" />
                    <ChevronRight className="h-4 w-4 text-[hsl(var(--toyota-graphite))] -ml-1" />
                  </motion.div>
                </div>

                {/* Labels */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-8 left-8 backdrop-blur-xl bg-white/10 px-6 py-3 rounded-full border border-[hsl(var(--toyota-platinum))]/20"
                >
                  <p className="text-white font-medium">Exterior Design</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="absolute top-8 right-8 backdrop-blur-xl bg-white/10 px-6 py-3 rounded-full border border-[hsl(var(--toyota-platinum))]/20"
                >
                  <p className="text-white font-medium">Interior Luxury</p>
                </motion.div>
              </div>

              {/* Slider Control - Premium */}
              <div className="absolute bottom-48 left-1/2 -translate-x-1/2 w-80">
                <div className="backdrop-blur-2xl bg-white/10 rounded-full p-4 border border-[hsl(var(--toyota-platinum))]/20">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(Number(e.target.value))}
                    className="w-full h-2 bg-[hsl(var(--toyota-graphite))]/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-[hsl(var(--toyota-platinum))] [&::-webkit-slider-thumb]:to-[hsl(var(--toyota-pearl))]"
                  />
                </div>
              </div>

              <div className="absolute bottom-32 left-8 md:left-16 text-white">
                <motion.h2 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-5xl font-bold mb-4"
                >
                  Design Excellence
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    onClick={() => openModal('design')}
                    variant="outline"
                    size="lg"
                    className="border-[hsl(var(--toyota-platinum))]/30 bg-white/5 text-white hover:bg-white/10 hover:border-[hsl(var(--toyota-platinum))] backdrop-blur-xl"
                  >
                    <Palette className="mr-2 h-5 w-5" /> Design Details
                  </Button>
                </motion.div>
              </div>
            </div>
          )}

          {/* Interior Scene */}
          {currentScene === 'interior' && (
            <div className="relative w-full h-full">
              <img
                src="https://media.cdntoyota.co.za/toyotacms23/attachments/clp5597ar01l8okakhr2brhc7-lc-300-tech-hero-1920x1080.desktop.jpg"
                alt="Interior"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--neutral-950))]/80 via-[hsl(var(--neutral-950))]/30 to-transparent" />
              
              {/* Interactive Hotspots */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 max-w-6xl">
                  {[
                    { id: 1, title: 'Premium Dashboard', icon: Gauge, desc: 'Digital instrument cluster' },
                    { id: 2, title: 'Luxury Seating', icon: Heart, desc: 'Heated & ventilated seats' },
                    { id: 3, title: 'Advanced Tech', icon: Camera, desc: 'Infotainment system' },
                  ].map((hotspot, idx) => (
                    <motion.button
                      key={hotspot.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      onClick={() => {
                        setActiveHotspot(hotspot.id);
                        openModal('interior');
                      }}
                      className="backdrop-blur-2xl bg-white/10 border border-[hsl(var(--toyota-platinum))]/20 rounded-3xl p-8 text-white hover:bg-white/20 transition-all"
                    >
                      <hotspot.icon className="h-12 w-12 mx-auto mb-4 text-[hsl(var(--toyota-platinum))]" />
                      <h3 className="text-xl font-semibold mb-2">{hotspot.title}</h3>
                      <p className="text-[hsl(var(--toyota-stone))] text-sm">{hotspot.desc}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-32 left-8 md:left-16 text-white">
                <motion.h2 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-5xl font-bold mb-4"
                >
                  Refined Interior
                </motion.h2>
              </div>
            </div>
          )}

          {/* Safety Scene */}
          {currentScene === 'safety' && (
            <div className="relative w-full h-full">
              <img
                src="https://media.cdntoyota.co.za/toyotacms23/attachments/clsojuxxrb5bwcyak1ignyxsb-lc-300-safety-hero-1920x1080-desktop-with-disclaimer.desktop.jpg"
                alt="Safety"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--neutral-950))]/90 via-[hsl(var(--neutral-950))]/50 to-transparent" />
              
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-2xl ml-8 md:ml-16 space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">Safety First</h2>
                    <p className="text-[hsl(var(--toyota-stone))] text-xl mb-8 leading-relaxed">
                      Advanced safety systems protecting you and your loved ones
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Shield, label: 'Pre-Collision' },
                      { icon: Eye, label: 'Blind Spot' },
                      { icon: Lock, label: 'Lane Assist' },
                      { icon: Compass, label: 'Adaptive Cruise' },
                    ].map((feature, idx) => (
                      <motion.div
                        key={feature.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        className="backdrop-blur-xl bg-white/5 border border-[hsl(var(--toyota-platinum))]/10 rounded-2xl p-4"
                      >
                        <feature.icon className="h-8 w-8 text-[hsl(var(--toyota-platinum))] mb-2" />
                        <p className="text-white font-medium">{feature.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Button
                      onClick={() => openModal('safety')}
                      variant="outline"
                      size="lg"
                      className="border-[hsl(var(--toyota-platinum))]/30 bg-white/5 text-white hover:bg-white/10 hover:border-[hsl(var(--toyota-platinum))] backdrop-blur-xl"
                    >
                      <Shield className="mr-2 h-5 w-5" /> Safety Features
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          )}

          {/* Lifestyle Scene */}
          {currentScene === 'lifestyle' && (
            <div className="relative w-full h-full">
              <AnimatePresence mode="wait">
                <motion.img
                  key={lifestyleMode}
                  src={
                    lifestyleMode === 'city' 
                      ? "https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-001-2160.jpg"
                      : lifestyleMode === 'highway'
                      ? "https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-1440w.jpg"
                      : "https://www.wsupercars.com/wallpapers-regular/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-2160.jpg"
                  }
                  alt="Lifestyle"
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--neutral-950))]/90 via-transparent to-[hsl(var(--neutral-950))]/50" />
              
              <div className="absolute inset-0 flex flex-col justify-between py-12">
                <motion.div 
                  key={lifestyleMode}
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <h2 className="text-5xl md:text-6xl font-bold text-white">
                    {lifestyleMode === 'city' && 'Urban Explorer'}
                    {lifestyleMode === 'highway' && 'Grand Tourer'}
                    {lifestyleMode === 'offroad' && 'Adventure Ready'}
                  </h2>
                </motion.div>

                <div className="flex flex-col items-center gap-6">
                  <div className="flex gap-4 flex-wrap justify-center px-8">
                    {(['city', 'highway', 'offroad'] as LifestyleMode[]).map((mode, idx) => (
                      <motion.button
                        key={mode}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + idx * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setLifestyleMode(mode)}
                        className={`px-8 py-3 rounded-full font-medium transition-all ${
                          lifestyleMode === mode
                            ? 'bg-gradient-to-r from-[hsl(var(--toyota-platinum))] to-[hsl(var(--toyota-pearl))] text-[hsl(var(--toyota-graphite))] shadow-xl'
                            : 'backdrop-blur-xl bg-white/10 text-white border border-[hsl(var(--toyota-platinum))]/20 hover:bg-white/20'
                        }`}
                      >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </motion.button>
                    ))}
                  </div>

                  <Button
                    onClick={() => openModal('lifestyle')}
                    variant="outline"
                    size="lg"
                    className="border-[hsl(var(--toyota-platinum))]/30 bg-white/5 text-white hover:bg-white/10 hover:border-[hsl(var(--toyota-platinum))] backdrop-blur-xl"
                  >
                    <Heart className="mr-2 h-5 w-5" /> Explore Lifestyle
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 z-20">
        <motion.button
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevScene}
          disabled={scenes.indexOf(currentScene) === 0}
          className="backdrop-blur-2xl bg-white/10 border border-[hsl(var(--toyota-platinum))]/20 rounded-full p-4 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-all"
        >
          <ChevronLeft className="h-6 w-6" />
        </motion.button>
      </div>
      <div className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 z-20">
        <motion.button
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextScene}
          disabled={scenes.indexOf(currentScene) === scenes.length - 1}
          className="backdrop-blur-2xl bg-white/10 border border-[hsl(var(--toyota-platinum))]/20 rounded-full p-4 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-all"
        >
          <ChevronRight className="h-6 w-6" />
        </motion.button>
      </div>

      {/* Navigation Dots - Luxury Design */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-20 backdrop-blur-2xl bg-[hsl(var(--toyota-graphite))]/40 px-6 py-3 rounded-full border border-[hsl(var(--toyota-platinum))]/20">
        {scenes.map((scene, idx) => (
          <motion.button
            key={scene}
            onClick={() => setCurrentScene(scene)}
            className={`relative transition-all duration-300 ${
              currentScene === scene ? 'w-8 h-2' : 'w-2 h-2'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Go to ${scene} scene`}
          >
            <motion.div
              className={`w-full h-full rounded-full ${
                currentScene === scene
                  ? 'bg-gradient-to-r from-[hsl(var(--toyota-platinum))] to-[hsl(var(--toyota-pearl))]'
                  : 'bg-white/30'
              }`}
              animate={currentScene === scene ? { opacity: [0.7, 1, 0.7] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        ))}
      </div>

      {/* CTA Bar - Premium Design */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[hsl(var(--neutral-950))] via-[hsl(var(--neutral-950))]/95 to-transparent p-8 z-10"
      >
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            onClick={onReserve} 
            size="lg" 
            className="bg-[hsl(var(--toyota-red))] hover:bg-[hsl(var(--toyota-red))]/90 text-white shadow-2xl shadow-[hsl(var(--toyota-red))]/20 px-8"
          >
            Reserve Now
          </Button>
          <Button 
            onClick={onTestDrive} 
            variant="outline" 
            size="lg" 
            className="border-[hsl(var(--toyota-platinum))]/30 bg-white/5 text-white hover:bg-white/10 hover:border-[hsl(var(--toyota-platinum))] backdrop-blur-xl"
          >
            <Car className="mr-2 h-5 w-5" /> Book Test Drive
          </Button>
          <Button 
            onClick={onConfigure} 
            variant="outline" 
            size="lg" 
            className="border-[hsl(var(--toyota-platinum))]/30 bg-white/5 text-white hover:bg-white/10 hover:border-[hsl(var(--toyota-platinum))] backdrop-blur-xl"
          >
            <Palette className="mr-2 h-5 w-5" /> Configure
          </Button>
        </div>
      </motion.div>

      {/* Modal - Premium Design with Enhanced Interactions */}
      <AnimatePresence>
        {modalOpen && modalContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[hsl(var(--neutral-950))]/95 backdrop-blur-2xl z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="bg-gradient-to-br from-[hsl(var(--toyota-graphite))]/95 to-[hsl(var(--neutral-950))]/95 backdrop-blur-2xl rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-[hsl(var(--toyota-platinum))]/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gradient-to-r from-[hsl(var(--toyota-graphite))]/98 to-[hsl(var(--neutral-950))]/98 backdrop-blur-2xl z-10 p-6 flex justify-between items-center border-b border-[hsl(var(--toyota-platinum))]/10">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--toyota-pearl))] to-[hsl(var(--toyota-platinum))] bg-clip-text text-transparent">
                    {modalContent.charAt(0).toUpperCase() + modalContent.slice(1)}
                  </h2>
                  <p className="text-[hsl(var(--toyota-stone))] text-sm mt-1">Interactive Experience</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeModal}
                  className="text-white hover:bg-white/10 rounded-full p-3 transition-colors backdrop-blur-xl border border-[hsl(var(--toyota-platinum))]/20"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              <div className="p-8 overflow-y-auto max-h-[calc(90vh-100px)]">
                {modalContent === 'hero' && <HeroModal is360Playing={is360Playing} setIs360Playing={setIs360Playing} rotation360={rotation360} />}
                {modalContent === 'performance' && <PerformanceModal driveMode={driveMode} />}
                {modalContent === 'design' && <DesignModal sliderPosition={sliderPosition} setSliderPosition={setSliderPosition} />}
                {modalContent === 'interior' && <InteriorModal activeHotspot={activeHotspot} setActiveHotspot={setActiveHotspot} />}
                {modalContent === 'safety' && <SafetyModal />}
                {modalContent === 'lifestyle' && <LifestyleModal lifestyleMode={lifestyleMode} setLifestyleMode={setLifestyleMode} />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Modal Content Components with Enhanced Interactions
const HeroModal = ({ is360Playing, setIs360Playing, rotation360 }: { is360Playing: boolean, setIs360Playing: (v: boolean) => void, rotation360: number }) => (
  <div className="space-y-8">
    {/* 360° Viewer */}
    <div className="relative">
      <div className="relative w-full h-96 bg-[hsl(var(--neutral-900))] rounded-3xl overflow-hidden border border-[hsl(var(--toyota-platinum))]/20">
        <motion.img
          src="https://www.virtualshowroom.toyota.ae/configurator/land-cruiser/en"
          alt="Vehicle 360"
          className="w-full h-full object-cover"
          style={{ transform: `rotateY(${rotation360}deg)` }}
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIs360Playing(!is360Playing)}
            className="backdrop-blur-xl bg-white/10 border border-[hsl(var(--toyota-platinum))]/30 rounded-full px-6 py-3 text-white flex items-center gap-2 hover:bg-white/20"
          >
            {is360Playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            {is360Playing ? 'Pause' : 'Play'} 360°
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="backdrop-blur-xl bg-white/10 border border-[hsl(var(--toyota-platinum))]/30 rounded-full p-3 text-white hover:bg-white/20"
          >
            <ZoomIn className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </div>

    {/* Feature Cards with Animations */}
    <div className="grid md:grid-cols-3 gap-4">
      {[
        { icon: Zap, title: "Power", desc: "302 HP", color: "from-blue-500 to-cyan-500" },
        { icon: Wind, title: "Efficiency", desc: "6.5L/100km", color: "from-green-500 to-emerald-500" },
        { icon: Shield, title: "Safety", desc: "5-Star Rating", color: "from-purple-500 to-pink-500" },
      ].map((feature, idx) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="relative group bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-6 border border-[hsl(var(--toyota-platinum))]/20 overflow-hidden"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
          <feature.icon className="h-10 w-10 text-[hsl(var(--toyota-platinum))] mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
          <p className="text-[hsl(var(--toyota-stone))]">{feature.desc}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

const PerformanceModal = ({ driveMode }: { driveMode: DriveMode }) => {
  const [gaugeValue, setGaugeValue] = useState(0);
  
  useEffect(() => {
    const target = driveMode === 'eco' ? 60 : driveMode === 'normal' ? 80 : 100;
    const interval = setInterval(() => {
      setGaugeValue(prev => {
        if (prev < target) return prev + 2;
        return prev;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [driveMode]);

  return (
    <div className="space-y-8">
      {/* Real-time Performance Gauge */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-gradient-to-br from-[hsl(var(--toyota-graphite))]/60 to-[hsl(var(--neutral-900))]/60 backdrop-blur-xl rounded-3xl p-8 border border-[hsl(var(--toyota-platinum))]/20"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-64 h-64">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="100"
                stroke="hsl(var(--toyota-graphite))"
                strokeWidth="12"
                fill="none"
              />
              <motion.circle
                cx="128"
                cy="128"
                r="100"
                stroke="hsl(var(--toyota-platinum))"
                strokeWidth="12"
                fill="none"
                strokeDasharray={628}
                initial={{ strokeDashoffset: 628 }}
                animate={{ strokeDashoffset: 628 - (628 * gaugeValue) / 100 }}
                transition={{ duration: 1, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Gauge className="h-12 w-12 text-[hsl(var(--toyota-platinum))] mb-2" />
              <motion.span 
                className="text-5xl font-bold text-white"
                key={gaugeValue}
              >
                {gaugeValue}%
              </motion.span>
              <span className="text-[hsl(var(--toyota-stone))] text-sm uppercase tracking-wider">{driveMode} Mode</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Engine Specs with Animations */}
        <div className="space-y-3">
          <h3 className="text-white text-xl font-semibold mb-4 flex items-center gap-2">
            <Zap className="h-6 w-6 text-[hsl(var(--toyota-platinum))]" />
            Engine Specs
          </h3>
          {[
            { label: "Engine Type", value: "2.5L Hybrid", icon: Zap },
            { label: "Horsepower", value: "302 HP", icon: Gauge },
            { label: "Torque", value: "361 Nm", icon: Wind },
            { label: "0-100 km/h", value: "6.8s", icon: Zap },
          ].map((spec, idx) => (
            <motion.div
              key={spec.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ x: 5 }}
              className="flex justify-between items-center p-4 bg-gradient-to-r from-white/5 to-white/10 rounded-xl border border-[hsl(var(--toyota-platinum))]/10 group"
            >
              <div className="flex items-center gap-3">
                <spec.icon className="h-5 w-5 text-[hsl(var(--toyota-platinum))] group-hover:scale-110 transition-transform" />
                <span className="text-[hsl(var(--toyota-stone))]">{spec.label}</span>
              </div>
              <span className="text-white font-semibold text-lg">{spec.value}</span>
            </motion.div>
          ))}
        </div>

        {/* Performance Insights */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-6 border border-[hsl(var(--toyota-platinum))]/10"
        >
          <Gauge className="h-16 w-16 text-[hsl(var(--toyota-platinum))] mb-4" />
          <h3 className="text-white text-xl font-semibold mb-3">Dynamic Performance</h3>
          <p className="text-[hsl(var(--toyota-stone))] leading-relaxed">
            Experience exhilarating performance with multiple drive modes tailored to your driving style. Switch seamlessly between Eco, Normal, and Sport modes.
          </p>
          <div className="mt-6 pt-6 border-t border-[hsl(var(--toyota-platinum))]/10">
            <div className="flex justify-between text-sm">
              <span className="text-[hsl(var(--toyota-stone))]">Top Speed</span>
              <span className="text-white font-semibold">220 km/h</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const DesignModal = ({ sliderPosition, setSliderPosition }: { sliderPosition: number, setSliderPosition: (v: number) => void }) => (
  <div className="space-y-6">
    <div className="relative h-96 rounded-3xl overflow-hidden border border-[hsl(var(--toyota-platinum))]/20">
      <img
        src="https://images.unsplash.com/photo-1617654112368-307921291f42?w=1200&auto=format&fit=crop"
        alt="Exterior"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--neutral-950))]/80 to-transparent" />
      <div className="absolute bottom-6 left-6 right-6 text-white">
        <h3 className="text-2xl font-bold mb-4">Sculpted Excellence</h3>
        <p className="text-[hsl(var(--toyota-stone))]">Every curve designed with precision and purpose</p>
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-4">
      {[
        { title: "Aerodynamic", desc: "Optimized for efficiency" },
        { title: "Premium Materials", desc: "Finest craftsmanship" },
        { title: "Signature Lighting", desc: "LED technology" },
      ].map((feature, idx) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-6 border border-[hsl(var(--toyota-platinum))]/10"
        >
          <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
          <p className="text-[hsl(var(--toyota-stone))] text-sm">{feature.desc}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

const InteriorModal = ({ activeHotspot, setActiveHotspot }: { activeHotspot: number | null, setActiveHotspot: (v: number | null) => void }) => (
  <div className="space-y-6">
    <div className="grid md:grid-cols-2 gap-6">
      <div className="relative h-96 rounded-3xl overflow-hidden border border-[hsl(var(--toyota-platinum))]/20">
        <img
          src="https://media.cdntoyota.co.za/toyotacms23/attachments/clps69a9y03fo7bakk274gy8j-lc-300-design-ip-04.desktop.jpg"
          alt="Interior"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="space-y-4">
        {[
          { id: 1, title: "Premium Dashboard", desc: "12.3\" digital display", icon: Gauge },
          { id: 2, title: "Luxury Seating", desc: "Heated & ventilated", icon: Heart },
          { id: 3, title: "Advanced Tech", desc: "Wireless connectivity", icon: Camera },
        ].map((item, idx) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => setActiveHotspot(item.id)}
            className={`w-full text-left p-6 rounded-2xl border transition-all ${
              activeHotspot === item.id
                ? 'bg-gradient-to-r from-[hsl(var(--toyota-platinum))]/20 to-[hsl(var(--toyota-pearl))]/10 border-[hsl(var(--toyota-platinum))]/40'
                : 'bg-white/5 border-[hsl(var(--toyota-platinum))]/10 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-4">
              <item.icon className="h-8 w-8 text-[hsl(var(--toyota-platinum))]" />
              <div>
                <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                <p className="text-[hsl(var(--toyota-stone))] text-sm">{item.desc}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  </div>
);

const SafetyModal = () => (
  <div className="space-y-6">
    <div className="grid md:grid-cols-2 gap-6">
      {[
        { icon: Shield, title: "Pre-Collision System", desc: "Detects potential collisions and alerts driver" },
        { icon: Eye, title: "Blind Spot Monitor", desc: "Monitors adjacent lanes for vehicles" },
        { icon: Lock, title: "Lane Departure Alert", desc: "Warns when vehicle drifts from lane" },
        { icon: Compass, title: "Adaptive Cruise Control", desc: "Maintains safe distance automatically" },
      ].map((feature, idx) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-6 border border-[hsl(var(--toyota-platinum))]/10"
        >
          <feature.icon className="h-12 w-12 text-[hsl(var(--toyota-platinum))] mb-4" />
          <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
          <p className="text-[hsl(var(--toyota-stone))]">{feature.desc}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

const LifestyleModal = ({ lifestyleMode, setLifestyleMode }: { lifestyleMode: LifestyleMode, setLifestyleMode: (v: LifestyleMode) => void }) => (
  <div className="space-y-6">
    <div className="grid md:grid-cols-3 gap-4 mb-6">
      {(['city', 'highway', 'offroad'] as LifestyleMode[]).map((mode, idx) => (
        <motion.button
          key={mode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          onClick={() => setLifestyleMode(mode)}
          className={`p-6 rounded-2xl transition-all ${
            lifestyleMode === mode
              ? 'bg-gradient-to-r from-[hsl(var(--toyota-platinum))]/20 to-[hsl(var(--toyota-pearl))]/10 border-2 border-[hsl(var(--toyota-platinum))]/40'
              : 'bg-white/5 border border-[hsl(var(--toyota-platinum))]/10 hover:bg-white/10'
          }`}
        >
          <h3 className="text-white font-semibold mb-2 capitalize">{mode}</h3>
          <p className="text-[hsl(var(--toyota-stone))] text-sm">
            {mode === 'city' && 'Urban adventures await'}
            {mode === 'highway' && 'Long distance comfort'}
            {mode === 'offroad' && 'Conquer any terrain'}
          </p>
        </motion.button>
      ))}
    </div>

    <AnimatePresence mode="wait">
      <motion.div
        key={lifestyleMode}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative h-96 rounded-3xl overflow-hidden border border-[hsl(var(--toyota-platinum))]/20"
      >
        <img
          src={
            lifestyleMode === 'city'
              ? "https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-004-1440w.jpg"
              : lifestyleMode === 'highway'
              ? "https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-1440w.jpg"
              : "https://www.wsupercars.com/wallpapers-wide/Toyota/2022-Toyota-Land-Cruiser-GR-Sport-002-1440w.jpg"
          }
          alt={lifestyleMode}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--neutral-950))]/80 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h3 className="text-3xl font-bold mb-2 capitalize">{lifestyleMode} Adventure</h3>
          <p className="text-[hsl(var(--toyota-stone))] text-lg">
            {lifestyleMode === 'city' && 'Navigate urban landscapes with style and confidence'}
            {lifestyleMode === 'highway' && 'Experience refined comfort on every journey'}
            {lifestyleMode === 'offroad' && 'Explore beyond the beaten path'}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  </div>
);

export default SeamlessCinematicShowroom;
