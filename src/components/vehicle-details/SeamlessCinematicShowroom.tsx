"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

// ==================== TYPES ====================
type ModalType = "interior" | "exterior" | "performance" | "safety" | "technology" | null;
type DriveMode = "eco" | "normal" | "sport";

// ==================== MAIN ====================
const SeamlessCinematicShowroom: React.FC = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const cards = [
    { id: "interior", title: "Interior", img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&q=80" },
    { id: "exterior", title: "Exterior", img: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80" },
    { id: "performance", title: "Performance", img: "https://images.unsplash.com/photo-1617654112368-307921291f42?w=1200&q=80" },
    { id: "safety", title: "Safety", img: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200&q=80" },
    { id: "technology", title: "Technology", img: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&q=80" },
  ];

  return (
    <section className="w-full bg-white">
      {/* GRID (Desktop) / CAROUSEL (Mobile) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {cards.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveModal(c.id as ModalType)}
            className="relative group rounded-xl overflow-hidden shadow-lg bg-white"
          >
            <img src={c.img} alt={c.title} className="w-full h-64 object-cover group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition" />
            <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">{c.title}</h3>
          </button>
        ))}
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {activeModal === "interior" && <InteriorModal onClose={() => setActiveModal(null)} />}
        {activeModal === "exterior" && <ExteriorModal onClose={() => setActiveModal(null)} />}
        {activeModal === "performance" && <PerformanceModal onClose={() => setActiveModal(null)} />}
        {activeModal === "safety" && <SafetyModal onClose={() => setActiveModal(null)} />}
        {activeModal === "technology" && <TechnologyModal onClose={() => setActiveModal(null)} />}
      </AnimatePresence>
    </section>
  );
};

// ==================== INTERIOR (Stepper) ====================
const InteriorModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const steps = [
    { title: "Dashboard", img: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&q=80" },
    { title: "Infotainment", img: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&q=80" },
    { title: "Comfort", img: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200&q=80" },
    { title: "Cargo", img: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1200&q=80" },
  ];

  return (
    <ModalWrapper title="Interior" onClose={onClose}>
      <motion.img key={step} src={steps[step].img} className="w-full rounded-xl mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
      <h2 className="text-2xl font-bold text-zinc-800 mb-4">{steps[step].title}</h2>
      <div className="flex justify-center gap-3 mb-6">
        {steps.map((_, i) => (
          <button key={i} onClick={() => setStep(i)} className={`h-2 w-8 rounded-full ${i === step ? "bg-red-600" : "bg-zinc-300"}`} />
        ))}
      </div>
    </ModalWrapper>
  );
};

// ==================== EXTERIOR (Hotspots) ====================
const ExteriorModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const hotspots = [
    { id: "roof", label: "Roof Rails", x: "50%", y: "10%" },
    { id: "lights", label: "LED Lights", x: "70%", y: "40%" },
    { id: "wheels", label: "Alloy Wheels", x: "30%", y: "70%" },
  ];
  return (
    <ModalWrapper title="Exterior" onClose={onClose}>
      <div className="relative">
        <img src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1400&q=80" className="w-full rounded-xl" />
        {hotspots.map((h) => (
          <button key={h.id} className="absolute bg-red-600 text-white text-xs px-2 py-1 rounded-full" style={{ top: h.y, left: h.x }}>
            {h.label}
          </button>
        ))}
      </div>
    </ModalWrapper>
  );
};

// ==================== PERFORMANCE (Drive Modes) ====================
const PerformanceModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [mode, setMode] = useState<DriveMode>("sport");
  const stats = {
    eco: { hp: 200, speed: 180 },
    normal: { hp: 250, speed: 220 },
    sport: { hp: 300, speed: 260 },
  };
  const current = stats[mode];

  return (
    <ModalWrapper title="Performance" onClose={onClose}>
      <div className="flex justify-center gap-4 mb-6">
        {(["eco", "normal", "sport"] as DriveMode[]).map((m) => (
          <button key={m} onClick={() => setMode(m)} className={`px-4 py-2 font-bold rounded ${mode === m ? "bg-red-600 text-white" : "bg-zinc-200"}`}>
            {m.toUpperCase()}
          </button>
        ))}
      </div>
      <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-4xl font-bold">{current.hp} HP</h2>
        <p className="text-zinc-600">Top Speed: {current.speed} km/h</p>
      </motion.div>
    </ModalWrapper>
  );
};

// ==================== SAFETY (Accordion) ====================
const SafetyModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [open, setOpen] = useState<string | null>(null);
  const features = [
    { id: "pcs", title: "Pre-Collision System", desc: "Detects potential collisions and brakes automatically." },
    { id: "lane", title: "Lane Assist", desc: "Keeps the car centered with visual and audio alerts." },
    { id: "blind", title: "Blind Spot Monitor", desc: "Alerts when vehicles enter blind spots." },
  ];
  return (
    <ModalWrapper title="Safety" onClose={onClose}>
      <div className="grid gap-4">
        {features.map((f) => (
          <div key={f.id} className="border rounded-xl p-4 bg-white shadow">
            <button onClick={() => setOpen(open === f.id ? null : f.id)} className="w-full text-left font-bold text-zinc-800">
              {f.title}
            </button>
            {open === f.id && <p className="mt-2 text-zinc-600">{f.desc}</p>}
          </div>
        ))}
      </div>
    </ModalWrapper>
  );
};

// ==================== TECHNOLOGY (Swipe Deck) ====================
const TechnologyModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [i, setI] = useState(0);
  const features = [
    { title: "CarPlay", img: "https://images.unsplash.com/photo-1517059224940-d4af9eec41e5?w=800&q=80" },
    { title: "Navigation", img: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80" },
    { title: "Connected Services", img: "https://images.unsplash.com/photo-1581093588401-22f82f2f09c2?w=800&q=80" },
  ];

  return (
    <ModalWrapper title="Technology" onClose={onClose}>
      <motion.img key={i} src={features[i].img} className="w-full rounded-xl mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
      <h2 className="text-xl font-bold text-zinc-800">{features[i].title}</h2>
      <div className="flex justify-center gap-2 mt-4">
        {features.map((_, idx) => (
          <button key={idx} onClick={() => setI(idx)} className={`h-2 w-6 rounded-full ${i === idx ? "bg-red-600" : "bg-zinc-300"}`} />
        ))}
      </div>
    </ModalWrapper>
  );
};

// ==================== MODAL WRAPPER ====================
const ModalWrapper: React.FC<{ title: string; children: React.ReactNode; onClose: () => void }> = ({ title, children, onClose }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-4xl p-6 relative">
      <button onClick={onClose} className="absolute top-4 right-4 bg-zinc-200 p-2 rounded-full">
        <X className="h-5 w-5 text-zinc-800" />
      </button>
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">{title}</h1>
      {children}
      <div className="mt-8 flex justify-center gap-4">
        <Button className="bg-red-600 text-white px-6 py-3">Reserve Now</Button>
        <Button variant="outline" className="border-2 border-zinc-800 px-6 py-3">Book Test Drive</Button>
      </div>
    </div>
  </motion.div>
);

// ==================== EXPORT ====================
export default SeamlessCinematicShowroom;
