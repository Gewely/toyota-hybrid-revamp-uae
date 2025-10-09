
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PersonaType } from "@/types/persona";
import { personas } from "@/data/personas";
import { usePersona } from "@/contexts/PersonaContext";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ChevronDown, MoveRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PersonaSelectorProps {
  onSelect: () => void;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({ onSelect }) => {
  const { setSelectedPersona, selectedPersona } = usePersona();
  const [hoveredPersona, setHoveredPersona] = useState<PersonaType | null>(null);
  const [visibleDetails, setVisibleDetails] = useState<PersonaType | null>(null);
  const [startSelectionAnimation, setStartSelectionAnimation] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track screen size for responsive adjustments
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePersonaSelect = (persona: PersonaType) => {
    if (persona === selectedPersona) {
      // If clicking the already selected persona, show its details
      setVisibleDetails(visibleDetails === persona ? null : persona);
      return;
    }
    
    // Start selection animation sequence
    setStartSelectionAnimation(true);
    setSelectedPersona(persona);
    
    // Add ambient sound effect as feedback
    const selectSound = new Audio('/sounds/select.mp3');
    selectSound.volume = 0.2;
    selectSound.play().catch(e => console.log('Audio playback prevented:', e));
    
    // Scroll to container top first for dramatic effect
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Animate out, then call parent's onSelect
    setTimeout(() => {
      onSelect();
      setStartSelectionAnimation(false);
    }, 1500);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };
  
  const personaTileAnimations = {
    "family-first": {
      hover: { 
        scale: 1.05,
        backgroundColor: 'rgba(143, 176, 234, 0.1)',
        boxShadow: '0 20px 25px -5px rgba(74, 109, 167, 0.2)',
        transition: { type: "spring", stiffness: 300, damping: 20 }
      },
      selected: {
        scale: [1, 1.1, 1],
        backgroundColor: 'rgba(143, 176, 234, 0.2)',
        boxShadow: '0 20px 30px -5px rgba(74, 109, 167, 0.4)',
        transition: { repeat: Infinity, repeatType: "reverse", duration: 3 }
      },
      icon: {
        y: [0, -5, 0],
        rotate: [0, -5, 0],
        transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
      }
    },
    "tech-enthusiast": {
      hover: { 
        scale: 1.05,
        backgroundColor: 'rgba(159, 122, 255, 0.1)',
        boxShadow: '0 0 20px rgba(107, 56, 251, 0.3)',
        transition: { type: "spring", stiffness: 400, damping: 10 }
      },
      selected: {
        scale: [1, 1.05, 1],
        backgroundColor: 'rgba(159, 122, 255, 0.15)',
        boxShadow: '0 0 30px rgba(107, 56, 251, 0.4)',
        transition: { repeat: Infinity, repeatType: "mirror", duration: 2 }
      },
      icon: {
        scale: [1, 1.2, 1],
        filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"],
        transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
      }
    },
    "eco-warrior": {
      hover: { 
        scale: 1.05,
        backgroundColor: 'rgba(129, 199, 132, 0.1)',
        boxShadow: '0 20px 25px -5px rgba(46, 125, 50, 0.2)',
        transition: { type: "spring", stiffness: 300, damping: 15 }
      },
      selected: {
        scale: [1, 1.03, 1],
        backgroundColor: 'rgba(129, 199, 132, 0.15)',
        boxShadow: '0 20px 30px -5px rgba(46, 125, 50, 0.3)',
        transition: { repeat: Infinity, repeatType: "mirror", duration: 4, ease: "easeInOut" }
      },
      icon: {
        rotate: [0, 15, 0, -15, 0],
        transition: { repeat: Infinity, duration: 5, ease: "easeInOut" }
      }
    },
    "urban-explorer": {
      hover: { 
        scale: 1.05,
        backgroundColor: 'rgba(120, 144, 156, 0.1)',
        boxShadow: '0 20px 25px -5px rgba(69, 90, 100, 0.2)',
        transition: { type: "spring", stiffness: 400, damping: 15 }
      },
      selected: {
        scale: [1, 1.04, 1],
        backgroundColor: 'rgba(120, 144, 156, 0.15)',
        boxShadow: '0 20px 30px -5px rgba(69, 90, 100, 0.3)',
        transition: { repeat: Infinity, repeatType: "mirror", duration: 3.5 }
      },
      icon: {
        x: [-3, 3, -3],
        transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
      }
    },
    "business-commuter": {
      hover: { 
        scale: 1.05,
        backgroundColor: 'rgba(84, 110, 122, 0.1)',
        boxShadow: '0 20px 25px -5px rgba(38, 50, 56, 0.2)',
        transition: { type: "spring", stiffness: 300, damping: 20 }
      },
      selected: {
        backgroundColor: 'rgba(84, 110, 122, 0.15)',
        boxShadow: '0 20px 30px -5px rgba(38, 50, 56, 0.3)',
        transition: { duration: 2 }
      },
      icon: {
        opacity: [0.9, 1, 0.9],
        transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
      }
    },
    "weekend-adventurer": {
      hover: { 
        scale: 1.05,
        backgroundColor: 'rgba(255, 138, 101, 0.1)',
        boxShadow: '0 20px 25px -5px rgba(191, 54, 12, 0.2)',
        transition: { type: "spring", stiffness: 300, damping: 15 }
      },
      selected: {
        scale: [1, 1.06, 1],
        backgroundColor: 'rgba(255, 138, 101, 0.15)',
        boxShadow: '0 20px 30px -5px rgba(191, 54, 12, 0.3)',
        transition: { repeat: Infinity, repeatType: "mirror", duration: 3 }
      },
      icon: {
        y: [0, -7, 0],
        transition: { repeat: Infinity, duration: 2.5, ease: "easeInOut" }
      }
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      className={cn(
        "py-10 lg:py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950",
        startSelectionAnimation && "overflow-hidden"
      )}
      initial="hidden"
      animate={startSelectionAnimation ? "exit" : "show"}
      variants={container}
    >
      <div className="toyota-container">
        {/* Heading section with enhanced animation */}
        <motion.div 
          variants={item} 
          className="text-center mb-8 lg:mb-12 max-w-4xl mx-auto"
        >
          <motion.div 
            className="inline-block mb-6 relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.span 
              className="inline-block text-5xl lg:text-6xl relative z-10"
              animate={{ 
                rotate: [0, -5, 5, -3, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                repeatDelay: 7
              }}
            >
              👋
            </motion.span>
            {/* Animated decorative elements */}
            <motion.div 
              className="absolute top-0 left-0 right-0 bottom-0 -z-10"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                repeatDelay: 7
              }}
            >
              <div className="w-full h-full rounded-full bg-yellow-200 bg-opacity-20" />
            </motion.div>
          </motion.div>

          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { 
                opacity: 1, 
                y: 0,
                transition: { 
                  delay: 0.2, 
                  type: "spring",
                  stiffness: 100
                }
              }
            }}
          >
            What Drives You? <br className="hidden md:block" />
            <span className="text-toyota-red">Let's Tailor Your Toyota Experience</span>
          </motion.h2>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { 
                opacity: 1, 
                y: 0,
                transition: { 
                  delay: 0.4,
                  type: "spring",
                  stiffness: 100
                }
              }
            }}
          >
            Select your lifestyle below and we'll personalize your entire browsing experience 
            to match your needs, preferences, and driving style.
          </motion.p>
          
          {/* Animated scroll indicator */}
          <motion.div 
            className="mt-8 flex justify-center items-center space-x-2 text-toyota-red"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown size={20} className="animate-bounce" />
            <span className="text-sm font-medium">Select your driving style</span>
            <ChevronDown size={20} className="animate-bounce" />
          </motion.div>
        </motion.div>
        
        {/* Personas grid with enhanced interactivity */}
        <motion.div 
          className={cn(
            "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6",
            startSelectionAnimation && "scale-90 opacity-50"
          )}
          variants={container}
        >
          {Object.values(personas).map((persona) => (
            <motion.div 
              key={persona.id} 
              variants={item}
              whileHover={(isMobile || selectedPersona === persona.id) ? {} : 
                (personaTileAnimations[persona.id as keyof typeof personaTileAnimations].hover)}
              animate={selectedPersona === persona.id ? 
                personaTileAnimations[persona.id as keyof typeof personaTileAnimations].selected : {}}
              onHoverStart={() => setHoveredPersona(persona.id)}
              onHoverEnd={() => setHoveredPersona(null)}
              onTap={() => setVisibleDetails(visibleDetails === persona.id ? null : persona.id)}
              className={cn(
                "perspective-1000", 
                visibleDetails === persona.id && "z-20"
              )}
            >
              <Card 
                className={cn(
                  "cursor-pointer h-full transition-all overflow-hidden relative",
                  `border-2 ${selectedPersona === persona.id ? "border-solid" : "border-dashed"}`,
                  selectedPersona === persona.id ? "shadow-persona" : "hover:shadow-lg",
                )}
                style={{ 
                  borderColor: selectedPersona === persona.id || hoveredPersona === persona.id ? 
                    persona.colorScheme.primary : "transparent",
                  background: selectedPersona === persona.id || hoveredPersona === persona.id ? 
                    `linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))` : 
                    `linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.95))`,
                  backgroundImage: persona.backgroundPattern || undefined
                }}
                onClick={() => handlePersonaSelect(persona.id)}
              >
                {/* Selection badge */}
                {selectedPersona === persona.id && (
                  <motion.div 
                    className="absolute -top-1 -right-1 z-10"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <div 
                      className="flex items-center justify-center p-1 rounded-full shadow-md"
                      style={{ 
                        backgroundColor: persona.colorScheme.primary,
                      }}
                    >
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                  </motion.div>
                )}

                {/* Persona content */}
                <CardContent className="flex flex-col items-center justify-center p-4 md:p-6 h-full">
                  {/* Icon with persona-specific animation */}
                  <motion.div 
                    className={cn(
                      "text-4xl sm:text-5xl mb-3 p-3 md:p-4 rounded-full",
                      "flex items-center justify-center"
                    )}
                    style={{ 
                      backgroundColor: `${selectedPersona === persona.id || hoveredPersona === persona.id ? 
                        persona.colorScheme.primary : 'rgba(0,0,0,0.03)'}`
                    }}
                    animate={selectedPersona === persona.id || hoveredPersona === persona.id ?
                      personaTileAnimations[persona.id as keyof typeof personaTileAnimations].icon : {}}
                    transition={{ duration: 1 }}
                  >
                    <span 
                      role="img" 
                      aria-label={persona.title}
                      className={cn(
                        selectedPersona === persona.id && "text-white",
                        "transition-colors duration-300"
                      )}
                    >
                      {persona.icon}
                    </span>
                  </motion.div>
                  
                  {/* Persona title */}
                  <h3 
                    className="font-bold text-lg mb-1 text-center transition-colors duration-300"
                    style={{ 
                      color: selectedPersona === persona.id || hoveredPersona === persona.id ? 
                        persona.colorScheme.primary : "" 
                    }}
                  >
                    {persona.title}
                  </h3>
                  
                  {/* Persona description */}
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 text-center">
                    {persona.description}
                  </p>
                  
                  {/* Selection indicator bar */}
                  <motion.div 
                    className="w-full mt-4 h-1 rounded-full bg-opacity-100"
                    style={{ backgroundColor: persona.colorScheme.primary }}
                    initial={{ width: "0%" }}
                    animate={{ 
                      width: selectedPersona === persona.id ? "100%" : 
                              hoveredPersona === persona.id ? "50%" : "0%",
                      backgroundColor: persona.colorScheme.primary
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </CardContent>
              </Card>
              
              {/* Expanded details panel */}
              <AnimatePresence>
                {visibleDetails === persona.id && (
                  <motion.div 
                    className="absolute z-30 top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 overflow-hidden"
                    style={{ borderColor: persona.colorScheme.primary }}
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <div className="p-4">
                      <h4 className="font-bold text-sm mb-2" style={{ color: persona.colorScheme.primary }}>
                        {persona.title} Experience Highlights:
                      </h4>
                      <ul className="text-xs space-y-1 mb-3">
                        {persona.valuePropositions?.slice(0, 3).map((value, i) => (
                          <li key={i} className="flex items-start">
                            <Star className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" style={{ color: persona.colorScheme.primary }} />
                            <span>{value}</span>
                          </li>
                        )) || (
                          <>
                            <li className="flex items-start">
                              <Star className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" style={{ color: persona.colorScheme.primary }} />
                              <span>Personalized recommendations</span>
                            </li>
                            <li className="flex items-start">
                              <Star className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" style={{ color: persona.colorScheme.primary }} />
                              <span>Tailored interface experience</span>
                            </li>
                          </>
                        )}
                      </ul>
                      <Button 
                        size="sm" 
                        className="w-full text-xs flex items-center justify-center"
                        style={{ 
                          backgroundColor: persona.colorScheme.primary,
                          color: "#FFF"
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePersonaSelect(persona.id);
                        }}
                      >
                        Choose This Style
                        <MoveRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Selection animation overlay */}
        <AnimatePresence>
          {startSelectionAnimation && selectedPersona && (
            <motion.div 
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="text-center p-8 rounded-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div 
                  className="text-7xl mb-4"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    rotate: [0, -10, 10, 0],
                  }}
                  transition={{ duration: 1 }}
                >
                  {personas[selectedPersona].icon}
                </motion.div>
                <motion.h3 
                  className="text-2xl font-bold text-white mb-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Personalizing as {personas[selectedPersona].title}
                </motion.h3>
                <motion.p 
                  className="text-gray-200"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Crafting your perfect Toyota experience...
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PersonaSelector;
