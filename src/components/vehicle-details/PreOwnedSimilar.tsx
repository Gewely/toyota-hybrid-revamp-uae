import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gauge, Calendar, CheckCircle2 } from "lucide-react";
import { preOwnedVehicles } from "@/data/vehicles";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const PreOwnedSimilar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1 text-sm">
            Certified Pre-Owned
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            Discover Certified Pre-Owned
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Quality Toyota vehicles with our comprehensive certification guarantee
          </p>
        </motion.div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {preOwnedVehicles.map((vehicle, index) => (
              <CarouselItem key={vehicle.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="h-full"
                >
                  <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm h-full">
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

                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 md:p-6">
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-white/80 text-xs md:text-sm">Starting from</p>
                            <p className="text-white text-2xl md:text-3xl font-bold">
                              AED {vehicle.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4 md:p-6 space-y-4 md:space-y-6">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1">
                          {vehicle.year} {vehicle.model}
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Gauge className="w-4 h-4 text-primary flex-shrink-0" />
                          <div>
                            <p className="text-muted-foreground text-xs">Mileage</p>
                            <p className="font-semibold text-foreground text-xs md:text-sm">
                              {vehicle.mileage.toLocaleString()} km
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                          <div>
                            <p className="text-muted-foreground text-xs">Year</p>
                            <p className="font-semibold text-foreground text-xs md:text-sm">{vehicle.year}</p>
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
                          className="flex-1 text-sm md:text-base"
                          onClick={() => navigate('/pre-owned')}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 text-sm md:text-base"
                          onClick={() => navigate('/enquire')}
                        >
                          Enquire
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </div>
        </Carousel>

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
