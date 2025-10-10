import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Play, X, Maximize2, Grid3x3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PremiumVirtualShowroomProps {
  vehicleName: string;
}

const PremiumVirtualShowroom: React.FC<PremiumVirtualShowroomProps> = ({ vehicleName }) => {
  const [isActive, setIsActive] = useState(false);
  
  const urlPath = vehicleName
    .toLowerCase()
    .replace(/toyota\s+/gi, "")
    .replace(/\s+/g, "-");
  
  const iframeUrl = `https://www.virtualshowroom.toyota.ae/configurator/${urlPath}/en`;

  const handleActivate = () => {
    setIsActive(true);
  };

  if (isActive) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[100] bg-black"
      >
        <div className="relative w-full h-full">
          <iframe
            src={iframeUrl}
            className="w-full h-full border-0"
            title={`${vehicleName} Virtual Showroom`}
            loading="lazy"
            allow="accelerometer; gyroscope; fullscreen"
          />
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsActive(false)}
            className="absolute top-6 right-6 z-10 bg-black/80 backdrop-blur-xl border-white/20 text-white hover:bg-black/90 hover:border-white/40 gap-2"
          >
            <X className="w-5 h-5" />
            Close Showroom
          </Button>
        </div>
      </motion.section>
    );
  }

  return (
    <section className="relative py-32 px-4 overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Premium background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Premium header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Grid3x3 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Immersive Experience</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
            Virtual Showroom
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience the {vehicleName} in stunning 360° detail. Configure colors, explore features, and visualize your dream vehicle.
          </p>
        </motion.div>

        {/* Premium interactive card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative group cursor-pointer"
          onClick={handleActivate}
        >
          {/* Glow effect on hover */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
          
          {/* Main card */}
          <div className="relative bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-2xl border-2 border-border/50 rounded-3xl p-12 md:p-16 overflow-hidden shadow-2xl group-hover:border-primary/30 transition-all duration-500">
            
            {/* Animated mesh gradient background */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.1),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(var(--accent-rgb),0.1),transparent_50%)]" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-10">
              {/* Premium icon with animation */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative"
              >
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10 flex items-center justify-center backdrop-blur-sm border-2 border-primary/20 shadow-xl">
                  <Play className="w-16 h-16 text-primary" fill="currentColor" />
                </div>
                
                {/* Pulsing rings */}
                <motion.div
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.6, 0, 0.6],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                  className="absolute inset-0 rounded-3xl border-2 border-primary/40"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.6, 1],
                    opacity: [0.4, 0, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 0.5
                  }}
                  className="absolute inset-0 rounded-3xl border-2 border-accent/40"
                />
              </motion.div>

              {/* Premium content */}
              <div className="space-y-6">
                <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Launch Interactive Experience
                </h3>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                  Step into our immersive virtual showroom and explore the {vehicleName} like never before
                </p>
              </div>

              {/* Premium features grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 w-full max-w-3xl">
                {[
                  { 
                    label: "360° View", 
                    icon: "🔄",
                    desc: "Rotate and explore every angle"
                  },
                  { 
                    label: "Live Customization", 
                    icon: "🎨",
                    desc: "See changes in real-time"
                  },
                  { 
                    label: "Interior Tour", 
                    icon: "🚗",
                    desc: "Explore premium details"
                  },
                ].map((feature, i) => (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                    className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-background/50 to-background/30 border border-border/50 backdrop-blur-sm group-hover:border-primary/20 transition-all duration-300"
                  >
                    <span className="text-5xl">{feature.icon}</span>
                    <div className="text-center">
                      <span className="font-semibold text-base block mb-1">{feature.label}</span>
                      <span className="text-sm text-muted-foreground">{feature.desc}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Premium CTA */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  className="mt-8 px-10 py-7 text-lg font-semibold rounded-2xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-2xl shadow-primary/20 group-hover:shadow-primary/30 transition-all duration-300 gap-3"
                >
                  <Maximize2 className="w-6 h-6" />
                  Enter Virtual Showroom
                  <ExternalLink className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>

            {/* Premium corner accents */}
            <div className="absolute top-0 left-0 w-40 h-40 border-t-2 border-l-2 border-primary/20 rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-40 h-40 border-b-2 border-r-2 border-primary/20 rounded-br-3xl" />
            
            {/* Floating particles */}
            <motion.div
              animate={{
                y: [-10, 10, -10],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-10 right-10 w-3 h-3 bg-primary/40 rounded-full blur-sm"
            />
            <motion.div
              animate={{
                y: [10, -10, 10],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute bottom-20 left-20 w-2 h-2 bg-accent/40 rounded-full blur-sm"
            />
          </div>
        </motion.div>

        {/* Bottom trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground"
        >
          {[
            "Powered by Toyota UAE",
            "Real-time Configuration",
            "High-Fidelity 3D Models"
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>{item}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumVirtualShowroom;
