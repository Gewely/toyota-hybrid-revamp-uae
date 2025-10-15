
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePersona } from "@/contexts/PersonaContext";
import { X, ChevronUp, ChevronDown, RefreshCw, UserCog, CheckCircle, Globe, ClipboardEdit, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonaType } from "@/types/persona";
import { personas } from "@/data/personas";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePassiveScroll } from "@/hooks/use-passive-scroll";

const PersonaBadge: React.FC = () => {
  const { selectedPersona, resetPersona, setSelectedPersona, isTransitioning, personaData } = usePersona();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"personas" | "preferences" | "settings">("personas");
  const [animation, setAnimation] = useState<"idle" | "pulse" | "bounce">("idle");
  const [showCTA, setShowCTA] = useState(false);
  const [badgePosition, setBadgePosition] = useState({ x: 0, y: 0 });
  const [isPinned, setIsPinned] = useState(true);

  // Track scroll position for dynamic badge behavior - using passive scroll hook
  usePassiveScroll(() => {
    const scrollY = window.scrollY;
    setShowCTA(scrollY > 300);
  }, []);
  
  if (!selectedPersona) return null;
  
  const persona = personas[selectedPersona];

  // Create a wobble animation every 30 seconds to remind user they can change persona
  React.useEffect(() => {
    const interval = setInterval(() => {
      setAnimation("bounce");
      setTimeout(() => setAnimation("idle"), 1000);
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  
  // Handle user drag to reposition badge
  const handleDragEnd = (event: any, info: any) => {
    setBadgePosition({
      x: badgePosition.x + info.offset.x,
      y: badgePosition.y + info.offset.y
    });
  };
  
  // Handle persona change
  const handlePersonaChange = (id: PersonaType) => {
    if (id === selectedPersona) return;
    
    setSelectedPersona(id);
    setIsOpen(false);
    
    toast({
      title: "Experience personalized!",
      description: `Now browsing as ${personas[id].title}`,
      variant: "default",
      style: { 
        backgroundColor: personas[id].colorScheme.primary,
        color: "#FFF"
      },
    });
  };

  // Animation variants
  const drawerVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 10, scale: 0.95 }
  };

  const badgeVariants = {
    idle: {},
    pulse: {
      scale: [1, 1.05, 1],
      transition: { duration: 0.5 }
    },
    bounce: {
      y: [0, -10, 0],
      transition: { 
        times: [0, 0.5, 1],
        duration: 0.5 
      }
    }
  };
  
  // Get persona-specific animations and styles
  const getPersonaAnimation = () => {
    switch(selectedPersona) {
      case "family-first":
        return {
          icon: { 
            rotate: [0, -10, 10, -5, 0],
            transition: { repeat: Infinity, duration: 8, repeatDelay: 5 }
          }
        };
      case "tech-enthusiast":
        return {
          icon: { 
            scale: [1, 1.2, 1],
            filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
            transition: { repeat: Infinity, duration: 2 }
          }
        };
      case "eco-warrior":
        return {
          icon: { 
            rotate: [0, 15, 0, -15, 0],
            transition: { repeat: Infinity, duration: 6 }
          }
        };
      case "urban-explorer":
        return {
          icon: { 
            x: [-3, 3, -3],
            transition: { repeat: Infinity, duration: 4 }
          }
        };
      case "business-commuter":
        return {
          icon: { 
            opacity: [1, 0.7, 1],
            transition: { repeat: Infinity, duration: 3 }
          }
        };
      case "weekend-adventurer":
        return {
          icon: { 
            y: [0, -5, 0],
            transition: { repeat: Infinity, duration: 4 }
          }
        };
      default:
        return { icon: {} };
    }
  };
  
  const personaAnimation = getPersonaAnimation();
  
  // Get badge style based on persona
  const getBadgeStyle = () => {
    const baseStyle = {
      backgroundColor: persona.colorScheme.primary,
      color: "#FFFFFF",
      boxShadow: `0 10px 25px -5px ${persona.colorScheme.primary}80`,
      border: "2px solid rgba(255,255,255,0.3)"
    };
    
    // Add persona-specific style modifications
    switch(selectedPersona) {
      case "family-first":
        return { ...baseStyle, borderRadius: "1.5rem" };
      case "tech-enthusiast":
        return { ...baseStyle, borderRadius: "0.5rem", border: `2px solid ${persona.colorScheme.accent}` };
      case "eco-warrior":
        return { ...baseStyle, borderRadius: "2rem", border: `2px solid rgba(255,255,255,0.5)` };
      case "urban-explorer":
        return { ...baseStyle, borderRadius: "0.75rem" };
      case "business-commuter":
        return { ...baseStyle, borderRadius: "0", borderBottom: `3px solid ${persona.colorScheme.accent}` };
      case "weekend-adventurer":
        return { ...baseStyle, borderRadius: "0.75rem", border: `2px dashed rgba(255,255,255,0.5)` };
      default:
        return baseStyle;
    }
  };

  return (
    <>
      {/* Main badge */}
      <motion.div 
        className={cn(
          "fixed z-40 transition-all duration-300",
          isPinned ? "bottom-24 md:bottom-8 right-4" : ""
        )}
        style={!isPinned ? { left: badgePosition.x, top: badgePosition.y } : {}}
        drag={!isPinned}
        dragConstraints={{ left: 0, right: window.innerWidth - 200, top: 0, bottom: window.innerHeight - 60 }}
        onDragEnd={handleDragEnd}
        dragMomentum={false}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                "bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 mb-3 w-[280px] md:w-[320px]",
                "border overflow-hidden"
              )}
              style={{ 
                borderLeft: `5px solid ${persona.colorScheme.primary}`,
                boxShadow: `0 10px 25px -5px ${persona.colorScheme.primary}30`,
                ...getBadgeStyle()
              }}
            >
              <div className="flex justify-between items-center mb-3 border-b pb-2 border-white/20">
                <h3 className="font-bold text-lg text-white">
                  {selectedTab === "personas" ? "Change Experience" : 
                   selectedTab === "preferences" ? "Preferences" : "Settings"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <Tabs 
                defaultValue="personas"
                value={selectedTab} 
                onValueChange={(value) => setSelectedTab(value as any)}
                className="w-full"
              >
                <TabsList className="w-full mb-4 bg-white/10">
                  <TabsTrigger 
                    value="personas"
                    className="text-white data-[state=active]:bg-white/30 flex items-center gap-1"
                  >
                    <UserCog className="h-3.5 w-3.5" />
                    <span>Personas</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="preferences"
                    className="text-white data-[state=active]:bg-white/30 flex items-center gap-1"
                  >
                    <ClipboardEdit className="h-3.5 w-3.5" />
                    <span>Preferences</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settings" 
                    className="text-white data-[state=active]:bg-white/30 flex items-center gap-1"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    <span>Settings</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="personas" className="m-0">
                  <div className="mb-4">
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {Object.values(personas).map((p) => (
                        <motion.button
                          key={p.id}
                          className={cn(
                            "flex flex-col items-center p-3 rounded-lg border-2 transition-all relative",
                            p.id === selectedPersona 
                              ? "bg-white/20 border-white" 
                              : "bg-white/10 border-transparent",
                          )}
                          style={{ 
                            borderColor: p.id === selectedPersona ? "white" : "transparent",
                          }}
                          onClick={() => handlePersonaChange(p.id)}
                          whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.25)" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="text-2xl mb-1 relative">
                            {p.icon}
                            {p.id === selectedPersona && (
                              <motion.div 
                                className="absolute -top-1 -right-1 bg-green-500 rounded-full border-2 border-white"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                              >
                                <CheckCircle className="h-4 w-4 text-white" />
                              </motion.div>
                            )}
                          </div>
                          <span className="text-xs font-medium text-center text-white">{p.title}</span>
                        </motion.button>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={resetPersona} 
                      className="w-full flex items-center justify-center bg-white/10 text-white border-white/30 hover:bg-white/20"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset to Default
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="preferences" className="m-0">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-white">Visual Preferences</h4>
                      <div className="space-y-3 text-white/90">
                        <div className="flex justify-between items-center">
                          <label className="text-sm flex items-center">
                            <Bell className="h-4 w-4 mr-1.5" />
                            <span>Enhanced Animations</span>
                          </label>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <label className="text-sm flex items-center">
                            <Globe className="h-4 w-4 mr-1.5" />
                            <span>High Contrast</span>
                          </label>
                          <Switch />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <label className="text-sm flex items-center">
                            <Settings className="h-4 w-4 mr-1.5" />
                            <span>Advanced Features</span>
                          </label>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-white">Content Preferences</h4>
                      <div className="flex flex-wrap gap-2">
                        {["Vehicles", "Features", "Safety", "Technology", "Design", "Performance"].map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="m-0">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-white">Display Settings</h4>
                      <div className="space-y-3 text-white/90">
                        <div className="flex justify-between items-center">
                          <label className="text-sm">Show badge as floating</label>
                          <Switch 
                            checked={!isPinned}
                            onCheckedChange={(checked) => setIsPinned(!checked)}
                          />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <label className="text-sm">Show related models</label>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-white">Privacy Settings</h4>
                      <div className="space-y-3 text-white/90">
                        <div className="flex justify-between items-center">
                          <label className="text-sm">Remember my persona</label>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <label className="text-sm">Personalized content</label>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div
          animate={animation}
          variants={badgeVariants}
          className={cn(
            "flex items-center gap-2 px-4 py-3 cursor-pointer transition-all",
            isPinned ? "rounded-full" : "rounded-lg"
          )}
          style={getBadgeStyle()}
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span 
            className="text-xl"
            animate={personaAnimation.icon}
            transition={{ duration: 0.5 }}
          >
            {persona.icon}
          </motion.span>
          <span className="font-medium mr-1">Browsing as: {persona.title}</span>
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </motion.div>
      </motion.div>
      
      {/* Call-to-action bubble that appears while scrolling */}
      <AnimatePresence>
        {showCTA && !isOpen && personaData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={cn(
              "fixed bottom-36 md:bottom-20 right-4 z-30 p-3 rounded-lg max-w-xs",
              "text-white text-sm shadow-lg"
            )}
            style={{ 
              backgroundColor: persona.colorScheme.primary,
              boxShadow: `0 10px 25px -5px ${persona.colorScheme.primary}60`,
            }}
          >
            <div className="flex items-start space-x-2">
              <div className="text-2xl mt-0.5">{persona.icon}</div>
              <div>
                <p className="font-medium mb-1">
                  We've personalized your experience as a {persona.title}
                </p>
                <p className="text-xs opacity-80">
                  Tap the persona badge to change or customize your experience anytime
                </p>
              </div>
            </div>
            <div 
              className="absolute w-4 h-4 transform rotate-45 bg-inherit"
              style={{ 
                right: '20px', 
                bottom: '-2px'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PersonaBadge;
