import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// ==================== TYPES ====================
interface ShowroomProps {
  vehicleName: string;
  vehicleImages: string[];
  onReserve: () => void;
  onTestDrive: () => void;
  onConfigure: () => void;
}

type ModalType = "interior" | "exterior" | "performance" | "safety" | "technology" | null;
type DriveMode = "eco" | "normal" | "sport";
type InteriorStep = 0 | 1 | 2 | 3;
type ExteriorColor = "white" | "black" | "red";

// ==================== MAIN ====================
const SeamlessCinematicShowroom: React.FC<ShowroomProps> = ({
  vehicleName,
  vehicleImages,
  onReserve,
  onTestDrive,
  onConfigure,
}) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const openModal = (m: ModalType) => setActiveModal(m);
  const closeModal = () => setActiveModal(null);

  const cards = [
    {
      id: "interior" as ModalType,
      title: "Interior",
      desc: "Refined and premium cabin.",
      image:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&q=80",
    },
    {
      id: "exterior" as ModalType,
      title: "Exterior",
      desc: "Bold and dynamic design.",
      image:
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80",
    },
    {
      id: "performance" as ModalType,
      title: "Performance",
      desc: "Exhilaration engineered for every journey.",
      image:
        "https://images.unsplash.com/photo-1617654112368-307921291f42?w=1200&q=80",
    },
    {
      id: "safety" as ModalType,
      title: "Safety",
      desc: "Advanced Toyota Safety Sense.",
      image:
        "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200&q=80",
    },
    {
      id: "technology" as ModalType,
      title: "Technology",
      desc: "Connected and intelligent features.",
      image:
        "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&q=80",
    },
  ];

  return (
    <section className="bg-white text-zinc-800">
      {/* ======= OUTSIDE VIEW ======= */}
      <div className="hidden md:grid md:grid-cols-5 gap-6 p-12">
        {cards.map((c) => (
          <button
            key={c.id}
            onClick={() => openModal(c.id)}
            className="rounded-2xl overflow-hidden bg-white shadow hover:shadow-xl transition-all"
          >
            <img
              src={c.image}
              alt={c.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4 text-left">
              <h3 className="font-bold text-lg">{c.title}</h3>
              <p className="text-sm text-zinc-600">{c.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Mobile Swipe Cards */}
      <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory px-4 gap-4">
        {cards.map((c) => (
          <button
            key={c.id}
            onClick={() => openModal(c.id)}
            className="snap-center shrink-0 w-72 rounded-2xl overflow-hidden bg-white shadow"
          >
            <img
              src={c.image}
              alt={c.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4 text-left">
              <h3 className="font-bold text-lg">{c.title}</h3>
              <p className="text-sm text-zinc-600">{c.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* ======= MODALS ======= */}
      <AnimatePresence mode="wait">
        {activeModal === "interior" && <InteriorModal onClose={closeModal} />}
        {activeModal === "exterior" && <ExteriorModal onClose={closeModal} />}
        {activeModal === "performance" && <PerformanceModal onClose={closeModal} />}
        {activeModal === "safety" && <SafetyModal onClose={closeModal} />}
        {activeModal === "technology" && <TechnologyModal onClose={closeModal} />}
      </AnimatePresence>
    </section>
  );
};

// ==================== INTERIOR ====================
const InteriorModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState<InteriorStep>(0);
  const steps = [
    {
      title: "Interior Design",
      desc: "Premium materials and ambient lighting.",
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200",
    },
    {
      title: "Dashboard",
      desc: "State-of-the-art digital instrument cluster.",
      image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200",
    },
    {
      title: "Infotainment",
      desc: "12.3” touchscreen, CarPlay, JBL audio.",
      image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200",
    },
    {
      title: "Comfort",
      desc: "Leather seats, climate control, spacious cabin.",
      image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200",
    },
  ];
  return (
    <ModalWrapper title="Interior" onClose={onClose}>
      <img src={steps[step].image} alt="" className="w-full rounded-xl mb-6" />
      <h2 className="text-2xl font-bold mb-2">{steps[step].title}</h2>
      <p className="text-zinc-600 mb-4">{steps[step].desc}</p>
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            onClick={() => setStep(i as InteriorStep)}
            className={`h-2 w-8 rounded-full ${
              step === i ? "bg-red-600" : "bg-zinc-300"
            }`}
          />
        ))}
      </div>
    </ModalWrapper>
  );
};

// ==================== EXTERIOR ====================
const ExteriorModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [color, setColor] = useState<ExteriorColor>("white");
  return (
    <ModalWrapper title="Exterior" onClose={onClose}>
      <motion.img
        key={color}
        src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1400"
        className="rounded-xl mb-6"
        animate={{ opacity: 1 }}
      />
      <div className="flex gap-3 mb-6">
        {["white", "black", "red"].map((c) => (
          <button
            key={c}
            onClick={() => setColor(c as ExteriorColor)}
            className={`px-4 py-2 rounded-full border ${
              color === c ? "bg-red-600 text-white" : "bg-white text-black"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="text-zinc-600">
        Choose your style with Pearl White, Midnight Black, or Supersonic Red.
      </p>
    </ModalWrapper>
  );
};

// ==================== PERFORMANCE ====================
const PerformanceModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [mode, setMode] = useState<DriveMode>("sport");
  const stats = {
    eco: { hp: 200, torque: 240, accel: 8.5, top: 200 },
    normal: { hp: 225, torque: 265, accel: 7.2, top: 220 },
    sport: { hp: 300, torque: 300, accel: 6.5, top: 260 },
  };
  const s = stats[mode];
  return (
    <ModalWrapper title="Performance" onClose={onClose}>
      <div className="flex gap-4 mb-6">
        {(["eco", "normal", "sport"] as DriveMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-full ${
              mode === m ? "bg-red-600 text-white" : "bg-zinc-200"
            }`}
          >
            {m}
          </button>
        ))}
      </div>
      <p className="text-zinc-600 mb-4">HP: {s.hp} | Torque: {s.torque}Nm | 0-100: {s.accel}s | Top: {s.top}km/h</p>
    </ModalWrapper>
  );
};

// ==================== SAFETY ====================
const SafetyModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const features = [
    { title: "Pre-Collision System", desc: "Automatic emergency braking." },
    { title: "Blind Spot Monitor", desc: "Visual alerts for blind spots." },
    { title: "Lane Departure Alert", desc: "Keeps you centered." },
    { title: "Adaptive Cruise", desc: "Maintains distance automatically." },
  ];
  return (
    <ModalWrapper title="Safety" onClose={onClose}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((f) => (
          <div key={f.title} className="p-4 border rounded-xl bg-white shadow">
            <h3 className="font-bold">{f.title}</h3>
            <p className="text-sm text-zinc-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </ModalWrapper>
  );
};

// ==================== TECHNOLOGY ====================
const TechnologyModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const features = [
    { title: "12.3\" Digital Cluster", desc: "Customizable high-res display" },
    { title: "Wireless CarPlay", desc: "No cables, just connect" },
    { title: "AI Navigation", desc: "Smart routes and maps" },
    { title: "Connected Services", desc: "Remote control + monitoring" },
  ];
  const [i, setI] = useState(0);
  return (
    <ModalWrapper title="Technology" onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">{features[i].title}</h2>
      <p className="text-zinc-600 mb-6">{features[i].desc}</p>
      <div className="flex gap-2">
        {features.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`h-2 w-8 rounded-full ${
              i === idx ? "bg-red-600" : "bg-zinc-300"
            }`}
          />
        ))}
      </div>
    </ModalWrapper>
  );
};

// ==================== REUSABLE MODAL ====================
const ModalWrapper: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({
  title,
  onClose,
  children,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 bg-white/95 flex items-center justify-center p-6 overflow-y-auto"
  >
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-zinc-200 hover:bg-zinc-300 rounded-full p-2"
      >
        <X className="h-5 w-5 text-zinc-800" />
      </button>
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      {children}
    </div>
  </motion.div>
);

export default SeamlessCinematicShowroom;
