import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSwipeable } from '@/hooks/use-swipeable';

// ==================== TYPES ====================
interface ShowroomProps {
  vehicleImages: string[];
  vehicleName: string;
  onReserve?: () => void;
  onTestDrive?: () => void;
  onConfigure?: () => void;
}

type ModalType = 'interior' | 'exterior' | 'performance' | 'safety' | 'technology' | null;
type DriveMode = 'eco' | 'normal' | 'sport';
type InteriorStep = 0 | 1 | 2 | 3;
type ExteriorColor = 'white' | 'black' | 'red';

// ==================== MAIN ====================
const SeamlessCinematicShowroom: React.FC<ShowroomProps> = ({ 
  vehicleImages, vehicleName, onReserve, onTestDrive, onConfigure 
}) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const openModal = (modal: ModalType) => setActiveModal(modal);
  const closeModal = () => setActiveModal(null);

  return (
    <section className="relative w-full bg-black h-screen overflow-hidden">
      {/* HERO BACKGROUND */}
      <div className="absolute inset-0">
        <img src={vehicleImages[0] || 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1920&q=80'} 
          alt={vehicleName} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>

      {/* HERO CONTENT */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Title + CTAs */}
        <div className="flex flex-col items-center justify-center flex-1 px-4">
          <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8}}
            className="text-center text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-4">
            Discover the {vehicleName}
          </motion.h1>
          <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.8, delay:0.2}}
            className="text-center text-base sm:text-lg md:text-xl text-white/90 mb-6">
            Exhilaration engineered for every journey
          </motion.p>
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.8, delay:0.4}}
            className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={onReserve} className="bg-[#EB0A1E] px-8 py-4 text-white text-lg hover:bg-[#d0091a]">Reserve Now</Button>
            <Button onClick={onTestDrive} variant="outline"
              className="border-2 border-white text-white px-8 py-4 text-lg hover:bg-white/10">Book Test Drive</Button>
            <Button onClick={onConfigure} variant="outline"
              className="border-2 border-zinc-400 text-zinc-300 px-8 py-4 text-lg hover:bg-zinc-800/50">Configure</Button>
          </motion.div>
        </div>

        {/* JOURNEY CARDS OVERLAY */}
        <JourneyCards openModal={openModal} />
      </div>

      {/* MODALS */}
      <AnimatePresence mode="wait">
        {activeModal === 'interior' && <InteriorModal onClose={closeModal} onReserve={onReserve} onTestDrive={onTestDrive} />}
        {activeModal === 'exterior' && <ExteriorModal onClose={closeModal} onReserve={onReserve} onTestDrive={onTestDrive} />}
        {activeModal === 'performance' && <PerformanceModal onClose={closeModal} onReserve={onReserve} onTestDrive={onTestDrive} />}
        {activeModal === 'safety' && <SafetyModal onClose={closeModal} onReserve={onReserve} onTestDrive={onTestDrive} />}
        {activeModal === 'technology' && <TechnologyModal onClose={closeModal} onReserve={onReserve} onTestDrive={onTestDrive} />}
      </AnimatePresence>
    </section>
  );
};

