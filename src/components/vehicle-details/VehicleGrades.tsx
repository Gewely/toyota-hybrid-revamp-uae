// VehicleGrades.tsx – drop-in replacement (React + Tailwind + Framer Motion)
import React, { useMemo, useReducer, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown, ArrowUpDown, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useSwipeable } from "@/hooks/use-swipeable";

interface VehicleGrade {
  id: string;
  name: string;
  price: number;
  badge?: string;
  icon: React.ReactNode;
  color: string; // "from-red-600 to-red-700"
  features: string[];
  specs: {
    engine: string;
    power: string;
    fuelEconomy: string;
    transmission: string;
  };
  image: string;
  popular?: boolean;
}

interface VehicleGradesProps {
  vehicle: VehicleModel;
  onCarBuilder?: (grade?: string) => void;
}

type State = { index: number; compareMode: boolean; selected: number[] };
type Action =
  | { type: "NEXT"; len: number }
  | { type: "PREV"; len: number }
  | { type: "GOTO"; index: number }
  | { type: "TOGGLE_COMPARE" }
  | { type: "SELECT"; index: number };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "NEXT": return { ...s, index: (s.index + 1) % a.len };
    case "PREV": return { ...s, index: (s.index - 1 + a.len) % a.len };
    case "GOTO": return { ...s, index: a.index };
    case "TOGGLE_COMPARE": return { ...s, compareMode: !s.compareMode, selected: [] };
    case "SELECT": {
      const on = s.selected.includes(a.index);
      if (on) return { ...s, selected: s.selected.filter(i => i !== a.index) };
      if (s.selected.length >= 3) return s;
      return { ...s, selected: [...s.selected, a.index] };
    }
  }
}

const spring = { type: "spring", stiffness: 260, damping: 22 } as const;

