
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, RotateCw, Check, Sparkles, Fuel, Shield, Award } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useToast } from "@/hooks/use-toast";

interface VehicleCardProps {
  vehicle: VehicleModel;
  onCompare: (vehicle: VehicleModel) => void;
  isCompared: boolean;
  onQuickView: (vehicle: VehicleModel) => void;
  actionButtons?: React.ReactNode;
  delay?: number;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onCompare,
  isCompared,
  onQuickView,
  actionButtons,
  delay = 0
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { toast } = useToast();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const cardVariants = {
    front: {
      rotateY: 0,
    },
    back: {
      rotateY: 180,
    },
  };

  const vehicleSlug = vehicle.id || vehicle.name.toLowerCase().replace(/\s+/g, '-');

  const isBestSeller = 
    vehicle.name === "Toyota Camry" || 
    vehicle.name === "Toyota Corolla Hybrid" || 
    vehicle.name === "Toyota Land Cruiser" || 
    vehicle.name === "Toyota RAV4 Hybrid";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className="relative h-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <motion.div
        className="h-full preserve-3d cursor-pointer"
        initial="front"
        animate={isFlipped ? "back" : "front"}
        variants={cardVariants}
        transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 20 }}
        style={{ perspective: 1000 }}
      >
        <Card className={`h-full backface-hidden rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 ${isFlipped ? "opacity-0" : "opacity-100"} overflow-hidden`}>
          <div className="relative h-48 overflow-hidden rounded-t-xl">
            <motion.img
              src={vehicle.image}
              alt={vehicle.name}
              className="w-full h-full object-cover"
              animate={{ 
                scale: isHovering ? 1.05 : 1
              }}
              transition={{ duration: 0.5 }}
            />
            <Badge
              className={`absolute top-3 left-3 border-none ${
                vehicle.category === "Hybrid" ? "bg-green-600" :
                vehicle.category === "Electric" ? "bg-blue-600" :
                vehicle.category === "GR Performance" ? "bg-red-600" :
                "bg-toyota-red"
              }`}
              variant="default"
            >
              {vehicle.category}
            </Badge>
            
            {isBestSeller && (
              <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                <Award className="h-3 w-3 mr-1" />
                Best Seller
              </div>
            )}
          </div>

          <CardContent className="p-5">
            <Link to={`/vehicle/${vehicleSlug}`} className="block mb-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate hover:text-toyota-red transition-colors">
                {vehicle.name}
              </h3>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              From AED {vehicle.price.toLocaleString()}
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {vehicle.features.slice(0, 3).map((feature, idx) => (
                <div
                  key={idx}
                  className="text-xs bg-gray-100 dark:bg-gray-800 rounded-lg p-2 text-center"
                >
                  {feature}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <motion.div className="flex-1" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleFlip}
                >
                  <Info className="h-4 w-4 mr-1" /> Details
                </Button>
              </motion.div>
              <motion.div className="flex-1" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant={isCompared ? "default" : "secondary"}
                  size="sm"
                  className={`w-full ${isCompared ? "bg-toyota-red hover:bg-toyota-darkred" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCompare(vehicle);
                  }}
                >
                  {isCompared ? (
                    <>
                      <Check className="h-4 w-4 mr-1" /> Compared
                    </>
                  ) : (
                    "Compare"
                  )}
                </Button>
              </motion.div>
            </div>

            {actionButtons}
          </CardContent>
        </Card>

        <Card className={`h-full absolute inset-0 backface-hidden rotateY-180 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 ${isFlipped ? "opacity-100" : "opacity-0"}`}>
          <CardContent className="p-6 flex flex-col h-full">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
              {vehicle.name} - Specifications
            </h3>

            <div className="flex-1 mb-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="inline-block bg-toyota-red/10 text-toyota-red rounded-full p-1 mr-2">
                    <Sparkles className="h-3 w-3" />
                  </span>
                  Engine: {vehicle.specifications?.engine || vehicle.features[0]}
                </li>
                <li className="flex items-start">
                  <span className="inline-block bg-toyota-red/10 text-toyota-red rounded-full p-1 mr-2">
                    <Fuel className="h-3 w-3" />
                  </span>
                  Fuel Economy: {vehicle.specifications?.fuelEconomy || "17.5 km/L"}
                </li>
                <li className="flex items-start">
                  <span className="inline-block bg-toyota-red/10 text-toyota-red rounded-full p-1 mr-2">
                    <Shield className="h-3 w-3" />
                  </span>
                  Safety: {vehicle.specifications?.safetyRating || vehicle.features[2]}
                </li>
                <li className="flex items-start">
                  <span className="inline-block bg-toyota-red/10 text-toyota-red rounded-full p-1 mr-2">
                    <Check className="h-3 w-3" />
                  </span>
                  Warranty: {vehicle.specifications?.warranty || "5 years / 100,000 km"}
                </li>
                {vehicle.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="inline-block bg-toyota-red/10 text-toyota-red rounded-full p-1 mr-2">
                      <Check className="h-3 w-3" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto flex gap-2">
              <motion.div className="flex-1" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleFlip}
                >
                  <RotateCw className="h-4 w-4 mr-1" /> Back
                </Button>
              </motion.div>
              <motion.div className="flex-1" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to={`/vehicle/${vehicleSlug}`} className="w-full">
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full bg-toyota-red hover:bg-toyota-darkred"
                  >
                    View Details
                  </Button>
                </Link>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default VehicleCard;
