import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  X, 
  Check, 
  Download, 
  Wrench, 
  Car,
  Star,
  Eye,
  EyeOff
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDeviceInfo } from "@/hooks/use-device-info";
import CollapsibleComparisonSection from "./CollapsibleComparisonSection";

interface Grade {
  name: string;
  description: string;
  price: number;
  monthlyFrom: number;
  badge: string;
  badgeColor: string;
  image: string;
  features: string[];
  specs: {
    engine: string;
    power: string;
    torque: string;
    transmission: string;
    acceleration: string;
    fuelEconomy: string;
  };
}

interface VehicleGradeComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  engineName: string;
  grades: Grade[];
  onGradeSelect: (gradeName: string) => void;
  onCarBuilder: (gradeName: string) => void;
  onTestDrive: (gradeName: string) => void;
}

const VehicleGradeComparison: React.FC<VehicleGradeComparisonProps> = ({
  isOpen,
  onClose,
  engineName,
  grades,
  onGradeSelect,
  onCarBuilder,
  onTestDrive
}) => {
  const isMobile = useIsMobile();
  const { deviceCategory } = useDeviceInfo();
  
  // Support up to 12 grades: Mobile shows 2 in comparison view, desktop shows 3
  const maxGradesInView = isMobile ? 2 : 3;
  const maxSelectableGrades = 12;
  
  const [selectedGrades, setSelectedGrades] = useState<number[]>(() => {
    const initialCount = Math.min(grades.length, maxGradesInView);
    return Array.from({ length: initialCount }, (_, index) => index);
  });
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);

  // Update selected grades when grades prop changes
  React.useEffect(() => {
    if (grades.length > 0) {
      const initialCount = Math.min(grades.length, maxGradesInView);
      setSelectedGrades(Array.from({ length: initialCount }, (_, index) => index));
    }
  }, [grades.length, maxGradesInView]);

  const toggleGradeSelection = (gradeIndex: number) => {
    if (selectedGrades.includes(gradeIndex)) {
      if (selectedGrades.length > 1) {
        setSelectedGrades(prev => prev.filter(i => i !== gradeIndex));
      }
    } else if (selectedGrades.length < maxSelectableGrades) {
      setSelectedGrades(prev => [...prev, gradeIndex].sort());
    }
  };

  // Pagination for comparison view
  const visibleGrades = selectedGrades.slice(scrollOffset, scrollOffset + maxGradesInView);
  const canScrollNext = scrollOffset + maxGradesInView < selectedGrades.length;
  const canScrollPrev = scrollOffset > 0;

  const scrollNext = () => {
    if (canScrollNext) setScrollOffset(prev => prev + 1);
  };

  const scrollPrev = () => {
    if (canScrollPrev) setScrollOffset(prev => prev - 1);
  };

  const comparisonSpecs = [
    {
      title: "Pricing",
      items: [
        { 
          label: "Base Price", 
          getValue: (grade: Grade) => `AED ${grade.price.toLocaleString()}`
        },
        { 
          label: "Monthly EMI", 
          getValue: (grade: Grade) => `AED ${grade.monthlyFrom}`
        }
      ]
    },
    {
      title: "Performance",
      items: [
        { 
          label: "Engine", 
          getValue: (grade: Grade) => grade.specs.engine
        },
        { 
          label: "Power", 
          getValue: (grade: Grade) => grade.specs.power
        },
        { 
          label: "Torque", 
          getValue: (grade: Grade) => grade.specs.torque
        },
        { 
          label: "Transmission", 
          getValue: (grade: Grade) => grade.specs.transmission
        },
        { 
          label: "0-100 km/h", 
          getValue: (grade: Grade) => grade.specs.acceleration
        },
        { 
          label: "Fuel Economy", 
          getValue: (grade: Grade) => grade.specs.fuelEconomy
        }
      ]
    },
    {
      title: "Features",
      items: [
        { 
          label: "Key Features", 
          getValue: (grade: Grade) => grade.features.join(", ")
        }
      ]
    }
  ];

  const selectedGradeObjects = selectedGrades.map(index => grades[index]).filter(grade => grade !== undefined);
  const visibleGradeObjects = visibleGrades.map(index => grades[index]).filter(grade => grade !== undefined);

  // Mobile-optimized dialog sizing
  const getDialogSize = () => {
    if (deviceCategory === 'smallMobile') return 'max-w-[95vw] max-h-[85vh]';
    if (deviceCategory === 'standardMobile' || deviceCategory === 'largeMobile') return 'max-w-[95vw] max-h-[90vh]';
    if (deviceCategory === 'extraLargeMobile') return 'max-w-[90vw] max-h-[90vh]';
    return 'max-w-6xl max-h-[90vh]';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${getDialogSize()} overflow-y-auto bg-gradient-to-br from-white to-[hsl(var(--neutral-50))] border-[hsl(var(--toyota-platinum))]/30 shadow-2xl`}>
        <DialogHeader className="border-b border-[hsl(var(--toyota-platinum))]/20 pb-6">
          <DialogTitle className="flex items-center justify-between">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-[hsl(var(--toyota-graphite))] to-[hsl(var(--toyota-charcoal))] bg-clip-text text-transparent">Compare {engineName} Grades</h2>
              <p className="text-sm text-[hsl(var(--toyota-stone))] mt-1">Find the perfect configuration</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="min-h-[44px] min-w-[44px] hover:bg-[hsl(var(--neutral-100))]">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 lg:mt-6 space-y-4 lg:space-y-6">
          {/* Grade Selection - Scrollable */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base lg:text-lg font-semibold">
                Select Grades ({selectedGrades.length}/{maxSelectableGrades})
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOnlyDifferences(!showOnlyDifferences)}
                className="flex items-center gap-2 min-h-[44px]"
              >
                {showOnlyDifferences ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showOnlyDifferences ? "Show All" : "Differences"}
              </Button>
            </div>
            
            <div className={`overflow-x-auto pb-2 ${isMobile ? '-mx-4 px-4' : ''}`}>
              <div className={`flex gap-3 ${isMobile ? 'min-w-max' : 'flex-wrap'}`}>
                {grades.map((grade, index) => (
                  <Button
                    key={grade.name}
                    variant={selectedGrades.includes(index) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleGradeSelection(index)}
                    className={`h-auto p-4 flex flex-col items-start min-h-[52px] ${isMobile ? 'min-w-[150px]' : ''} ${selectedGrades.includes(index) ? 'bg-[hsl(var(--toyota-graphite))] text-white border-[hsl(var(--toyota-graphite))] shadow-[0_4px_16px_rgba(0,0,0,0.15)]' : 'bg-white border-[hsl(var(--toyota-platinum))]/40 hover:border-[hsl(var(--toyota-graphite))]/30 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]'}`}
                    disabled={selectedGrades.length >= maxSelectableGrades && !selectedGrades.includes(index)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {selectedGrades.includes(index) && <Check className="h-3 w-3" />}
                      <span className="font-bold text-sm">{grade.name}</span>
                      {grade.badge === "Most Popular" && (
                        <Badge className="bg-[hsl(var(--luxury-gold))]/20 text-[hsl(var(--luxury-gold))] border-[hsl(var(--luxury-gold))]/30 text-xs px-1.5 py-0.5">
                          <Star className="h-2 w-2 mr-1 fill-current" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs font-semibold opacity-70">AED {grade.price.toLocaleString()}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Grade Images and Info - Paginated View */}
          {selectedGrades.length > maxGradesInView && (
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className="min-h-[40px]"
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Viewing {scrollOffset + 1}-{Math.min(scrollOffset + maxGradesInView, selectedGrades.length)} of {selectedGrades.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={scrollNext}
                disabled={!canScrollNext}
                className="min-h-[40px]"
              >
                Next
              </Button>
            </div>
          )}
          
          <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : `grid grid-cols-${visibleGrades.length} gap-6`}`}>
            {visibleGradeObjects.filter(grade => grade).map((grade, idx) => (
              <Card key={grade.name} className="overflow-hidden border-[hsl(var(--toyota-platinum))]/30 shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-all">
                <CardContent className="p-0">
                  <div className={`${isMobile ? 'aspect-[4/3]' : 'aspect-video'} overflow-hidden relative group`}>
                    <img
                      src={grade.image}
                      alt={grade.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className={`${isMobile ? 'p-4' : 'p-5 lg:p-6'} bg-gradient-to-br from-white to-[hsl(var(--neutral-50))]`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`font-bold ${isMobile ? 'text-base' : 'text-base lg:text-lg'} text-[hsl(var(--toyota-graphite))]`}>{grade.name}</h4>
                      <Badge variant="secondary" className="text-xs bg-[hsl(var(--luxury-champagne))] text-[hsl(var(--toyota-graphite))] border-[hsl(var(--luxury-gold))]/30 font-semibold">
                        {grade.badge}
                      </Badge>
                    </div>
                    <p className={`text-xs ${isMobile ? 'mb-3' : 'lg:text-sm text-[hsl(var(--toyota-stone))] mb-4'}`}>{grade.description}</p>
                    <div className={`${isMobile ? 'mb-4' : 'mb-4 lg:mb-5'}`}>
                      <div className={`font-bold ${isMobile ? 'text-lg' : 'text-xl lg:text-2xl'} text-[hsl(var(--toyota-graphite))]`}>AED {grade.price.toLocaleString()}</div>
                      <div className={`text-xs ${isMobile ? '' : 'lg:text-sm'} text-[hsl(var(--toyota-stone))]`}>From AED {grade.monthlyFrom}/month</div>
                    </div>
                    <div className={`${isMobile ? 'space-y-2' : 'grid grid-cols-3 gap-2'}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`text-xs min-h-[40px] ${isMobile ? 'w-full' : ''}`}
                        onClick={() => {
                          onGradeSelect(grade.name);
                          onClose();
                        }}
                      >
                        Select
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`text-xs min-h-[40px] ${isMobile ? 'w-full' : ''}`}
                        onClick={() => {
                          onTestDrive(grade.name);
                          onClose();
                        }}
                      >
                        <Car className="h-3 w-3 mr-1" />
                        {isMobile ? "Test Drive" : "Drive"}
                      </Button>
                      <Button
                        size="sm"
                        className={`text-xs min-h-[40px] ${isMobile ? 'w-full' : ''}`}
                        onClick={() => {
                          onCarBuilder(grade.name);
                          onClose();
                        }}
                      >
                        <Wrench className="h-3 w-3 mr-1" />
                        {isMobile ? "Configure" : "Build"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Collapsible Comparison Sections - Using visible grades */}
          <div className="space-y-2">
            {comparisonSpecs.map((section, index) => (
              <CollapsibleComparisonSection
                key={section.title}
                title={section.title}
                items={section.items}
                grades={visibleGradeObjects}
                showOnlyDifferences={showOnlyDifferences}
                defaultOpen={!isMobile && index === 0}
              />
            ))}
          </div>

          {/* Actions - Mobile Optimized */}
          <div className={`flex gap-3 pt-4 border-t ${isMobile ? 'flex-col' : ''}`}>
            <Button variant="outline" onClick={onClose} className={`${isMobile ? 'w-full' : 'flex-1'} min-h-[48px]`}>
              Close
            </Button>
            <Button className={`${isMobile ? 'w-full' : 'flex-1'} min-h-[48px]`}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleGradeComparison;
