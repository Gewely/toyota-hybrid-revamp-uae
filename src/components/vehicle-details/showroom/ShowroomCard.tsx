import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { ShowroomCard as ShowroomCardType } from './types';

interface ShowroomCardProps {
  card: ShowroomCardType;
  onClick: () => void;
  index: number;
}

const ShowroomCard: React.FC<ShowroomCardProps> = ({ card, onClick, index }) => {
  const getLayoutClasses = () => {
    const { gridSpan } = card;
    let classes = 'relative rounded-3xl overflow-hidden bg-background shadow-sm border border-border hover:shadow-md transition-shadow cursor-pointer ';
    
    // Desktop grid positioning
    if (gridSpan.row) classes += `${gridSpan.row} `;
    if (gridSpan.col) classes += `${gridSpan.col} `;
    
    return classes;
  };

  const isTextFirst = card.contentPosition === 'top';

  return (
    <motion.button
      onClick={onClick}
      className={getLayoutClasses()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`flex ${isTextFirst ? 'flex-col' : 'flex-col-reverse'} h-full min-h-[320px]`}>
        {/* Text Content */}
        <div className="p-8 flex flex-col justify-between flex-1">
          <div>
            <h3 className="text-2xl lg:text-3xl font-bold mb-3 text-foreground">
              {card.title}
            </h3>
            <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
              {card.tagline}
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2 text-foreground font-medium group-hover:gap-3 transition-all">
            <span>Learn more</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>

        {/* Image */}
        <div className="relative h-48 lg:h-56 overflow-hidden rounded-2xl mx-6 mb-6">
          <img 
            src={card.image} 
            alt={card.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </motion.button>
  );
};

export default ShowroomCard;
