// Import statements remain the same
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useReducedMotion, useScroll, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, Zap, Shield, Sparkles, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

// Enhanced interfaces with styling options
interface StoryScene {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  backgroundVideo?: string;
  overlayStyle?: 'gradient' | 'dark' | 'light';
  accentColor?: string;
  cta?: {
    label: string;
    action: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
  };
  stats?: Array<{
    value: string;
    label: string;
    icon?: React.ReactNode;
    endValue?: number;
    prefix?: string;
    suffix?: string;
  }>;
  features?: string[];
}

// Props interface remains the same
interface AppleStyleStorytellingProps {
  monthlyEMI: number;
  setIsBookingOpen: (open: boolean) => void;
  navigate: (path: string) => void;
  setIsFinanceOpen: (open: boolean) => void;
  onSafetyExplore: () => void;
  onConnectivityExplore: () => void;
  onHybridTechExplore: () => void;
  onInteriorExplore: () => void;
  galleryImages?: string[];
}

// Enhanced AnimatedCounter component for stats
const AnimatedCounter: React.FC<{
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}> = ({ value, prefix = '', suffix = '', duration = 1.5 }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const [isInView, setIsInView] = useState(false);
  const motionValue = useSpring(0, {
    stiffness: 100,
    damping: 30,
    duration
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.5 }
    );
    
    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <span ref={nodeRef} className="tabular-nums">
      <motion.span>
        {prefix}
        {motionValue.get().toFixed(value % 1 === 0 ? 0 : 1)}
        {suffix}
      </motion.span>
    </span>
  );
};