// ==================== JOURNEY CARDS (Overlay) ====================
const JourneyCards: React.FC<{ openModal: (modal: ModalType) => void }> = ({ openModal }) => {
  const cards = [
    { id:'interior', title:'Interior', desc:'Refined cabin experience', img:'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80' },
    { id:'exterior', title:'Exterior', desc:'Bold dynamic design', img:'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&q=80' },
    { id:'performance', title:'Performance', desc:'Power and handling', img:'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80' },
    { id:'safety', title:'Safety', desc:'Advanced protection', img:'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80' },
    { id:'technology', title:'Technology', desc:'Cutting-edge features', img:'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&q=80' },
  ];

  return (
    <div className="relative bg-black p-4 sm:p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {cards.map((c,i)=>(
          <motion.button key={c.id} onClick={()=>openModal(c.id as ModalType)}
            initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
            className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden text-left hover:bg-zinc-800">
            <img src={c.img} alt={c.title} className="h-28 w-full object-cover" />
            <div className="p-3">
              <h3 className="text-white font-bold text-lg">{c.title}</h3>
              <p className="text-zinc-400 text-sm">{c.desc}</p>
              <div className="flex items-center text-zinc-300 mt-2">
                <span className="text-xs font-semibold">Learn More</span>
                <ChevronRight className="ml-1 h-4 w-4" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// ==================== INTERIOR MODAL ====================
const InteriorModal: React.FC<{ onClose:()=>void; onReserve?:()=>void; onTestDrive?:()=>void }> = ({ onClose,onReserve,onTestDrive }) => {
  const steps = [
    {title:'Interior Design',desc:'Premium materials, ambient lighting.',img:'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&q=80'},
    {title:'Dashboard',desc:'Digital cluster with customizable themes.',img:'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&q=80'},
    {title:'Infotainment',desc:'12.3" touchscreen, wireless CarPlay.',img:'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&q=80'},
    {title:'Comfort',desc:'Ventilated seats, spacious rear.',img:'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200&q=80'},
  ];
  const [step,setStep]=useState<InteriorStep>(0);
  const swipe = useSwipeable({
    onSwipeLeft:()=> step<3 && setStep((s)=>(s+1) as InteriorStep),
    onSwipeRight:()=> step>0 && setStep((s)=>(s-1) as InteriorStep),
  });

  return(
    <ModalWrapper onClose={onClose}>
      <ModalHeader title="INTERIOR" onClose={onClose} />
      <div {...swipe} className="flex flex-col items-center justify-center flex-1 px-4 py-6">
        <motion.img key={step} src={steps[step].img} alt={steps[step].title}
          initial={{opacity:0}} animate={{opacity:1}} className="rounded-xl mb-4 w-full max-w-3xl"/>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{steps[step].title}</h2>
        <p className="text-zinc-300 text-sm sm:text-base mb-4">{steps[step].desc}</p>
        <div className="flex gap-2 mb-4">
          {steps.map((_,i)=>(
            <button key={i} onClick={()=>setStep(i as InteriorStep)} 
              className={`h-2 w-6 rounded-full ${step===i?'bg-[#EB0A1E]':'bg-zinc-600'}`} />
          ))}
        </div>
        <Button onClick={()=> step<3? setStep((s)=>(s+1) as InteriorStep):onClose()} 
          className="bg-[#EB0A1E] text-white px-6 py-3">{step<3?'Next':'Finish'}</Button>
      </div>
      <ModalFooter onReserve={onReserve} onTestDrive={onTestDrive}/>
    </ModalWrapper>
  );
};
// ==================== EXTERIOR MODAL ====================
const ExteriorModal: React.FC<{ onClose:()=>void; onReserve?:()=>void; onTestDrive?:()=>void }> = ({onClose,onReserve,onTestDrive})=>{
  const [color,setColor]=useState<ExteriorColor>('white');
  const colors=[
    {id:'white',name:'Pearl White',class:'bg-zinc-100'},
    {id:'black',name:'Midnight Black',class:'bg-zinc-900 border-zinc-600'},
    {id:'red',name:'Supersonic Red',class:'bg-[#EB0A1E]'},
  ];
  const features=[
    {title:'Stylish Design',img:'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80'},
    {title:'LED Lighting',img:'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80'},
    {title:'Roof Rails',img:'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800&q=80'},
  ];

  return(
    <ModalWrapper onClose={onClose}>
      <ModalHeader title="EXTERIOR" onClose={onClose}/>
      <div className="flex flex-col items-center px-4 py-6">
        <motion.img key={color} src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1400&q=80"
          alt="Exterior" initial={{opacity:0}} animate={{opacity:1}}
          className="w-full max-w-4xl rounded-xl mb-6"/>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {colors.map(c=>(
            <button key={c.id} onClick={()=>setColor(c.id as ExteriorColor)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${color===c.id?'border-white bg-white/10':'border-zinc-700 hover:border-zinc-500'}`}>
              <div className={`h-5 w-5 rounded-full ${c.class}`}/>
              <span className="text-white text-sm">{c.name}</span>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl">
          {features.map(f=>(
            <div key={f.title} className="bg-zinc-900/60 border border-zinc-700 rounded-xl overflow-hidden">
              <img src={f.img} alt={f.title} className="h-32 w-full object-cover"/>
              <div className="p-3">
                <h3 className="text-white font-bold">{f.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ModalFooter onReserve={onReserve} onTestDrive={onTestDrive}/>
    </ModalWrapper>
  );
};

// ==================== PERFORMANCE MODAL ====================
const PerformanceModal: React.FC<{ onClose:()=>void; onReserve?:()=>void; onTestDrive?:()=>void }> = ({onClose,onReserve,onTestDrive})=>{
  const [mode,setMode]=useState<DriveMode>('sport');
  const stats={
    eco:{hp:200,torque:240,acc:8.5,speed:200},
    normal:{hp:225,torque:265,acc:7.2,speed:220},
    sport:{hp:300,torque:300,acc:6.5,speed:260},
  };
  const current=stats[mode];

  return(
    <ModalWrapper onClose={onClose}>
      <ModalHeader title="PERFORMANCE" onClose={onClose}/>
      <div className="flex flex-col items-center px-4 py-6">
        <div className="flex gap-4 mb-6">
          {(['eco','normal','sport'] as DriveMode[]).map(m=>(
            <button key={m} onClick={()=>setMode(m)}
              className={`uppercase text-lg font-bold ${mode===m?'text-[#EB0A1E]':'text-zinc-500 hover:text-zinc-300'}`}>
              {m}
            </button>
          ))}
        </div>
        <motion.img key={mode} src="https://images.unsplash.com/photo-1617654112368-307921291f42?w=1400&q=80"
          alt="Performance" initial={{opacity:0}} animate={{opacity:1}}
          className="w-full max-w-4xl rounded-xl mb-6"/>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
          <div className="flex justify-around">
            <div className="text-center text-white"><div className="text-3xl font-bold">{current.hp}</div><div className="text-sm text-zinc-400">HP</div></div>
            <div className="text-center text-white"><div className="text-3xl font-bold">{current.torque}</div><div className="text-sm text-zinc-400">Nm</div></div>
            <div className="text-center text-white"><div className="text-3xl font-bold">{current.acc}</div><div className="text-sm text-zinc-400">0-100s</div></div>
          </div>
          <div className="flex justify-center items-center">
            <div className="relative">
              <svg width="200" height="200" viewBox="0 0 280 280">
                <circle cx="140" cy="140" r="110" fill="none" stroke="#27272a" strokeWidth="2"/>
                <motion.line x1="140" y1="140" x2="140" y2="50" stroke="#EB0A1E" strokeWidth="4"
                  strokeLinecap="round" initial={{rotate:-135}}
                  animate={{rotate:(current.speed/280)*270-135}}
                  style={{transformOrigin:'140px 140px'}}/>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-white">{current.speed}</div>
                <div className="text-sm text-zinc-400">KM/H</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalFooter onReserve={onReserve} onTestDrive={onTestDrive}/>
    </ModalWrapper>
  );
};

// ==================== SAFETY MODAL ====================
const SafetyModal: React.FC<{ onClose:()=>void; onReserve?:()=>void; onTestDrive?:()=>void }> = ({onClose,onReserve,onTestDrive})=>{
  const features=[
    {title:'Pre-Collision System',desc:'Detects collisions and auto-brakes.',icon:'🛡️'},
    {title:'Blind Spot Monitor',desc:'Alerts for vehicles beside you.',icon:'👁️'},
    {title:'Lane Departure Alert',desc:'Warns if drifting lanes.',icon:'🛣️'},
    {title:'Adaptive Cruise Control',desc:'Keeps safe distance auto.',icon:'🎯'},
  ];

  return(
    <ModalWrapper onClose={onClose}>
      <ModalHeader title="SAFETY" onClose={onClose}/>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 w-full max-w-4xl mx-auto">
        {features.map((f,i)=>(
          <motion.div key={f.title} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
            className="bg-zinc-900/60 border border-zinc-700 rounded-xl p-6">
            <div className="text-3xl mb-2">{f.icon}</div>
            <h3 className="text-white font-bold mb-1">{f.title}</h3>
            <p className="text-zinc-400 text-sm">{f.desc}</p>
          </motion.div>
        ))}
      </div>
      <ModalFooter onReserve={onReserve} onTestDrive={onTestDrive}/>
    </ModalWrapper>
  );
};

// ==================== TECHNOLOGY MODAL ====================
const TechnologyModal: React.FC<{ onClose:()=>void; onReserve?:()=>void; onTestDrive?:()=>void }> = ({onClose,onReserve,onTestDrive})=>{
  const features=[
    {title:'12.3" Digital Cluster',desc:'Customizable high-res display',img:'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80'},
    {title:'Wireless CarPlay',desc:'Seamless phone integration',img:'https://images.unsplash.com/photo-1517059224940-d4af9eec41e5?w=800&q=80'},
    {title:'AI Navigation',desc:'Smart routing with live traffic',img:'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80'},
    {title:'Connected Services',desc:'Remote start + monitoring',img:'https://images.unsplash.com/photo-1581093588401-22f82f2f09c2?w=800&q=80'},
  ];
  const [index,setIndex]=useState(0);

  return(
    <ModalWrapper onClose={onClose}>
      <ModalHeader title="TECHNOLOGY" onClose={onClose}/>
      <div className="flex flex-col md:flex-row items-center gap-6 p-6">
        <motion.div key={index} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}}
          className="w-full md:w-1/2">
          <img src={features[index].img} alt={features[index].title} className="rounded-xl w-full"/>
        </motion.div>
        <div className="w-full md:w-1/2">
          <h2 className="text-white font-bold text-xl sm:text-2xl mb-2">{features[index].title}</h2>
          <p className="text-zinc-300 mb-4">{features[index].desc}</p>
          <div className="flex gap-2 mb-6">
            {features.map((_,i)=>(
              <button key={i} onClick={()=>setIndex(i)} className={`h-2 w-6 rounded-full ${index===i?'bg-[#EB0A1E]':'bg-zinc-600'}`}/>
            ))}
          </div>
          <div className="flex gap-3">
            <Button className="bg-[#EB0A1E] text-white px-6 py-3">Learn More</Button>
            <Button onClick={onReserve} className="border border-white text-white px-6 py-3 hover:bg-white/10">Reserve Now</Button>
          </div>
        </div>
      </div>
      <ModalFooter onReserve={onReserve} onTestDrive={onTestDrive}/>
    </ModalWrapper>
  );
};

// ==================== REUSABLE COMPONENTS ====================
const ModalWrapper:React.FC<{children:React.ReactNode;onClose:()=>void}> = ({children,onClose})=>(
  <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
    className="fixed inset-0 z-50 bg-black/95 overflow-hidden flex flex-col"
    onClick={(e)=>{if(e.target===e.currentTarget)onClose();}}>
    <motion.div initial={{scale:0.95}} animate={{scale:1}} exit={{scale:0.95}} className="flex flex-col flex-1">
      {children}
    </motion.div>
  </motion.div>
);

const ModalHeader:React.FC<{title:string;onClose:()=>void}> = ({title,onClose})=>(
  <div className="flex items-center justify-between border-b border-zinc-800 p-4">
    <span className="text-white font-bold">TOYOTA</span>
    <h1 className="text-white font-bold text-lg">{title}</h1>
    <button onClick={onClose} className="bg-zinc-800 rounded-full p-2"><X className="h-5 w-5 text-white"/></button>
  </div>
);

const ModalFooter:React.FC<{onReserve?:()=>void;onTestDrive?:()=>void}> = ({onReserve,onTestDrive})=>(
  <div className="flex gap-3 border-t border-zinc-800 p-4 justify-center">
    <Button onClick={onTestDrive} variant="outline" className="border-2 border-white text-white px-6 py-3 hover:bg-white/10">Test Drive</Button>
    <Button onClick={onReserve} className="bg-[#EB0A1E] text-white px-6 py-3 hover:bg-[#d0091a]">Reserve</Button>
  </div>
);

// ==================== EXPORT ====================
export default SeamlessCinematicShowroom;
