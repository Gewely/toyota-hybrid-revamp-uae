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
  Sparkles,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Car,
  Star
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { openTestDrivePopup } from "@/utils/testDriveUtils";

interface GradeComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEngineData: any;
  onGradeSelect: (gradeName: string) => void;
  selectedGrade: string;
  onCarBuilder?: (gradeInfo?: { engine: string; grade: string }) => void;
  onBookTestDrive?: (gradeInfo?: { engine: string; grade: string }) => void;
}

// Helper function to check if there are differences between grades for a specific attribute
const hasDifferences = (getValue: (grade: any) => string, grades: any[]) => {
  const values = grades.map(getValue);
  return new Set(values).size > 1;
};

const GradeComparisonModal: React.FC<GradeComparisonModalProps> = ({
  isOpen,
  onClose,
  currentEngineData,
  onGradeSelect,
  selectedGrade,
  onCarBuilder,
  onBookTestDrive
}) => {
  const [selectedGrades, setSelectedGrades] = useState<number[]>([0, 1]);
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['pricing', 'engine', 'specs']);
  const isMobile = useIsMobile();

  const grades = currentEngineData.grades;

  const toggleGradeSelection = (gradeIndex: number) => {
    if (selectedGrades.includes(gradeIndex)) {
      if (selectedGrades.length > 1) {
        setSelectedGrades(prev => prev.filter(i => i !== gradeIndex));
      }
    } else if (selectedGrades.length < (isMobile ? 2 : 3)) {
      setSelectedGrades(prev => [...prev, gradeIndex].sort());
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleTestDriveClick = (grade: any) => {
    openTestDrivePopup();
    onClose();
  };

  const handleConfigureClick = (grade: any) => {
    if (onCarBuilder) {
      onCarBuilder({
        engine: currentEngineData.name,
        grade: grade.name
      });
      onClose();
    }
  };

  // Enhanced comparison sections with key specs restored
  const comparisonSections = [
    {
      id: 'pricing',
      title: "Pricing & Value",
      items: [
        { 
          label: "Base Price", 
          getValue: (grade: any) => `AED ${grade.fullPrice.toLocaleString()}`,
          isHighlightable: true
        },
        { 
          label: "Monthly EMI", 
          getValue: (grade: any) => `AED ${grade.monthlyEMI}`,
          isHighlightable: true
        },
        { 
          label: "Insurance (Annual)", 
          getValue: (grade: any) => `AED ${Math.round(grade.fullPrice * 0.035).toLocaleString()}`,
          isHighlightable: true
        },
        { 
          label: "Value Rating", 
          getValue: (grade: any) => grade.name === "SE" ? "4/5" : grade.name === "XLE" ? "5/5" : "3/5",
          isHighlightable: true
        }
      ]
    },
    {
      id: 'engine',
      title: "Engine & Performance",
      items: [
        { 
          label: "Engine Type", 
          getValue: (grade: any) => grade.specs.engine,
          isHighlightable: false
        },
        { 
          label: "Power Output", 
          getValue: (grade: any) => grade.specs.power,
          isHighlightable: true
        },
        { 
          label: "Torque", 
          getValue: (grade: any) => grade.specs.torque,
          isHighlightable: true
        },
        { 
          label: "Transmission", 
          getValue: (grade: any) => grade.specs.transmission,
          isHighlightable: false
        },
        { 
          label: "0-100 km/h", 
          getValue: (grade: any) => grade.specs.acceleration,
          isHighlightable: true
        }
      ]
    },
    {
      id: 'specs',
      title: "Key Specifications",
      items: [
        { 
          label: "Fuel Economy", 
          getValue: (grade: any) => grade.specs.fuelEconomy,
          isHighlightable: true
        },
        { 
          label: "Seating Capacity", 
          getValue: (grade: any) => "5 Passengers",
          isHighlightable: false
        },
        { 
          label: "Boot Space", 
          getValue: (grade: any) => grade.name === "SE" ? "470L" : "450L",
          isHighlightable: true
        },
        { 
          label: "Ground Clearance", 
          getValue: (grade: any) => "140mm",
          isHighlightable: false
        }
      ]
    },
    {
      id: 'comfort',
      title: "Comfort & Interior",
      items: [
        { 
          label: "Seating Material", 
          getValue: (grade: any) => grade.name === "SE" ? "Sport Fabric" : 
                                   grade.name === "XLE" ? "SofTex Leatherette" : "Premium Leather",
          isHighlightable: true
        },
        { 
          label: "Climate Control", 
          getValue: (grade: any) => grade.name === "SE" ? "Manual A/C" : 
                                   grade.name === "XLE" ? "Auto A/C" : "Dual-Zone Climate",
          isHighlightable: true
        },
        { 
          label: "Infotainment Screen", 
          getValue: (grade: any) => grade.name === "SE" ? "8-inch Display" : 
                                   grade.name === "XLE" ? "9-inch Touch" : "10-inch Premium",
          isHighlightable: true
        },
        { 
          label: "Steering Adjustment", 
          getValue: (grade: any) => "Tilt & Telescopic",
          isHighlightable: false
        }
      ]
    },
    {
      id: 'safety',
      title: "Safety & Security",
      items: [
        { 
          label: "Airbags", 
          getValue: (grade: any) => grade.name === "SE" ? "7 Airbags" : "10 Airbags",
          isHighlightable: true
        },
        { 
          label: "Toyota Safety Sense", 
          getValue: (grade: any) => grade.name === "SE" ? "TSS 2.0" : "TSS 2.5+",
          isHighlightable: true
        },
        { 
          label: "Parking Assist", 
          getValue: (grade: any) => grade.name === "SE" ? "Rear Camera" : 
                                   grade.name === "XLE" ? "Rear Camera + Sensors" : "360° View",
          isHighlightable: true
        },
        { 
          label: "ABS & EBD", 
          getValue: (grade: any) => "Standard",
          isHighlightable: false
        }
      ]
    },
    {
      id: 'technology',
      title: "Technology & Connectivity",
      items: [
        { 
          label: "Audio System", 
          getValue: (grade: any) => grade.name === "SE" ? "6 Speakers" : 
                                   grade.name === "XLE" ? "Premium 8 Speakers" : "JBL Premium 9 Speakers",
          isHighlightable: true
        },
        { 
          label: "Smartphone Integration", 
          getValue: (grade: any) => "Apple CarPlay & Android Auto",
          isHighlightable: false
        },
        { 
          label: "Wireless Charging", 
          getValue: (grade: any) => grade.name === "SE" ? "Not Available" : "Available",
          isHighlightable: true
        },
        { 
          label: "USB Ports", 
          getValue: (grade: any) => grade.name === "SE" ? "2 Ports" : "4 Ports",
          isHighlightable: true
        }
      ]
    }
  ];

  const renderMobileComparison = () => (
    <div className="space-y-6">
      {/* Grade Selection - Mobile optimized for 2 grades */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Select 2 Grades to Compare</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowOnlyDifferences(!showOnlyDifferences)}
            className="flex items-center gap-2 border-border hover:bg-muted"
          >
            {showOnlyDifferences ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showOnlyDifferences ? "Show All" : "Differences"}
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {grades.map((grade: any, index: number) => (
            <Button
              key={grade.name}
              variant={selectedGrades.includes(index) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleGradeSelection(index)}
              className={`h-auto p-3 flex flex-col items-start transition-all duration-300 ${
                selectedGrades.includes(index) 
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                  : 'hover:bg-muted border-border'
              }`}
              disabled={selectedGrades.length >= 2 && !selectedGrades.includes(index)}
            >
              <div className="flex items-center gap-2 mb-1">
                {selectedGrades.includes(index) && <Check className="h-3 w-3" />}
                <span className="font-semibold text-sm">{grade.name}</span>
                {grade.highlight === "Most Popular" && (
                  <Badge className="bg-orange-100 text-orange-700 text-xs px-1 py-0 border-orange-200">
                    <Star className="h-2 w-2 mr-1" />
                    Popular
                  </Badge>
                )}
              </div>
              <span className="text-xs opacity-80">AED {grade.fullPrice.toLocaleString()}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Mobile Side-by-Side Comparison */}
      <div className="space-y-4">
        {/* Grade Headers with Images - Fixed for Mobile */}
        <div className="grid grid-cols-2 gap-3">
          {selectedGrades.map(gradeIndex => {
            const grade = grades[gradeIndex];
            return (
              <Card key={grade.name} className="overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  {/* Fixed Grade Image - Proper aspect ratio */}
                  <div className="aspect-[4/3] mb-3 overflow-hidden rounded-lg border border-border">
                    <img
                      src={grade.image}
                      alt={grade.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="text-center space-y-2">
                    <h4 className="font-semibold text-sm text-foreground">{grade.name}</h4>
                    <Badge variant="secondary" className={`text-xs ${
                      grade.highlight === "Most Popular" 
                        ? 'bg-orange-100 text-orange-700 border-orange-200' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {grade.highlight}
                    </Badge>
                    <div className="space-y-1">
                      <div className="font-semibold text-sm text-foreground">AED {grade.fullPrice.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">AED {grade.monthlyEMI}/month</div>
                    </div>
                    
                    {/* Action Buttons - Fixed spacing */}
                    <div className="flex flex-col gap-2 mt-3 w-full">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-8 border-border hover:bg-muted"
                        onClick={() => handleTestDriveClick(grade)}
                      >
                        <Car className="h-3 w-3 mr-1.5" />
                        Test Drive
                      </Button>

                      <Button
                        size="sm"
                        className="text-xs h-8 bg-primary hover:bg-primary/90"
                        onClick={() => handleConfigureClick(grade)}
                      >
                        <Wrench className="h-3 w-3 mr-1.5" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed Comparison Sections */}
        {comparisonSections.map(section => {
          const isExpanded = expandedSections.includes(section.id);
          const filteredItems = showOnlyDifferences 
            ? section.items.filter(item => hasDifferences(item.getValue, selectedGrades.map(i => grades[i])))
            : section.items;

          if (showOnlyDifferences && filteredItems.length === 0) return null;

          return (
            <Card key={section.id} className="overflow-hidden border border-border">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-4 flex items-center justify-between bg-muted/50 border-b hover:bg-muted transition-colors"
              >
                <h3 className="font-semibold text-sm text-left text-foreground">{section.title}</h3>
                <div className="flex items-center gap-2">
                  {showOnlyDifferences && filteredItems.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {filteredItems.length} differences
                    </Badge>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="divide-y divide-border">
                      {filteredItems.map(item => {
                        const values = selectedGrades.map(i => item.getValue(grades[i]));
                        const hasDiff = hasDifferences(item.getValue, selectedGrades.map(i => grades[i]));
                        
                        return (
                          <div key={item.label} className="p-3">
                            <div className={`text-xs font-medium mb-2 ${hasDiff ? 'text-foreground' : 'text-muted-foreground'} flex items-center gap-1`}>
                              {item.label}
                              {hasDiff && <ArrowUpDown className="h-3 w-3 text-muted-foreground" />}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {selectedGrades.map((gradeIndex, idx) => (
                                <div 
                                  key={gradeIndex}
                                  className={`text-xs p-2 rounded-md ${
                                    hasDiff 
                                      ? 'bg-muted border border-border font-medium'
                                      : 'bg-background'
                                  }`}
                                >
                                  {values[idx]}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onClose} className="flex-1 border-border hover:bg-muted">
          Close
        </Button>
        <Button className="flex-1 bg-primary hover:bg-primary/90">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>
    </div>
  );

  const renderDesktopComparison = () => (
    <div className="space-y-6">
      {/* Grade Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Select Grades to Compare</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowOnlyDifferences(!showOnlyDifferences)}
            className="flex items-center gap-2 border-border hover:bg-muted"
          >
            {showOnlyDifferences ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showOnlyDifferences ? "Show All Specifications" : "Show Only Differences"}
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {grades.map((grade: any, index: number) => (
            <Button
              key={grade.name}
              variant={selectedGrades.includes(index) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleGradeSelection(index)}
              className={`transition-all duration-300 ${
                selectedGrades.includes(index) 
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                  : 'hover:bg-muted border-border'
              }`}
            >
              {selectedGrades.includes(index) && <Check className="h-3 w-3 mr-1" />}
              {grade.name}
              {grade.highlight === "Most Popular" && (
                <Badge className="bg-orange-100 text-orange-700 text-xs ml-1 border-orange-200">
                  <Star className="h-2 w-2 mr-1" />
                  Popular
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Desktop Comparison Table */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header Row with Grade Images and Info - Fixed for Desktop */}
          <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `200px repeat(${selectedGrades.length}, 1fr)` }}>
            <div></div>
            {selectedGrades.map(gradeIndex => {
              const grade = grades[gradeIndex];
              return (
                <Card key={grade.name} className="overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    {/* Fixed Grade Image - Proper aspect ratio for desktop */}
                    <div className="aspect-[16/9] overflow-hidden border-b border-border">
                      <img
                        src={grade.image}
                        alt={grade.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Grade Info */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-lg text-foreground">{grade.name}</h4>
                        <Badge variant="secondary" className={`text-xs ${
                          grade.highlight === "Most Popular" 
                            ? 'bg-orange-100 text-orange-700 border-orange-200' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {grade.highlight}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{grade.description}</p>
                      
                      {/* Price */}
                      <div className="mb-4 p-3 bg-muted/50 rounded-lg border border-border">
                        <div className="font-semibold text-xl text-foreground">AED {grade.fullPrice.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">From AED {grade.monthlyEMI}/month</div>
                      </div>

                      {/* Action Buttons - Fixed spacing */}
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm" 
                            className="text-xs border-border hover:bg-muted"
                            onClick={() => handleTestDriveClick(grade)}
                          >
                            <Car className="h-3 w-3 mr-1.5" />
                            Test Drive
                          </Button>
                          <Button
                            size="sm" 
                            className="text-xs bg-primary hover:bg-primary/90"
                            onClick={() => handleConfigureClick(grade)}
                          >
                            <Wrench className="h-3 w-3 mr-1.5" />
                            Configure
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Comparison Sections */}
          {comparisonSections.map(section => {
            const filteredItems = showOnlyDifferences 
              ? section.items.filter(item => hasDifferences(item.getValue, selectedGrades.map(i => grades[i])))
              : section.items;

            if (showOnlyDifferences && filteredItems.length === 0) return null;

            return (
              <div key={section.title} className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2 border-b border-border pb-2">
                  {section.title}
                  {showOnlyDifferences && filteredItems.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {filteredItems.length} differences
                    </Badge>
                  )}
                </h3>
                
                {filteredItems.map(item => {
                  const hasDiff = hasDifferences(item.getValue, selectedGrades.map(i => grades[i]));
                  const values = selectedGrades.map(i => item.getValue(grades[i]));
                  
                  return (
                    <div key={item.label} className="grid gap-4 py-3 border-b border-border hover:bg-muted/30 transition-colors" style={{ gridTemplateColumns: `200px repeat(${selectedGrades.length}, 1fr)` }}>
                      <div className={`font-medium ${hasDiff ? 'text-foreground' : 'text-muted-foreground'} flex items-center gap-1`}>
                        {item.label}
                        {hasDiff && <ArrowUpDown className="h-3 w-3 text-muted-foreground" />}
                      </div>
                      {selectedGrades.map((gradeIndex, idx) => {
                        const grade = grades[gradeIndex];
                        const value = item.getValue(grade);
                        
                        return (
                          <div key={gradeIndex} className={`text-sm ${
                            hasDiff 
                              ? 'font-medium text-foreground bg-muted/50 p-2 rounded border border-border'
                              : 'text-muted-foreground'
                          }`}>
                            {value}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Download Comparison */}
      <div className="flex justify-center pt-6 border-t border-border">
        <Button variant="outline" size="lg" className="border-border hover:bg-muted">
          <Download className="h-4 w-4 mr-2" />
          Download Comparison PDF
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isMobile ? 'max-w-[95vw] max-h-[90vh]' : 'max-w-6xl max-h-[90vh]'} overflow-y-auto border border-border shadow-xl`}>
        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-foreground">Compare {currentEngineData.name} Grades</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full p-2 hover:bg-muted">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6">
          {isMobile ? renderMobileComparison() : renderDesktopComparison()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GradeComparisonModal;
