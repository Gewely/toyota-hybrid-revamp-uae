import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface PageContext {
  heroImage?: string;
  galleryImages?: string[];
  vehicleName?: string;
  vehiclePrice?: number;
  [key: string]: any;
}

interface ModalState {
  id: string;
  props?: Record<string, any>;
  priority?: number;
}

interface ModalContextValue {
  open: (id: string, props?: Record<string, any>) => void;
  close: (id?: string) => void;
  closeAll: () => void;
  isOpen: (id: string) => boolean;
  getProps: (id: string) => Record<string, any>;
  pageContext: PageContext;
  setPageContext: (context: PageContext) => void;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
  pageContext?: PageContext;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children, pageContext: initialPageContext = {} }) => {
  const [modals, setModals] = useState<ModalState[]>([]);
  const [pageContext, setPageContext] = useState<PageContext>(initialPageContext);

  const open = useCallback((id: string, props?: Record<string, any>) => {
    setModals((prev) => {
      const exists = prev.find((m) => m.id === id);
      if (exists) return prev;
      return [...prev, { id, props }];
    });
  }, []);

  const close = useCallback((id?: string) => {
    setModals((prev) => {
      if (!id) return prev.slice(0, -1);
      return prev.filter((m) => m.id !== id);
    });
  }, []);

  const closeAll = useCallback(() => {
    setModals([]);
  }, []);

  const isOpen = useCallback(
    (id: string) => {
      return modals.some((m) => m.id === id);
    },
    [modals]
  );

  const getProps = useCallback(
    (id: string) => {
      return modals.find((m) => m.id === id)?.props || {};
    },
    [modals]
  );

  return (
    <ModalContext.Provider value={{ open, close, closeAll, isOpen, getProps, pageContext, setPageContext }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
};
