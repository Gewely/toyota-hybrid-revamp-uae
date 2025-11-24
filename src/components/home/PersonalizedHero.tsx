
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePersona } from "@/contexts/PersonaContext";
import { ArrowRight, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const PersonalizedHero: React.FC = () => {
  const { personaData, isTransitioning } = usePersona();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();
  const [hasInteracted, setHasInteracted] = useState(false);
  
  useEffect(() => {
    if (personaData) {
      // Reset animation state on persona change
      setAnimationComplete(false);
      setIsImageLoaded(false);
      
      // Preload the background image or setup video
      if (personaData.backgroundImage.endsWith('.mp4')) {
        // It's a video
        if (videoRef.current) {
          videoRef.current.src = personaData.backgroundImage;
          videoRef.current.onloadeddata = () => setIsImageLoaded(true);
          videoRef.current.play().catch(err => console.log('Auto-play prevented:', err));
        }
      } else {
        // It's an image
        const img = new Image();
        img.src = personaData.backgroundImage;
        img.onload = () => setIsImageLoaded(true);
      }
      
      // Mark animation as complete after delay
      const timer = setTimeout(() => {
        setAnimationComplete(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [personaData]);
  
  // Track user interaction
  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
    };
    
    window.addEventListener('click', handleInteraction);
    window.addEventListener('scroll', handleInteraction);
    
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };
  }, []);
  
  if (!personaData) return null;

  // Get animation style based on persona preference - optimized for mobile
  const getAnimation = (style: string) => {
    const mobileDuration = isMobile ? 0.4 : 0.6;
    const mobileDistance = isMobile ? 40 : 80;
    
    switch (style) {
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: mobileDuration, ease: [0.4, 0, 0.2, 1] }
        };
      case "slide":
        return {
          initial: { x: -mobileDistance, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: mobileDistance, opacity: 0 },
          transition: { duration: mobileDuration, ease: [0.4, 0, 0.2, 1] }
        };
      case "zoom":
        return {
          initial: { scale: 0.9, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 1.1, opacity: 0 },
          transition: { duration: mobileDuration, ease: [0.4, 0, 0.2, 1] }
        };
      case "bounce":
        return {
          initial: { y: isMobile ? -40 : -80, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: isMobile ? 40 : 80, opacity: 0 },
          transition: { 
            type: "spring", 
            stiffness: isMobile ? 200 : 120, 
            damping: isMobile ? 20 : 12 
          }
        };
      case "flip":
        return {
          initial: { rotateY: 60, opacity: 0 },
          animate: { rotateY: 0, opacity: 1 },
          exit: { rotateY: -60, opacity: 0 },
          transition: { duration: mobileDuration, ease: [0.4, 0, 0.2, 1] }
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: mobileDuration, ease: [0.4, 0, 0.2, 1] }
        };
    }
  };

  // Get persona-specific styles
  const getPersonaStyles = () => {
    const baseStyles = {
      heading: "text-4xl md:text-6xl font-bold mb-4 text-shadow-lg",
      subheading: "text-xl md:text-2xl mb-8 text-shadow max-w-2xl mx-auto",
      button: "text-white rounded-full shadow-lg transform transition-all duration-300 hover:scale-105",
      overlay: "absolute inset-0 bg-black/40 z-10"
    };
    
    switch (personaData.id) {
      case "family-first":
        return {
          ...baseStyles,
          heading: `${baseStyles.heading} font-serif tracking-wide`,
          button: `${baseStyles.button} rounded-xl font-semibold`,
          overlay: `${baseStyles.overlay} bg-gradient-to-b from-black/60 to-black/30`
        };
      case "tech-enthusiast":
        return {
          ...baseStyles,
          heading: `${baseStyles.heading} font-mono tracking-tight`,
          button: `${baseStyles.button} rounded-md border border-white/20 backdrop-blur-sm`,
          overlay: `${baseStyles.overlay} bg-gradient-to-r from-black/50 via-black/30 to-black/50`
        };
      case "eco-warrior":
        return {
          ...baseStyles,
          heading: `${baseStyles.heading} font-light tracking-wide`,
          button: `${baseStyles.button} rounded-full border-2 border-white/20`,
          overlay: `${baseStyles.overlay} bg-gradient-to-t from-black/60 via-black/30 to-black/20`
        };
      case "urban-explorer":
        return {
          ...baseStyles,
          heading: `${baseStyles.heading} uppercase tracking-wider text-shadow-lg`,
          button: `${baseStyles.button} rounded-none border-b-2 border-white/50`,
          overlay: `${baseStyles.overlay} bg-black/30`
        };
      case "business-commuter":
        return {
          ...baseStyles,
          heading: `${baseStyles.heading} font-light tracking-tight`,
          button: `${baseStyles.button} rounded-none border-b-2`,
          overlay: `${baseStyles.overlay} bg-gradient-to-b from-black/70 via-black/40 to-black/30`
        };
      case "weekend-adventurer":
        return {
          ...baseStyles,
          heading: `${baseStyles.heading} font-extrabold tracking-wide`,
          button: `${baseStyles.button} rounded-lg font-bold`,
          overlay: `${baseStyles.overlay} bg-gradient-to-br from-black/50 to-black/30`
        };
      default:
        return baseStyles;
    }
  };

  const animationProps = getAnimation(personaData.animationStyle);
  const styles = getPersonaStyles();

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={personaData.id}
        className={cn(
          "relative h-[90vh] sm:h-[85vh] md:h-[75vh] overflow-hidden",
          personaData.id === "tech-enthusiast" && "tech-grid-bg",
          personaData.id === "eco-warrior" && "nature-pattern"
        )}
        style={{ backgroundColor: personaData.colorScheme.primary }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.overlay} />
        
        {/* Background media - image or video */}
        <motion.div
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: isImageLoaded ? 1 : 0
          }}
          transition={{ duration: isMobile ? 0.8 : 1.5, ease: [0.4, 0, 0.2, 1] }}
          className="w-full h-full"
        >
          {personaData.backgroundImage.endsWith('.mp4') ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={personaData.backgroundImage} type="video/mp4" />
            </video>
          ) : (
            <img
              src={personaData.backgroundImage}
              alt={personaData.title}
              className="w-full h-full object-cover"
              onLoad={() => setIsImageLoaded(true)}
            />
          )}
        </motion.div>
        
        {/* Mobile scroll indicator - faster animation */}
        {isMobile && !hasInteracted && (
          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            <motion.div 
              className="w-1.5 h-8 rounded-full border-2 border-white flex items-start justify-center p-1"
              animate={{ y: [0, 4, 0], opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              <motion.div 
                className="w-1 h-1.5 bg-white rounded-full"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              />
            </motion.div>
            <motion.p 
              className="text-white text-xs mt-2 opacity-80"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              Scroll to explore
            </motion.p>
          </motion.div>
        )}
        
        {/* Persona-specific decorative elements */}
        <div className="absolute inset-0 z-[11] pointer-events-none overflow-hidden">
          {personaData.id === "tech-enthusiast" && (
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-10 h-full">
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.div 
                    key={i}
                    className="border-r border-white/30 h-full"
                    initial={{ height: 0 }}
                    animate={{ height: "100%" }}
                    transition={{ delay: i * 0.1, duration: 1 }}
                  />
                ))}
              </div>
              <div className="grid grid-rows-10 w-full absolute top-0">
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.div 
                    key={i}
                    className="border-b border-white/30 w-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: i * 0.1, duration: 1 }}
                  />
                ))}
              </div>
            </div>
          )}
          
          {personaData.id === "eco-warrior" && (
            <div className="absolute inset-0 opacity-30">
              <motion.div 
                className="absolute bottom-0 left-0 right-0 overflow-hidden"
                initial={{ height: 0 }}
                animate={{ height: "40%" }}
                transition={{ delay: 0.5, duration: 1.5 }}
              >
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute bottom-0 rounded-full bg-white/30"
                    style={{
                      left: `${(i * 10) % 100}%`,
                      width: `${20 + Math.random() * 60}px`,
                      height: `${100 + Math.random() * 200}px`,
                    }}
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ 
                      delay: 0.5 + i * 0.1, 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      repeatDelay: Math.random() * 5
                    }}
                  />
                ))}
              </motion.div>
            </div>
          )}
          
          {personaData.id === "family-first" && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              transition={{ delay: 1, duration: 1 }}
            >
              <div className="w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] rounded-full border-[20px] border-dashed border-white/30" />
            </motion.div>
          )}
          
          {personaData.id === "weekend-adventurer" && (
            <motion.div 
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ delay: 0.5 }}
            >
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.path
                    key={i}
                    d={`M0,${50 + i * 5} Q${25 + i * 2},${40 + i * 3} ${50 + i},${60 - i * 2} T100,${45 + i * 2}`}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="0.5"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: i * 0.2, duration: 2 }}
                  />
                ))}
              </svg>
            </motion.div>
          )}
          
          {personaData.id === "urban-explorer" && (
            <motion.div 
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              transition={{ delay: 0.5 }}
            >
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {Array.from({ length: 15 }).map((_, i) => (
                  <motion.rect
                    key={i}
                    x={Math.random() * 90}
                    y={Math.random() * 90}
                    width={5 + Math.random() * 10}
                    height={5 + Math.random() * 20}
                    fill="rgba(255,255,255,0.1)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ delay: i * 0.1, duration: 1 }}
                  />
                ))}
              </svg>
            </motion.div>
          )}
          
          {personaData.id === "business-commuter" && (
            <motion.div 
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ delay: 0.5 }}
            >
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <motion.line
                  x1="0" y1="50" x2="100" y2="50"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5 }}
                />
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.line
                    key={i}
                    x1={i * 10} y1="0" x2={i * 10} y2="100"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="0.2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: i * 0.1, duration: 1 }}
                  />
                ))}
              </svg>
            </motion.div>
          )}

          {/* Mobile floating particles - faster */}
          {isMobile && (
            <div className="absolute inset-0">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bg-white/15 rounded-full"
                  style={{ 
                    width: `${3 + Math.random() * 5}px`, 
                    height: `${3 + Math.random() * 5}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                  animate={{
                    x: [0, Math.random() * 15 - 7.5, 0],
                    y: [0, Math.random() * 15 - 7.5, 0],
                    opacity: [0.2, 0.6, 0.2],
                    scale: [1, 1.15, 1]
                  }}
                  transition={{
                    duration: 2.5 + Math.random() * 2.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white p-6">
          <div className="max-w-4xl mx-auto">
            {/* Main heading with persona-specific animation */}
            <motion.div {...animationProps}>
              <motion.h1 
                className={styles.heading}
                style={{ 
                  textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                }}
                animate={
                  personaData.id === "tech-enthusiast" ? {
                    textShadow: ["0 0 5px rgba(0,212,255,0.5)", "0 0 15px rgba(0,212,255,0.8)", "0 0 5px rgba(0,212,255,0.5)"]
                  } : 
                  personaData.id === "eco-warrior" ? {
                    textShadow: ["0 2px 10px rgba(0,0,0,0.5)", "0 2px 15px rgba(46,125,50,0.8)", "0 2px 10px rgba(0,0,0,0.5)"]
                  } : {}
                }
                transition={{ repeat: Infinity, duration: 3 }}
              >
                {personaData.headlineText}
              </motion.h1>
            </motion.div>
            
            {/* Subheading with staggered animation */}
            <motion.p 
              {...animationProps}
              transition={{ ...animationProps.transition, delay: 0.2 }}
              className={styles.subheading}
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
            >
              {personaData.subheadlineText}
            </motion.p>
            
            {/* CTA button with persona-specific styling */}
            <motion.div
              {...animationProps}
              transition={{ ...animationProps.transition, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                size="lg"
                className={styles.button}
                style={{ 
                  backgroundColor: personaData.colorScheme.accent,
                  boxShadow: `0 10px 25px -5px ${personaData.colorScheme.accent}80` 
                }}
              >
                <Link to="/new-cars" className="flex items-center gap-2 px-8 py-6 text-lg">
                  {personaData.ctaText}
                  <ArrowRight className={cn(
                    "h-5 w-5 ml-1",
                    personaData.id === "tech-enthusiast" ? "animate-pulse" :
                    personaData.id === "weekend-adventurer" ? "animate-bounce" : ""
                  )} />
                </Link>
              </Button>
            </motion.div>
            
            {/* Persona label badge */}
            {animationComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-8"
              >
                <span 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white/20 backdrop-blur-sm"
                >
                  <Star className="h-3 w-3 mr-1" />
                  <span>Personalized for {personaData.title}</span>
                </span>
              </motion.div>
            )}

            {/* Scroll hint for mobile */}
            {isMobile && (
              <motion.div
                className="absolute bottom-16 left-0 right-0 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ChevronRight 
                    className="h-8 w-8 transform rotate-90 opacity-70"
                  />
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PersonalizedHero;
