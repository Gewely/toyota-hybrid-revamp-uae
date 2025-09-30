import React, { useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Share2, 
  Download, 
  Bookmark, 
  X, 
  Plus,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Car,
  Calculator,
  FileText,
  Pin,
  Grid3X3,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface Grade {
  id: string;
  name: string;
  description: string;
  price: number;
  monthlyFrom: number;
  badge: string;
  badgeColor: string;
  image: string;
  video?: string;
  features: string[];
  specs: {
    engine: string;
    power: string;
    torque: string;
    transmission: string;
    acceleration: string;
    fuelEconomy: string;
  };
  highlights: string[];
}

interface LuxuryComparisonToolProps {
  grades: Grade[];
  isOpen: boolean;
  onClose: () => void;
  onTestDrive: (gradeId: string) => void;
  onGetQuote: (gradeId: string) => void;
}

type ViewMode = 'highlights' | 'all' | 'differences';

const LuxuryComparisonTool: React.FC<LuxuryComparisonToolProps> = ({
  grades,
  isOpen,
  onClose,
  onTestDrive,
  onGetQuote
}) => {
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [selectedGrades, setSelectedGrades] = useState<string[]>(
    grades.slice(0, isMobile ? 2 : 3).map(g => g.id)
  );
  const [pinnedBaseline, setPinnedBaseline] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('highlights');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentOffset, setCurrentOffset] = useState(0);
  
  const maxSelection = 10;
  const visibleCount = isMobile ? 2 : 3;
  
  const filteredGrades = useMemo(() => {
    return grades.filter(grade => 
      grade.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grade.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [grades, searchQuery]);
  
  const selectedGradeObjects = useMemo(() => {
    return selectedGrades
      .map(id => filteredGrades.find(g => g.id === id))
      .filter(Boolean) as Grade[];
  }, [selectedGrades, filteredGrades]);
  
  const visibleGrades = useMemo(() => {
    return selectedGradeObjects.slice(currentOffset, currentOffset + visibleCount);
  }, [selectedGradeObjects, currentOffset, visibleCount]);
  
  const handleGradeToggle = useCallback((gradeId: string) => {
    setSelectedGrades(prev => {
      if (prev.includes(gradeId)) {
        return prev.filter(id => id !== gradeId);
      } else if (prev.length < maxSelection) {
        return [...prev, gradeId];
      }
      return prev;
    });
  }, []);
  
  const handlePinBaseline = useCallback((gradeId: string) => {
    setPinnedBaseline(prev => prev === gradeId ? null : gradeId);
  }, []);
  
  const scrollToNext = useCallback(() => {
    if (currentOffset + visibleCount < selectedGradeObjects.length) {
      setCurrentOffset(prev => prev + 1);
    }
  }, [currentOffset, visibleCount, selectedGradeObjects.length]);
  
  const scrollToPrev = useCallback(() => {
    if (currentOffset > 0) {
      setCurrentOffset(prev => prev - 1);
    }
  }, [currentOffset]);
  
  const comparisonSpecs = [
    {
      title: "Pricing",
      items: [
        { 
          label: "Base Price", 
          getValue: (grade: Grade) => `AED ${grade.price.toLocaleString()}`,
          highlight: true
        },
        { 
          label: "Monthly EMI", 
          getValue: (grade: Grade) => `AED ${grade.monthlyFrom}`,
          highlight: true
        }
      ]
    },
    {
      title: "Performance",
      items: [
        { 
          label: "Engine", 
          getValue: (grade: Grade) => grade.specs.engine,
          highlight: true
        },
        { 
          label: "Power", 
          getValue: (grade: Grade) => grade.specs.power,
          highlight: true
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
          getValue: (grade: Grade) => grade.specs.acceleration,
          highlight: true
        },
        { 
          label: "Fuel Economy", 
          getValue: (grade: Grade) => grade.specs.fuelEconomy,
          highlight: true
        }
      ]
    },
    {
      title: "Key Features",
      items: [
        { 
          label: "Features", 
          getValue: (grade: Grade) => grade.features.join(", "),
          highlight: false
        }
      ]
    }
  ];
  
  const getFilteredSpecs = useCallback(() => {
    return comparisonSpecs.map(section => ({
      ...section,
      items: section.items.filter(item => {
        if (viewMode === 'highlights') return item.highlight;
        if (viewMode === 'all') return true;
        if (viewMode === 'differences') {
          // Show only items with different values across grades
          const values = visibleGrades.map(grade => item.getValue(grade));
          return new Set(values).size > 1;
        }
        return true;
      })
    })).filter(section => section.items.length > 0);
  }, [comparisonSpecs, viewMode, visibleGrades]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-md z-[9999] overflow-hidden"
    >
      <div className="h-full flex flex-col">
        {/* Top Controls - Pinned */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/10 border-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
                <h1 className="text-xl font-light text-white">Grade Comparison</h1>
              </div>
              
              <div className="flex items-center gap-2">
                {!isMobile && (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                    <Input
                      placeholder="Search grades..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/60 w-64"
                    />
                  </div>
                )}
                
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                {(['highlights', 'all', 'differences'] as ViewMode[]).map(mode => (
                  <Button
                    key={mode}
                    size="sm"
                    variant={viewMode === mode ? "default" : "ghost"}
                    onClick={() => setViewMode(mode)}
                    className={`${
                      viewMode === mode 
                        ? 'bg-white text-black' 
                        : 'text-white hover:bg-white/10'
                    } capitalize text-xs`}
                  >
                    {mode === 'highlights' && <Eye className="h-3 w-3 mr-1" />}
                    {mode === 'differences' && <EyeOff className="h-3 w-3 mr-1" />}
                    {mode === 'all' && <Grid3X3 className="h-3 w-3 mr-1" />}
                    {mode}
                  </Button>
                ))}
              </div>
              
              <div className="text-sm text-white/60">
                {selectedGrades.length} of {maxSelection} selected
              </div>
            </div>
          </div>
        </motion.div>

        {/* Selection Tray */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="border-b border-white/10 bg-black/40"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
              <span className="text-sm text-white/60 whitespace-nowrap">Grades:</span>
              <div className="flex gap-2">
                {filteredGrades.map(grade => (
                  <Button
                    key={grade.id}
                    size="sm"
                    variant={selectedGrades.includes(grade.id) ? "default" : "outline"}
                    onClick={() => handleGradeToggle(grade.id)}
                    disabled={!selectedGrades.includes(grade.id) && selectedGrades.length >= maxSelection}
                    className={`${
                      selectedGrades.includes(grade.id)
                        ? 'bg-white text-black hover:bg-white/90'
                        : 'border-white/20 text-white hover:bg-white/10'
                    } whitespace-nowrap relative`}
                  >
                    {selectedGrades.includes(grade.id) && (
                      <X className="h-3 w-3 mr-1" />
                    )}
                    {!selectedGrades.includes(grade.id) && (
                      <Plus className="h-3 w-3 mr-1" />
                    )}
                    {grade.name}
                    {pinnedBaseline === grade.id && (
                      <Pin className="h-3 w-3 ml-1 text-yellow-400" />
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Comparison View */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Grade Cards with Navigation */}
            <div className="relative">
              {selectedGradeObjects.length > visibleCount && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={scrollToPrev}
                    disabled={currentOffset === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white hover:bg-black/80 rounded-full h-10 w-10 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={scrollToNext}
                    disabled={currentOffset + visibleCount >= selectedGradeObjects.length}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white hover:bg-black/80 rounded-full h-10 w-10 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
              
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                <AnimatePresence mode="wait">
                  {visibleGrades.map((grade, index) => (
                    <motion.div
                      key={grade.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-card text-card-foreground border overflow-hidden shadow-sm">
                        {/* Media */}
                        <div className="relative aspect-video bg-muted overflow-hidden">
                          <motion.img
                            src={grade.image}
                            alt={grade.name}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                          />
                          <div className="absolute top-2 left-2">
                            <Badge className={`${grade.badgeColor} text-white text-xs`}>
                              {grade.badge}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePinBaseline(grade.id)}
                            className={`absolute top-2 right-2 rounded-full h-8 w-8 p-0 ${
                              pinnedBaseline === grade.id
                                ? 'bg-yellow-400 text-black'
                                : 'bg-muted/80 text-foreground hover:bg-muted'
                            }`}
                          >
                            <Pin className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        {/* Grade Info */}
                        <div className="p-4 space-y-3">
                          <div>
                            <h3 className="font-medium">{grade.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{grade.description}</p>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-lg font-light">
                              AED {grade.price.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              From AED {grade.monthlyFrom}/month
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <div className="p-4 space-y-6">
                {getFilteredSpecs().map((section, sectionIndex) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: sectionIndex * 0.1 }}
                    className="space-y-3"
                  >
                    <h3 className="text-sm font-medium text-white/80 uppercase tracking-wide">
                      {section.title}
                    </h3>
                    
                    <div className="space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <div 
                          key={item.label}
                          className="grid grid-cols-3 lg:grid-cols-4 gap-4 py-3 border-b border-white/5"
                        >
                          <div className="col-span-1 text-sm text-white/60">
                            {item.label}
                          </div>
                          
                          {visibleGrades.map((grade, gradeIndex) => (
                            <div 
                              key={grade.id}
                              className={`text-sm text-white ${
                                pinnedBaseline === grade.id ? 'bg-yellow-400/10 px-2 py-1 rounded' : ''
                              }`}
                            >
                              {item.getValue(grade)}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA - Sticky */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky bottom-0 bg-black/90 backdrop-blur-md border-t border-white/10"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Button 
                className="flex-1 bg-white text-black hover:bg-white/90"
                onClick={() => visibleGrades.forEach(grade => onTestDrive(grade.id))}
              >
                <Car className="h-4 w-4 mr-2" />
                Test Drive
              </Button>
              
              <Button 
                variant="outline" 
                className="flex-1 border-white/20 text-white hover:bg-white/10"
                onClick={() => visibleGrades.forEach(grade => onGetQuote(grade.id))}
              >
                <Calculator className="h-4 w-4 mr-2" />
                Get Quote
              </Button>
              
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LuxuryComparisonTool;