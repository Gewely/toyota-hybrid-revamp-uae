import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSwipeable } from "@/hooks/use-swipeable";
import { useModal } from "@/contexts/ModalProvider";

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  image: string;
  category: string;
  terms: string[];
}

interface OffersSectionProps {
  onOfferClick: (offer: Offer) => void;
}

const OffersSection: React.FC<OffersSectionProps> = ({ onOfferClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();
  const { open } = useModal();

  const offers: Offer[] = [
    {
      id: "1",
      title: "0% APR Financing",
      description: "Get 0% APR financing for up to 60 months on select Toyota models.",
      discount: "0% APR",
      validUntil: "December 31, 2024",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/62301a41-e12b-4cd4-8be6-7cfddbd8bdba/items/bd7a1520-edfa-4312-a950-5699bf4114fe/renditions/aa4c707f-7c97-4105-a2c1-acdf1e604fc2?binary=true&mformat=true",
      category: "Financing",
      terms: ["Subject to approved credit", "Select models only", "May not be combined with other offers"]
    },
    {
      id: "2", 
      title: "Cash Back Bonus",
      description: "Get up to AED 5,000 cash back on your new Toyota purchase.",
      discount: "AED 5,000",
      validUntil: "January 15, 2025",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/2c9a7268-c9d3-4609-b7d7-ad28ae2374fa/items/5fd4b9bd-c2b8-4b9f-8eaa-46106d40b290/renditions/45e02ab3-8a09-487e-9d35-3065e03bf8f2?binary=true&mformat=true",
      category: "Cash Back",
      terms: ["Must finance through Toyota Financial", "Cannot be combined with 0% APR offer", "New vehicle purchases only"]
    },
    {
      id: "3",
      title: "Loyalty Bonus",
      description: "Current Toyota owners get an additional AED 2,500 loyalty bonus.",
      discount: "AED 2,500",
      validUntil: "March 31, 2025",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/62301a41-e12b-4cd4-8be6-7cfddbd8bdba/items/eed05ec6-363d-40a1-b776-dece1cee4482/renditions/7274d827-3cca-4828-a3ea-873611934ba2?binary=true&mformat=true",
      category: "Loyalty",
      terms: ["Must own a Toyota for at least 2 years", "Trade-in required", "Proof of ownership required"]
    },
    {
      id: "4",
      title: "Graduate Program",
      description: "Recent graduates get special pricing and financing options.",
      discount: "Up to AED 3,000",
      validUntil: "June 30, 2025",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/62301a41-e12b-4cd4-8be6-7cfddbd8bdba/items/6071111b-1ed2-4327-84d2-a1c5e02194c2/renditions/2330bd15-fc2c-44c3-b6b7-2a8109f05484?binary=true&mformat=true",
      category: "Graduate",
      terms: ["Graduated within 2 years", "Proof of graduation required", "Subject to credit approval"]
    },
    {
      id: "5",
      title: "Trade-In Bonus",
      description: "Get extra value for your trade-in vehicle with our special promotion.",
      discount: "Up to AED 4,000",
      validUntil: "April 30, 2025",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/2c9a7268-c9d3-4609-b7d7-ad28ae2374fa/items/5fd4b9bd-c2b8-4b9f-8eaa-46106d40b290/renditions/45e02ab3-8a09-487e-9d35-3065e03bf8f2?binary=true&mformat=true",
      category: "Trade-In",
      terms: ["Valid trade-in required", "Cannot be combined with other offers", "Market evaluation applies"]
    },
    {
      id: "6",
      title: "Military Discount",
      description: "Special pricing for active military personnel and veterans.",
      discount: "AED 1,500",
      validUntil: "December 31, 2024",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/62301a41-e12b-4cd4-8be6-7cfddbd8bdba/items/d5300d2b-da5b-4415-b11d-a0dca6bf5770/renditions/e4061dbc-a622-446c-b6d8-3092c2eec316?binary=true&mformat=true",
      category: "Military",
      terms: ["Valid military ID required", "Active duty and veterans eligible", "Cannot be combined with other offers"]
    }
  ];

  const nextOffer = () => {
    setCurrentIndex((prev) => (prev + 1) % offers.length);
  };

  const prevOffer = () => {
    setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
  };

  const visibleOffers = isMobile ? 1 : 3;
  const maxIndex = Math.max(0, offers.length - visibleOffers);

  const swipeableRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: () => {
      if (currentIndex < maxIndex) {
        nextOffer();
      }
    },
    onSwipeRight: () => {
      if (currentIndex > 0) {
        prevOffer();
      }
    },
    threshold: 50,
    preventDefaultTouchmoveEvent: false
  });

  return (
    <section className="py-12 lg:py-20 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="toyota-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground mb-4">
            Special Offers
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-black text-foreground mb-4 lg:mb-6">
            Limited Time Deals
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Don't miss out on these exclusive offers. Save more on your dream Toyota today.
          </p>
        </motion.div>

        {/* Enhanced Carousel with Swipe Support */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevOffer}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-xl border hover:shadow-2xl transition-all duration-300 -translate-x-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button
            onClick={nextOffer}
            disabled={currentIndex >= maxIndex}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-xl border hover:shadow-2xl transition-all duration-300 translate-x-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Offers Carousel Container with Swipe - Fixed touch behavior */}
          <div 
            ref={swipeableRef} 
            className="overflow-hidden mx-8 touch-manipulation select-none"
            style={{ touchAction: 'pan-y pinch-zoom' }}
          >
            <motion.div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleOffers)}%)`
              }}
            >
              {offers.map((offer, index) => {
                const row = Math.floor(index / visibleOffers);
                const col = index % visibleOffers;
                const diagonalDelay = (row + col) * 0.08;
                
                return (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: -100, rotateX: -15, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-5%" }}
                    transition={{ 
                      delay: diagonalDelay,
                      duration: 0.6,
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }}
                    whileHover={{ 
                      y: -12, 
                      scale: 1.02,
                      rotateY: 3,
                      zIndex: 10,
                      transition: { duration: 0.3 }
                    }}
                    className={`group cursor-pointer flex-shrink-0 ${
                      isMobile ? 'w-full' : 'w-1/3'
                    } px-3`}
                    onClick={() => onOfferClick(offer)}
                    style={{ 
                      transformStyle: 'preserve-3d',
                      perspective: '1000px'
                    }}
                  >

                  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02] bg-white h-full">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/95 text-gray-900 border-0 shadow-md">
                          {offer.category}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-primary text-primary-foreground border-0 shadow-md font-bold">
                          {offer.discount}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="space-y-4 flex-1">
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {offer.title}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {offer.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div className="text-sm text-muted-foreground">
                            Valid until {offer.validUntil}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary-foreground hover:bg-primary group-hover:translate-x-1 transition-all duration-200"
                          >
                            Learn More
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
            </motion.div>
          </div>

          {/* Enhanced Indicators with Swipe Hint */}
          <div className="flex flex-col items-center space-y-2 mt-8">
            <div className="flex space-x-2">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-primary w-8 shadow-lg' 
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>
            <div className="md:hidden">
              <span className="text-xs text-muted-foreground">Swipe to browse offers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
