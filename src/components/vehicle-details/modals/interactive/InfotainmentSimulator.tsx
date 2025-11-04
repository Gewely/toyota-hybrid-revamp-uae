import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Music, Navigation, Settings, Phone, Radio, Volume2, Bluetooth, Wifi } from 'lucide-react';

interface InfotainmentSimulatorProps {
  className?: string;
}

type Screen = 'home' | 'music' | 'navigation' | 'settings';

const screens = {
  home: {
    icon: Home,
    title: 'Home',
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-accent/50 p-6 rounded-xl cursor-pointer"
          >
            <Music className="w-8 h-8 mb-2 text-primary" />
            <h4 className="font-semibold">Music</h4>
            <p className="text-xs text-muted-foreground">1,245 songs</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-accent/50 p-6 rounded-xl cursor-pointer"
          >
            <Navigation className="w-8 h-8 mb-2 text-primary" />
            <h4 className="font-semibold">Navigation</h4>
            <p className="text-xs text-muted-foreground">Ready</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-accent/50 p-6 rounded-xl cursor-pointer"
          >
            <Phone className="w-8 h-8 mb-2 text-primary" />
            <h4 className="font-semibold">Phone</h4>
            <p className="text-xs text-muted-foreground">Connected</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-accent/50 p-6 rounded-xl cursor-pointer"
          >
            <Radio className="w-8 h-8 mb-2 text-primary" />
            <h4 className="font-semibold">Radio</h4>
            <p className="text-xs text-muted-foreground">FM 101.5</p>
          </motion.div>
        </div>
      </div>
    ),
  },
  music: {
    icon: Music,
    title: 'Music',
    content: (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <div className="w-48 h-48 mx-auto bg-gradient-to-br from-primary/20 to-accent rounded-xl mb-4 flex items-center justify-center">
            <Music className="w-20 h-20 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-1">Summer Vibes</h3>
          <p className="text-sm text-muted-foreground">Playlist • 42 songs</p>
        </div>
        <div className="flex items-center justify-center gap-6">
          <motion.button whileTap={{ scale: 0.9 }} className="p-3 rounded-full hover:bg-accent">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} className="p-4 rounded-full bg-primary text-primary-foreground">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} className="p-3 rounded-full hover:bg-accent">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 18h2V6h-2zm-3.5-6L4 6v12z" />
            </svg>
          </motion.button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">1:23</span>
          <div className="flex-1 h-1 bg-accent rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '30%' }}
              animate={{ width: '35%' }}
              transition={{ duration: 1, repeat: Infinity }}
              className="h-full bg-primary"
            />
          </div>
          <span className="text-xs text-muted-foreground">3:45</span>
        </div>
      </div>
    ),
  },
  navigation: {
    icon: Navigation,
    title: 'Navigation',
    content: (
      <div className="space-y-4">
        <div className="bg-accent/30 rounded-xl p-4 h-64 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/20" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1">Home</h3>
                <p className="text-sm text-muted-foreground">42 George Street</p>
              </div>
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                15 min
              </div>
            </div>
            <div className="space-y-2 mt-8">
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-3 bg-background/50 backdrop-blur-sm p-3 rounded-lg"
              >
                <Navigation className="w-5 h-5 text-primary rotate-45" />
                <div>
                  <p className="text-sm font-medium">Turn right in 200m</p>
                  <p className="text-xs text-muted-foreground">Main Street</p>
                </div>
              </motion.div>
            </div>
          </div>
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-4 right-4 w-3 h-3 bg-primary rounded-full"
          />
        </div>
      </div>
    ),
  },
  settings: {
    icon: Settings,
    title: 'Settings',
    content: (
      <div className="space-y-3">
        {[
          { icon: Bluetooth, label: 'Bluetooth', value: 'iPhone 14 Pro' },
          { icon: Wifi, label: 'Wi-Fi', value: 'Toyota_5G' },
          { icon: Volume2, label: 'Volume', value: '75%' },
        ].map((setting, i) => (
          <motion.div
            key={i}
            whileHover={{ x: 4 }}
            className="flex items-center justify-between p-4 bg-accent/50 rounded-xl cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <setting.icon className="w-5 h-5 text-primary" />
              <span className="font-medium">{setting.label}</span>
            </div>
            <span className="text-sm text-muted-foreground">{setting.value}</span>
          </motion.div>
        ))}
      </div>
    ),
  },
};

export const InfotainmentSimulator: React.FC<InfotainmentSimulatorProps> = ({ className }) => {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');

  return (
    <div className={`bg-gradient-to-br from-background to-accent/20 rounded-2xl p-6 border-2 border-border ${className}`}>
      {/* Screen */}
      <div className="bg-background rounded-xl border border-border overflow-hidden mb-4">
        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-accent/30 border-b border-border">
          <span className="text-xs font-medium">12:34 PM</span>
          <div className="flex items-center gap-2">
            <Bluetooth className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <div className="flex gap-0.5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-1 h-3 bg-primary rounded-full" />
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {screens[activeScreen].content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-4 gap-2">
        {(Object.keys(screens) as Screen[]).map((screen) => {
          const Icon = screens[screen].icon;
          const isActive = activeScreen === screen;
          return (
            <motion.button
              key={screen}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveScreen(screen)}
              className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent/50 hover:bg-accent'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{screens[screen].title}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
