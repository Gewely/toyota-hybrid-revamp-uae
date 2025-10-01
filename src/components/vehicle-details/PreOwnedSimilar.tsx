import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Clock, MapPin, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface PreOwnedVehicle {
  id: string;
  name: string;
  year: number;
  mileage: string;
  price: string;
  image: string;
  location: string;
  certified: boolean;
  condition: 'Excellent' | 'Very Good' | 'Good';
}

interface PreOwnedSimilarProps {
  currentVehicle: string;
}

const preOwnedVehicles: PreOwnedVehicle[] = [
  {
    id: '1',
    name: 'Land Cruiser VXR',
    year: 2022,
    mileage: '12,000 km',
    price: 'AED 285,000',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2940',
    location: 'Dubai, UAE',
    certified: true,
    condition: 'Excellent'
  },
  {
    id: '2',
    name: 'Land Cruiser GXR',
    year: 2021,
    mileage: '28,500 km',
    price: 'AED 245,000',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=2942',
    location: 'Abu Dhabi, UAE',
    certified: true,
    condition: 'Very Good'
  },
  {
    id: '3',
    name: 'Land Cruiser V8',
    year: 2020,
    mileage: '45,000 km',
    price: 'AED 215,000',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=2940',
    location: 'Sharjah, UAE',
    certified: true,
    condition: 'Very Good'
  }
];

export const PreOwnedSimilar: React.FC<PreOwnedSimilarProps> = ({ currentVehicle }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="toyota-container">
        {/* Header */}
        <div className="max-w-3xl mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                <Clock className="mr-1 h-3 w-3" />
                Pre-Owned
              </Badge>
            </div>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              Certified Pre-Owned {currentVehicle}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Discover premium pre-owned vehicles, rigorously inspected and certified for quality. 
              Experience luxury at exceptional value.
            </p>
          </motion.div>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {preOwnedVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Certified Badge */}
                  {vehicle.certified && (
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-primary/90 backdrop-blur-sm rounded-full flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-primary-foreground" />
                      <span className="text-xs font-semibold text-primary-foreground">
                        Toyota Certified
                      </span>
                    </div>
                  )}

                  {/* Condition Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-background/90 backdrop-blur-sm rounded-full">
                    <span className="text-xs font-medium text-foreground">
                      {vehicle.condition}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Title & Year */}
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {vehicle.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.year} Model
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Gauge className="h-4 w-4" />
                      <span>{vehicle.mileage}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      <span>{vehicle.location}</span>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Starting from
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {vehicle.price}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/pre-owned')}
                      className="group/btn"
                    >
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            onClick={() => navigate('/pre-owned')}
            size={isMobile ? "default" : "lg"}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8"
          >
            View All Pre-Owned Vehicles
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
