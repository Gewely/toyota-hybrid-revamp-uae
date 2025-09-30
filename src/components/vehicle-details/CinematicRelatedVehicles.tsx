import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Heart, Star, ArrowRight, Eye, Zap, Shield } from 'lucide-react';
import { vehicles } from '@/data/vehicles';
import { VehicleModel } from '@/types/vehicle';
import { useSwipeable } from '@/hooks/use-swipeable';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CinematicRelatedVehiclesProps {
  currentVehicle: VehicleModel;
  className?: string;
  title?: string;
}

export default function CinematicRelatedVehicles({ 
  currentVehicle, 
  className,
  title = "You may also like"
}: CinematicRelatedVehiclesProps) {
  const scrollableRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  // Related vehicles logic
  const relatedVehicles = vehicles
    .filter(vehicle => vehicle.category === currentVehicle.category && vehicle.name !== currentVehicle.name)
    .slice(0, 6);

  // Enhanced vehicles with highlight properties and additional features
  const enhancedVehicles = relatedVehicles.map((vehicle, index) => ({
    ...vehicle,
    image: vehicle.image || '/placeholder.svg',
    highlight: {
      icon: <Star className="h-4 w-4" />,
      label: "Featured",
      color: "from-primary to-primary/80"
    },
    quickFeatures: [
      vehicle.features?.[0] || "Premium Interior",
      vehicle.features?.[1] || "Advanced Safety",
      vehicle.features?.[2] || "Hybrid Engine"
    ]
  }));

  // Swipe and scroll handlers
  const scroll = (dir: "left" | "right") => {
    if (!scrollableRef.current) return;
    const scrollAmount = dir === "left" ? -400 : 400;
    scrollableRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Click handlers for UX and CX
  const handleQuickView = (vehicle: VehicleModel) => {
    console.log('Quick view for:', vehicle.name);
    // TODO: Open quick view modal
  };

  const handleAddToFavorites = (vehicle: VehicleModel) => {
    console.log('Add to favorites:', vehicle.name);
    // TODO: Add to favorites logic
  };

  const handleConfigureVehicle = (vehicle: VehicleModel) => {
    console.log('Configure vehicle:', vehicle.name);
    // TODO: Open vehicle configurator
  };

  const swipeHandlers = useSwipeable({
    onSwipeLeft: () => scroll("right"),
    onSwipeRight: () => scroll("left"),
    threshold: 40,
    preventDefaultTouchmoveEvent: false
  });

  const bindScrollable = (ref: HTMLDivElement | null) => {
    scrollableRef.current = ref;
  };

  if (!enhancedVehicles.length) return null;

  return (
    <section 
      ref={containerRef}
      className={cn("py-20 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden", className)}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-primary/5 bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      <div className="toyota-container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="flex items-center justify-between mb-16"
        >
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            >
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                {title}
              </span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-muted-foreground text-lg leading-relaxed"
            >
              Discover more exceptional vehicles from our {currentVehicle.category} collection, 
              each designed to elevate your driving experience.
            </motion.p>
          </div>
          
          {/* Navigation Controls */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="hidden lg:flex items-center gap-3"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => scroll('left')}
              className="h-12 w-12 p-0 rounded-xl border-2 hover:border-primary hover:bg-primary/10 transition-all duration-300 group"
            >
              <ChevronLeft className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => scroll('right')}
              className="h-12 w-12 p-0 rounded-xl border-2 hover:border-primary hover:bg-primary/10 transition-all duration-300 group"
            >
              <ChevronRight className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Vehicle Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative"
        >
          <div
            {...swipeHandlers}
            ref={bindScrollable}
            className="flex gap-8 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollPaddingLeft: '32px' }}
          >
            {enhancedVehicles.map((vehicle, index) => (
              <motion.article
                key={vehicle.name}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.6 + (index * 0.1),
                  ease: [0.4, 0, 0.2, 1]
                }}
                whileHover={{ 
                  y: -12, 
                  scale: 1.02,
                  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
                }}
                onHoverStart={() => setHoveredCard(vehicle.name)}
                onHoverEnd={() => setHoveredCard(null)}
                className="flex-none w-96 snap-start group cursor-pointer"
              >
                <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-0 relative">
                    {/* Image Container */}
                    <div className="relative h-56 overflow-hidden">
                      <motion.img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                      />
                      
                      {/* Dynamic Gradient Overlay */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                        animate={{ 
                          opacity: hoveredCard === vehicle.name ? 0.6 : 0.8 
                        }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      {/* Floating Highlight Badge */}
                      <motion.div 
                        className="absolute top-6 left-6"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.8 + (index * 0.1) }}
                      >
                        <div className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-white shadow-xl backdrop-blur-sm bg-gradient-to-r",
                          vehicle.highlight.color
                        )}>
                          {vehicle.highlight.icon}
                          <span className="text-sm">{vehicle.highlight.label}</span>
                        </div>
                      </motion.div>
                      
                      {/* Interactive Price Tag */}
                      <motion.div 
                        className="absolute top-6 right-6"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl font-bold text-lg shadow-xl backdrop-blur-sm border border-primary-foreground/20">
                          AED {vehicle.price.toLocaleString()}
                        </div>
                      </motion.div>

                      {/* Quick Action Overlay */}
                      <AnimatePresence>
                        {hoveredCard === vehicle.name && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="absolute bottom-4 left-6 right-6 flex gap-2"
                          >
                            <Button
                              size="sm"
                              variant="secondary"
                              className="flex-1 bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
                              onClick={() => handleQuickView(vehicle)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Quick View
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm h-9 w-9 p-0"
                              onClick={() => handleAddToFavorites(vehicle)}
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <motion.h3 
                            className="text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300"
                            whileHover={{ x: 4 }}
                            transition={{ duration: 0.2 }}
                          >
                            {vehicle.name}
                          </motion.h3>
                          <p className="text-muted-foreground uppercase tracking-wider text-sm font-medium">
                            {vehicle.category}
                          </p>
                        </div>
                        
                        <motion.div
                          whileHover={{ rotate: 90, scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-60 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-primary-foreground rounded-full h-10 w-10 p-0"
                          >
                            <ArrowRight className="h-5 w-5" />
                          </Button>
                        </motion.div>
                      </div>
                      
                      {/* Quick Features */}
                      <div className="space-y-2 mb-6">
                        {vehicle.quickFeatures.map((feature, idx) => (
                          <motion.div
                            key={feature}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ 
                              duration: 0.4, 
                              delay: 0.9 + (index * 0.1) + (idx * 0.05) 
                            }}
                            className="flex items-center gap-3 text-sm text-muted-foreground"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span>{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button 
                          asChild
                          className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 font-semibold"
                          variant="outline"
                          size="lg"
                        >
                          <Link to={`/vehicle/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`}>
                            Explore Details
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          className="px-4 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                          onClick={() => handleConfigureVehicle(vehicle)}
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.article>
            ))}
          </div>
          
          {/* Enhanced Gradient Fade */}
          <div className="absolute right-0 top-0 bottom-8 w-32 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none" />
          <div className="absolute left-0 top-0 bottom-8 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}