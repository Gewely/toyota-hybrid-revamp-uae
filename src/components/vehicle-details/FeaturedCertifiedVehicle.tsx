import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Shield, Calendar, Gauge, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface FeaturedVehicle {
  id: string;
  model: string;
  year: number;
  price: number;
  mileage: string;
  image: string;
  images?: string[];
  certified: boolean;
  warranty: string;
  services: number;
  lastService: string;
  previousOwners: number;
  accidentFree: boolean;
}

interface FeaturedCertifiedVehicleProps {
  vehicle: FeaturedVehicle;
  onViewDetails: () => void;
  onBookTestDrive: () => void;
}

const FeaturedCertifiedVehicle: React.FC<FeaturedCertifiedVehicleProps> = ({
  vehicle,
  onViewDetails,
  onBookTestDrive,
}) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const monthlyPayment = Math.round((vehicle.price * 0.8 * 0.035) / 12 * Math.pow(1.035/12, 60) / (Math.pow(1.035/12, 60) - 1));

  const images = vehicle.images || [vehicle.image];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-card via-card/95 to-muted/30 rounded-3xl overflow-hidden border border-border/40 shadow-xl"
    >
      <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="relative">
            <Badge className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground shadow-lg">
              <Shield className="w-3 h-3 mr-1" />
              Featured
            </Badge>
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
                      <img
                        src={img}
                        alt={`${vehicle.year} ${vehicle.model} - View ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {images.length > 1 && (
                <>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </>
              )}
            </Carousel>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-3">
            {vehicle.certified && (
              <div className="flex items-center gap-2 bg-primary/10 rounded-xl p-3">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold">Certified</span>
              </div>
            )}
            {vehicle.accidentFree && (
              <div className="flex items-center gap-2 bg-emerald-500/10 rounded-xl p-3">
                <Shield className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-semibold">Accident-Free</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header */}
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-2">
                {vehicle.year} {vehicle.model}
              </h3>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(vehicle.price)}
                </span>
                <span className="text-sm text-muted-foreground">
                  or from AED {monthlyPayment.toLocaleString()}/mo
                </span>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/40 rounded-xl p-3">
                <Gauge className="w-5 h-5 text-primary mb-1" />
                <p className="text-xs text-muted-foreground">Mileage</p>
                <p className="font-semibold">{vehicle.mileage}</p>
              </div>
              <div className="bg-muted/40 rounded-xl p-3">
                <Calendar className="w-5 h-5 text-primary mb-1" />
                <p className="text-xs text-muted-foreground">Warranty</p>
                <p className="font-semibold">{vehicle.warranty}</p>
              </div>
            </div>

            {/* Service History */}
            <div className="bg-muted/30 rounded-xl p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Service History
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Services</span>
                  <span className="font-semibold">{vehicle.services} Services</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Service</span>
                  <span className="font-semibold">{vehicle.lastService}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Previous Owners</span>
                  <span className="font-semibold">{vehicle.previousOwners} Owner{vehicle.previousOwners !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>

            {/* 160-Point Inspection */}
            <div className="border-l-4 border-primary pl-4">
              <p className="text-sm font-semibold text-primary mb-1">
                160-Point Certified Inspection
              </p>
              <p className="text-xs text-muted-foreground">
                Comprehensive quality check including engine, transmission, brakes, and more
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <Button className="flex-1" onClick={onViewDetails}>
              View Details
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" className="flex-1" onClick={onBookTestDrive}>
              Test Drive
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedCertifiedVehicle;
