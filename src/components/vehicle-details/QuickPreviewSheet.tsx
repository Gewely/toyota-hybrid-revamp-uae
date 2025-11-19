import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { VehicleModel } from "@/types/vehicle";

interface QuickPreviewSheetProps {
  vehicle: VehicleModel | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickPreviewSheet: React.FC<QuickPreviewSheetProps> = ({
  vehicle,
  isOpen,
  onClose,
}) => {
  if (!vehicle) return null;

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

  const highlights = [
    { icon: Zap, label: "Power", value: "High Performance" },
    { icon: Shield, label: "Safety", value: "Advanced Safety Suite" },
    { icon: Gauge, label: "Efficiency", value: "Optimized" },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-2xl font-bold">{vehicle.name}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-video rounded-2xl overflow-hidden bg-muted"
          >
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <Badge className="bg-primary text-primary-foreground">
                {vehicle.category}
              </Badge>
            </div>
          </motion.div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-foreground">
              {formatPrice(vehicle.price)}
            </span>
            <span className="text-lg text-muted-foreground">Starting from</span>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-3 gap-3">
            {highlights.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-muted/50 rounded-xl p-4 text-center"
              >
                <item.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                <p className="text-sm font-semibold">{item.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-3">Key Features</h3>
            <div className="grid grid-cols-2 gap-2">
              {vehicle.features?.slice(0, 6).map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2 text-sm"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              className="flex-1"
              onClick={() => {
                window.location.href = `/vehicle/${vehicle.id}`;
              }}
            >
              View Full Details
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" className="flex-1">
              Book Test Drive
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default QuickPreviewSheet;
