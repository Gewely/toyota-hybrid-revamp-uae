import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Sun, Moon, MapPin } from "lucide-react";

interface CinematicFlagshipGalleryProps {
  vehicleName: string;
  galleryImages: string[];
  onReserve: () => void;
  onTestDrive: () => void;
  onConfigure: () => void;
}

const CinematicFlagshipGallery: React.FC<CinematicFlagshipGalleryProps> = ({
  vehicleName,
  galleryImages,
  onReserve,
  onTestDrive,
  onConfigure,
}) => {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<"sport" | "urban" | "eco">("urban");
  const [selectedAmbient, setSelectedAmbient] = useState<string>("pearl");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();
  
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!shouldReduceMotion) {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [shouldReduceMotion]);

  const hotspots = [
    { id: "grille", label: "Diamond Grille", x: "50%", y: "30%", details: "Signature chrome-finished grille with precision-cut pattern" },
    { id: "wheels", label: "Alloy Wheels", x: "20%", y: "70%", details: "18-inch multi-spoke alloy wheels with performance tires" },
    { id: "headlights", label: "LED Headlights", x: "75%", y: "35%", details: "Adaptive LED headlights with auto high-beam" },
  ];

  const moods = {
    sport: { bg: "from-red-950/30 via-background to-background", speed: 1.5, label: "Sport" },
    urban: { bg: "from-slate-900/40 via-background to-background", speed: 1, label: "Urban" },
    eco: { bg: "from-emerald-950/30 via-background to-background", speed: 0.8, label: "Eco" },
  };

  const ambientColors = [
    { id: "pearl", label: "Pearl White", color: "from-slate-50 to-slate-200" },
    { id: "graphite", label: "Graphite", color: "from-slate-700 to-slate-900" },
    { id: "ruby", label: "Ruby Red", color: "from-red-500 to-red-700" },
  ];

  const lifestyleScenes = [
    { id: "city", title: "Urban Explorer", description: "Navigate city streets with confidence and style", image: galleryImages[0], icon: <MapPin className="w-5 h-5" /> },
    { id: "desert", title: "Adventure Awaits", description: "Conquer any terrain with power and precision", image: galleryImages[1], icon: <Sun className="w-5 h-5" /> },
    { id: "family", title: "Weekend Getaway", description: "Create memories with comfort and space", image: galleryImages[2], icon: <Sparkles className="w-5 h-5" /> },
  ];

  return (
    <div className="relative bg-background">
      {/* Floating CTA Bar */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4"
      >
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-4">
          <div className="flex gap-3">
            <Button onClick={onReserve} variant="default" className="flex-1 group">
              Reserve
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="ml-2"
              >
                ✨
              </motion.span>
            </Button>
            <Button onClick={onTestDrive} variant="outline" className="flex-1">
              Test Drive
            </Button>
            <Button onClick={onConfigure} variant="outline" className="flex-1">
              Configure
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Section 1: Hero Reveal with Light Sweep */}
      <section ref={heroRef} className="relative h-screen overflow-hidden bg-background">
        <motion.div style={{ opacity, scale }} className="relative w-full h-full">
          <img
            src={galleryImages[0]}
            alt={vehicleName}
            className="w-full h-full object-cover"
          />
          
          {/* Light sweep effect following pointer */}
          {!shouldReduceMotion && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.15), transparent)`,
              }}
            />
          )}

          {/* Parallax layers */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, 200]) }}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <Badge variant="outline" className="mb-4 text-sm px-4 py-1 bg-background/50 backdrop-blur-sm">
                Flagship Gallery
              </Badge>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-foreground">
                {vehicleName}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
                Where engineering meets artistry
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Section 2: Design Focus with Hotspots */}
      <section className="relative min-h-screen flex items-center justify-center py-24 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
              Design Excellence
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore the details that define perfection
            </p>
          </motion.div>

          <div className="relative aspect-[16/9] max-w-5xl mx-auto">
            <img
              src={galleryImages[1]}
              alt="Vehicle design details"
              className="w-full h-full object-cover rounded-3xl"
            />

            {/* Interactive hotspots */}
            {hotspots.map((hotspot) => (
              <motion.button
                key={hotspot.id}
                className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2"
                style={{ left: hotspot.x, top: hotspot.y }}
                onClick={() => setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-primary/30 rounded-full"
                />
                <div className="relative w-full h-full bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
              </motion.button>
            ))}

            {/* Hotspot detail panel */}
            <AnimatePresence>
              {activeHotspot && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.9 }}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md mx-4"
                >
                  <div className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-6 shadow-2xl">
                    <h3 className="text-xl font-bold mb-2 text-foreground">
                      {hotspots.find(h => h.id === activeHotspot)?.label}
                    </h3>
                    <p className="text-muted-foreground">
                      {hotspots.find(h => h.id === activeHotspot)?.details}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Section 3: Mood Shift Scene */}
      <section className="relative min-h-screen flex items-center justify-center py-24 px-4 overflow-hidden">
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${moods[selectedMood].bg} transition-all duration-1000`}
        />

        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
              Choose Your Mode
            </h2>
            <p className="text-lg text-muted-foreground">
              Experience transforms with your driving style
            </p>
          </motion.div>

          <div className="flex justify-center gap-4 mb-16">
            {Object.entries(moods).map(([key, mood]) => (
              <Button
                key={key}
                variant={selectedMood === key ? "default" : "outline"}
                size="lg"
                onClick={() => setSelectedMood(key as typeof selectedMood)}
                className="px-8"
              >
                {mood.label}
              </Button>
            ))}
          </div>

          <motion.div
            key={selectedMood}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[16/9] max-w-5xl mx-auto rounded-3xl overflow-hidden"
          >
            <img
              src={galleryImages[2]}
              alt={`${selectedMood} mode`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: moods[selectedMood].speed * 2, repeat: Infinity }}
                className="text-center"
              >
                <Zap className="w-16 h-16 text-primary mx-auto mb-4" />
                <p className="text-2xl font-bold text-white">{moods[selectedMood].label} Mode Active</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 4: Interior Immersion */}
      <section className="relative min-h-screen flex items-center justify-center py-24 px-4 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
              Interior Sanctuary
            </h2>
            <p className="text-lg text-muted-foreground">
              Where luxury meets functionality
            </p>
          </motion.div>

          <div className="relative aspect-[16/9] max-w-5xl mx-auto rounded-3xl overflow-hidden">
            <img
              src={galleryImages[3] || galleryImages[0]}
              alt="Interior view"
              className="w-full h-full object-cover"
            />

            {/* Animated dashboard light sweep */}
            <motion.div
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut",
              }}
              className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-primary/20 to-transparent"
            />

            {/* Feature callouts */}
            <div className="absolute bottom-8 left-8 right-8 flex flex-wrap gap-4 justify-center">
              {["Premium Leather", "Ambient Lighting", "Digital Cockpit"].map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card/90 backdrop-blur-sm border border-border rounded-full px-4 py-2"
                >
                  <span className="text-sm font-medium text-foreground">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Ambient Experience */}
      <section className="relative min-h-screen flex items-center justify-center py-24 px-4 bg-background">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
              Color Your Journey
            </h2>
            <p className="text-lg text-muted-foreground">
              Select your signature finish
            </p>
          </motion.div>

          <div className="flex justify-center gap-6 mb-16">
            {ambientColors.map((color) => (
              <motion.button
                key={color.id}
                onClick={() => setSelectedAmbient(color.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-3"
              >
                <div
                  className={`w-20 h-20 rounded-full bg-gradient-to-br ${color.color} shadow-xl border-4 ${
                    selectedAmbient === color.id ? "border-primary" : "border-border"
                  } transition-all`}
                />
                <span className="text-sm font-medium text-foreground">{color.label}</span>
              </motion.button>
            ))}
          </div>

          <motion.div
            key={selectedAmbient}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative aspect-[16/9] max-w-5xl mx-auto rounded-3xl overflow-hidden"
          >
            <img
              src={galleryImages[4] || galleryImages[1]}
              alt="Ambient lighting"
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${ambientColors.find(c => c.id === selectedAmbient)?.color} opacity-20 mix-blend-overlay`} />
          </motion.div>
        </div>
      </section>

      {/* Section 6: Lifestyle Personas */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
              Your Story, Your Style
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover how {vehicleName} fits your lifestyle
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {lifestyleScenes.map((scene, index) => (
              <motion.div
                key={scene.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group relative aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer"
              >
                {/* Parallax image */}
                <motion.img
                  src={scene.image}
                  alt={scene.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="mb-3 text-primary">{scene.icon}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">{scene.title}</h3>
                    <p className="text-white/80">{scene.description}</p>
                  </motion.div>
                </div>

                {/* Hover accent */}
                <motion.div
                  className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CinematicFlagshipGallery;
