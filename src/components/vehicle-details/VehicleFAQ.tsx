import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  Car,
  Wrench,
  Shield,
  CreditCard,
  Users,
  Search,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface VehicleFAQProps {
  vehicle: VehicleModel;
}

const VehicleFAQ: React.FC<VehicleFAQProps> = ({ vehicle }) => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [currentFAQIndex, setCurrentFAQIndex] = useState(0);
  const isMobile = useIsMobile();

  // --- FAQ data ---
  const faqs = useMemo(
    () => [
      {
        category: "Vehicle Features",
        question: `What are the key features of the ${vehicle.name}?`,
        answer: `The ${vehicle.name} comes with Toyota Safety Sense 3.0, advanced infotainment system, premium audio, wireless connectivity, and comprehensive driver assistance features. It also includes LED lighting, dual-zone climate control, and premium interior materials.`,
      },
      {
        category: "Vehicle Features",
        question: "Does it come with hybrid technology?",
        answer:
          "Yes, the hybrid variant features Toyota's advanced Hybrid Synergy Drive system, delivering exceptional fuel efficiency of up to 25.2 km/L while maintaining powerful performance with 218 HP combined output.",
      },
      {
        category: "Vehicle Features",
        question: "What safety features are included?",
        answer:
          "Standard safety features include Pre-Collision System, Lane Departure Alert with Steering Assist, Dynamic Radar Cruise Control, Automatic High Beams, and Blind Spot Monitor with Cross-Traffic Alert.",
      },
      {
        category: "Vehicle Features",
        question: "What infotainment options are available?",
        answer:
          "The vehicle features a 12.3-inch touchscreen display with wireless Apple CarPlay and Android Auto, premium JBL audio system, cloud-based navigation, and Toyota's Remote Connect services.",
      },
      {
        category: "Maintenance",
        question: "What is the recommended service interval?",
        answer:
          "We recommend servicing every 10,000 km or 6 months, whichever comes first. This ensures optimal performance and maintains your warranty coverage.",
      },
      {
        category: "Maintenance",
        question: "Where can I get my vehicle serviced?",
        answer:
          "You can service your vehicle at any authorized Toyota service center across the UAE. We have over 25 locations offering genuine parts and certified technicians.",
      },
      {
        category: "Maintenance",
        question: "What maintenance is covered under warranty?",
        answer:
          "Basic maintenance items like oil changes, filter replacements, and routine inspections are covered for the first 2 years or 40,000 km under our comprehensive warranty program.",
      },
      {
        category: "Warranty",
        question: "What warranty is provided?",
        answer:
          "All new Toyota vehicles come with a 3-year/100,000 km comprehensive warranty, plus an additional 2-year extended warranty option. Hybrid components are covered for 8 years/195,000 km.",
      },
      {
        category: "Warranty",
        question: "Does the warranty cover hybrid components?",
        answer:
          "Yes, hybrid system components including the battery, inverter, and electric motors are covered under our exclusive 8-year/195,000 km Hybrid Vehicle Warranty.",
      },
      {
        category: "Financing",
        question: "What financing options are available?",
        answer:
          "We offer conventional loans, Islamic financing (Sharia-compliant), balloon payment plans, and leasing options. Interest rates start from 3.5% APR with flexible terms up to 7 years.",
      },
      {
        category: "Financing",
        question: "Can I trade in my current vehicle?",
        answer:
          "Absolutely! We offer competitive trade-in values for your current vehicle. Our team will provide a free evaluation and apply the value towards your new purchase.",
      },
      {
        category: "Financing",
        question: "What documents do I need for financing?",
        answer:
          "You'll need a valid UAE driving license, Emirates ID, salary certificate, bank statements for the last 3 months, and a down payment. Our finance team will guide you through the process.",
      },
    ],
    [vehicle.name]
  );

  // --- Category model (without "All") ---
  const iconByCategory: Record<string, JSX.Element> = {
    "Vehicle Features": <Car className="h-4 w-4" />,
    Maintenance: <Wrench className="h-4 w-4" />,
    Warranty: <Shield className="h-4 w-4" />,
    Financing: <CreditCard className="h-4 w-4" />,
  };

  const categoryOrder = ["Vehicle Features", "Maintenance", "Warranty", "Financing"] as const;

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of categoryOrder) map.set(c, 0);
    faqs.forEach((f) => map.set(f.category, (map.get(f.category) ?? 0) + 1));
    return map;
  }, [faqs]);

  const categories = useMemo(
    () =>
      categoryOrder
        .filter((c) => counts.get(c)! > 0)
        .map((c) => ({
          name: c,
          icon: iconByCategory[c],
          count: counts.get(c)!,
        })),
    [counts]
  );

  // Default to first real category
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.name ?? "Vehicle Features");

  // Keep selection in sync if the data changes
  React.useEffect(() => {
    if (!categories.find((c) => c.name === selectedCategory)) {
      setSelectedCategory(categories[0]?.name ?? "Vehicle Features");
    }
  }, [categories, selectedCategory]);

  const filteredFAQs = useMemo(
    () => faqs.filter((faq) => faq.category === selectedCategory),
    [faqs, selectedCategory]
  );

  const nextCategory = () => {
    const currentIndex = categories.findIndex((cat) => cat.name === selectedCategory);
    const nextIndex = (currentIndex + 1) % categories.length;
    setSelectedCategory(categories[nextIndex].name);
    setOpenFAQ(null);
    setCurrentFAQIndex(0);
  };

  const prevCategory = () => {
    const currentIndex = categories.findIndex((cat) => cat.name === selectedCategory);
    const prevIndex = (currentIndex - 1 + categories.length) % categories.length;
    setSelectedCategory(categories[prevIndex].name);
    setOpenFAQ(null);
    setCurrentFAQIndex(0);
  };

  const nextFAQ = () => {
    setCurrentFAQIndex((prev) => (prev + 1) % filteredFAQs.length);
    setOpenFAQ(null);
  };

  const prevFAQ = () => {
    setCurrentFAQIndex((prev) => (prev - 1 + filteredFAQs.length) % filteredFAQs.length);
    setOpenFAQ(null);
  };

  return (
    <section className="py-8 lg:py-16 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="toyota-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 lg:mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Frequently Asked Questions
          </motion.div>
          <h2 className="text-2xl lg:text-4xl font-black text-foreground mb-4 leading-tight">
            Everything You Need to Know About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              {vehicle.name.split(" ").pop()}
            </span>
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Get instant answers to the most common questions about your next Toyota.
          </p>
        </motion.div>

        {/* Category Filter (no "All") */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          {isMobile ? (
            /* Mobile Swipe Filter */
            <div className="relative px-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={prevCategory}
                  className="p-2 rounded-full bg-white shadow-lg border hover:shadow-xl transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="text-center flex-1 mx-4">
                  <div className="bg-white rounded-lg shadow-md border p-3">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      {categories.find((cat) => cat.name === selectedCategory)?.icon}
                      <span className="font-semibold text-sm">{selectedCategory}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {categories.find((cat) => cat.name === selectedCategory)?.count} Questions
                    </Badge>
                  </div>
                </div>

                <button
                  onClick={nextCategory}
                  className="p-2 rounded-full bg-white shadow-lg border hover:shadow-xl transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Category Indicators */}
              <div className="flex justify-center space-x-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`h-2 rounded-full transition-all ${
                      selectedCategory === category.name ? "bg-primary w-6" : "bg-muted-foreground/30 w-2"
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* Desktop Filter */
            <div className="flex flex-wrap justify-center gap-3 px-4">
              {categories.map((category) => (
                <motion.button
                  key={category.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                    selectedCategory === category.name
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/50 bg-white"
                  }`}
                >
                  {category.icon}
                  <span className="font-medium">{category.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>

        {/* FAQ Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-4"
          key={selectedCategory}
        >
          {isMobile ? (
            /* Mobile Swipe FAQ */
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={prevFAQ}
                  className="p-3 rounded-full bg-white shadow-lg border hover:shadow-xl transition-all min-h-[44px] min-w-[44px]"
                  disabled={filteredFAQs.length <= 1}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">
                    Question {currentFAQIndex + 1} of {filteredFAQs.length}
                  </div>
                  <div className="flex space-x-1">
                    {filteredFAQs.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1 w-6 rounded-full ${
                          index === currentFAQIndex ? "bg-primary" : "bg-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={nextFAQ}
                  className="p-3 rounded-full bg-white shadow-lg border hover:shadow-xl transition-all min-h-[44px] min-w-[44px]"
                  disabled={filteredFAQs.length <= 1}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedCategory}-${currentFAQIndex}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden border shadow-lg">
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <Badge variant="outline" className="mb-3">
                          {filteredFAQs[currentFAQIndex]?.category}
                        </Badge>
                        <h3 className="text-lg font-bold text-foreground leading-tight">
                          {filteredFAQs[currentFAQIndex]?.question}
                        </h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {filteredFAQs[currentFAQIndex]?.answer}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            /* Desktop FAQ List */
            <div className="space-y-4">
              <AnimatePresence>
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={`${selectedCategory}-${index}`}
                    initial={{ opacity: 0, y: 20, scale: 0.95, rotateX: -5 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ 
                      delay: index * 0.06,
                      duration: 0.4,
                      type: "spring",
                      stiffness: 120
                    }}
                    style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
                  >
                    <Card className="overflow-hidden border hover:shadow-lg transition-all duration-300">
                      <motion.button
                        className="w-full text-left"
                        onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                        whileHover={{ 
                          scale: 1.02, 
                          y: -2,
                          boxShadow: '0 10px 30px -5px rgba(0,0,0,0.15)',
                          transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.98 }}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <Badge variant="outline" className="mb-2 text-xs">
                                {faq.category}
                              </Badge>
                              <h3 className="text-lg font-bold text-foreground leading-tight">
                                {faq.question}
                              </h3>
                            </div>
                            <motion.div
                              animate={{ rotate: openFAQ === index ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            </motion.div>
                          </div>

                          <AnimatePresence>
                            {openFAQ === index && (
                              <motion.div
                                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                animate={{ opacity: 1, height: "auto", scale: 1 }}
                                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                transition={{ 
                                  duration: 0.3,
                                  ease: [0.22, 1, 0.36, 1]
                                }}
                                className="overflow-hidden"
                              >
                                <motion.div 
                                  className="pt-4 border-t border-border mt-4"
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.1 }}
                                >
                                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </motion.button>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Contact CTA (unchanged) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12 px-4"
        >
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6 lg:p-8">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-primary/20 rounded-full mr-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Still Have Questions?</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Our expert team is here to help you make the right decision. Get personalized answers and assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button className="flex items-center space-x-2">
                  <HelpCircle className="h-4 w-4" />
                  <span>Contact Our Experts</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <span>Search More FAQs</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default VehicleFAQ;
