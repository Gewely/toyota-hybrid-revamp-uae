import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ArrowRight } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface MobileSimilarCarouselProps {
  vehicles: VehicleModel[];
  onQuickView: (vehicle: VehicleModel) => void;
  onNavigate: (id: string) => void;
}

const MobileSimilarCarousel: React.FC<MobileSimilarCarouselProps> = ({ 
  vehicles, 
  onQuickView, 
  onNavigate 
}) => {
  const parsePrice = (price: string | number): number => {
    if (typeof price === 'number') return price;
    return parseInt(price.replace(/[^0-9]/g, ''));
  };

  const formatPrice = (price: string | number): string => {
    const numPrice = parsePrice(price);
    return `AED ${numPrice.toLocaleString()}`;
  };

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
          <CarouselItem key={vehicle.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2">
            <Card 
              className="group overflow-hidden transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm h-full hover:shadow-xl hover:border-primary/30 cursor-pointer"
              onClick={() => onNavigate(vehicle.id)}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                
                <div className="absolute top-2 right-2">
                  <Badge className="bg-primary/90 text-primary-foreground shadow-lg text-xs backdrop-blur-sm">
                    {vehicle.category}
                  </Badge>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3">
                  <p className="text-white/80 text-[10px]">Starting from</p>
                  <p className="text-white text-lg font-bold">
                    {formatPrice(vehicle.price)}
                  </p>
                </div>
              </div>

              <CardContent className="p-3 space-y-3">
                <h3 className="text-base font-bold text-foreground line-clamp-1">
                  {vehicle.name}
                </h3>

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
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickView(vehicle);
                    }}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Quick View
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 h-8 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(vehicle.id);
                    }}
                  >
                    Details
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      
      <div className="hidden sm:flex justify-center gap-2 mt-4">
        <CarouselPrevious className="relative left-0 translate-x-0" />
        <CarouselNext className="relative right-0 translate-x-0" />
      </div>
    </Carousel>
  );
};

export default MobileSimilarCarousel;
