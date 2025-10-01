import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Sparkles, Zap, Leaf, Sun, Moon, Mountain, Building2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSwipeable } from '@/hooks/use-swipeable';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { performantSpringConfigs } from '@/utils/performance-animations';

interface ShowroomProps {
  vehicleName: string;
  galleryImages: Array<{
    url: string;
    alt: string;
    category?: string;
  }>;
  onReserve?: () => void;
  onTestDrive?: () => void;
  onConfigure?: () => void;
}

type ShowroomState = 'entrance' | 'highlights' | 'mood' | 'interior' | 'ambient' | 'lifestyle';

const STATES: ShowroomState[] = ['entrance', 'highlights', 'mood', 'interior', 'ambient', 'lifestyle'];

const moods = {
  sport: { 
    gradient: 'from-red-950/40 via-black to-black',
    icon: Zap,
    label: 'Sport Mode'
  },
  urban: { 
    gradient: 'from-blue-950/40 via-slate-900 to-black',
    icon: Building2,
    label: 'Urban Drive'
  },
  eco: { 
    gradient: 'from-green-950/40 via-emerald-950 to-black',
    icon: Leaf,
    label: 'Eco Mode'
  }
};

const ambientColors = [
  { name: 'Pearl White', color: 'from-slate-100/20 to-white/10' },
  { name: 'Sunset Orange', color: 'from-orange-500/20 to-red-500/10' },
  { name: 'Ocean Blue', color: 'from-blue-500/20 to-cyan-500/10' },
  { name: 'Forest Green', color: 'from-green-500/20 to-emerald-500/10' }
];

const lifestyleScenes = [
  { 
    id: 'city', 
    title: 'Urban Explorer',
    gradient: 'from-slate-900/90 via-gray-800/80 to-black/90',
    icon: Building2
  },
  { 
    id: 'desert', 
    title: 'Desert Wanderer',
    gradient: 'from-amber-900/90 via-orange-900/80 to-black/90',
    icon: Sun
  },
  { 
    id: 'mountain', 
    title: 'Mountain Escape',
    gradient: 'from-blue-950/90 via-indigo-900/80 to-black/90',
    icon: Mountain
  }
];

const hotspots = [
  { id: 'grille', x: 50, y: 45, label: 'Dynamic Grille', detail: 'Aggressive front fascia with LED accents' },
  { id: 'wheels', x: 30, y: 70, label: 'Alloy Wheels', detail: 'Premium 19" machined alloy design' },
  { id: 'lights', x: 70, y: 40, label: 'LED Headlamps', detail: 'Adaptive bi-beam LED technology' }
];

