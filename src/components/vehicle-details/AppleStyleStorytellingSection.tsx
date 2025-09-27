import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, Zap, Shield, Sparkles, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { useIntersectionLock } from '@/hooks/useIntersectionLock';

interface StoryScene {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  backgroundVideo?: string;
  cta?: {
    label: string;
    action: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
  };
  stats?: Array<{
    value: string;
    label: string;
    icon?: React.ReactNode;
  }>;
  features?: string[];
}

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

// Progress indicator component
const ProgressDots: React.FC<{
  scenes: StoryScene[];
  currentIndex: number;
  onSceneSelect: (index: number) => void;
  className?: string;
}> = ({ scenes, currentIndex, onSceneSelect, className = "" }) => {
  const reduceMotion = useReducedMotionSafe();

  return (
    <div 
      className={`flex justify-center space-x-3 ${className}`}
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
          className={`relative h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black ${
            index === currentIndex 
              ? 'bg-white w-8' 
              : 'bg-white/40 hover:bg-white/60 w-2'
          }`}
          onClick={() => onSceneSelect(index)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft' && index > 0) {
              onSceneSelect(index - 1);
            } else if (e.key === 'ArrowRight' && index < scenes.length - 1) {
              onSceneSelect(index + 1);
            }
          }}
        >
          {index === currentIndex && (
            <motion.div
              className="absolute inset-0 bg-white rounded-full"
              layoutId="activeIndicator"
              transition={reduceMotion ? { duration: 0 } : { 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
              }}
            />
          )}
        </button>
      ))}
    </div>
  );
};

