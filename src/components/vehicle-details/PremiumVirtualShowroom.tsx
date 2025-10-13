import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Play, Sparkles, Maximize2, X, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface PremiumVirtualShowroomProps {
  vehicleName: string;
}

const PremiumVirtualShowroom: React.FC<PremiumVirtualShowroomProps> = ({ vehicleName }) => {
  const [isActive, setIsActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isMobile = useIsMobile();
  
  // Convert vehicle name to URL format
  const urlPath = vehicleName
    .toLowerCase()
    .replace(/toyota\s+/gi, "")
    .replace(/\s+/g, "-");
  
  const iframeUrl = `https://www.virtualshowroom.toyota.ae/configurator/${urlPath}/en`;

  const handleActivate = () => {
    setIsActive(true);
  };

  const handleClose = () => {
    setIsActive(false);
    setIsFullscreen(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isActive) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`${isFullscreen ? 'fixed inset-0 z-50' : 'relative w-full'} bg-black`}
      >
        {/* Controls Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Virtual Showroom
            </Badge>
            <h3 className="text-white font-semibold hidden sm:block">{vehicleName}</h3>
          </div>
          
          <div className="flex items-center gap-2">
            {!isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/10"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Iframe Container */}
        <div className={`w-full ${isFullscreen ? 'h-screen' : 'h-[80vh] md:h-screen'}`}>
          <iframe
            src={iframeUrl}
            className="w-full h-full border-0"
            title={`${vehicleName} Virtual Showroom`}
            loading="lazy"
            allow="accelerometer; gyroscope; fullscreen"
          />
        </div>
      </motion.section>
    );
  }

  return (
    <section className="relative py-16 md:py-24 px-4 overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Ambient background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
            Interactive Experience
          </Badge>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
            Step Into the Virtual Showroom
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the {vehicleName} like never before with our immersive 360° virtual showroom
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative group cursor-pointer"
          onClick={handleActivate}
        >
          {/* Main Card */}
          <div className="relative bg-gradient-to-br from-card via-card to-muted/30 backdrop-blur-xl border border-border/50 rounded-3xl p-6 md:p-12 lg:p-16 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 hover:scale-[1.01]">
            
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10" />
            </div>

            {/* Floating sparkles */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-8 right-8 text-primary/40"
            >
              <Sparkles className="w-8 h-8 md:w-12 md:h-12" />
            </motion.div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-6 md:space-y-8">
              {/* Icon with pulse effect */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative"
              >
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center backdrop-blur-sm border-2 border-primary/30 shadow-lg shadow-primary/20">
                  <Play className="w-10 h-10 md:w-14 md:h-14 text-primary" fill="currentColor" />
                </div>
                
                {/* Pulse rings */}
                <motion.div
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                  className="absolute inset-0 rounded-full bg-primary/30 -z-10"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.6, 1],
                    opacity: [0.3, 0, 0.3],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 0.5
                  }}
                  className="absolute inset-0 rounded-full bg-primary/20 -z-10"
                />
              </motion.div>

              {/* Content */}
              <div className="space-y-3 md:space-y-4">
                <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold">
                  Launch Virtual Experience
                </h3>
                <p className="text-sm md:text-lg text-muted-foreground max-w-xl mx-auto">
                  Explore every angle, customize colors, and experience the {vehicleName} in stunning 360° detail from the comfort of your screen
                </p>
              </div>

              {/* Features grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-4 md:pt-6 w-full max-w-3xl">
                {[
                  { label: "360° Rotation", icon: "🔄" },
                  { label: "Color Studio", icon: "🎨" },
                  { label: "Interior Tour", icon: "🚗" },
                  { label: "Real-time 3D", icon: "✨" },
                ].map((feature, i) => (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5"
                  >
                    <span className="text-2xl md:text-3xl">{feature.icon}</span>
                    <span className="text-xs md:text-sm font-medium text-muted-foreground">{feature.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <Button
                size={isMobile ? "default" : "lg"}
                className="mt-4 md:mt-6 px-6 md:px-8 py-4 md:py-6 text-base md:text-lg font-semibold group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-105"
              >
                <ExternalLink className="mr-2 w-4 h-4 md:w-5 md:h-5" />
                Enter Virtual Showroom
              </Button>

              {/* Additional info */}
              <p className="text-xs md:text-sm text-muted-foreground mt-4">
                No download required • Works on all devices • Fully interactive
              </p>
            </div>

            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-24 md:w-32 h-24 md:h-32 border-t-2 border-l-2 border-primary/20 rounded-tl-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 right-0 w-24 md:w-32 h-24 md:h-32 border-b-2 border-r-2 border-primary/20 rounded-br-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mt-8 md:mt-12 text-xs md:text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Live 3D Rendering</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Powered by Toyota UAE</span>
          </div>
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-primary" />
            <span>Official Virtual Showroom</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumVirtualShowroom;