// Enhanced ProgressDots with premium styling
const ProgressDots: React.FC<{
  scenes: StoryScene[];
  currentIndex: number;
  onSceneSelect: (index: number) => void;
  className?: string;
}> = ({ scenes, currentIndex, onSceneSelect, className = "" }) => {
  const reduceMotion = useReducedMotionSafe();

  return (
    <motion.div 
      className={`flex justify-center space-x-4 backdrop-blur-sm py-3 px-6 rounded-full 
        bg-black/20 border border-white/10 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      role="tablist"
      aria-label="Story navigation"
    >
      {scenes.map((_, index) => (
        <button
          key={index}
          role="tab"
          aria-selected={index === currentIndex}
          aria-current={index === currentIndex ? "true" : undefined}
          aria-label={`Go to scene ${index + 1}: ${scenes[index]?.title}`}
          className={`group relative h-2 rounded-full transition-all duration-500 
            focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 
            focus:ring-offset-transparent ${
            index === currentIndex 
              ? 'bg-white w-12' 
              : 'bg-white/30 hover:bg-white/50 w-2'
          }`}
          onClick={() => onSceneSelect(index)}
        >
          {index === currentIndex && (
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-white via-white/90 to-white"
              layoutId="activeIndicator"
              transition={reduceMotion ? { duration: 0 } : { 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
              }}
            />
          )}
          <motion.span
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 
              group-hover:opacity-100 transition-opacity duration-300 text-xs text-white/70
              whitespace-nowrap pointer-events-none"
          >
            Scene {index + 1}
          </motion.span>
        </button>
      ))}
    </motion.div>
  );
};

// Enhanced SceneMedia with premium overlays
const SceneMedia: React.FC<{
  scene: StoryScene;
  isActive: boolean;
  reduceMotion: boolean;
}> = ({ scene, isActive, reduceMotion }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const parallaxY = useMotionValue(0);
  const parallaxScale = useTransform(parallaxY, [-100, 100], [1.1, 1]);

  useEffect(() => {
    if (scene.backgroundVideo && isActive && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback handled by poster image
      });
    }
  }, [isActive, scene.backgroundVideo]);

  return (
    <motion.div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{ scale: parallaxScale }}
    >
      {scene.backgroundVideo && !reduceMotion ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover scale-110"
          poster={scene.backgroundImage}
          muted
          loop
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
        >
          <source src={scene.backgroundVideo} type="video/mp4" />
        </video>
      ) : (
        <motion.img
          src={scene.backgroundImage}
          alt={scene.title}
          className="absolute inset-0 w-full h-full object-cover"
          loading={isActive ? "eager" : "lazy"}
          srcSet={`${scene.backgroundImage} 1920w, 
            ${scene.backgroundImage}?w=1280 1280w, 
            ${scene.backgroundImage}?w=768 768w`}
          sizes="100vw"
          initial={{ scale: 1.1 }}
          animate={{ scale: isActive ? 1 : 1.1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      )}
      
      {/* Premium cinematic overlays */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
        <div 
          className={`absolute inset-0 mix-blend-overlay bg-gradient-to-tr 
            ${scene.accentColor || 'from-blue-900/20 to-transparent'}`}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>
    </motion.div>
  );
};

// Enhanced SceneContent with rich animations
const SceneContent: React.FC<{
  scene: StoryScene;
  monthlyEMI: number;
  isActive: boolean;
}> = ({ scene, monthlyEMI, isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const reduceMotion = useReducedMotionSafe();

  return (
    <motion.div
      ref={containerRef}
      className="relative z-20 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 30 }}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto text-center text-white">
        <motion.h2
          className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6 
            bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {scene.title}
        </motion.h2>

        <motion.p
          className="text-xl md:text-2xl text-white/90 mb-8 font-light max-w-3xl mx-auto
            leading-relaxed tracking-wide"
          initial={{ opacity: 0, y: 15 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {scene.subtitle}
        </motion.p>

        {scene.stats && (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, y: 15 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {scene.stats.map((stat, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
              >
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-xl 
                  group-hover:bg-white/10 transition-all duration-300" />
                <div className="relative p-4 text-center">
                  <motion.div
                    className="flex items-center justify-center mb-3"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <div className="text-3xl md:text-4xl font-light mb-1">
                    {stat.endValue ? (
                      <AnimatedCounter
                        value={stat.endValue}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                      />
                    ) : (
                      <span>{stat.value}</span>
                    )}
                  </div>
                  <div className="text-white/70 text-sm uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {scene.features && (
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 15 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {scene.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
              >
                <Badge
                  className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-2
                    hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-default"
                >
                  {feature}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        )}

        {scene.cta && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Button
              onClick={scene.cta.action}
              variant={scene.cta.variant === 'primary' ? 'default' : 'outline'}
              size="lg"
              className={`${
                scene.cta.variant === 'primary'
                  ? 'bg-white text-brand-dark hover:bg-white/90'
                  : 'border-white/30 text-white hover:bg-white/10'
              } px-8 py-6 min-w-[200px] transition-all duration-300 
              hover:scale-105 hover:shadow-lg hover:shadow-white/10
              active:scale-95 text-lg tracking-wide`}
            >
              {scene.cta.label}
              <ChevronRight className="ml-2 w-5 h-5 inline-block" />
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Main component
const AppleStyleStorytellingSection: React.FC<AppleStyleStorytellingProps> = ({
  monthlyEMI,
  setIsBookingOpen,
  navigate,
  setIsFinanceOpen,
  onSafetyExplore,
  onConnectivityExplore,
  onHybridTechExplore,
  onInteriorExplore,
  galleryImages = []
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentScene, setCurrentScene] = useState(0);
  const reduceMotion = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ container: containerRef });

  // Use straight quotes instead of curly quotes
  const storyScenes: StoryScene[] = useMemo(() => [
    {
      id: "hero",
      title: "Experience Tomorrow's Drive Today",  // Fixed quote syntax
      subtitle: "Where power meets efficiency in perfect harmony",
      description: "Discover automotive excellence redefined",
      backgroundImage: galleryImages[0] || defaultImages[0],
      accentColor: "from-blue-900/20 to-purple-900/20",
      cta: {
        label: "Reserve Your Future",
        action: () => setIsBookingOpen(true),
        variant: "primary"
      },
      stats: [
        { 
          value: "268",
          endValue: 268,
          label: "Horsepower",
          icon: <Zap className="w-8 h-8 text-yellow-400" />,
          suffix: " HP"
        },
        {
          value: "7.1",
          endValue: 7.1,
          label: "0-100 km/h",
          icon: <Car className="w-8 h-8 text-blue-400" />,
          suffix: "s"
        },
        {
          value: "850",
          endValue: 850,
          label: "Range",
          icon: <Sparkles className="w-8 h-8 text-green-400" />,
          suffix: "km"
        },
        {
          value: "5",
          endValue: 5,
          label: "Safety Rating",
          icon: <Shield className="w-8 h-8 text-red-400" />,
          suffix: "★"
        }
      ]
    },
    // Additional scenes...
  ], [galleryImages, setIsBookingOpen]);

  // Touch navigation with enhanced sensitivity
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > 50;
    const isDownSwipe = distance < -50;

    if (isUpSwipe && currentScene < storyScenes.length - 1) {
      setCurrentScene(prev => prev + 1);
    } else if (isDownSwipe && currentScene > 0) {
      setCurrentScene(prev => prev - 1);
    }
  }, [touchStart, touchEnd, currentScene, storyScenes.length]);

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.tagName === 'INPUT') return;

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          if (currentScene < storyScenes.length - 1) {
            setCurrentScene(prev => prev + 1);
          }
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          if (currentScene > 0) {
            setCurrentScene(prev => prev - 1);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScene, storyScenes.length]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen overflow-hidden bg-brand-dark"
      role="region"
      aria-label="Interactive vehicle showcase"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        {storyScenes.map((scene, index) => (
          index === currentScene && (
            <motion.div
              key={scene.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <SceneMedia
                scene={scene}
                isActive={index === currentScene}
                reduceMotion={reduceMotion}
              />
            </motion.div>
          )
        ))}
      </AnimatePresence>

      <div className="absolute inset-0 z-10">
        {storyScenes.map((scene, index) => (
          <SceneContent
            key={scene.id}
            scene={scene}
            monthlyEMI={monthlyEMI}
            isActive={index === currentScene}
          />
        ))}
      </div>

      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ProgressDots
          scenes={storyScenes}
          currentIndex={currentScene}
          onSceneSelect={setCurrentScene}
        />
      </motion.div>

      <motion.div
        className="fixed top-8 right-8 z-30 text-white/70 text-sm bg-black/20 
          backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {currentScene + 1} / {storyScenes.length}
      </motion.div>

      <motion.div
        className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-30 
          text-white/60 text-sm text-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: currentScene === 0 ? 1 : 0 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <div className="flex flex-col items-center space-y-3">
          <p className="text-sm uppercase tracking-wider">Scroll or swipe to explore</p>
          <motion.div
            className="w-1 h-8 bg-white/30 rounded-full"
            animate={reduceMotion ? {} : { 
              y: [0, 8, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={reduceMotion ? {} : { 
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default AppleStyleStorytellingSection;