// Scene media component
const SceneMedia: React.FC<{
  scene: StoryScene;
  isActive: boolean;
  reduceMotion: boolean;
}> = ({ scene, isActive, reduceMotion }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (scene.backgroundVideo && isActive && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Video autoplay failed, fallback to image
      });
    }
  }, [isActive, scene.backgroundVideo]);

  return (
    <div className="absolute inset-0">
      {scene.backgroundVideo && !reduceMotion ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster={scene.backgroundImage}
          muted
          loop
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          onPlay={() => setIsVideoPlaying(true)}
          onPause={() => setIsVideoPlaying(false)}
        >
          <source src={scene.backgroundVideo} type="video/mp4" />
        </video>
      ) : (
        <img
          src={scene.backgroundImage}
          alt={scene.title}
          className="w-full h-full object-cover"
          loading={isActive ? "eager" : "lazy"}
          srcSet={`${scene.backgroundImage} 1920w, ${scene.backgroundImage}?w=1280 1280w, ${scene.backgroundImage}?w=768 768w`}
          sizes="100vw"
        />
      )}
      
      {/* Cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
    </div>
  );
};

// Scene content component
const SceneContent: React.FC<{
  scene: StoryScene;
  monthlyEMI: number;
  isActive: boolean;
}> = ({ scene, monthlyEMI, isActive }) => {
  return (
    <motion.div
      className="relative z-20 h-full flex items-center justify-center"
      initial={{ opacity: 0, y: 30 }}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-4xl mx-auto px-6 text-center text-white">
        {/* Title */}
        <motion.h2
          className="text-4xl md:text-6xl font-light tracking-tight mb-6 line-clamp-2"
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {scene.title}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-white/90 mb-8 font-light max-w-[70ch] mx-auto line-clamp-3"
          initial={{ opacity: 0, y: 15 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {scene.subtitle}
        </motion.p>

        {/* Stats */}
        {scene.stats && (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 15 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {scene.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-light">{stat.value}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Features */}
        {scene.features && (
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-8"
            initial={{ opacity: 0, y: 15 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {scene.features.map((feature, index) => (
              <Badge
                key={index}
                className="bg-white/10 text-white border-white/20 backdrop-blur-sm"
              >
                {feature}
              </Badge>
            ))}
          </motion.div>
        )}

        {/* CTA */}
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
              } px-8 py-3 min-w-[200px] transition-all duration-200 hover:scale-105`}
            >
              {scene.cta.label}
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

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
  const [isWheelLocked, setIsWheelLocked] = useState(false);
  const reduceMotion = useReducedMotionSafe();
  const { lockScroll, unlockScroll } = useIntersectionLock();

  // Default high-quality images
  const defaultImages = [
    'https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/19d9b6ba-2cee-4d91-b3b3-621f72452918/renditions/9c9119d9-d77c-4c13-a2aa-b0f9e55219cb?binary=true&mformat=true',
    'https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/27c33e82-7b5a-4f89-8e5c-8b9c4c8d5f7a/renditions/e4f5a6b7-8c9d-4e1f-a2b3-c4d5e6f7a8b9?binary=true&mformat=true',
    'https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/f8e9d0c1-b2a3-4c5d-6e7f-a8b9c0d1e2f3/renditions/a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6?binary=true&mformat=true',
    'https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d/renditions/f0e1d2c3-b4a5-968a7-8b9c-0d1e2f3a4b5c?binary=true&mformat=true'
  ];

  const usedImages = galleryImages.length > 0 ? galleryImages : defaultImages;

  const storyScenes: StoryScene[] = useMemo(() => [
    {
      id: 'hero',
      title: 'Redefine Your Journey',
      subtitle: 'Experience the perfect harmony of power, efficiency, and innovation',
      description: 'Discover a new level of automotive excellence',
      backgroundImage: usedImages[0],
      cta: {
        label: 'Reserve Now',
        action: () => setIsBookingOpen(true),
        variant: 'primary'
      },
      stats: [
        { value: '268', label: 'Horsepower', icon: <Zap className="w-6 h-6 text-yellow-400" /> },
        { value: '7.1s', label: '0-100 km/h', icon: <Car className="w-6 h-6 text-blue-400" /> },
        { value: '850km', label: 'Range', icon: <Sparkles className="w-6 h-6 text-green-400" /> },
        { value: '5★', label: 'Safety', icon: <Shield className="w-6 h-6 text-red-400" /> }
      ]
    },
    {
      id: 'exterior',
      title: 'Sculpted for Performance',
      subtitle: 'Every curve designed with purpose, every line crafted for excellence',
      description: 'Aerodynamic design meets bold aesthetics',
      backgroundImage: usedImages[1],
      cta: {
        label: 'Explore Design',
        action: () => navigate('/design'),
        variant: 'secondary'
      },
      features: ['LED Matrix Headlights', 'Active Aero', 'Carbon Fiber Accents', 'Sport Wheels']
    },
    {
      id: 'interior',
      title: 'Luxury Redefined',
      subtitle: 'Step into a world where comfort meets cutting-edge technology',
      description: 'Premium materials and intelligent design',
      backgroundImage: usedImages[2],
      cta: {
        label: 'Experience Interior',
        action: onInteriorExplore,
        variant: 'primary'
      },
      features: ['Premium Leather', 'Ambient Lighting', 'Panoramic Roof', 'JBL Premium Audio']
    },
    {
      id: 'technology',
      title: 'Innovation at Your Fingertips',
      subtitle: 'Advanced technology that anticipates your needs and enhances every drive',
      description: 'Smart features for the modern driver',
      backgroundImage: usedImages[3],
      cta: {
        label: 'Discover Tech',
        action: onConnectivityExplore,
        variant: 'secondary'
      },
      features: ['Hybrid Synergy Drive', 'Toyota Safety Sense', 'Connected Services', 'Wireless Charging']
    }
  ], [usedImages, setIsBookingOpen, navigate, onInteriorExplore, onConnectivityExplore]);

  // Intersection observer for scroll lock
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          lockScroll();
        } else {
          unlockScroll();
        }
      },
      { threshold: [0, 0.5, 1] }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      unlockScroll();
    };
  }, [lockScroll, unlockScroll]);

  // Wheel event handler
  const handleWheel = useCallback((e: WheelEvent) => {
    if (isWheelLocked) return;
    
    e.preventDefault();
    
    setIsWheelLocked(true);
    setTimeout(() => setIsWheelLocked(false), 800);

    if (e.deltaY > 0 && currentScene < storyScenes.length - 1) {
      setCurrentScene(prev => prev + 1);
    } else if (e.deltaY < 0 && currentScene > 0) {
      setCurrentScene(prev => prev - 1);
    }
  }, [currentScene, storyScenes.length, isWheelLocked]);

  // Touch/swipe handler
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > 50;
    const isDownSwipe = distance < -50;

    if (isUpSwipe && currentScene < storyScenes.length - 1) {
      setCurrentScene(prev => prev + 1);
    } else if (isDownSwipe && currentScene > 0) {
      setCurrentScene(prev => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleWheel, currentScene, storyScenes.length]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen overflow-hidden bg-brand-dark"
      role="region"
      aria-label="Interactive vehicle story"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Scene Backgrounds */}
      <AnimatePresence mode="wait">
        {storyScenes.map((scene, index) => (
          index === currentScene && (
            <motion.div
              key={scene.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
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

      {/* Scene Content */}
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

      {/* Progress Navigation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <ProgressDots
          scenes={storyScenes}
          currentIndex={currentScene}
          onSceneSelect={setCurrentScene}
        />
      </div>

      {/* Scene Counter */}
      <div className="absolute top-8 right-8 z-30 text-white/70 text-sm">
        {currentScene + 1} / {storyScenes.length}
      </div>

      {/* Scroll Hint */}
      <motion.div
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30 text-white/60 text-xs text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: currentScene === 0 ? 1 : 0 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <div className="flex flex-col items-center space-y-2">
          <p>Scroll or swipe to explore</p>
          <motion.div
            className="w-1 h-6 bg-white/40 rounded-full"
            animate={reduceMotion ? {} : { y: [0, 5, 0] }}
            transition={reduceMotion ? {} : { repeat: Infinity, duration: 1.5 }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default AppleStyleStorytellingSection;