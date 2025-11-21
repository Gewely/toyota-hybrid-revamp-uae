import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gauge, Calendar, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface PreOwnedVehicle {
  id: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  image: string;
  certified?: boolean;
  features?: string[];
}

interface MobilePreOwnedCarouselProps {
  vehicles: PreOwnedVehicle[];
}

const MobilePreOwnedCarousel: React.FC<MobilePreOwnedCarouselProps> = ({ vehicles }) => {
  const navigate = useNavigate();

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {vehicles.map((vehicle) => (
          <CarouselItem key={vehicle.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
            <Card className="group overflow-hidden transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm h-full hover:shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={vehicle.image}
                  alt={`${vehicle.year} ${vehicle.model}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                
                {vehicle.certified && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-primary text-primary-foreground shadow-lg text-xs">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Certified
                    </Badge>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3">
                  <p className="text-white/80 text-[10px]">Starting from</p>
                  <p className="text-white text-xl font-bold">
                    AED {vehicle.price.toLocaleString()}
                  </p>
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                <h3 className="text-base font-bold text-foreground line-clamp-1">
                  {vehicle.year} {vehicle.model}
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Gauge className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-muted-foreground text-[10px]">Mileage</p>
                      <p className="font-semibold text-foreground text-xs">
                        {vehicle.mileage.toLocaleString()} km
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-muted-foreground text-[10px]">Year</p>
                      <p className="font-semibold text-foreground text-xs">{vehicle.year}</p>
                    </div>
                  </div>
                </div>

                {vehicle.features && vehicle.features.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {vehicle.features.slice(0, 2).map((feature, i) => (
                      <Badge key={i} variant="secondary" className="text-[9px] px-1.5 py-0.5">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 h-8 text-xs"
                    onClick={() => navigate('/pre-owned')}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8 text-xs"
                    onClick={() => navigate('/enquire')}
                  >
                    Enquire
                  </Button>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      
      <div className="hidden md:flex justify-center gap-2 mt-4">
        <CarouselPrevious className="relative left-0 translate-x-0" />
        <CarouselNext className="relative right-0 translate-x-0" />
      </div>
    </Carousel>
  );
};

export default MobilePreOwnedCarousel;
