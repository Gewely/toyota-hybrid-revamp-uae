import { useState, useEffect, useCallback, useRef } from 'react';

export interface ModalState {
  id: string;
  zIndex: number;
  isOpen: boolean;
}

const BASE_Z_INDEX = 1000;

export const useModalStack = () => {
  const [modalStack, setModalStack] = useState<ModalState[]>([]);
  const bodyScrollLocked = useRef(false);

  // Add modal to stack
  const pushModal = useCallback((id: string) => {
    setModalStack(prev => {
      const exists = prev.find(m => m.id === id);
      if (exists) return prev;

      const zIndex = BASE_Z_INDEX + prev.length;
      return [...prev, { id, zIndex, isOpen: true }];
    });
  }, []);

  // Remove modal from stack
  const popModal = useCallback((id: string) => {
    setModalStack(prev => prev.filter(m => m.id !== id));
  }, []);

  // Get z-index for modal
  const getZIndex = useCallback((id: string): number => {
    const modal = modalStack.find(m => m.id === id);
    return modal?.zIndex ?? BASE_Z_INDEX;
  }, [modalStack]);

  // Check if modal is on top
  const isTopModal = useCallback((id: string): boolean => {
    if (modalStack.length === 0) return false;
    return modalStack[modalStack.length - 1]?.id === id;
  }, [modalStack]);

  // Get top modal ID
  const getTopModalId = useCallback((): string | null => {
    if (modalStack.length === 0) return null;
    return modalStack[modalStack.length - 1]?.id ?? null;
  }, [modalStack]);

  // Body scroll lock management
  useEffect(() => {
    const hasOpenModals = modalStack.length > 0;

    if (hasOpenModals && !bodyScrollLocked.current) {
      // Lock scroll
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      bodyScrollLocked.current = true;
    } else if (!hasOpenModals && bodyScrollLocked.current) {
      // Unlock scroll
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
      bodyScrollLocked.current = false;
    }
  }, [modalStack]);

  // Handle ESC key - only close top modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalStack.length > 0) {
        const topModalId = getTopModalId();
        if (topModalId) {
          popModal(topModalId);
        }
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [modalStack, getTopModalId, popModal]);

  return {
    modalStack,
    pushModal,
    popModal,
    getZIndex,
    isTopModal,
    getTopModalId,
    hasOpenModals: modalStack.length > 0
  };
};

// Singleton instance for global modal stack management
let globalModalStack: ReturnType<typeof useModalStack> | null = null;

export const useGlobalModalStack = () => {
  if (!globalModalStack) {
    globalModalStack = useModalStack();
  }
  return globalModalStack;
};
