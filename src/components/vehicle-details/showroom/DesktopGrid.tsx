import React from 'react';
import ShowroomCard from './ShowroomCard';
import { ShowroomCard as ShowroomCardType } from './types';

interface DesktopGridProps {
  cards: ShowroomCardType[];
  onCardClick: (id: string) => void;
}

const DesktopGrid: React.FC<DesktopGridProps> = ({ cards, onCardClick }) => {
  return (
    <div className="hidden lg:grid grid-cols-2 gap-6 p-8 max-w-7xl mx-auto">
      {cards.map((card, index) => (
        <ShowroomCard
          key={card.id}
          card={card}
          onClick={() => onCardClick(card.id)}
          index={index}
        />
      ))}
    </div>
  );
};

export default DesktopGrid;
