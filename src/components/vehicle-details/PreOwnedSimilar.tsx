import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gauge, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { preOwnedVehicles } from "@/data/vehicles";

interface PreOwnedSimilarProps {
  currentVehicle: string;
}

const PreOwnedSimilar: React.FC<PreOwnedSimilarProps> = ({ currentVehicle }) => {
  const navigate = useNavigate();

  // Filter similar pre-owned vehicles
  const similarVehicles = preOwnedVehicles
    .filter(v => v.model.toLowerCase().includes(currentVehicle.toLowerCase().split(' ')[0]))
    .slice(0, 3);

  if (similarVehicles.length === 0) {
    return null;
  }

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1 text-sm">
            Certified Pre-Owned
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Similar Pre-Owned Vehicles
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover certified pre-owned {currentVehicle} models with Toyota's quality guarantee
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {similarVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={vehicle.image}
                    alt={`${vehicle.year} ${vehicle.model}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Certified badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary text-primary-foreground shadow-lg">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Certified
                    </Badge>
                  </div>

                  {/* Price overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-white/80 text-sm">Starting from</p>
                        <p className="text-white text-3xl font-bold">
                          ${vehicle.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6 space-y-6">
                  {/* Title */}
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-1">
                      {vehicle.year} {vehicle.model}
                    </h3>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Gauge className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-muted-foreground text-xs">Mileage</p>
                        <p className="font-semibold text-foreground">
                          {vehicle.mileage.toLocaleString()} km
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-muted-foreground text-xs">Year</p>
                        <p className="font-semibold text-foreground">{vehicle.year}</p>
                      </div>
                    </div>

                  </div>

                  {/* Key features */}
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

                  {/* CTA Buttons */}
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

        {/* View all CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/pre-owned')}
            className="px-8"
          >
            View All Pre-Owned Vehicles
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PreOwnedSimilar;
