import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { VehicleModel } from "@/types/vehicle";
import { vehicles } from "@/data/vehicles";
import { Link } from "react-router-dom";
import { useSwipeable } from "@/hooks/use-swipeable";
import { cn } from "@/lib/utils";

interface CinematicRelatedVehiclesProps {
  currentVehicle: VehicleModel;
  className?: string;
  title?: string;
}

const FALLBACKS = [
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/e6cd7f93-d348-444b-9525-42b7ea441e99/items/da1e230a-67ae-4564-813e-fc2e7413879e/renditions/181a04c5-0892-4dff-aff2-82a3a4395f79?binary=true&mformat=true",
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/d4d16181-611d-43ed-9af4-fa2469645028/items/2c0d9643-2b2e-4b69-b7d5-322fa0f537a7/renditions/f48ef8f7-1be3-4d17-8267-f3a5896617ea?binary=true&mformat=true",
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/d4d16181-611d-43ed-9af4-fa2469645028/items/57c0be94-a250-45cf-b4cb-6e91c2911ad7/renditions/8eea1c4d-54ec-4d07-80cc-cf35dcaff8d5?binary=true&mformat=true",
];

const CinematicRelatedVehicles: React.FC<CinematicRelatedVehiclesProps> = ({
  currentVehicle,
  className,
  title = "You Might Also Like",
}) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const relatedVehicles = React.useMemo(
    () =>
      vehicles
        .filter(
          (v) =>
            v.id !== currentVehicle.id &&
            v.category === currentVehicle.category
        )
        .slice(0, 6),
    [currentVehicle]
  );

  const enhancedVehicles = React.useMemo(
    () =>
      relatedVehicles.map((v, i) => ({
        ...v,
        image: v.image && v.image.trim() ? v.image : FALLBACKS[i % FALLBACKS.length],
        highlights: [
          { icon: Star, label: "Premium" },
          { icon: Zap, label: "Performance" },
          { icon: Shield, label: "Safety" },
        ][i % 3],
      })),
    [relatedVehicles]
  );

  const scroll = (dir: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const amount = dir === "left" ? -400 : 400;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  const swipeableRef = useSwipeable({
    onSwipeLeft: () => scroll("right"),
    onSwipeRight: () => scroll("left"),
    threshold: 40,
    preventDefaultTouchmoveEvent: false,
  });

  const bindScrollable = (el: HTMLDivElement | null) => {
    scrollContainerRef.current = el || null;
    if (swipeableRef && "current" in swipeableRef) {
      (swipeableRef as any).current = el;
    }
  };

  if (!enhancedVehicles.length) return null;

  return (
    <section className={cn("py-16 bg-gradient-to-br from-background via-muted/20 to-background", className)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              {title}
            </h2>
            <p className="text-muted-foreground mt-2">Discover more from our premium collection</p>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button
              size="icon"
              variant="outline"
              className="rounded-full border-border hover:bg-muted hover:border-primary/50 transition-all duration-300"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="rounded-full border-border hover:bg-muted hover:border-primary/50 transition-all duration-300"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background via-background/80 to-transparent z-10 rounded-l-2xl" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background via-background/80 to-transparent z-10 rounded-r-2xl" />

          <div
            ref={bindScrollable}
            className="flex gap-6 overflow-x-auto pb-6 pr-4 pl-4 snap-x snap-mandatory scroll-smooth hide-scrollbar"
            role="listbox"
          >
            {enhancedVehicles.map((vehicle, index) => {
              const slug = vehicle.id;
              const href = `/vehicle/${slug}`;
              const IconComponent = vehicle.highlights.icon;

              return (
                <motion.article
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative flex-shrink-0 w-[85vw] max-w-[380px] md:w-[350px] lg:w-[380px] snap-start"
                >
                  <Card className="overflow-hidden border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 bg-gradient-to-br from-card via-card to-muted/20">
                    <Link to={href}>
                      <div className="relative w-full aspect-[4/3] overflow-hidden">
                        <img
                          src={vehicle.image}
                          alt={vehicle.name}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 85vw, 380px"
                          srcSet={`${vehicle.image}?w=400 400w, ${vehicle.image}?w=600 600w, ${vehicle.image}?w=800 800w`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Floating highlight badge */}
                        <motion.div
                          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Badge className="bg-primary/90 backdrop-blur-sm border-primary/20 text-primary-foreground shadow-lg">
                            <IconComponent className="h-3 w-3 mr-1" />
                            {vehicle.highlights.label}
                          </Badge>
                        </motion.div>

                        {/* Animated overlay */}
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
                      </div>
                    </Link>

                    <div className="p-5">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
                            {vehicle.name}
                          </h3>
                          {vehicle.category && (
                            <p className="text-sm text-muted-foreground capitalize">
                              {vehicle.category}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">Starting from</p>
                            <p className="font-bold text-xl text-primary">
                              AED {new Intl.NumberFormat("en-AE").format(vehicle.price)}
                            </p>
                          </div>
                          
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button 
                              asChild 
                              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              <Link to={href} className="flex items-center gap-2">
                                Explore
                                <motion.div
                                  animate={{ x: [0, 4, 0] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                  →
                                </motion.div>
                              </Link>
                            </Button>
                          </motion.div>
                        </div>

                        {/* Feature highlights */}
                        <div className="pt-2 border-t border-border/50">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              Premium
                            </span>
                            <span className="flex items-center gap-1">
                              <Zap className="h-3 w-3 text-blue-500" />
                              Performance
                            </span>
                            <span className="flex items-center gap-1">
                              <Shield className="h-3 w-3 text-green-500" />
                              Safety
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CinematicRelatedVehicles;