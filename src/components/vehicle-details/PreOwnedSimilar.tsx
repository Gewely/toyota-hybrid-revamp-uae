import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { preOwnedVehicles } from "@/data/vehicles";
import FeaturedCertifiedVehicle from "./FeaturedCertifiedVehicle";
import MobilePreOwnedCarousel from "./MobilePreOwnedCarousel";
import { useIsMobile } from "@/hooks/use-mobile";

const PreOwnedSimilar: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
    <section className="py-12 md:py-16 px-4 bg-gradient-to-br from-background via-primary/5 to-background relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(var(--primary-rgb),0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(var(--primary-rgb),0.08),transparent_50%)]" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 mb-4 bg-gradient-to-r from-primary/20 to-amber-500/20 backdrop-blur-sm px-5 py-2 rounded-full border border-primary/30">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Certified Pre-Owned Excellence</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
            Trust & Heritage Showcase
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Every vehicle undergoes our <span className="font-bold text-primary">rigorous 160-point inspection</span>, backed by comprehensive warranty
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

        {/* Other Certified Vehicles - Mobile Carousel / Desktop Grid */}
        {isMobile ? (
          <MobilePreOwnedCarousel vehicles={preOwnedVehicles.slice(1, 5)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {preOwnedVehicles.slice(1, 4).map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <div className="group overflow-hidden rounded-2xl transition-all duration-300 border border-border/50 bg-card/80 backdrop-blur-sm h-full hover:shadow-xl hover:border-primary/30 cursor-pointer"
                  onClick={() => navigate('/pre-owned')}
                >
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
                          Certified
                        </Badge>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
                      <p className="text-white/80 text-xs">Starting from</p>
                      <p className="text-white text-2xl font-bold">
                        AED {vehicle.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-foreground">
                      {vehicle.year} {vehicle.model}
                    </h3>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Mileage</p>
                        <p className="font-semibold text-foreground">
                          {vehicle.mileage.toLocaleString()} km
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Year</p>
                        <p className="font-semibold text-foreground">{vehicle.year}</p>
                      </div>
                    </div>

                    {vehicle.features && vehicle.features.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {vehicle.features.slice(0, 2).map((feature, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="default"
                        className="flex-1"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/pre-owned');
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/enquire');
                        }}
                      >
                        Enquire
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

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
