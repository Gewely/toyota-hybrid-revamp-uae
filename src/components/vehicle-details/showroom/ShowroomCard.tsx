import React from 'react';
import { motion } from 'framer-motion';
import { ShowroomCard as ShowroomCardType } from './types';

interface ShowroomCardProps {
  card: ShowroomCardType;
  onClick: () => void;
  index: number;
}

const ShowroomCard: React.FC<ShowroomCardProps> = ({ card, onClick, index }) => {
  const getLayoutClasses = () => {
    const { layout, gridSpan } = card;
    let classes = 'relative rounded-3xl overflow-hidden bg-white shadow-md border border-border/50 cursor-pointer ';
    
    // Desktop grid positioning
    if (gridSpan.row) classes += `${gridSpan.row} `;
    if (gridSpan.col) classes += `${gridSpan.col} `;
    
    return classes;
  };

  const getContentClasses = () => {
    const { contentPosition } = card;
    
    if (contentPosition === 'overlay') {
      return 'absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/70 via-black/30 to-transparent';
    }
    
    if (contentPosition === 'top') {
      return 'flex flex-col p-8';
    }
    
    return 'flex flex-col p-8';
  };

  return (
    <motion.button
      onClick={onClick}
      className={getLayoutClasses()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative w-full h-full min-h-[300px]">
        <img 
          src={card.image} 
          alt={card.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className={getContentClasses()}>
          <h3 className={`text-2xl lg:text-3xl font-bold mb-2 ${
            card.contentPosition === 'overlay' ? 'text-white' : 'text-zinc-900'
          }`}>
            {card.title}
          </h3>
          <p className={`text-sm lg:text-base ${
            card.contentPosition === 'overlay' ? 'text-white/90' : 'text-zinc-600'
          }`}>
            {card.tagline}
          </p>
        </div>
      </div>
    </motion.button>
  );
};

export default ShowroomCard;
