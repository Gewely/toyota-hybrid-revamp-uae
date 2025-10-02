"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Types for different modal journeys
type ModalType = "interior" | "exterior" | "performance" | "safety" | "technology" | null;

// Props for main showroom
interface ShowroomProps {
  vehicleName: string;
  heroImage: string;
  onReserve?: () => void;
  onTestDrive?: () => void;
  onConfigure?: () => void;
}

// ==================== MAIN WRAPPER ====================
const SeamlessCinematicShowroom: React.FC<ShowroomProps> = ({
  vehicleName,
  heroImage,
  onReserve,
  onTestDrive,
  onConfigure,
}) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return (
    <section className="relative w-full min-h-screen bg-black">
      {/* Hero */}
      <HeroSection vehicleName={vehicleName} heroImage={heroImage} onReserve={onReserve} onTestDrive={onTestDrive} onConfigure={onConfigure} />

      {/* Journey cards (grid desktop / swipe mobile) */}
      <JourneyCards openModal={(m) => setActiveModal(m)} />

      {/* Modal journeys */}
      <AnimatePresence mode="wait">
        {activeModal === "interior" && <InteriorModal onClose={() => setActiveModal(null)} onReserve={onReserve} onTestDrive={onTestDrive} />}
        {activeModal === "exterior" && <ExteriorModal onClose={() => setActiveModal(null)} onReserve={onReserve} onTestDrive={onTestDrive} />}
        {activeModal === "performance" && <PerformanceModal onClose={() => setActiveModal(null)} onReserve={onReserve} onTestDrive={onTestDrive} />}
        {activeModal === "safety" && <SafetyModal onClose={() => setActiveModal(null)} />}
        {activeModal === "technology" && <TechnologyModal onClose={() => setActiveModal(null)} />}
      </AnimatePresence>
    </section>
  );
};
// ==================== HERO SECTION ====================
const HeroSection: React.FC<{
  vehicleName: string;
  heroImage: string;
  onReserve?: () => void;
  onTestDrive?: () => void;
  onConfigure?: () => void;
}> = ({ vehicleName, heroImage, onReserve, onTestDrive, onConfigure }) => {
  return (
    <div className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden">
      <img
        src={heroImage}
        alt={vehicleName}
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />
      <div className="relative z-10 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">{vehicleName}</h1>
        <p className="max-w-xl mx-auto text-lg opacity-80">
          Discover the future of driving with Toyota&apos;s advanced design,
          performance, and technology.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          {onTestDrive && (
            <Button
              onClick={onTestDrive}
              className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-full"
            >
              Book a Test Drive
            </Button>
          )}
          {onReserve && (
            <Button
              onClick={onReserve}
              className="bg-[#EB0A1E] text-white hover:bg-red-700 px-6 py-3 rounded-full"
            >
              Reserve Now
            </Button>
          )}
          {onConfigure && (
            <Button
              onClick={onConfigure}
              className="bg-gray-800 text-white hover:bg-gray-700 px-6 py-3 rounded-full"
            >
              Configure Yours
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== JOURNEY CARDS ====================
const JourneyCards: React.FC<{ openModal: (m: ModalType) => void }> = ({
  openModal,
}) => {
  const cards = [
    {
      id: "interior",
      title: "Interior",
      desc: "Refined and spacious cabin",
      img: "/images/interior.jpg",
    },
    {
      id: "exterior",
      title: "Exterior",
      desc: "Striking dynamic design",
      img: "/images/exterior.jpg",
    },
    {
      id: "performance",
      title: "Performance",
      desc: "Power and precision",
      img: "/images/performance.jpg",
    },
    {
      id: "technology",
      title: "Technology",
      desc: "Seamless connectivity",
      img: "/images/technology.jpg",
    },
    {
      id: "safety",
      title: "Safety",
      desc: "Advanced protection",
      img: "/images/safety.jpg",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6 py-12 bg-black">
      {cards.map((card) => (
        <motion.div
          key={card.id}
          whileHover={{ scale: 1.02 }}
          className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg cursor-pointer"
          onClick={() => openModal(card.id as ModalType)}
        >
          <img
            src={card.img}
            alt={card.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-6 text-white">
            <h3 className="text-xl font-bold mb-2">{card.title}</h3>
            <p className="text-gray-400 mb-4">{card.desc}</p>
            <Button className="bg-[#EB0A1E] text-white rounded-full px-5 py-2">
              Explore {card.title}
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
// ==================== INTERIOR MODAL ====================
const InteriorModal: React.FC<{ onClose: () => void; onReserve?: () => void; onTestDrive?: () => void }> = ({
  onClose,
  onReserve,
  onTestDrive,
}) => {
  const steps = [
    {
      id: 1,
      title: "Interior Design",
      desc: "Explore the refined and spacious design of the Toyota interior with premium materials and intuitive controls.",
      img: "/images/interior-step1.jpg",
    },
    {
      id: 2,
      title: "Comfort & Seating",
      desc: "Enjoy ergonomic seating, climate control, and spacious rear legroom built for long journeys.",
      img: "/images/interior-step2.jpg",
    },
    {
      id: 3,
      title: "Cockpit & Controls",
      desc: "Stay in command with a driver-focused cockpit and seamless steering wheel controls.",
      img: "/images/interior-step3.jpg",
    },
    {
      id: 4,
      title: "Digital Experience",
      desc: "A modern infotainment screen, ambient lighting, and a digital cluster for an immersive driving experience.",
      img: "/images/interior-step4.jpg",
    },
  ];
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
    >
      <div className="relative bg-black rounded-2xl max-w-4xl w-full mx-4 p-6 text-white overflow-hidden">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-400"
        >
          <X size={28} />
        </button>

        {/* Image */}
        <img
          src={steps[currentStep].img}
          alt={steps[currentStep].title}
          className="w-full h-64 md:h-96 object-cover rounded-xl mb-6"
        />

        {/* Step Content */}
        <h2 className="text-3xl font-bold mb-2">{steps[currentStep].title}</h2>
        <p className="text-gray-300 mb-6">{steps[currentStep].desc}</p>

        {/* Stepper */}
        <div className="flex justify-center gap-3 mb-6">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`w-4 h-4 rounded-full ${
                idx === currentStep ? "bg-[#EB0A1E]" : "bg-gray-600"
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            className="bg-gray-800 text-white px-6 py-2 rounded-full"
          >
            Back
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))}
              className="bg-[#EB0A1E] text-white px-6 py-2 rounded-full"
            >
              Next
            </Button>
          ) : (
            <div className="flex gap-3">
              {onTestDrive && (
                <Button onClick={onTestDrive} className="bg-white text-black px-6 py-2 rounded-full">
                  Book Test Drive
                </Button>
              )}
              {onReserve && (
                <Button onClick={onReserve} className="bg-[#EB0A1E] text-white px-6 py-2 rounded-full">
                  Reserve Now
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
// ==================== EXTERIOR MODAL ====================
const ExteriorModal: React.FC<{ onClose: () => void; onReserve?: () => void; onTestDrive?: () => void }> = ({
  onClose,
  onReserve,
  onTestDrive,
}) => {
  const features = [
    {
      title: "Stylish Design",
      desc: "Dynamic lines and a bold stance make the Toyota exterior instantly recognizable.",
      img: "/images/exterior-style.jpg",
    },
    {
      title: "Advanced Lighting",
      desc: "LED headlamps and signature DRLs enhance visibility and add character.",
      img: "/images/exterior-lighting.jpg",
    },
    {
      title: "Versatile Roof Rails",
      desc: "Functional and stylish, ready for your lifestyle and adventures.",
      img: "/images/exterior-roof.jpg",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
    >
      <div className="relative bg-black rounded-2xl max-w-5xl w-full mx-4 p-6 text-white overflow-y-auto max-h-[90vh]">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-400"
        >
          <X size={28} />
        </button>

        {/* Hero Image */}
        <img
          src="/images/exterior-hero.jpg"
          alt="Toyota Exterior"
          className="w-full h-72 md:h-[420px] object-cover rounded-xl mb-6"
        />

        {/* Title */}
        <h2 className="text-3xl font-bold mb-2">Exterior</h2>
        <p className="text-gray-300 mb-6">
          Explore the striking and dynamic design that defines Toyota&apos;s
          exterior — modern aesthetics meet aerodynamic performance.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-900 rounded-xl overflow-hidden shadow-md"
            >
              <img
                src={f.img}
                alt={f.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex justify-center gap-4 mt-8">
          {onTestDrive && (
            <Button
              onClick={onTestDrive}
              className="bg-white text-black px-6 py-2 rounded-full"
            >
              Book Test Drive
            </Button>
          )}
          {onReserve && (
            <Button
              onClick={onReserve}
              className="bg-[#EB0A1E] text-white px-6 py-2 rounded-full"
            >
              Reserve Now
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
// ==================== PERFORMANCE MODAL ====================
const PerformanceModal: React.FC<{ onClose: () => void; onReserve?: () => void; onTestDrive?: () => void }> = ({
  onClose,
  onReserve,
  onTestDrive,
}) => {
  const modes = ["Eco", "Normal", "Sport"] as const;
  type Mode = typeof modes[number];
  const [currentMode, setCurrentMode] = useState<Mode>("Sport");

  const stats: Record<Mode, { hp: number; torque: number; accel: number; topSpeed: number }> = {
    Eco: { hp: 180, torque: 220, accel: 9.2, topSpeed: 190 },
    Normal: { hp: 220, torque: 260, accel: 7.8, topSpeed: 210 },
    Sport: { hp: 300, torque: 320, accel: 6.4, topSpeed: 250 },
  };

  const s = stats[currentMode];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
    >
      <div className="relative bg-black rounded-2xl max-w-6xl w-full mx-4 p-6 text-white overflow-y-auto max-h-[90vh]">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-400"
        >
          <X size={28} />
        </button>

        {/* Drive Mode Selector */}
        <div className="flex justify-center gap-6 mb-6">
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => setCurrentMode(m)}
              className={`px-6 py-2 rounded-full text-lg font-semibold transition ${
                currentMode === m
                  ? "bg-[#EB0A1E] text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Hero Image */}
        <img
          src="/images/performance-hero.jpg"
          alt="Performance"
          className="w-full h-72 md:h-[420px] object-cover rounded-xl mb-6"
        />

        {/* Stats + Speedometer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Stats */}
          <div className="flex justify-around">
            <div className="text-center">
              <div className="text-5xl font-bold">{s.hp}</div>
              <div className="text-gray-400">Horsepower</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold">{s.torque}</div>
              <div className="text-gray-400">Nm Torque</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold">{s.accel}</div>
              <div className="text-gray-400">0–100 km/h (s)</div>
            </div>
          </div>

          {/* Speedometer */}
          <div className="flex justify-center">
            <div className="relative">
              <svg viewBox="0 0 200 200" className="w-56 h-56">
                <circle cx="100" cy="100" r="80" stroke="#333" strokeWidth="8" fill="none" />
                <motion.line
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="30"
                  stroke="#EB0A1E"
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ rotate: -90 }}
                  animate={{ rotate: (s.topSpeed / 260) * 180 - 90 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  style={{ transformOrigin: "100px 100px" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold">{s.topSpeed}</div>
                <div className="text-sm text-gray-400">km/h</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex justify-center gap-4 mt-8">
          {onTestDrive && (
            <Button
              onClick={onTestDrive}
              className="bg-white text-black px-6 py-2 rounded-full"
            >
              Book Test Drive
            </Button>
          )}
          {onReserve && (
            <Button
              onClick={onReserve}
              className="bg-[#EB0A1E] text-white px-6 py-2 rounded-full"
            >
              Reserve Now
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
// ==================== SAFETY MODAL ====================
const SafetyModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const features = [
    {
      icon: "🛡️",
      title: "Pre-Collision System",
      desc: "Radar and camera technology detect potential collisions and automatically apply brakes.",
    },
    {
      icon: "👁️",
      title: "Blind Spot Monitor",
      desc: "Detects vehicles in blind spots and alerts the driver with visual indicators.",
    },
    {
      icon: "🛣️",
      title: "Lane Departure Alert",
      desc: "Warns if the car drifts from its lane without signaling.",
    },
    {
      icon: "🎯",
      title: "Adaptive Cruise Control",
      desc: "Maintains safe distance from the vehicle ahead, adjusting speed automatically.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
    >
      <div className="relative bg-black rounded-2xl max-w-4xl w-full mx-4 p-6 text-white overflow-y-auto max-h-[90vh]">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-400"
        >
          <X size={28} />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-4">Safety First</h2>
        <p className="text-gray-300 mb-8">
          Toyota Safety Sense integrates advanced features to protect you and your passengers in every journey.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03 }}
              className="bg-gray-900 rounded-xl p-6 flex flex-col items-start"
            >
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
// ==================== TECHNOLOGY MODAL ====================
const TechnologyModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const features = [
    {
      title: '12.3" Digital Cluster',
      desc: "Customizable, high-resolution digital display with real-time vehicle data.",
      img: "/images/tech-cluster.jpg",
    },
    {
      title: "Wireless CarPlay",
      desc: "Seamless smartphone integration without the hassle of cables.",
      img: "/images/tech-carplay.jpg",
    },
    {
      title: "Advanced Navigation",
      desc: "Real-time traffic updates and AI-optimized routing.",
      img: "/images/tech-navigation.jpg",
    },
    {
      title: "Connected Services",
      desc: "Control and monitor your vehicle remotely via the Toyota app.",
      img: "/images/tech-connected.jpg",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
    >
      <div className="relative bg-black rounded-2xl max-w-5xl w-full mx-4 p-6 text-white overflow-y-auto max-h-[90vh]">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-400"
        >
          <X size={28} />
        </button>

        {/* Hero */}
        <img
          src="/images/tech-hero.jpg"
          alt="Toyota Technology"
          className="w-full h-72 md:h-[420px] object-cover rounded-xl mb-6"
        />

        {/* Title */}
        <h2 className="text-3xl font-bold mb-2">Technology</h2>
        <p className="text-gray-300 mb-6">
          Innovation designed to keep you connected, informed, and in control.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-900 rounded-xl overflow-hidden shadow-md"
            >
              <img src={f.img} alt={f.title} className="w-full h-36 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
// ==================== EXPORT DEFAULT ====================
export default SeamlessCinematicShowroom;
