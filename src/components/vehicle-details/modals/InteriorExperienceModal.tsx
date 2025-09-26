// InteriorExperienceModal.tsx
import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Car, Smartphone, Lightbulb, Ruler, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MobileOptimizedDialog,
  MobileOptimizedDialogContent,
  MobileOptimizedDialogHeader,
  MobileOptimizedDialogBody,
  MobileOptimizedDialogFooter,
  MobileOptimizedDialogTitle,
  MobileOptimizedDialogDescription,
} from "@/components/ui/mobile-optimized-dialog";
import { cn } from "@/lib/utils";

const TOYOTA_RED = "#cb0017";

const IMG_INTERIOR_HERO =
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true";
const IMG_A =
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true";
const IMG_B =
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/561ac4b4-3604-4e66-ae72-83e2969d7d65/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true";

type Scene = {
  key: string;
  title: string;
  kicker: string;
  body: string;
  icon: React.ElementType;
  media: { type: "image" | "youtube"; src: string; alt?: string };
  stats?: { label: string; value: string }[];
};

const DEFAULT_SCENES: Scene[] = [
  {
    key: "comfort",
    title: "Comfort that fits",
    kicker: "Premium seating · Quiet ride",
    body: "Supportive ergonomics and refined materials make every drive effortless.",
    icon: Car,
    media: { type: "image", src: IMG_INTERIOR_HERO, alt: "Cabin comfort" },
    stats: [
      { label: "Cabin", value: "100.4 cu ft" },
      { label: "Front legroom", value: "42.1 in" },
    ],
  },
  {
    key: "tech",
    title: "Everyday tech, simplified",
    kicker: "Wireless charging · Seamless pairing",
    body: "Your essentials, always easy: fast charging and intuitive connectivity.",
    icon: Smartphone,
    media: { type: "image", src: IMG_B, alt: "Center console & tech" },
    stats: [
      { label: "Charging", value: "Wireless" },
      { label: "USB", value: "Multiple ports" },
    ],
  },
  {
    key: "space",
    title: "Room to breathe",
    kicker: "Smart storage · Real space",
    body: "Generous passenger room with storage that stays out of your way.",
    icon: Ruler,
    media: { type: "image", src: IMG_A, alt: "Interior space" },
    stats: [
      { label: "Passenger", value: "100.4 cu ft" },
      { label: "Trunk", value: "15.1 cu ft" },
    ],
  },
  {
    key: "design",
    title: "Quietly premium",
    kicker: "Subtle light · Fine textures",
    body: "Elegant details and balanced lines that feel premium without shouting.",
    icon: Lightbulb,
    media: { type: "image", src: IMG_INTERIOR_HERO, alt: "Ambient design" },
    stats: [{ label: "Lighting", value: "Full-cabin LED" }],
  },
];

interface InteriorExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTestDrive: () => void;
  scenes?: Scene[];
  videos?: string[]; // YouTube IDs (optional)
  gallery?: { src: string; alt?: string }[]; // optional grid images
}

