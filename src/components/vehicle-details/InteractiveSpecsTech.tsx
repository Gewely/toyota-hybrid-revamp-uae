
import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { VehicleModel } from "@/types/vehicle";
import { 
  Car, Fuel, Award, Settings, Check, Zap, Shield, Smartphone 
} from "lucide-react";

interface InteractiveSpecsTechProps {
  vehicle: VehicleModel;
  onCarBuilder?: (grade?: string) => void;
}

interface Engine {
  name: string;
  power: string;
  torque: string;
  type: string;
  displacement: string;
}

interface Grade {
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

const InteractiveSpecsTech: React.FC<InteractiveSpecsTechProps> = ({ vehicle, onCarBuilder }) => {
  const [activeTab, setActiveTab] = useState<"specs" | "tech" | "configure">("specs");
  const [selectedEngine, setSelectedEngine] = useState("3.5L");
  const [selectedGrade, setSelectedGrade] = useState("Base");

  const handleTabChange = useCallback((value: "specs" | "tech" | "configure") => {
    setActiveTab(value);
  }, []);

  // Engine options with detailed specifications
  const engines: Engine[] = useMemo(() => [
    { 
      name: "3.5L", 
      power: "268 HP", 
      torque: "336 Nm",
      type: "V6 Hybrid",
      displacement: "3.5L"
    },
    { 
      name: "4.0L", 
      power: "301 HP", 
      torque: "365 Nm",
      type: "V6 Hybrid",
      displacement: "4.0L"
    }
  ], []);

  // Grades that change based on selected engine
  const getGradesForEngine = useCallback((engine: string): Grade[] => {
    if (engine === "4.0L") {
      return [
        {
          name: "Limited",
          price: vehicle.price + 15000,
          features: ["Premium leather", "Advanced safety", "Navigation system", "Heated seats"]
        },
        {
          name: "Platinum",
          price: vehicle.price + 25000,
          features: ["All Limited features", "Premium audio", "Ventilated seats", "Head-up display"],
          popular: true
        }
      ];
    }
    return [
      {
        name: "Base",
        price: vehicle.price,
        features: ["Standard safety", "Climate control", "Touch display", "Backup camera"]
      },
      {
        name: "SE",
        price: vehicle.price + 5000,
        features: ["Sport styling", "Upgraded audio", "Smart key", "LED lights"],
        popular: true
      },
      {
        name: "XLE",
        price: vehicle.price + 10000,
        features: ["Premium comfort", "Power seats", "Moonroof", "Advanced climate"]
      },
      {
        name: "Limited",
        price: vehicle.price + 15000,
        features: ["Luxury features", "Leather trim", "Premium audio", "Advanced tech"]
      }
    ];
  }, [vehicle.price]);

  // Dynamic specifications based on selections
  const getSpecsForConfig = useCallback(() => {
    const selectedEngineData = engines.find(e => e.name === selectedEngine);
    return {
      engineType: selectedEngineData?.type || "Hybrid",
      engineDisplacement: selectedEngineData?.displacement || "3.5L",
      horsepower: selectedEngineData?.power || "268 HP",
      torque: selectedEngineData?.torque || "336 Nm",
      transmission: "CVT",
      fuelEconomy: selectedGrade === "Platinum" ? "20.5 km/L" : "22.2 km/L",
      drivetrain: selectedGrade === "Limited" || selectedGrade === "Platinum" ? "AWD" : "FWD",
      length: "192.1 in",
      width: "72.4 in",
      height: "56.9 in",
      cityFuelEconomy: "28 mpg",
      highwayFuelEconomy: "39 mpg",
      seatingCapacity: "5 passengers",
      cargoVolume: "15.1 cu ft"
    };
  }, [selectedEngine, selectedGrade, engines]);

  // Technology features
  const techFeatures = useMemo(() => [
    {
      title: "Toyota Safety Sense 3.0",
      description: "Next-generation safety with AI-powered collision prevention",
      icon: <Shield className="h-8 w-8" />,
      color: "from-green-500 to-emerald-400",
      features: ["Pre-Collision System", "Lane Departure Alert", "Dynamic Radar Cruise Control"]
    },
    {
      title: "Connected Intelligence",
      description: "Seamless smartphone integration with wireless connectivity",
      icon: <Smartphone className="h-8 w-8" />,
      color: "from-primary to-primary/70",
      features: ["Wireless Apple CarPlay", "Premium JBL sound", "Voice recognition"]
    },
    {
      title: "Hybrid Synergy Drive",
      description: "World's most advanced hybrid system with instant electric response",
      icon: <Zap className="h-8 w-8" />,
      color: "from-primary to-primary/80",
      features: ["Seamless electric-gasoline transition", "Regenerative braking system", "EV mode for silent operation"]
    }
  ], []);

  const specs = getSpecsForConfig();
  const availableGrades = getGradesForEngine(selectedEngine);

  // Handle engine change and reset grade if needed
  const handleEngineChange = useCallback((engine: string) => {
    setSelectedEngine(engine);
    const newGrades = getGradesForEngine(engine);
    if (!newGrades.find(g => g.name === selectedGrade)) {
      setSelectedGrade(newGrades[0].name);
    }
  }, [selectedGrade, getGradesForEngine]);

  const handleConfigureWithSelections = useCallback(() => {
    if (onCarBuilder) {
      onCarBuilder(`${selectedEngine}-${selectedGrade}`);
    }
  }, [onCarBuilder, selectedEngine, selectedGrade]);

  return (
    <div className="toyota-container">
      <Tabs defaultValue="specs" className="w-full" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="tech">Technology</TabsTrigger>
          <TabsTrigger value="configure">Configure</TabsTrigger>
        </TabsList>
        
        <AnimatePresence mode="wait">
          {activeTab === 'specs' && (
            <TabsContent value="specs" className="mt-6 space-y-4">
              <motion.div
                key="specs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-2xl font-bold mb-6">Vehicle Specifications</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Engine & Performance */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Car className="h-5 w-5 mr-2 text-primary" />
                        Engine & Performance
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Engine Type</span>
                          <span className="font-medium">{specs.engineType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Displacement</span>
                          <span className="font-medium">{specs.engineDisplacement}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Horsepower</span>
                          <span className="font-medium">{specs.horsepower}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Torque</span>
                          <span className="font-medium">{specs.torque}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Fuel Economy */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Fuel className="h-5 w-5 mr-2 text-primary" />
                        Fuel Economy
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Combined</span>
                          <span className="font-medium">{specs.fuelEconomy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">City</span>
                          <span className="font-medium">{specs.cityFuelEconomy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Highway</span>
                          <span className="font-medium">{specs.highwayFuelEconomy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Drivetrain</span>
                          <span className="font-medium">{specs.drivetrain}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Dimensions & Capacity */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Settings className="h-5 w-5 mr-2 text-primary" />
                        Dimensions
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Length</span>
                          <span className="font-medium">{specs.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Width</span>
                          <span className="font-medium">{specs.width}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Height</span>
                          <span className="font-medium">{specs.height}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Seating</span>
                          <span className="font-medium">{specs.seatingCapacity}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Features */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Standard Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.features.map((feature, index) => (
                      <Badge key={index} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          )}
          
          {activeTab === 'tech' && (
            <TabsContent value="tech" className="mt-6 space-y-4">
              <motion.div
                key="tech"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-2xl font-bold mb-6">Technology Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {techFeatures.map((feature, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white`}>
                            {feature.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm">{feature.description}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {feature.features.map((feat, idx) => (
                            <div key={feat} className="flex items-center space-x-3">
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </TabsContent>
          )}
          
          {activeTab === 'configure' && (
            <TabsContent value="configure" className="mt-6 space-y-6">
              <motion.div
                key="configure"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-bold mb-6">Configure Your Vehicle</h2>
                
                {/* Engine & Grade Selection */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Engine Selection */}
                  <div>
                    <h3 className="text-xl font-bold mb-4">Select Engine</h3>
                    <div className="space-y-3">
                      {engines.map((engine) => (
                        <motion.div
                          key={engine.name}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                            selectedEngine === engine.name 
                              ? 'bg-primary/10 border-primary shadow-lg' 
                              : 'bg-card border-border hover:border-primary/50'
                          }`}
                          onClick={() => handleEngineChange(engine.name)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-bold">{engine.name} {engine.type}</h4>
                            {selectedEngine === engine.name && (
                              <Check className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <p className="text-primary text-sm font-medium">{engine.power} • {engine.torque}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Grade Selection */}
                  <div>
                    <h3 className="text-xl font-bold mb-4">Select Grade</h3>
                    <div className="space-y-3">
                      {availableGrades.map((grade) => (
                        <motion.div
                          key={grade.name}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 relative ${
                            selectedGrade === grade.name
                              ? "bg-primary/10 border-primary shadow-lg"
                              : "bg-card border-border hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedGrade(grade.name)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="text-lg font-bold flex items-center gap-2">
                                {grade.name}
                                {grade.popular && (
                                  <Badge className="bg-primary text-primary-foreground text-xs">
                                    Popular
                                  </Badge>
                                )}
                              </h4>
                              <p className="text-primary text-sm font-medium">
                                AED {grade.price.toLocaleString()}
                              </p>
                            </div>
                            {selectedGrade === grade.name && (
                              <Check className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div className="space-y-1">
                            {grade.features.slice(0, 2).map((feature, idx) => (
                              <div key={feature} className="flex items-center space-x-2">
                                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                                <span className="text-xs text-muted-foreground">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Selected Configuration Summary */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Your Configuration</h3>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{selectedEngine}</div>
                        <div className="text-sm text-muted-foreground">Engine</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{selectedGrade}</div>
                        <div className="text-sm text-muted-foreground">Grade</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          AED {availableGrades.find(g => g.name === selectedGrade)?.price.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Starting Price</div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <Button 
                        size="lg" 
                        className="px-12 py-4"
                        onClick={handleConfigureWithSelections}
                      >
                        Build Your {vehicle.name} {selectedGrade}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default InteractiveSpecsTech;
