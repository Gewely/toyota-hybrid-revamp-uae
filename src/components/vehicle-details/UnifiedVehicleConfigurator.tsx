import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { 
  Car, 
  Fuel, 
  Award, 
  Settings, 
  Check, 
  Zap, 
  Shield, 
  Smartphone,
  Star,
  ArrowRight,
  Wrench,
  BarChart3,
  X,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UnifiedVehicleConfiguratorProps {
  vehicle: VehicleModel;
  onCarBuilder?: (grade?: string) => void;
  onTestDrive?: () => void;
  onGradeSelect?: (gradeName: string) => void;
}

interface Engine {
  name: string;
  power: string;
  torque: string;
  type: string;
  displacement: string;
  fuelEconomy: string;
  price: number;
}

interface Grade {
  name: string;
  price: number;
  monthlyFrom: number;
  features: string[];
  popular?: boolean;
  badge?: string;
  badgeColor?: string;
  specs: {
    engine: string;
    power: string;
    torque: string;
    transmission: string;
    acceleration: string;
    fuelEconomy: string;
    drivetrain: string;
  };
}

const UnifiedVehicleConfigurator: React.FC<UnifiedVehicleConfiguratorProps> = ({ 
  vehicle, 
  onCarBuilder, 
  onTestDrive,
  onGradeSelect 
}) => {
  const [activeTab, setActiveTab] = useState<"specs" | "tech" | "configure">("configure");
  const [selectedEngine, setSelectedEngine] = useState("3.5L");
  const [selectedGrade, setSelectedGrade] = useState("SE");
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Engine options with detailed specifications
  const engines: Engine[] = useMemo(() => [
    { 
      name: "3.5L", 
      power: "295 HP", 
      torque: "263 lb-ft",
      type: "V6 Dynamic Force",
      displacement: "3.5L",
      fuelEconomy: "9.2L/100km",
      price: 0
    },
    { 
      name: "4.0L", 
      power: "270 HP", 
      torque: "278 lb-ft",
      type: "V6 1GR-FE",
      displacement: "4.0L",
      fuelEconomy: "11.8L/100km",
      price: 8000
    }
  ], []);

  // Grades that change based on selected engine
  const getGradesForEngine = useCallback((engine: string): Grade[] => {
    const basePrice = vehicle.price;
    const enginePrice = engines.find(e => e.name === engine)?.price || 0;
    
    if (engine === "4.0L") {
      return [
        {
          name: "TRD Off-Road",
          price: basePrice + enginePrice + 10000,
          monthlyFrom: Math.round((basePrice + enginePrice + 10000) * 0.035 / 12),
          badge: "Off-Road Pro",
          badgeColor: "bg-orange-100 text-orange-700",
          features: ["Multi-terrain Select", "Crawl Control", "TRD Skid Plates", "Off-Road Suspension"],
          specs: {
            engine: "4.0L V6 1GR-FE",
            power: "270 HP",
            torque: "278 lb-ft",
            transmission: "5-Speed Automatic",
            acceleration: "8.1 seconds",
            fuelEconomy: "11.8L/100km",
            drivetrain: "4WD"
          }
        },
        {
          name: "TRD Pro",
          price: basePrice + enginePrice + 30000,
          monthlyFrom: Math.round((basePrice + enginePrice + 30000) * 0.035 / 12),
          badge: "Ultimate Off-Road",
          badgeColor: "bg-red-100 text-red-700",
          features: ["All TRD Off-Road features", "Fox Racing Shocks", "TRD Pro Wheels", "Heritage Grille"],
          popular: true,
          specs: {
            engine: "4.0L V6 1GR-FE",
            power: "270 HP",
            torque: "278 lb-ft",
            transmission: "5-Speed Automatic",
            acceleration: "8.1 seconds",
            fuelEconomy: "11.8L/100km",
            drivetrain: "4WD"
          }
        }
      ];
    }
    
    return [
      {
        name: "SE",
        price: basePrice + enginePrice,
        monthlyFrom: Math.round((basePrice + enginePrice) * 0.035 / 12),
        badge: "Value Choice",
        badgeColor: "bg-blue-100 text-blue-700",
        features: ["LED Headlights", "Smart Key", "7-inch Display", "Toyota Safety Sense"],
        specs: {
          engine: "3.5L V6 Dynamic Force",
          power: "295 HP",
          torque: "263 lb-ft",
          transmission: "8-Speed Automatic",
          acceleration: "7.2 seconds",
          fuelEconomy: "9.2L/100km",
          drivetrain: "2WD"
        }
      },
      {
        name: "XLE",
        price: basePrice + enginePrice + 20000,
        monthlyFrom: Math.round((basePrice + enginePrice + 20000) * 0.035 / 12),
        badge: "Most Popular",
        badgeColor: "bg-green-100 text-green-700",
        features: ["Sunroof", "Premium Audio", "Heated Seats", "Wireless Charging", "360° Camera"],
        popular: true,
        specs: {
          engine: "3.5L V6 Dynamic Force",
          power: "295 HP",
          torque: "263 lb-ft",
          transmission: "8-Speed Automatic",
          acceleration: "7.2 seconds",
          fuelEconomy: "9.2L/100km",
          drivetrain: "AWD"
        }
      },
      {
        name: "Limited",
        price: basePrice + enginePrice + 40000,
        monthlyFrom: Math.round((basePrice + enginePrice + 40000) * 0.035 / 12),
        badge: "Premium",
        badgeColor: "bg-purple-100 text-purple-700",
        features: ["Leather Interior", "JBL Audio", "Head-up Display", "Adaptive Cruise", "Premium Paint"],
        specs: {
          engine: "3.5L V6 Dynamic Force",
          power: "295 HP",
          torque: "263 lb-ft",
          transmission: "8-Speed Automatic",
          acceleration: "7.2 seconds",
          fuelEconomy: "9.2L/100km",
          drivetrain: "AWD"
        }
      }
    ];
  }, [vehicle.price, engines]);

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

  const availableGrades = getGradesForEngine(selectedEngine);
  const selectedEngineData = engines.find(e => e.name === selectedEngine);
  const selectedGradeData = availableGrades.find(g => g.name === selectedGrade);

  // Dynamic specifications based on selections
  const getSpecsForConfig = useCallback(() => {
    const gradeData = availableGrades.find(g => g.name === selectedGrade);
    return {
      engineType: selectedEngineData?.type || "V6 Dynamic Force",
      engineDisplacement: selectedEngineData?.displacement || "3.5L",
      horsepower: selectedEngineData?.power || "295 HP",
      torque: selectedEngineData?.torque || "263 lb-ft",
      transmission: gradeData?.specs.transmission || "8-Speed Automatic",
      fuelEconomy: gradeData?.specs.fuelEconomy || "9.2L/100km",
      drivetrain: gradeData?.specs.drivetrain || "2WD",
      acceleration: gradeData?.specs.acceleration || "7.2 seconds",
      length: "198.5 in",
      width: "78.0 in",
      height: "71.7 in",
      seatingCapacity: "7-8 passengers",
      cargoVolume: "84.3 cu ft"
    };
  }, [selectedEngine, selectedGrade, availableGrades, selectedEngineData]);

  const specs = getSpecsForConfig();

  // Handle engine change and reset grade if needed
  const handleEngineChange = useCallback((engine: string) => {
    setSelectedEngine(engine);
    const newGrades = getGradesForEngine(engine);
    if (!newGrades.find(g => g.name === selectedGrade)) {
      setSelectedGrade(newGrades[0].name);
    }
  }, [selectedGrade, getGradesForEngine]);

  const handleGradeSelect = useCallback((gradeName: string) => {
    setSelectedGrade(gradeName);
    onGradeSelect?.(gradeName);
    toast({
      title: "Grade Selected",
      description: `${gradeName} grade has been selected for your ${vehicle.name}.`,
    });
  }, [onGradeSelect, vehicle.name, toast]);

  const handleCarBuilder = useCallback((gradeName?: string) => {
    const grade = gradeName || selectedGrade;
    onCarBuilder?.(`${selectedEngine}-${grade}`);
    toast({
      title: "Opening Car Builder",
      description: `Configure your ${vehicle.name} ${grade} with ${selectedEngine} engine.`,
    });
  }, [onCarBuilder, selectedEngine, selectedGrade, vehicle.name, toast]);

  const handleTestDrive = useCallback(() => {
    onTestDrive?.();
    toast({
      title: "Test Drive Booked",
      description: `Test drive scheduled for ${vehicle.name} ${selectedGrade} with ${selectedEngine} engine.`,
    });
  }, [onTestDrive, vehicle.name, selectedGrade, selectedEngine, toast]);

  const handleComparisonToggle = useCallback((gradeKey: string) => {
    setSelectedForComparison(prev => {
      if (prev.includes(gradeKey)) {
        return prev.filter(key => key !== gradeKey);
      } else if (prev.length < 3) {
        return [...prev, gradeKey];
      } else {
        toast({
          title: "Maximum Reached",
          description: "You can compare up to 3 grades at once.",
          variant: "destructive"
        });
        return prev;
      }
    });
  }, [toast]);

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
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            Configure Your <span className="text-primary">{vehicle.name}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore specifications, technology, and configure your perfect vehicle with our comprehensive configurator
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className={cn(
            "grid w-full mb-8",
            isMobile ? "grid-cols-3 h-12" : "grid-cols-3 h-14"
          )}>
            <TabsTrigger value="configure" className="text-sm font-medium">
              Configure
            </TabsTrigger>
            <TabsTrigger value="specs" className="text-sm font-medium">
              Specifications
            </TabsTrigger>
            <TabsTrigger value="tech" className="text-sm font-medium">
              Technology
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {/* Configure Tab */}
            {activeTab === 'configure' && (
              <TabsContent value="configure" className="mt-0">
                <motion.div
                  key="configure"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-8"
                >
                  {/* Engine & Grade Selection */}
                  <div className={cn(
                    "grid gap-8",
                    isMobile ? "grid-cols-1" : "grid-cols-2"
                  )}>
                    {/* Engine Selection */}
                    <div>
                      <h3 className="text-xl font-bold mb-6">Select Engine</h3>
                      <div className="space-y-4">
                        {engines.map((engine) => (
                          <motion.div
                            key={engine.name}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                              "p-4 rounded-xl cursor-pointer transition-all duration-200 border-2",
                              selectedEngine === engine.name 
                                ? 'bg-primary/10 border-primary shadow-lg' 
                                : 'bg-card border-border hover:border-primary/50'
                            )}
                            onClick={() => handleEngineChange(engine.name)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="text-lg font-bold">{engine.name} {engine.type}</h4>
                                <p className="text-primary text-sm font-medium">
                                  {engine.power} • {engine.torque}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                  Fuel Economy: {engine.fuelEconomy}
                                </p>
                                {engine.price > 0 && (
                                  <p className="text-sm font-medium text-green-600">
                                    +AED {engine.price.toLocaleString()}
                                  </p>
                                )}
                              </div>
                              {selectedEngine === engine.name && (
                                <Check className="h-5 w-5 text-primary" />
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Grade Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold">Select Grade</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsComparisonOpen(true)}
                          disabled={availableGrades.length < 2}
                          className="flex items-center gap-2"
                        >
                          <BarChart3 className="h-4 w-4" />
                          Compare
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {availableGrades.map((grade) => (
                          <motion.div
                            key={grade.name}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                              "p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 relative",
                              selectedGrade === grade.name
                                ? "bg-primary/10 border-primary shadow-lg"
                                : "bg-card border-border hover:border-primary/50"
                            )}
                            onClick={() => handleGradeSelect(grade.name)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-lg font-bold">{grade.name}</h4>
                                  {grade.popular && (
                                    <Badge className="bg-primary text-primary-foreground text-xs">
                                      <Star className="h-3 w-3 mr-1" />
                                      Popular
                                    </Badge>
                                  )}
                                  {grade.badge && (
                                    <Badge className={grade.badgeColor}>
                                      {grade.badge}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-primary text-lg font-bold">
                                  AED {grade.price.toLocaleString()}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                  From AED {grade.monthlyFrom}/month
                                </p>
                              </div>
                              {selectedGrade === grade.name && (
                                <Check className="h-5 w-5 text-primary" />
                              )}
                            </div>
                            <div className="space-y-1 mt-3">
                              {grade.features.slice(0, 2).map((feature) => (
                                <div key={feature} className="flex items-center space-x-2">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                  <span className="text-sm text-muted-foreground">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Current Configuration Summary */}
                  <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4">Your Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                          <p className="text-sm text-muted-foreground">Engine</p>
                          <p className="font-semibold">{selectedEngineData?.name} {selectedEngineData?.type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Grade</p>
                          <p className="font-semibold">{selectedGradeData?.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Price</p>
                          <p className="font-bold text-lg text-primary">
                            AED {selectedGradeData?.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className={cn(
                        "flex gap-4",
                        isMobile ? "flex-col" : "flex-row"
                      )}>
                        <Button 
                          onClick={() => handleCarBuilder()}
                          className="flex-1"
                          size="lg"
                        >
                          <Wrench className="h-4 w-4 mr-2" />
                          Build Your Vehicle
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={handleTestDrive}
                          className="flex-1"
                          size="lg"
                        >
                          <Car className="h-4 w-4 mr-2" />
                          Book Test Drive
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specs' && (
              <TabsContent value="specs" className="mt-0">
                <motion.div
                  key="specs"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-2xl font-bold mb-6">Vehicle Specifications</h2>
                  
                  <div className={cn(
                    "grid gap-6",
                    isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"
                  )}>
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
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">0-100 km/h</span>
                            <span className="font-medium">{specs.acceleration}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Fuel Economy */}
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                          <Fuel className="h-5 w-5 mr-2 text-primary" />
                          Drivetrain & Efficiency
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Fuel Economy</span>
                            <span className="font-medium">{specs.fuelEconomy}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Transmission</span>
                            <span className="font-medium">{specs.transmission}</span>
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
                          Dimensions & Capacity
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
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Cargo Volume</span>
                            <span className="font-medium">{specs.cargoVolume}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Features */}
                  <div className="mt-8">
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

            {/* Technology Tab */}
            {activeTab === 'tech' && (
              <TabsContent value="tech" className="mt-0">
                <motion.div
                  key="tech"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-2xl font-bold mb-6">Technology Features</h2>
                  <div className={cn(
                    "grid gap-6",
                    isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"
                  )}>
                    {techFeatures.map((feature, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className={cn(
                              "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white",
                              feature.color
                            )}>
                              {feature.icon}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">{feature.title}</h3>
                              <p className="text-muted-foreground text-sm">{feature.description}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {feature.features.map((feat) => (
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
          </AnimatePresence>
        </Tabs>

        {/* Grade Comparison Modal */}
        <Dialog open={isComparisonOpen} onOpenChange={setIsComparisonOpen}>
          <DialogContent className={cn(
            "max-w-7xl max-h-[90vh] overflow-y-auto",
            isMobile ? "w-[95vw]" : "w-full"
          )}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Compare {vehicle.name} Grades - {selectedEngine} Engine
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold">Feature</th>
                      {availableGrades.map((grade) => (
                        <th key={grade.name} className="text-center p-4 font-semibold">
                          <div className="space-y-2">
                            <div>{grade.name}</div>
                            <div className="text-sm font-normal text-muted-foreground">
                              AED {grade.price.toLocaleString()}
                            </div>
                            {grade.badge && (
                              <Badge className={grade.badgeColor}>
                                {grade.badge}
                              </Badge>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Monthly Payment</td>
                      {availableGrades.map((grade) => (
                        <td key={grade.name} className="text-center p-4">
                          AED {grade.monthlyFrom}/month
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Power</td>
                      {availableGrades.map((grade) => (
                        <td key={grade.name} className="text-center p-4">
                          {grade.specs.power}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Fuel Economy</td>
                      {availableGrades.map((grade) => (
                        <td key={grade.name} className="text-center p-4">
                          {grade.specs.fuelEconomy}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Drivetrain</td>
                      {availableGrades.map((grade) => (
                        <td key={grade.name} className="text-center p-4">
                          {grade.specs.drivetrain}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Key Features</td>
                      {availableGrades.map((grade) => (
                        <td key={grade.name} className="text-center p-4">
                          <div className="space-y-1">
                            {grade.features.map((feature) => (
                              <div key={feature} className="text-xs text-muted-foreground">
                                {feature}
                              </div>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                {availableGrades.map((grade) => (
                  <Button
                    key={grade.name}
                    className="flex-1"
                    variant={selectedGrade === grade.name ? "default" : "outline"}
                    onClick={() => {
                      handleGradeSelect(grade.name);
                      setIsComparisonOpen(false);
                    }}
                  >
                    Select {grade.name}
                  </Button>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default UnifiedVehicleConfigurator;