const HeroMedia: React.FC<{ media: Scene["media"] }> = ({ media }) => {
  if (media.type === "youtube") {
    const id = media.src;
    const poster = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    const [play, setPlay] = React.useState(false);
    return (
      <div className="relative w-full overflow-hidden rounded-2xl bg-black ring-1 ring-black/5">
        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          {!play ? (
            <button
              onClick={() => setPlay(true)}
              aria-label="Play video"
              className="absolute inset-0 flex items-center justify-center group"
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:opacity-95 transition"
                style={{ backgroundImage: `url('${poster}')` }}
              />
              <div className="relative z-10 flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur text-sm font-medium shadow">
                <Play className="h-4 w-4" /> Play video
              </div>
            </button>
          ) : (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1&autoplay=1`}
              title="Feature video"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl ring-1 ring-black/5 border bg-black/5"
      style={{ paddingTop: "56.25%" }}
    >
      <img
        src={media.src}
        alt={media.alt || ""}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  );
};

const SceneCard: React.FC<{
  active: boolean;
  title: string;
  kicker: string;
  Icon: React.ElementType;
  onClick: () => void;
}> = ({ active, title, kicker, Icon, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "text-left rounded-xl border ring-1 ring-black/5 p-3 hover:shadow-sm transition w-full",
      active ? "bg-black text-white border-black" : "bg-white"
    )}
    aria-pressed={active}
  >
    <div className="flex items-center gap-2">
      <span className={cn("p-2 rounded-md", active ? "bg-white/15 text-white" : "bg-black/5 text-black")}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="font-semibold text-sm">{title}</div>
    </div>
    <div className={cn("mt-1 text-xs", active ? "text-white/80" : "text-muted-foreground")}>{kicker}</div>
  </button>
);

const ThumbRail: React.FC<{
  items: Scene[];
  activeKey: string;
  onPick: (key: string) => void;
}> = ({ items, activeKey, onPick }) => (
  <div className="mt-3 overflow-x-auto no-scrollbar">
    <div className="flex gap-2 min-w-max">
      {items.map((s) => (
        <button
          key={s.key}
          onClick={() => onPick(s.key)}
          aria-label={`Show ${s.title}`}
          className={cn(
            "relative h-16 w-28 rounded-lg overflow-hidden ring-1 ring-black/5 border",
            activeKey === s.key ? "outline outline-2" : ""
          )}
          style={activeKey === s.key ? { outlineColor: TOYOTA_RED } : {}}
        >
          {s.media.type === "image" ? (
            <img src={s.media.src} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="h-full w-full grid place-items-center bg-black text-white">
              <Play className="h-5 w-5" />
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 text-[10px] bg-black/50 text-white px-1 py-0.5 truncate">
            {s.title}
          </div>
        </button>
      ))}
    </div>
  </div>
);

const InteriorExperienceModal: React.FC<InteriorExperienceModalProps> = ({
  isOpen,
  onClose,
  onBookTestDrive,
  scenes = DEFAULT_SCENES,
  videos = [],
  gallery,
}) => {
  const prefersReduced = useReducedMotion();
  const enter = prefersReduced ? {} : { opacity: 0, y: 16 };
  const entered = prefersReduced ? {} : { opacity: 1, y: 0 };

  const [active, setActive] = React.useState<string>(scenes[0]?.key || "comfort");
  const current = scenes.find((s) => s.key === active) || scenes[0];

  return (
    <MobileOptimizedDialog open={isOpen} onOpenChange={onClose}>
      <MobileOptimizedDialogContent className="sm:max-w-6xl max-w-[1100px] w-[96vw]">
        <MobileOptimizedDialogHeader className="px-3 py-2 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <MobileOptimizedDialogTitle className="text-lg font-semibold leading-tight sm:text-2xl sm:font-bold">
              Interior Experience
            </MobileOptimizedDialogTitle>
            <Button variant="ghost" size="icon" className="sm:hidden" onClick={onClose} aria-label="Close">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <MobileOptimizedDialogDescription className="hidden sm:block text-base mt-1">
            Pick a moment — content updates instantly. No hotspots or interior controls.
          </MobileOptimizedDialogDescription>
        </MobileOptimizedDialogHeader>

        <MobileOptimizedDialogBody>
          <div className="space-y-6">
            <motion.div
              initial={enter}
              animate={entered}
              transition={{ duration: 0.3 }}
              className="rounded-2xl p-4 lg:p-6 border bg-white/70 backdrop-blur ring-1 ring-black/5"
            >
              <div className="grid lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1 space-y-2">
                  {scenes.map((s) => (
                    <SceneCard
                      key={s.key}
                      active={active === s.key}
                      title={s.title}
                      kicker={s.kicker}
                      Icon={s.icon}
                      onClick={() => setActive(s.key)}
                    />
                  ))}
                </div>

                <div className="lg:col-span-2 space-y-3">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.key}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35 }}
                    >
                      <HeroMedia media={current.media} />
                    </motion.div>
                  </AnimatePresence>

                  <div className="rounded-xl border ring-1 ring-black/5 bg-white p-4">
                    <div className="text-xs font-semibold mb-1" style={{ color: TOYOTA_RED }}>
                      {current.kicker}
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold mb-1">{current.title}</h3>
                    <p className="text-sm text-muted-foreground">{current.body}</p>

                    {!!current.stats?.length && (
                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {current.stats.map((s) => (
                          <div key={s.label} className="rounded-md border bg-white p-2 text-xs">
                            <div className="text-muted-foreground">{s.label}</div>
                            <div className="font-medium">{s.value}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <ThumbRail items={scenes} activeKey={active} onPick={setActive} />
                </div>
              </div>
            </motion.div>

            {gallery?.length ? (
              <div className="rounded-2xl border bg-white/70 backdrop-blur ring-1 ring-black/5 p-3">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {gallery.map((im) => (
                    <div key={im.src} className="relative w-full overflow-hidden rounded-lg border ring-1 ring-black/5">
                      <div className="w-full" style={{ paddingTop: "60%" }}>
                        <img src={im.src} alt={im.alt || ""} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {videos.length > 0 && (
              <div className="rounded-2xl border bg-white/70 backdrop-blur ring-1 ring-black/5 p-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  {videos.map((id) => (
                    <div key={id} className="relative w-full overflow-hidden rounded-xl bg-black ring-1 ring-black/5">
                      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                        <iframe
                          className="absolute inset-0 w-full h-full"
                          src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`}
                          title="Feature video"
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </MobileOptimizedDialogBody>

        <MobileOptimizedDialogFooter className="px-3 py-3 sm:px-6 sm:py-4">
          <div className="flex w-full sm:w-auto sm:ml-auto gap-3">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={onBookTestDrive} style={{ background: TOYOTA_RED }}>
              Book Test Drive
            </Button>
          </div>
        </MobileOptimizedDialogFooter>
      </MobileOptimizedDialogContent>
    </MobileOptimizedDialog>
  );
};

export default InteriorExperienceModal;
