import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  Palette, 
  Gauge, 
  Leaf,
  Mountain,
  Building2,
  Users
} from "lucide-react";

interface CinematicFlagshipGalleryProps {
  vehicleName: string;
  galleryImages: string[];
  onReserve?: () => void;
  onTestDrive?: () => void;
  onConfigure?: () => void;
}

const CinematicFlagshipGallery: React.FC<CinematicFlagshipGalleryProps> = ({
  vehicleName,
  galleryImages,
  onReserve,
  onTestDrive,
  onConfigure,
}) => {
  const prefersReducedMotion = useReducedMotionSafe();
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [selectedMood, setSelectedMood] = useState<"sport" | "urban" | "eco">("sport");
  const [selectedAmbient, setSelectedAmbient] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [prefersReducedMotion]);

  const hotspots = [
    { id: 1, x: 30, y: 35, label: "Signature Grille", detail: "Bold and commanding design" },
    { id: 2, x: 70, y: 55, label: "LED Matrix Headlights", detail: "Adaptive lighting technology" },
    { id: 3, x: 85, y: 70, label: "20\" Alloy Wheels", detail: "Aerodynamic performance" },
  ];

  const moods = {
    sport: { bg: "from-red-950/20 via-background to-background", speed: 1.2, icon: Gauge },
    urban: { bg: "from-blue-950/20 via-background to-background", speed: 1, icon: Building2 },
    eco: { bg: "from-green-950/20 via-background to-background", speed: 0.8, icon: Leaf },
  };

  const ambientColors = [
    { name: "Crimson", color: "bg-red-500", overlay: "bg-red-500/10" },
    { name: "Azure", color: "bg-blue-500", overlay: "bg-blue-500/10" },
    { name: "Emerald", color: "bg-green-500", overlay: "bg-emerald-500/10" },
  ];

  const lifestyleScenes = [
    {
      title: "Desert Explorer",
      description: "Conquer any terrain with confidence",
      image: galleryImages[1] || "/lovable-uploads/89971938-ac2c-4968-b6cb-a4fcd702b56c.png",
      icon: Mountain,
    },
    {
      title: "Urban Professional",
      description: "Refined elegance for city life",
      image: galleryImages[2] || "/lovable-uploads/89971938-ac2c-4968-b6cb-a4fcd702b56c.png",
      icon: Building2,
    },
    {
      title: "Family Adventures",
      description: "Creating memories together",
      image: galleryImages[3] || "/lovable-uploads/89971938-ac2c-4968-b6cb-a4fcd702b56c.png",
      icon: Users,
    },
  ];

  const MoodIcon = moods[selectedMood].icon;

  return (
    <section className="relative bg-background">
      {/* Mobile: Tabbed Interface */}
      <div className="lg:hidden">
        <Tabs defaultValue="hero" className="w-full">
          <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap rounded-none h-auto p-2">
              <TabsTrigger value="hero" className="flex-shrink-0">Hero</TabsTrigger>
              <TabsTrigger value="design" className="flex-shrink-0">Design</TabsTrigger>
              <TabsTrigger value="mood" className="flex-shrink-0">Mood</TabsTrigger>
              <TabsTrigger value="interior" className="flex-shrink-0">Interior</TabsTrigger>
              <TabsTrigger value="ambient" className="flex-shrink-0">Ambient</TabsTrigger>
              <TabsTrigger value="lifestyle" className="flex-shrink-0">Lifestyle</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="hero" className="mt-0">
            <div className="relative h-[70vh] overflow-hidden">
              <motion.img
                src={galleryImages[0] || "/lovable-uploads/89971938-ac2c-4968-b6cb-a4fcd702b56c.png"}
                alt={vehicleName}
                className="w-full h-full object-cover"
                style={{ opacity: heroOpacity, scale: heroScale }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              <div className="absolute bottom-8 left-4 right-4 text-center">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-bold text-foreground mb-2"
                >
                  {vehicleName}
                </motion.h1>
                <p className="text-muted-foreground text-sm">Luxury Reimagined</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="design" className="mt-0">
            <div className="relative h-[70vh] p-4">
              <img
                src={galleryImages[0] || "/lovable-uploads/89971938-ac2c-4968-b6cb-a4fcd702b56c.png"}
                alt="Design Focus"
                className="w-full h-full object-cover rounded-lg"
              />
              {hotspots.map((spot) => (
                <motion.button
                  key={spot.id}
                  className="absolute w-12 h-12 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center"
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                  onClick={() => setActiveHotspot(activeHotspot === spot.id ? null : spot.id)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </motion.button>
              ))}
              {activeHotspot && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur-sm p-4 rounded-lg border border-border"
                >
                  <h3 className="font-semibold text-foreground mb-1">
                    {hotspots.find((h) => h.id === activeHotspot)?.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {hotspots.find((h) => h.id === activeHotspot)?.detail}
                  </p>
                </motion.div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="mood" className="mt-0">
            <div className="relative h-[70vh]">
              <motion.div
                key={selectedMood}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`absolute inset-0 bg-gradient-to-br ${moods[selectedMood].bg}`}
              />
              <img
                src={galleryImages[1] || "/lovable-uploads/89971938-ac2c-4968-b6cb-a4fcd702b56c.png"}
                alt="Mood Scene"
                className="w-full h-full object-cover mix-blend-overlay"
              />
              <div className="absolute bottom-4 left-4 right-4 space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <MoodIcon className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold text-foreground capitalize">{selectedMood} Mode</h3>
                </div>
                <div className="flex gap-2">
                  {(["sport", "urban", "eco"] as const).map((mood) => (
                    <Button
                      key={mood}
                      variant={selectedMood === mood ? "default" : "outline"}
                      onClick={() => setSelectedMood(mood)}
                      className="flex-1 capitalize"
                      size="sm"
                    >
                      {mood}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="interior" className="mt-0">
            <div className="relative h-[70vh] p-4">
              <img
                src={galleryImages[2] || "/lovable-uploads/89971938-ac2c-4968-b6cb-a4fcd702b56c.png"}
                alt="Interior"
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur-sm p-4 rounded-lg border border-border space-y-3">
                <Badge className="mb-2">Premium Interior</Badge>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Seats</p>
                    <p className="font-semibold text-foreground">Nappa Leather</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Display</p>
                    <p className="font-semibold text-foreground">12.3" Digital</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ambient" className="mt-0">
            <div className="relative h-[70vh]">
              <img
                src={galleryImages[2] || "/lovable-uploads/89971938-ac2c-4968-b6cb-a4fcd702b56c.png"}
                alt="Ambient Lighting"
                className="w-full h-full object-cover"
              />
              <motion.div
                key={selectedAmbient}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`absolute inset-0 ${ambientColors[selectedAmbient].overlay}`}
              />
              <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur-sm p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Ambient Lighting</h3>
                </div>
                <div className="flex gap-3">
                  {ambientColors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedAmbient(idx)}
                      className={`w-12 h-12 rounded-full ${color.color} ${
                        selectedAmbient === idx ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lifestyle" className="mt-0">
            <div className="space-y-4 p-4">
              {lifestyleScenes.map((scene, idx) => {
                const Icon = scene.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative h-64 rounded-lg overflow-hidden group"
                  >
                    <img
                      src={scene.image}
                      alt={scene.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <Icon className="w-8 h-8 mb-2" />
                      <h3 className="text-xl font-bold mb-1">{scene.title}</h3>
                      <p className="text-sm text-white/80">{scene.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop: Sidebar Navigation */}
      <div className="hidden lg:grid lg:grid-cols-[280px_1fr] min-h-screen">
        {/* Sidebar */}
        <div className="sticky top-0 h-screen border-r border-border bg-card/50 backdrop-blur-sm p-6 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">{vehicleName}</h2>
              <p className="text-sm text-muted-foreground">Gallery Experience</p>
            </div>

            <nav className="space-y-2">
              {[
                { id: "hero", label: "Hero Reveal" },
                { id: "design", label: "Design Focus" },
                { id: "mood", label: "Mood Shift" },
                { id: "interior", label: "Interior" },
                { id: "ambient", label: "Ambient" },
                { id: "lifestyle", label: "Lifestyle" },
              ].map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block px-4 py-2 rounded-lg hover:bg-accent transition-colors text-sm font-medium"
                >
                  {section.label}
                </a>
              ))}
            </nav>

            <div className="pt-6 space-y-2">
              <Button onClick={onReserve} className="w-full" size="sm">
                Reserve
              </Button>
              <Button onClick={onTestDrive} variant="outline" className="w-full" size="sm">
                Test Drive
              </Button>
              <Button onClick={onConfigure} variant="outline" className="w-full" size="sm">
                Configure
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto">
          {/* Hero Section */}
          <div id="hero" className="relative h-screen flex items-center justify-center">
            <motion.img
              src={galleryImages[0] || "/lovable-uploads/89971938-ac2c-4968-b6cb-a4fcd702b56c.png"}
              alt={vehicleName}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: heroOpacity, scale: heroScale }}
            />
            {!prefersReducedMotion && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
                }}
              />
            )}
            <div className="relative z-10 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl font-bold text-white mb-4"
              >
                {vehicleName}
              </motion.h1>
              <p className="text-white/80 text-lg">Luxury Reimagined</p>
            </div>
          </div>

          {/* Design Focus */}
          <div id="design" className="relative min-h-screen flex items-center justify-center p-12 bg-muted/30">
            <div className="relative w-full max-w-5xl aspect-video">
              <img
                src={galleryImages[0] || "/lovable-uploads/89971938-ac2c-4968-b6cb-a4fcd702b56c.png"}
                alt="Design Focus"
                className="w-full h-full object-cover rounded-lg"
              />
              {hotspots.map((spot) => (
                <React.Fragment key={spot.id}>
                  <motion.button
                    className="absolute w-16 h-16 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center"
                    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                    onClick={() => setActiveHotspot(activeHotspot === spot.id ? null : spot.id)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Sparkles className="w-6 h-6 text-primary-foreground" />
                  </motion.button>
                  {activeHotspot === spot.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute bg-card/95 backdrop-blur-sm p-6 rounded-lg border border-border min-w-[250px]"
                      style={{
                        left: `${spot.x > 50 ? spot.x - 30 : spot.x + 10}%`,
                        top: `${spot.y + 10}%`,
                      }}
                    >
                      <h3 className="font-semibold text-foreground mb-2">{spot.label}</h3>
                      <p className="text-sm text-muted-foreground">{spot.detail}</p>
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Mood Shift & Interior combined */}
          <div id="mood" className="grid md:grid-cols-2 min-h-screen">
            <div className="relative">
              <motion.div
                key={selectedMood}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`absolute inset-0 bg-gradient-to-br ${moods[selectedMood].bg}`}
              />
              <img
                src={galleryImages[1] || "/lovable-uploads/89971938-ac2c-4968-b6cb-a4fcd702b56c.png"}
                alt="Mood Scene"
                className="w-full h-full object-cover mix-blend-overlay"
              />
              <div className="absolute inset-0 flex items-end p-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MoodIcon className="w-8 h-8 text-primary" />
                    <h3 className="text-3xl font-bold text-foreground capitalize">{selectedMood} Mode</h3>
                  </div>
                  <div className="flex gap-3">
                    {(["sport", "urban", "eco"] as const).map((mood) => (
                      <Button
                        key={mood}
                        variant={selectedMood === mood ? "default" : "outline"}
                        onClick={() => setSelectedMood(mood)}
                        className="capitalize"
                      >
                        {mood}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div id="interior" className="relative bg-background p-12 flex items-center">
              <div className="space-y-6">
                <Badge className="mb-4">Premium Interior</Badge>
                <h3 className="text-3xl font-bold text-foreground">Sanctuary of Comfort</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-muted-foreground mb-1">Seats</p>
                    <p className="text-lg font-semibold text-foreground">Nappa Leather</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Display</p>
                    <p className="text-lg font-semibold text-foreground">12.3" Digital</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Audio</p>
                    <p className="text-lg font-semibold text-foreground">JBL Premium</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Climate</p>
                    <p className="text-lg font-semibold text-foreground">4-Zone</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ambient */}
          <div id="ambient" className="relative min-h-screen flex items-center justify-center">
            <img
              src={galleryImages[2] || "/lovable-uploads/89971938-ac2c-4968-b6cb-a4fcd702b56c.png"}
              alt="Ambient Lighting"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <motion.div
              key={selectedAmbient}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`absolute inset-0 ${ambientColors[selectedAmbient].overlay}`}
            />
            <div className="relative z-10 text-center space-y-8">
              <div className="flex items-center justify-center gap-3">
                <Palette className="w-8 h-8 text-primary" />
                <h3 className="text-4xl font-bold text-foreground">Ambient Experience</h3>
              </div>
              <div className="flex gap-6 justify-center">
                {ambientColors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedAmbient(idx)}
                    className={`w-20 h-20 rounded-full ${color.color} ${
                      selectedAmbient === idx ? "ring-4 ring-primary ring-offset-4 ring-offset-background" : ""
                    } transition-all hover:scale-110`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Lifestyle */}
          <div id="lifestyle" className="grid md:grid-cols-3 min-h-screen">
            {lifestyleScenes.map((scene, idx) => {
              const Icon = scene.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group overflow-hidden"
                >
                  <img
                    src={scene.image}
                    alt={scene.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <Icon className="w-10 h-10 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">{scene.title}</h3>
                    <p className="text-white/80">{scene.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CinematicFlagshipGallery;
