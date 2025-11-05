
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ToyotaLayout from "@/components/ToyotaLayout";
import HeroCarousel from "@/components/home/HeroCarousel";
import PersonaSelector from "@/components/home/PersonaSelector";
import PersonalizedHero from "@/components/home/PersonalizedHero";
import QuickLinks from "@/components/home/QuickLinks";
import PersonaBadge from "@/components/home/PersonaBadge";
import CategoryFilter from "@/components/home/CategoryFilter";
import VehicleShowcase from "@/components/home/VehicleShowcase";
import ComparisonTable from "@/components/home/ComparisonTable";
import QuickViewModal from "@/components/home/QuickViewModal";
import CompareFloatingBox from "@/components/home/CompareFloatingBox";
import LifestyleSection from "@/components/home/LifestyleSection";
import PerformanceSection from "@/components/home/PerformanceSection";
import PreOwnedSection from "@/components/home/PreOwnedSection";
import OffersSection from "@/components/home/OffersSection";

import VehicleRecommendations from "@/components/home/VehicleRecommendations";
import LuxuryShowcase from "@/components/LuxuryShowcase";
import CarBuilder from "@/components/builder/CarBuilder";
import LuxuryComparisonTool from "@/components/comparison/LuxuryComparisonTool";
import CustomerJourneyCTAs from "@/components/cta/CustomerJourneyCTAs";
import { vehicles, preOwnedVehicles, heroSlides } from "@/data/vehicles";
import { VehicleModel } from "@/types/vehicle";
import { usePersona } from "@/contexts/PersonaContext";
import { useToast } from "@/hooks/use-toast";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Available categories for filtering
const categories = ["All", "Hybrid", "Electric", "Hydrogen", "Sedan", "SUV", "GR Performance", "Commercial"];

