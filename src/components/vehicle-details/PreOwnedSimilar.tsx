import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gauge, Calendar, CheckCircle2, Shield } from "lucide-react";
import { preOwnedVehicles } from "@/data/vehicles";
import FeaturedCertifiedVehicle from "./FeaturedCertifiedVehicle";
import CertificationBadge from "./CertificationBadge";

const PreOwnedSimilar: React.FC = () => {
  const navigate = useNavigate();

  // Featured vehicle
  const featuredVehicle = {
    id: preOwnedVehicles[0].id,
    model: preOwnedVehicles[0].model,
    year: preOwnedVehicles[0].year,
    price: preOwnedVehicles[0].price,
    mileage: `${preOwnedVehicles[0].mileage.toLocaleString()} km`,
    image: preOwnedVehicles[0].image,
    images: [preOwnedVehicles[0].image],
    certified: true,
    warranty: "2 Years",
    services: 3,
    lastService: "Jan 2024",
    previousOwners: 1,
    accidentFree: true,
  };

  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Badge variant="outline" className="px-4 py-1.5 text-sm">
              <Shield className="w-3 h-3 mr-1.5" />
              Certified Pre-Owned
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            Trust & Heritage Showcase
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Every vehicle undergoes our rigorous 160-point inspection, backed by comprehensive warranty
          </p>
        </motion.div>

        {/* Featured Vehicle */}
        <div className="mb-12">
          <FeaturedCertifiedVehicle
            vehicle={featuredVehicle}
            onViewDetails={() => navigate("/pre-owned")}
            onBookTestDrive={() => navigate("/test-drive")}
          />
        </div>

        {/* Other Certified Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {preOwnedVehicles.slice(1, 4).map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm h-full hover:shadow-lg">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={vehicle.image}
                    alt={`${vehicle.year} ${vehicle.model}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {vehicle.certified && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary text-primary-foreground shadow-lg">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Certified
                      </Badge>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-white/80 text-xs">Starting from</p>
                        <p className="text-white text-2xl font-bold">
                          AED {vehicle.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {vehicle.year} {vehicle.model}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Gauge className="w-4 h-4 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-muted-foreground text-xs">Mileage</p>
                        <p className="font-semibold text-foreground">
                          {vehicle.mileage.toLocaleString()} km
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-muted-foreground text-xs">Year</p>
                        <p className="font-semibold text-foreground">{vehicle.year}</p>
                      </div>
                    </div>
                  </div>

                  {vehicle.features && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Features
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {vehicle.features.slice(0, 3).map((feature, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="default"
                      className="flex-1"
                      onClick={() => navigate('/pre-owned')}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigate('/enquire')}
                    >
                      Enquire
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-8 md:mt-12"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/pre-owned')}
            className="px-6 md:px-8"
          >
            View All Pre-Owned Vehicles
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PreOwnedSimilar;
