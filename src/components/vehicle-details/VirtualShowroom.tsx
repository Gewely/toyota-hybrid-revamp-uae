import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VirtualShowroomProps {
  vehicleName: string;
}

const VirtualShowroom: React.FC<VirtualShowroomProps> = ({ vehicleName }) => {
  const [isActive, setIsActive] = useState(false);

  const handleActivate = () => {
    setIsActive(true);
  };

  if (isActive) {
    return (
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full h-screen bg-background/95 backdrop-blur-sm"
      >
        <iframe
          src={`https://www.toyota.com/360-congfigurator/${vehicleName.toLowerCase()}`}
          className="w-full h-full border-0"
          title={`${vehicleName} Virtual Showroom`}
          loading="lazy"
          allow="accelerometer; gyroscope; fullscreen"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsActive(false)}
          className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm"
        >
          Close
        </Button>
      </motion.section>
    );
  }

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Step Into the Future
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the {vehicleName} like never before in our immersive virtual showroom
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
          {/* Glass card */}
          <div className="relative bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-border/50 rounded-3xl p-8 md:p-12 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30">
            
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5" />
            </div>

            {/* Sparkle effects */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-8 right-8 text-primary/40"
            >
              <Sparkles className="w-8 h-8" />
            </motion.div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-8">
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center backdrop-blur-sm border border-primary/30">
                  <Play className="w-12 h-12 text-primary" fill="currentColor" />
                </div>
                
                {/* Pulse effect */}
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                  className="absolute inset-0 rounded-full bg-primary/30"
                />
              </motion.div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-3xl md:text-4xl font-bold text-foreground">
                  Launch Virtual Experience
                </h3>
                <p className="text-muted-foreground text-lg max-w-xl">
                  Explore every angle, customize your dream configuration, and experience the {vehicleName} in stunning 360° detail
                </p>
              </div>

              {/* Features grid */}
              <div className="grid grid-cols-3 gap-6 pt-6 w-full max-w-2xl">
                {[
                  { label: "360° View", icon: "🔄" },
                  { label: "Color Options", icon: "🎨" },
                  { label: "Interior Tour", icon: "🚗" },
                ].map((feature, i) => (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <span className="text-3xl">{feature.icon}</span>
                    <span className="text-sm text-muted-foreground">{feature.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <Button
                size="lg"
                className="mt-6 px-8 py-6 text-lg group-hover:shadow-lg group-hover:shadow-primary/20 transition-shadow duration-300"
              >
                Enter Virtual Showroom
                <ExternalLink className="ml-2 w-5 h-5" />
              </Button>
            </div>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-primary/20 rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-primary/20 rounded-br-3xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VirtualShowroom;
