import { useEffect } from 'react';

interface UseModalDeepLinkProps {
  modalId: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  enabled?: boolean;
}

export const useModalDeepLink = ({
  modalId,
  isOpen,
  onOpen,
  onClose,
  enabled = true,
}: UseModalDeepLinkProps) => {
  useEffect(() => {
    if (!enabled) return;

    const checkHash = () => {
      const hash = window.location.hash.replace('#modal=', '');
      if (hash === modalId && !isOpen) {
        onOpen();
      } else if (hash !== modalId && isOpen) {
        onClose();
      }
    };

    checkHash();

    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [modalId, isOpen, onOpen, onClose, enabled]);

  useEffect(() => {
    if (!enabled) return;
    
    if (isOpen) {
      window.history.pushState(null, '', `#modal=${modalId}`);
    } else if (window.location.hash === `#modal=${modalId}`) {
      window.history.pushState(null, '', window.location.pathname);
    }
  }, [isOpen, modalId, enabled]);
};
