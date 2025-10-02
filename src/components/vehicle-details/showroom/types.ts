export interface ShowroomCard {
  id: 'interior' | 'exterior' | 'performance' | 'safety' | 'technology';
  title: string;
  tagline: string;
  image: string;
  layout: 'tall' | 'wide' | 'square';
  gridSpan: { row?: string; col?: string };
  contentPosition: 'top' | 'bottom' | 'overlay';
}

export interface ModalWrapperProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  fullScreen?: boolean;
  maxWidth?: string;
  background?: string;
}