const Index = () => {
  // State management
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<number[]>([0, 300000]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleModel | null>(null);
  const { toast } = useToast();
  const { personaData, selectedPersona: activePersona } = usePersona();
  const [personaFilteredVehicles, setPersonaFilteredVehicles] = useState<VehicleModel[] | null>(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const initialLoadRef = useRef(false);
  const [animateVehicles, setAnimateVehicles] = useState(false);
  
  // Luxury component states
  const [showCarBuilder, setShowCarBuilder] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showLuxuryExperience, setShowLuxuryExperience] = useState(false);

  // Custom section visibility states based on persona
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({
    showcase: true,
    recommendations: false,
    performance: true,
    offers: true,
    lifestyle: true,
    preOwned: true
  });
  
  // Listen for persona vehicle filtering events
  useEffect(() => {
    const handleFilteredVehicles = (event: any) => {
      if (event.detail && event.detail.vehicles) {
        setPersonaFilteredVehicles(event.detail.vehicles);
      } else {
        setPersonaFilteredVehicles(null);
      }
    };
    
    window.addEventListener('persona-vehicles-filtered', handleFilteredVehicles);
    return () => window.removeEventListener('persona-vehicles-filtered', handleFilteredVehicles);
  }, []);
  
  // Update section visibility based on selected persona
  useEffect(() => {
    if (personaData) {
      // If we've just selected a persona, scroll to top to see full personalization
      if (!initialLoadRef.current) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        initialLoadRef.current = true;
      }
      
      const newVisibility: Record<string, boolean> = {
        showcase: true,
        recommendations: true, // Show recommendations when a persona is selected
        performance: personaData.highlightedSections.includes("performance"),
        offers: true,
        lifestyle: personaData.highlightedSections.includes("lifestyle") || 
                  personaData.id === "family-first" || 
                  personaData.id === "weekend-adventurer",
        preOwned: personaData.id !== "tech-enthusiast" // Hide pre-owned for tech enthusiasts who prefer new models
      };
      
      setVisibleSections(newVisibility);
      
      // Set appropriate category based on persona
      if (personaData.id === "eco-warrior") {
        setSelectedCategory("Hybrid");
      } else if (personaData.id === "family-first") {
        setSelectedCategory("SUV");
      } else if (personaData.id === "tech-enthusiast") {
        setSelectedCategory("GR Performance");
      } else if (personaData.id === "urban-explorer" || personaData.id === "business-commuter") {
        setSelectedCategory("Sedan");
      } else if (personaData.id === "weekend-adventurer") {
        setSelectedCategory("SUV");
      }

      // Start vehicle animation sequence after persona selection
      setTimeout(() => {
        setAnimateVehicles(true);
      }, 500);
      
    } else {
      // Reset to all sections visible
      setVisibleSections({
        showcase: true,
        recommendations: false,
        performance: true,
        offers: true,
        lifestyle: true,
        preOwned: true
      });
      setSelectedCategory("All");
      setAnimateVehicles(false);
    }
  }, [personaData]);


  // Filter vehicles based on category, price, and persona recommendations
  const filteredVehicles = React.useMemo(() => {
    // If we have persona-filtered vehicles, use those as the base
    const baseVehicles = personaFilteredVehicles || vehicles;
    
    // Then apply additional user filters
    return baseVehicles.filter(
      (vehicle) =>
        (selectedCategory === "All" || vehicle.category === selectedCategory) &&
        vehicle.price >= priceRange[0] &&
        vehicle.price <= priceRange[1]
    );
  }, [personaFilteredVehicles, selectedCategory, priceRange]);

  // Handler for compare toggle
  const handleCompareToggle = (vehicle: VehicleModel) => {
    if (compareList.includes(vehicle.name)) {
      // Remove from compare list
      setCompareList(compareList.filter((name) => name !== vehicle.name));
      toast({
        title: "Removed from comparison",
        description: `${vehicle.name} has been removed from your comparison list.`,
        variant: "default",
      });
    } else {
      // Add to compare list (max 3)
      if (compareList.length >= 3) {
        toast({
          title: "Comparison limit reached",
          description: "You can compare up to 3 vehicles at a time. Please remove a vehicle first.",
          variant: "destructive",
        });
        return;
      }
      
      setCompareList([...compareList, vehicle.name]);
      toast({
        title: "Added to comparison",
        description: `${vehicle.name} has been added to your comparison list.`,
        variant: "default",
      });
    }
  };

  // Handler for removing vehicle from compare list
  const handleRemoveFromCompare = (name: string) => {
    setCompareList(compareList.filter((item) => item !== name));
  };

  // Handler for clearing all vehicles from compare list
  const handleClearCompare = () => {
    setCompareList([]);
  };

  // Handle persona selection completion
  const handlePersonaSelection = () => {
    // Scroll to vehicle showcase after persona selection
    setTimeout(() => {
      document.getElementById('vehicle-showcase')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  // Vehicle comparison data
  const comparedVehicles = vehicles.filter((vehicle) =>
    compareList.includes(vehicle.name)
  );

  return (
    <ToyotaLayout>
      {/* Show either default hero or personalized hero based on persona selection */}
      {!activePersona ? (
        <>
          <HeroCarousel slides={heroSlides} />
          <PersonaSelector onSelect={handlePersonaSelection} />
        </>
      ) : (
        <>
          <PersonalizedHero />
          <QuickLinks />
        </>
      )}

      {/* Top Actions Bar with Persona-specific styling */}
      <motion.div 
        className={cn(
          "shadow-sm z-20 sticky top-0",
          personaData ? "bg-opacity-95 backdrop-blur-sm" : "",
        )}
        style={personaData ? { 
          backgroundColor: `${personaData.colorScheme.primary}10`,
          borderBottom: `1px solid ${personaData.colorScheme.primary}20`
        } : {}}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="toyota-container py-4 flex justify-between items-center">
          <div className="text-sm flex items-center">
            <span 
              className={cn(
                "font-medium",
                personaData && "text-opacity-90"
              )}
              style={personaData ? { color: personaData.colorScheme.primary } : {}}
            >
              Showing {filteredVehicles.length} vehicles
            </span>
            
            {personaData && (
              <motion.span 
                className="ml-2 text-xs bg-opacity-20 px-2 py-0.5 rounded-full"
                style={{ 
                  backgroundColor: personaData.colorScheme.primary,
                  color: personaData.colorScheme.primary 
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                Personalized for you
              </motion.span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant={showFilterPanel ? "default" : "outline"} 
              size="sm" 
              className={cn(
                "relative",
                personaData && "border-opacity-50"
              )}
              style={personaData && showFilterPanel ? {
                backgroundColor: personaData.colorScheme.primary,
                color: "#FFF"
              } : personaData ? {
                borderColor: personaData.colorScheme.primary  
              } : {}}
              onClick={() => setShowFilterPanel(!showFilterPanel)}
            >
              <Filter className="h-4 w-4 mr-2" />
              <span>Filter</span>
            </Button>

            {/* Quick access to new experiences so changes reflect immediately */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowComparison(true)}
            >
              Compare Grades
            </Button>
            <Button 
              size="sm" 
              onClick={() => setShowCarBuilder(true)}
            >
              Build & Reserve
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Category Filter */}
      <AnimatePresence>
        {showFilterPanel && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <CategoryFilter
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedPersona={selectedPersona}
              setSelectedPersona={setSelectedPersona}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              categories={categories}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Personalized Recommendations */}
      {visibleSections.recommendations && personaData && (
        <VehicleRecommendations 
          personaData={personaData} 
          vehicles={vehicles} 
        />
      )}

      {/* Vehicle Showcase with Persona-specific styling */}
      {visibleSections.showcase && (
        <section 
          id="vehicle-showcase" 
          className="py-10 md:py-16"
          style={personaData ? {
            backgroundColor: `${personaData.colorScheme.background}`,
            backgroundImage: personaData.backgroundPattern || "",
          } : {}}
        >
          <VehicleShowcase
            title={personaData ? 
              `${personaData.title} Recommended Models` : 
              "Explore Our Vehicles"}
            vehicles={filteredVehicles}
            compareList={compareList}
            onCompare={handleCompareToggle}
            onQuickView={setSelectedVehicle}
            personaData={personaData}
          />
        </section>
      )}

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedVehicle && (
          <QuickViewModal
            vehicle={selectedVehicle}
            onClose={() => setSelectedVehicle(null)}
            personaData={personaData}
          />
        )}
      </AnimatePresence>

      {/* Compare Floating Box - Only show if comparing 1 vehicle */}
      {compareList.length === 1 && (
        <CompareFloatingBox
          compareList={compareList}
          vehicles={vehicles}
          onRemove={handleRemoveFromCompare}
          onClearAll={handleClearCompare}
          personaData={personaData}
        />
      )}

      {/* Performance Section - Show based on persona */}
      {visibleSections.performance && (
        <PerformanceSection />
      )}

      {/* Special Offers Section */}
      {visibleSections.offers && (
        <OffersSection onOfferClick={() => {}} />
      )}

      {/* Lifestyle Section */}
      {visibleSections.lifestyle && (
        <LifestyleSection />
      )}

      {/* Pre-Owned Section */}
      {visibleSections.preOwned && (
        <PreOwnedSection vehicles={preOwnedVehicles} />
      )}

      {/* Comparison Table - Show as overlay when at least 2 vehicles are selected */}
      {compareList.length >= 2 && (
        <ComparisonTable
          vehicles={comparedVehicles}
          onRemove={handleRemoveFromCompare}
          onClearAll={handleClearCompare}
          personaData={personaData}
        />
      )}

      {/* Luxury Showcase Experience */}
      {showLuxuryExperience && (
        <LuxuryShowcase
          onReserve={() => setShowCarBuilder(true)}
          onBuild={() => setShowCarBuilder(true)}
          onTestDrive={() => console.log('Test drive')}
          onCompare={() => setShowComparison(true)}
          onShare={() => console.log('Share')}
          onFeatureLearnMore={(id) => console.log('Learn more:', id)}
          onCarouselAction={(id) => console.log('Carousel action:', id)}
        />
      )}

      {/* Customer Journey CTAs */}
      <CustomerJourneyCTAs />

      {/* Car Builder Modal */}
      <CarBuilder
        isOpen={showCarBuilder}
        onClose={() => setShowCarBuilder(false)}
        onReserve={(config) => {
          console.log('Reserve config:', config);
          setShowCarBuilder(false);
        }}
      />

      {/* Luxury Comparison Tool */}
      <LuxuryComparisonTool
        isOpen={showComparison}
        grades={[
            { 
              id: 'le', 
              name: 'LE', 
              price: 32500, 
              description: 'Essential features and reliability', 
              monthlyFrom: 450, 
              badge: 'Popular', 
              badgeColor: 'blue', 
              image: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/19d9b6ba-2cee-4d91-b3b3-621f72452918/renditions/9c9119d9-d77c-4c13-a2aa-b0f9e55219cb?binary=true&mformat=true',
              features: ['Toyota Safety Sense 2.0', 'LED Headlights'],
              specs: {
                engine: '2.5L 4-Cylinder',
                power: '203 HP',
                torque: '184 lb-ft',
                transmission: '8-Speed Automatic',
                acceleration: '8.2 sec 0-100 km/h',
                fuelEconomy: '7.2L/100km'
              },
              highlights: ['Most affordable option', 'Proven reliability', 'Comprehensive safety features']
            },
            { 
              id: 'xle', 
              name: 'XLE', 
              price: 35500, 
              description: 'Enhanced comfort and convenience', 
              monthlyFrom: 520, 
              badge: 'Best Value', 
              badgeColor: 'green', 
              image: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/19d9b6ba-2cee-4d91-b3b3-621f72452918/renditions/9c9119d9-d77c-4c13-a2aa-b0f9e55219cb?binary=true&mformat=true',
              features: ['Moonroof', 'Heated Seats'],
              specs: {
                engine: '2.5L 4-Cylinder',
                power: '203 HP',
                torque: '184 lb-ft',
                transmission: '8-Speed Automatic',
                acceleration: '8.2 sec 0-100 km/h',
                fuelEconomy: '7.0L/100km'
              },
              highlights: ['Perfect balance of features and price', 'Enhanced comfort', 'Premium amenities']
            },
            { 
              id: 'limited', 
              name: 'Limited', 
              price: 39500, 
              description: 'Premium luxury and technology', 
              monthlyFrom: 580, 
              badge: 'Premium', 
              badgeColor: 'gold', 
              image: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/19d9b6ba-2cee-4d91-b3b3-621f72452918/renditions/9c9119d9-d77c-4c13-a2aa-b0f9e55219cb?binary=true&mformat=true',
              features: ['Leather Interior', 'JBL Audio'],
              specs: {
                engine: '2.5L 4-Cylinder',
                power: '203 HP',
                torque: '184 lb-ft',
                transmission: '8-Speed Automatic',
                acceleration: '8.2 sec 0-100 km/h',
                fuelEconomy: '7.0L/100km'
              },
              highlights: ['Top-tier luxury features', 'Premium materials', 'Advanced technology']
            }
          ]}
          onClose={() => setShowComparison(false)}
          onTestDrive={(gradeId) => console.log('Test drive grade:', gradeId)}
          onGetQuote={(gradeId) => console.log('Get quote grade:', gradeId)}
        />

      {/* Persona Badge - Show when a persona is selected */}
      {activePersona && <PersonaBadge />}
    </ToyotaLayout>
  );
};

export default Index;
