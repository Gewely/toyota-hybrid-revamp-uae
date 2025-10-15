/**
 * Z-Index Token System
 * Centralized z-index management to prevent stacking context issues
 * Usage: import { Z } from '@/lib/z-index' and use Z.modal instead of hardcoded values
 */

export const Z = {
  base: 0,
  dropdown: 10,
  header: 50,
  stickyNav: 80,
  stickyElement: 90,
  floatingActions: 95,
  overlay: 900,
  drawer: 950,
  modal: 1000,
  popover: 1050,
  toast: 1100,
  tooltip: 1150,
} as const;

export type ZIndexToken = typeof Z[keyof typeof Z];
