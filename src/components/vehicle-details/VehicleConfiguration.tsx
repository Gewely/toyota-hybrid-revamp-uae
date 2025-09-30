import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import VehicleGradeComparison from "./VehicleGradeComparison";
import { Star, ArrowRight, Wrench, Car } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface VehicleConfigurationProps {
  vehicle: VehicleModel;
  selectedEngine?: string;
  onCarBuilder: (gradeName?: string) => void;
  onTestDrive: () => void;
  onGradeSelect: (gradeName: string) => void;
  onGradeComparison?: () => void;
}

const VehicleConfiguration: React.FC<VehicleConfigurationProps> = ({
  vehicle,
  selectedEngine = "3.5L",
  onCarBuilder,
  onTestDrive,
  onGradeSelect,
  onGradeComparison
}) => {
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const isMobile = useIsMobile();

  // Dynamic grade data based on selected engine
  const getGradesForEngine = (engine: string) => {
    if (engine === "4.0L") {
      return [
        {
          name: "TRD Off-Road",
          description: "Built for adventure with enhanced off-road capability",
          price: vehicle.price + 20000,
          monthlyFrom: Math.round((vehicle.price + 20000) * 0.8 * 0.035 / 12),
          badge: "Value",
          badgeColor: "bg-blue-100 text-blue-700",
          image: vehicle.image,
          features: ["TRD Off-Road Package", "Crawl Control", "Multi-Terrain Select", "Skid Plates"],
          specs: {
            engine: "4.0L V6 1GR-FE",
            power: "270 HP",
            torque: "278 lb-ft",
            transmission: "5-Speed Automatic",
            acceleration: "8.1s",
            fuelEconomy: "11.8L/100km"
          }
        },
        {
          name: "TRD Pro",
          description: "Ultimate off-road performance with premium features",
          price: vehicle.price + 50000,
          monthlyFrom: Math.round((vehicle.price + 50000) * 0.8 * 0.035 / 12),
          badge: "Most Popular",
          badgeColor: "bg-orange-100 text-orange-700",
          image: vehicle.image,
          features: ["TRD Pro Package", "Fox Racing Shocks", "TRD Pro Wheels", "Premium Interior"],
          specs: {
            engine: "4.0L V6 1GR-FE",
            power: "270 HP",
            torque: "278 lb-ft",
            transmission: "5-Speed Automatic",
            acceleration: "8.1s",
            fuelEconomy: "11.8L/100km"
          }
        }
      ];
    }
    
    // Default 3.5L grades
    return [
      {
        name: "SE",
        description: "Essential features for everyday driving",
        price: vehicle.price,
        monthlyFrom: Math.round(vehicle.price * 0.8 * 0.035 / 12),
        badge: "Value",
        badgeColor: "bg-blue-100 text-blue-700",
        image: vehicle.image,
        features: ["LED Headlights", "Smart Key", "8-inch Display", "Toyota Safety Sense"],
        specs: {
          engine: "3.5L V6 Dynamic Force",
          power: "295 HP",
          torque: "263 lb-ft",
          transmission: "8-Speed Automatic",
          acceleration: "7.2s",
          fuelEconomy: "9.2L/100km"
        }
      },
      {
        name: "XLE",
        description: "Enhanced comfort and technology features",
        price: vehicle.price + 20000,
        monthlyFrom: Math.round((vehicle.price + 20000) * 0.8 * 0.035 / 12),
        badge: "Most Popular",
        badgeColor: "bg-orange-100 text-orange-700",
        image: vehicle.image,
        features: ["Sunroof", "Premium Audio", "Heated Seats", "Wireless Charging", "360° Camera"],
        specs: {
          engine: "3.5L V6 Dynamic Force",
          power: "295 HP",
          torque: "263 lb-ft",
          transmission: "8-Speed Automatic",
          acceleration: "7.2s",
          fuelEconomy: "9.2L/100km"
        }
      },
      {
        name: "Limited",
        description: "Luxury features with advanced technology",
        price: vehicle.price + 40000,
        monthlyFrom: Math.round((vehicle.price + 40000) * 0.8 * 0.035 / 12),
        badge: "Luxury",
        badgeColor: "bg-purple-100 text-purple-700",
        image: vehicle.image,
        features: ["Leather Interior", "JBL Audio", "Head-up Display", "Adaptive Cruise", "Premium Paint"],
        specs: {
          engine: "3.5L V6 Dynamic Force",
          power: "295 HP",
          torque: "263 lb-ft",
          transmission: "8-Speed Automatic",
          acceleration: "7.2s",
          fuelEconomy: "9.2L/100km"
        }
      }
    ];
  };

  const grades = getGradesForEngine(selectedEngine);

  const handleGradeSelect = (gradeName: string) => {
    onGradeSelect(gradeName);
  };

  const handleCarBuilder = (gradeName: string) => {
    onCarBuilder(gradeName);
  };

  const handleTestDrive = (gradeName: string) => {
    onTestDrive();
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="toyota-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Choose Your {vehicle.name}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Configure your perfect vehicle with {selectedEngine} engine options
          </p>
        </motion.div>

        {/* Grades Grid */}
        <div className={`grid gap-6 mb-12 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
          {grades.map((grade, index) => (
            <motion.div
              key={grade.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-0">
                  {/* Grade Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={grade.image}
                      alt={`${vehicle.name} ${grade.name} Grade`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className={grade.badgeColor}>
                        {grade.badge === "Most Popular" && <Star className="w-3 h-3 mr-1" />}
                        {grade.badge}
                      </Badge>
                    </div>
                  </div>

                  {/* Grade Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-2">{grade.name} Grade</h3>
                      <p className="text-sm text-muted-foreground">{grade.description}</p>
                    </div>

                    {/* Pricing */}
                    <div className="mb-6">
                      <div className="text-2xl font-bold">AED {grade.price.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        From AED {grade.monthlyFrom}/month
                      </div>
                    </div>

                    {/* Key Features */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">Key Features:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {grade.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <Button
                        className="w-full"
                        onClick={() => handleGradeSelect(grade.name)}
                      >
                        Select {grade.name}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleCarBuilder(grade.name)}
                        >
                          <Wrench className="w-4 h-4 mr-1" />
                          Build
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleTestDrive(grade.name)}
                        >
                          <Car className="w-4 h-4 mr-1" />
                          Drive
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Compare Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsComparisonOpen(true)}
            className="px-8"
          >
            Compare All Grades
          </Button>
        </motion.div>

        {/* Grade Comparison Modal */}
        <VehicleGradeComparison
          isOpen={isComparisonOpen}
          onClose={() => setIsComparisonOpen(false)}
          engineName={vehicle.name}
          grades={grades}
          onGradeSelect={handleGradeSelect}
          onCarBuilder={handleCarBuilder}
          onTestDrive={handleTestDrive}
        />
      </div>
    </section>
  );
};

export default VehicleConfiguration;