const SeamlessCinematicShowroom: React.FC<ShowroomProps> = ({
  vehicleName,
  galleryImages,
  onReserve,
  onTestDrive,
  onConfigure
}) => {
  const [currentState, setCurrentState] = useState<ShowroomState>('entrance');
  const [selectedMood, setSelectedMood] = useState<keyof typeof moods>('sport');
  const [selectedAmbient, setSelectedAmbient] = useState(0);
  const [selectedLifestyle, setSelectedLifestyle] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const prefersReducedMotion = useReducedMotionSafe();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const parallaxX = useTransform(mouseX, [0, 1], [-20, 20]);
  const parallaxY = useTransform(mouseY, [0, 1], [-10, 10]);

  const currentStateIndex = STATES.indexOf(currentState);

  const navigateState = useCallback((direction: 'next' | 'prev') => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    const newIndex = direction === 'next' 
      ? Math.min(currentStateIndex + 1, STATES.length - 1)
      : Math.max(currentStateIndex - 1, 0);
    
    setCurrentState(STATES[newIndex]);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [currentStateIndex, isTransitioning]);

  const swipeHandlers = useSwipeable({
    onSwipeLeft: () => navigateState('next'),
    onSwipeRight: () => navigateState('prev'),
    threshold: 50
  });

  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, prefersReducedMotion]);

  const getBackgroundGradient = () => {
    switch (currentState) {
      case 'mood':
        return moods[selectedMood].gradient;
      case 'ambient':
        return ambientColors[selectedAmbient].color;
      case 'lifestyle':
        return lifestyleScenes[selectedLifestyle].gradient;
      default:
        return 'from-black via-slate-950 to-black';
    }
  };

  const exteriorImage = galleryImages.find(img => 
    img.category === 'exterior' || img.alt?.toLowerCase().includes('exterior')
  )?.url || galleryImages[0]?.url;

  const interiorImage = galleryImages.find(img => 
    img.category === 'interior' || img.alt?.toLowerCase().includes('interior')
  )?.url || galleryImages[1]?.url;

  return (
    <section 
      ref={swipeHandlers}
      className="relative w-full h-screen overflow-hidden bg-black"
      style={{ touchAction: 'pan-y pinch-zoom' }}
    >
      {/* Dynamic Background */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${getBackgroundGradient()}`}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />

      {/* Main Content Canvas */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          {/* STATE 1: Cinematic Entrance */}
          {currentState === 'entrance' && (
            <motion.div
              key="entrance"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={prefersReducedMotion ? { duration: 0.3 } : performantSpringConfigs.cinematic}
              className="relative w-full h-full flex items-center justify-center"
            >
              <motion.div
                style={!prefersReducedMotion ? { x: parallaxX, y: parallaxY } : {}}
                className="relative w-[90%] max-w-6xl h-[70%]"
              >
                <motion.img
                  src={exteriorImage}
                  alt={vehicleName}
                  className="w-full h-full object-contain"
                  initial={{ opacity: 0, filter: 'brightness(0.3)' }}
                  animate={{ opacity: 1, filter: 'brightness(1)' }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                />
                
                {/* Light Sweep Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 2, delay: 0.5, ease: 'easeInOut' }}
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute bottom-32 left-1/2 -translate-x-1/2 text-6xl md:text-8xl font-serif text-white tracking-wider"
              >
                {vehicleName}
              </motion.h1>
            </motion.div>
          )}

          {/* STATE 2: Interactive Highlights */}
          {currentState === 'highlights' && (
            <motion.div
              key="highlights"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              <div className="relative w-[90%] max-w-6xl h-[70%]">
                <img
                  src={exteriorImage}
                  alt={vehicleName}
                  className="w-full h-full object-contain opacity-90"
                />
                
                {/* Interactive Hotspots */}
                {hotspots.map((hotspot) => (
                  <motion.div
                    key={hotspot.id}
                    className="absolute"
                    style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, ...performantSpringConfigs.smooth }}
                  >
                    <motion.button
                      onClick={() => setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)}
                      className="relative group"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <motion.div
                        className="w-8 h-8 rounded-full bg-primary/80 backdrop-blur-sm border-2 border-white/40"
                        animate={activeHotspot === hotspot.id ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 0.6, repeat: Infinity }}
                      />
                      
                      <AnimatePresence>
                        {activeHotspot === hotspot.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="absolute left-12 top-1/2 -translate-y-1/2 min-w-[200px] p-4 rounded-lg bg-card/95 backdrop-blur-xl border border-border shadow-2xl"
                          >
                            <h3 className="text-sm font-semibold text-foreground mb-1">{hotspot.label}</h3>
                            <p className="text-xs text-muted-foreground">{hotspot.detail}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STATE 3: Mood Transformation */}
          {currentState === 'mood' && (
            <motion.div
              key="mood"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="relative w-full h-full flex flex-col items-center justify-center gap-12"
            >
              <motion.img
                src={exteriorImage}
                alt={vehicleName}
                className="w-[80%] max-w-5xl h-[60%] object-contain"
                animate={{ 
                  filter: selectedMood === 'sport' 
                    ? 'brightness(1.1) contrast(1.2) saturate(1.3)' 
                    : selectedMood === 'eco'
                    ? 'brightness(1.05) saturate(0.9) hue-rotate(10deg)'
                    : 'brightness(1) saturate(1)'
                }}
                transition={{ duration: 0.8 }}
              />

              <div className="flex gap-6">
                {Object.entries(moods).map(([key, mood]) => {
                  const Icon = mood.icon;
                  return (
                    <motion.button
                      key={key}
                      onClick={() => setSelectedMood(key as keyof typeof moods)}
                      className={`flex flex-col items-center gap-2 px-6 py-4 rounded-2xl backdrop-blur-xl border-2 transition-all ${
                        selectedMood === key
                          ? 'bg-primary/20 border-primary shadow-lg shadow-primary/50'
                          : 'bg-card/40 border-border/40 hover:bg-card/60'
                      }`}
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className={`w-6 h-6 ${selectedMood === key ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`text-sm font-medium ${selectedMood === key ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {mood.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STATE 4: Interior Immersion */}
          {currentState === 'interior' && (
            <motion.div
              key="interior"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              <motion.div
                className="relative w-[90%] max-w-6xl h-[80%] rounded-3xl overflow-hidden"
                style={!prefersReducedMotion ? { x: parallaxX, y: parallaxY } : {}}
              >
                <img
                  src={interiorImage}
                  alt={`${vehicleName} Interior`}
                  className="w-full h-full object-cover"
                />
                
                {/* Ambient Breathing Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>
            </motion.div>
          )}

          {/* STATE 5: Ambient Lighting Wall */}
          {currentState === 'ambient' && (
            <motion.div
              key="ambient"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="relative w-full h-full flex flex-col items-center justify-center gap-12"
            >
              <motion.div
                className="relative w-[85%] max-w-5xl h-[65%]"
                animate={{ 
                  boxShadow: `0 0 100px 30px ${
                    selectedAmbient === 0 ? 'rgba(255,255,255,0.3)' :
                    selectedAmbient === 1 ? 'rgba(251,146,60,0.4)' :
                    selectedAmbient === 2 ? 'rgba(59,130,246,0.4)' :
                    'rgba(34,197,94,0.4)'
                  }`
                }}
                transition={{ duration: 1 }}
              >
                <img
                  src={interiorImage}
                  alt={`${vehicleName} Ambient`}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </motion.div>

              <div className="flex gap-4">
                {ambientColors.map((ambient, index) => (
                  <motion.button
                    key={ambient.name}
                    onClick={() => setSelectedAmbient(index)}
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${ambient.color} backdrop-blur-sm border-2 ${
                      selectedAmbient === index ? 'border-white scale-110' : 'border-white/30'
                    }`}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    animate={selectedAmbient === index ? { 
                      boxShadow: ['0 0 0 0 rgba(255,255,255,0.4)', '0 0 0 15px rgba(255,255,255,0)']
                    } : {}}
                    transition={{ duration: 0.8, repeat: selectedAmbient === index ? Infinity : 0 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* STATE 6: Lifestyle Persona Scenes */}
          {currentState === 'lifestyle' && (
            <motion.div
              key="lifestyle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              <div className="relative w-full h-full">
                {/* Background Scene with Parallax */}
                <motion.div
                  className="absolute inset-0"
                  style={!prefersReducedMotion ? { 
                    x: useTransform(parallaxX, [-20, 20], [-40, 40]),
                    y: useTransform(parallaxY, [-10, 10], [-20, 20])
                  } : {}}
                >
                  <div className={`w-full h-full bg-gradient-to-br ${lifestyleScenes[selectedLifestyle].gradient}`} />
                </motion.div>

                {/* Car Image */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  style={!prefersReducedMotion ? { x: parallaxX, y: parallaxY } : {}}
                >
                  <img
                    src={exteriorImage}
                    alt={vehicleName}
                    className="w-[85%] max-w-5xl h-auto object-contain"
                  />
                </motion.div>

                {/* Scene Selector */}
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-6">
                  {lifestyleScenes.map((scene, index) => {
                    const Icon = scene.icon;
                    return (
                      <motion.button
                        key={scene.id}
                        onClick={() => setSelectedLifestyle(index)}
                        className={`flex flex-col items-center gap-2 px-8 py-5 rounded-2xl backdrop-blur-2xl border-2 transition-all ${
                          selectedLifestyle === index
                            ? 'bg-primary/30 border-primary shadow-2xl shadow-primary/50'
                            : 'bg-card/30 border-border/30 hover:bg-card/50'
                        }`}
                        whileHover={{ scale: 1.08, y: -6 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon className={`w-7 h-7 ${selectedLifestyle === index ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={`text-sm font-semibold ${selectedLifestyle === index ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {scene.title}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {STATES.map((state, index) => (
          <motion.button
            key={state}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true);
                setCurrentState(state);
                setTimeout(() => setIsTransitioning(false), 600);
              }
            }}
            className={`h-1.5 rounded-full transition-all ${
              index === currentStateIndex 
                ? 'w-12 bg-primary' 
                : 'w-6 bg-white/40 hover:bg-white/60'
            }`}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>

      {/* Floating Glassmorphic CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute top-6 right-6 flex gap-3 z-20"
      >
        {onReserve && (
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onReserve}
              variant="default"
              size="lg"
              className="backdrop-blur-xl bg-primary/90 hover:bg-primary shadow-xl shadow-primary/30 font-semibold"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Reserve
            </Button>
          </motion.div>
        )}
        
        {onTestDrive && (
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onTestDrive}
              variant="outline"
              size="lg"
              className="backdrop-blur-xl bg-card/60 border-border/50 hover:bg-card/80 shadow-lg font-semibold"
            >
              Test Drive
            </Button>
          </motion.div>
        )}
        
        {onConfigure && (
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onConfigure}
              variant="outline"
              size="lg"
              className="backdrop-blur-xl bg-card/60 border-border/50 hover:bg-card/80 shadow-lg font-semibold"
            >
              Configure
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Mobile Instructions Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: currentState === 'entrance' ? 1 : 0 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/60 text-sm md:hidden pointer-events-none"
      >
        Swipe to explore →
      </motion.div>
    </section>
  );
};

export default SeamlessCinematicShowroom;
