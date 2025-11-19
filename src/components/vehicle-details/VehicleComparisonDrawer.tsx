import React from "react";
import { motion } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { VehicleModel } from "@/types/vehicle";

interface VehicleComparisonDrawerProps {
  vehicles: VehicleModel[];
  isOpen: boolean;
  onClose: () => void;
  onClearAll: () => void;
}

const VehicleComparisonDrawer: React.FC<VehicleComparisonDrawerProps> = ({
  vehicles,
  isOpen,
  onClose,
  onClearAll,
}) => {
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

  const comparisonRows = [
    { label: "Price", getValue: (v: VehicleModel) => formatPrice(v.price) },
    { label: "Category", getValue: (v: VehicleModel) => v.category },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold">Compare Vehicles</SheetTitle>
            <Button variant="ghost" size="sm" onClick={onClearAll}>
              Clear All
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Vehicle Images */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {vehicles.map((vehicle) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-xl overflow-hidden aspect-video bg-muted"
              >
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <p className="text-xs font-semibold text-white truncate">
                    {vehicle.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="bg-muted/30 rounded-xl p-4 space-y-1">
            {comparisonRows.map((row, index) => (
              <div
                key={row.label}
                className={`grid grid-cols-${vehicles.length + 1} gap-4 py-3 ${
                  index !== comparisonRows.length - 1 ? "border-b border-border/40" : ""
                }`}
              >
                <div className="font-semibold text-sm text-muted-foreground">
                  {row.label}
                </div>
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="text-sm font-medium">
                    {row.getValue(vehicle)}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Features Comparison */}
          <div>
            <h3 className="font-semibold mb-3">Key Features</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="bg-muted/20 rounded-lg p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 truncate">
                    {vehicle.name}
                  </p>
                  <ul className="space-y-1">
                    {vehicle.features?.slice(0, 3).map((feature, i) => (
                      <li key={i} className="text-xs">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {vehicles.map((vehicle) => (
              <Button
                key={vehicle.id}
                variant="outline"
                className="flex-1"
                onClick={() => {
                  window.location.href = `/vehicle/${vehicle.id}`;
                }}
              >
                View Details
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default VehicleComparisonDrawer;
