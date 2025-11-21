import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Plus, ArrowRight, Zap, Star, TrendingUp } from "lucide-react";
import type { VehicleModel } from "@/types/vehicle";

interface DiscoveryGridProps {
  vehicles: VehicleModel[];
  onCompare: (vehicleIds: string[]) => void;
  onQuickView: (vehicle: VehicleModel) => void;
  onNavigate: (vehicleId: string) => void;
}

const DiscoveryGrid: React.FC<DiscoveryGridProps> = ({
  vehicles,
  onCompare,
  onQuickView,
  onNavigate,
}) => {
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const toggleComparison = (vehicleId: string) => {
    setSelectedForComparison((prev) => {
      const newSelection = prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId)
        : prev.length < 3
        ? [...prev, vehicleId]
        : prev;
      return newSelection;
    });
  };

  const handleCompare = () => {
    if (selectedForComparison.length >= 2) {
      onCompare(selectedForComparison);
    }
  };

  const parsePrice = (price: string | number): number => {
    if (typeof price === 'number') return price;
    return parseFloat(String(price).replace(/[^\d.]/g, '')) || 0;
  };

  const formatPrice = (price: string | number): string => {
    const numPrice = parsePrice(price);
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  return (
    <div className="relative">
      {/* Bold Header */}
      <div className="mb-8 text-center">
        <Badge className="mb-3 bg-gradient-to-r from-primary to-amber-500 text-white px-4 py-1.5 text-sm shadow-lg">
          <Zap className="w-3 h-3 mr-1.5" />
          Discovery Zone
        </Badge>
        <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent mb-3">
          Explore Similar Vehicles
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          Hand-picked alternatives that match your lifestyle and preferences
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[280px]">
        {vehicles.map((vehicle, index) => {
          const isFeatured = index === 0 || index === 3;
          const isSelected = selectedForComparison.includes(vehicle.id);

          return (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className={`group relative ${
                isFeatured ? "sm:col-span-2 sm:row-span-2" : ""
              }`}
            >
              <Card
                className={`h-full overflow-hidden border-border/40 bg-card/95 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg ${
                  isSelected ? "ring-2 ring-primary" : ""
                }`}
              >
                {/* Comparison Checkbox */}
                <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-background/95 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleComparison(vehicle.id)}
                      disabled={!isSelected && selectedForComparison.length >= 3}
                      aria-label={`Compare ${vehicle.name}`}
                    />
                  </div>
                </div>

                {/* Vehicle Image */}
                <div
                  className="relative h-full cursor-pointer overflow-hidden"
                  onClick={() => onNavigate(vehicle.id)}
                >
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                      <div className="flex items-end justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                            {vehicle.name}
                          </h3>
                          <p className="text-sm text-white/80 mb-2">{vehicle.category}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {vehicle.features?.slice(0, 2).map((feature, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-xs bg-white/20 backdrop-blur-sm text-white border-white/30"
                              >
                                {feature}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xl sm:text-2xl font-bold text-white">
                            {formatPrice(vehicle.price)}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="shrink-0 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickView(vehicle);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Default Content (visible when not hovering) */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 group-hover:opacity-0 transition-opacity">
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                      {vehicle.name}
                    </h3>
                    <p className="text-lg sm:text-xl font-semibold text-white">
                      {formatPrice(vehicle.price)}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Compare Button */}
      {selectedForComparison.length >= 2 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-24 sm:bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
          <Button
            size="lg"
            onClick={handleCompare}
            className="shadow-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 rounded-2xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Compare ({selectedForComparison.length}) Vehicles
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default DiscoveryGrid;
