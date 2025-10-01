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
      <DialogContent className={`${getDialogSize()} overflow-y-auto bg-card text-card-foreground`}>
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center justify-between">
            <span className="text-lg lg:text-xl">Compare {engineName} Grades</span>
            <Button variant="ghost" size="sm" onClick={onClose} className="min-h-[44px] min-w-[44px]">
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
              <div className={`flex gap-2 ${isMobile ? 'min-w-max' : 'flex-wrap'}`}>
                {grades.map((grade, index) => (
                  <Button
                    key={grade.name}
                    variant={selectedGrades.includes(index) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleGradeSelection(index)}
                    className={`h-auto p-3 flex flex-col items-start min-h-[48px] ${isMobile ? 'min-w-[140px]' : ''}`}
                    disabled={selectedGrades.length >= maxSelectableGrades && !selectedGrades.includes(index)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {selectedGrades.includes(index) && <Check className="h-3 w-3" />}
                      <span className="font-semibold text-sm">{grade.name}</span>
                      {grade.badge === "Most Popular" && (
                        <Badge className="bg-orange-100 text-orange-700 text-xs px-1 py-0">
                          <Star className="h-2 w-2 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs opacity-80">AED {grade.price.toLocaleString()}</span>
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
          
          <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : `grid grid-cols-${visibleGrades.length} gap-4`}`}>
            {visibleGradeObjects.filter(grade => grade).map((grade, idx) => (
              <Card key={grade.name} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className={`${isMobile ? 'aspect-[4/3]' : 'aspect-video'} overflow-hidden`}>
                    <img
                      src={grade.image}
                      alt={grade.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={`${isMobile ? 'p-3' : 'p-3 lg:p-4'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-semibold ${isMobile ? 'text-sm' : 'text-sm lg:text-base'}`}>{grade.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {grade.badge}
                      </Badge>
                    </div>
                    <p className={`text-xs ${isMobile ? 'mb-2' : 'lg:text-sm text-muted-foreground mb-3'}`}>{grade.description}</p>
                    <div className={`${isMobile ? 'mb-3' : 'mb-3 lg:mb-4'}`}>
                      <div className={`font-bold ${isMobile ? 'text-sm' : 'text-base lg:text-lg'}`}>AED {grade.price.toLocaleString()}</div>
                      <div className={`text-xs ${isMobile ? '' : 'lg:text-sm'} text-muted-foreground`}>From AED {grade.monthlyFrom}/month</div>
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
