import { useState, useCallback, useEffect } from 'react';

interface SavedFilters {
  category?: string;
  priceRange?: [number, number];
}

const STORAGE_KEY = 'toyota.savedFilters';

export const useSavedFilters = () => {
  const [savedFilters, setSavedFilters] = useState<SavedFilters>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedFilters(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load saved filters:', error);
    }
  }, []);

  const saveCategory = useCallback((category: string) => {
    setSavedFilters(prev => {
      const updated = { ...prev, category };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save category:', error);
      }
      return updated;
    });
  }, []);

  const savePriceRange = useCallback((priceRange: [number, number]) => {
    setSavedFilters(prev => {
      const updated = { ...prev, priceRange };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save price range:', error);
      }
      return updated;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSavedFilters({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear filters:', error);
    }
  }, []);

  return {
    savedFilters,
    saveCategory,
    savePriceRange,
    clearFilters
  };
};