const VehicleGrades: React.FC<VehicleGradesProps> = ({ vehicle, onCarBuilder }) => {
  const prefersReducedMotion = useReducedMotion();
  const [state, dispatch] = React.useReducer(reducer, { index: 0, compareMode: false, selected: [] });

  const grades: VehicleGrade[] = useMemo(() => [
    {
      id: "base",
      name: "LE",
      price: vehicle.price,
      badge: "Base",
      icon: <Star className="h-6 w-6" />,
      color: "from-gray-600 to-gray-700",
      features: ["Toyota Safety Sense 3.0","8-inch Touchscreen","Dual-zone Climate Control","LED Headlights","Backup Camera"],
      specs: { engine: "2.5L 4-Cylinder Hybrid", power: "208 HP", fuelEconomy: "22.2 km/L", transmission: "CVT" },
      image: "https://images.unsplash.com/photo-1494976688531-c21fd785c8d0?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "mid",
      name: "XLE",
      price: vehicle.price + 15000,
      badge: "Popular",
      icon: <Zap className="h-6 w-6" />,
      color: "from-red-600 to-red-700",
      popular: true,
      features: ["All LE Features","Premium Audio System","Wireless Charging","Power Moonroof","Heated Front Seats","Smart Key System"],
      specs: { engine: "2.5L 4-Cylinder Hybrid", power: "218 HP", fuelEconomy: "23.8 km/L", transmission: "CVT" },
      image: "https://images.unsplash.com/photo-1571088520017-b4e1b2e1c6dd?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "premium",
      name: "Limited",
      price: vehicle.price + 25000,
      badge: "Premium",
      icon: <Crown className="h-6 w-6" />,
      color: "from-gray-800 to-gray-900",
      features: ["All XLE Features","Leather-trimmed Seats","Premium JBL Audio","360° Camera","Ventilated Front Seats","Head-up Display","Advanced Parking Assist"],
      specs: { engine: "2.5L 4-Cylinder Hybrid", power: "218 HP", fuelEconomy: "23.8 km/L", transmission: "CVT" },
      image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80"
    }
  ], [vehicle.price]);

  const next = () => dispatch({ type: "NEXT", len: grades.length });
  const prev = () => dispatch({ type: "PREV", len: grades.length });
  const swipeableRef = useSwipeable<HTMLDivElement>({ onSwipeLeft: next, onSwipeRight: prev, threshold: 50, debug: false });

  // Ambient background
  const bgStyle: React.CSSProperties = {
    backgroundImage:
      "radial-gradient(60rem 60rem at 80% -10%, rgba(239,68,68,0.12), transparent 60%)," +
      "radial-gradient(40rem 40rem at 10% 110%, rgba(239,68,68,0.10), transparent 60%)",
  };

  const i = state.index;

  const handleConfigureGrade = useCallback((gradeName: string) => {
    if (onCarBuilder) {
      onCarBuilder(gradeName);
    }
  }, [onCarBuilder]);

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden bg-gradient-to-br from-background via-red-50/30 to-background" style={bgStyle}>
      <div className="pointer-events-none absolute inset-x-0 -top-32 h-64 bg-gradient-to-b from-red-500/10 to-transparent blur-3xl" />
      <div className="toyota-container">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-5xl font-black tracking-tight">
            Choose Your{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700">Grade</span>
              <motion.span layoutId="underline" className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-gradient-to-r from-red-500 to-red-700" />
            </span>
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
            Select the perfect trim level that matches your lifestyle and preferences
          </p>

          {/* Compare Toggle */}
          <div className="mt-8 flex justify-center">
            <Button
              variant={state.compareMode ? "default" : "outline"}
              onClick={() => dispatch({ type: "TOGGLE_COMPARE" })}
              className={`${state.compareMode ? "bg-red-600 hover:bg-red-700 text-white" : "border-red-200 text-red-600 hover:bg-red-50"} rounded-xl gap-2`}
            >
              <ArrowUpDown className="h-4 w-4" />
              <span>{state.compareMode ? "Exit Compare" : "Compare Grades"}</span>
            </Button>
          </div>
        </motion.div>

        {!state.compareMode ? (
          <div className="space-y-8">
            {/* Fancy Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {grades.map((g, idx) => (
                <motion.button
                  key={g.id}
                  onClick={() => dispatch({ type: "GOTO", index: idx })}
                  className={`relative px-6 py-3 rounded-2xl font-semibold border transition-all duration-300 ${
                    i === idx
                      ? "bg-red-600 text-white shadow-[0_10px_25px_-10px_rgba(239,68,68,0.6)] border-red-600"
                      : "bg-white/70 backdrop-blur border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-700"
                  }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${g.color} text-white shadow-inner`}>{g.icon}</span>
                    <span>{g.name}</span>
                  </div>
                  {g.popular && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs shadow">Popular</Badge>
                  )}
                  {i === idx && <motion.span layoutId="tabGlow" className="absolute inset-0 -z-10 rounded-2xl bg-red-500/20 blur-xl" transition={spring} />}
                </motion.button>
              ))}
            </div>

            {/* Carousel */}
            <div ref={swipeableRef} className="touch-manipulation select-none" style={{ touchAction: "pan-y pinch-zoom" }}>
              <div className="flex items-center justify-between mb-6">
                <Button variant="ghost" onClick={prev} className="rounded-full" aria-label="Previous grade">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="text-sm text-muted-foreground">{i + 1} / {grades.length}</div>
                <Button variant="ghost" onClick={next} className="rounded-full" aria-label="Next grade">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -80 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="grid lg:grid-cols-2 gap-8 lg:gap-12"
                >
                  {/* Image with shine */}
                  <motion.div className="relative group" initial={false} whileHover={{ scale: prefersReducedMotion ? 1 : 1.01 }}>
                    <motion.img
                      src={grades[i].image}
                      alt={grades[i].name}
                      className="w-full h-80 lg:h-96 object-cover rounded-3xl shadow-2xl"
                      style={{ transformOrigin: "center" }}
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-3xl overflow-hidden">
                      <div className="absolute -inset-x-20 -top-1/2 h-full rotate-12 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>
                    {grades[i].badge && (
                      <Badge className={`absolute top-4 left-4 shadow bg-gradient-to-r ${grades[i].color} text-white`}>
                        {grades[i].badge}
                      </Badge>
                    )}
                  </motion.div>

                  {/* Details */}
                  <motion.div layout className="space-y-6">
                    <div>
                      <div className="inline-flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-red-600" />
                        <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
                          {vehicle.name} {grades[i].name}
                        </h3>
                      </div>
                      <p className="mt-2 text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700">
                        From AED {grades[i].price.toLocaleString()}
                      </p>
                    </div>

                    {/* Specs chips */}
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(grades[i].specs).map(([k, v]) => (
                        <div key={k} className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50/60 px-3 py-1.5 text-sm text-red-800">
                          <span className="capitalize">{k.replace(/([A-Z])/g, " $1")}:</span>
                          <strong className="font-semibold">{v}</strong>
                        </div>
                      ))}
                    </div>

                    {/* Features list */}
                    <div>
                      <h4 className="font-semibold mb-3">Key Features</h4>
                      <ul className="grid sm:grid-cols-2 gap-2">
                        {grades[i].features.map((feature, idx) => (
                          <motion.li
                            key={feature}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.06, duration: 0.3 }}
                            className="flex items-center gap-3 rounded-xl bg-white/70 backdrop-blur border border-gray-100 px-3 py-2"
                          >
                            <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button 
                        size="lg" 
                        className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => handleConfigureGrade(grades[i].name)}
                      >
                        Configure {grades[i].name}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="flex-1 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => {/* Handle test drive */}
                        }
                      >
                        Test Drive
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Dots */}
              <div className="flex justify-center mt-6">
                <div className="flex items-center gap-2 bg-white/70 backdrop-blur border border-gray-200 rounded-full px-3 py-1.5">
                  {grades.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => dispatch({ type: "GOTO", index: idx })}
                      aria-label={`Go to grade ${idx + 1}`}
                      className={`h-2.5 rounded-full transition-all ${i === idx ? "w-6 bg-red-600" : "w-2.5 bg-red-300"}`}
                    />
                  ))}
                  <span className="ml-2 hidden sm:inline text-xs text-red-800/70">Swipe or click</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Compare mode
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-muted-foreground">Select up to 3 grades to compare</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {grades.map((g, idx) => (
                <motion.div
                  key={g.id}
                  whileHover={{ y: -3 }}
                  className={`relative cursor-pointer transition-all ${state.selected.includes(idx) ? "ring-2 ring-red-500" : "ring-1 ring-transparent hover:ring-red-200"}`}
                  onClick={() => dispatch({ type: "SELECT", index: idx })}
                >
                  <Card className="h-full border-red-100/60 hover:border-red-200/80 rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="text-center space-y-4">
                        <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${g.color} flex items-center justify-center text-white shadow-lg`}>
                          {g.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-xl">{g.name}</h3>
                          <p className="text-red-600 font-semibold">AED {g.price.toLocaleString()}</p>
                        </div>
                        <div className="space-y-2 text-left">
                          {g.features.slice(0, 3).map((feature) => (
                            <div key={feature} className="flex items-center gap-2 text-sm">
                              <Check className="h-3.5 w-3.5 text-green-600" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {state.selected.includes(idx) && (
                        <div className="absolute top-3 right-3 w-7 h-7 bg-red-600 rounded-full flex items-center justify-center shadow">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {state.selected.length > 1 && (
              <div className="text-center">
                <Button 
                  size="lg" 
                  className="px-8 rounded-xl bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => {
                    const selectedGrades = state.selected.map(idx => grades[idx].name);
                    if (onCarBuilder) {
                      onCarBuilder(selectedGrades[0]); // Open builder with first selected grade
                    }
                  }}
                >
                  Compare Selected Grades ({state.selected.length})
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-red-500/10 to-transparent" />
    </section>
  );
};

export default VehicleGrades;
