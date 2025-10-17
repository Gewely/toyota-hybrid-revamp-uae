/**
 * Premium Car Builder Theme Tokens
 * 
 * Provides design tokens for light (Porcelain+) and dark (Carbon) themes.
 * All values use HSL color space for consistency with the design system.
 */

export const carBuilderTokens = {
  // Porcelain+ Light Theme (Default)
  light: {
    bg: 'hsl(var(--background))',
    card: 'hsl(var(--card))',
    cardHover: 'hsl(var(--accent))',
    muted: 'hsl(var(--muted))',
    mutedForeground: 'hsl(var(--muted-foreground))',
    border: 'hsl(var(--border))',
    borderFocus: 'hsl(var(--ring))',
    accent: 'hsl(var(--primary))',
    accentForeground: 'hsl(var(--primary-foreground))',
    foreground: 'hsl(var(--foreground))',
    
    // Shadows - soft, premium
    shadowSm: '0 1px 3px hsl(var(--foreground) / 0.04), 0 1px 2px hsl(var(--foreground) / 0.03)',
    shadowMd: '0 4px 6px hsl(var(--foreground) / 0.05), 0 2px 4px hsl(var(--foreground) / 0.04)',
    shadowLg: '0 10px 15px hsl(var(--foreground) / 0.06), 0 4px 6px hsl(var(--foreground) / 0.04)',
    shadowXl: '0 20px 25px hsl(var(--foreground) / 0.08), 0 8px 10px hsl(var(--foreground) / 0.05)',
    shadow2xl: '0 25px 50px hsl(var(--foreground) / 0.10), 0 10px 20px hsl(var(--foreground) / 0.06)',
    
    // Radii
    radiusSm: '0.5rem',  // 8px
    radiusMd: '0.75rem', // 12px
    radiusLg: '1rem',    // 16px
    radiusXl: '1.5rem',  // 24px
    radius2xl: '2rem',   // 32px
  },
  
  // Typography Scale
  typography: {
    display: 'text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight',
    headline: 'text-xl md:text-2xl font-semibold tracking-tight',
    title: 'text-lg md:text-xl font-semibold',
    body: 'text-sm md:text-base',
    caption: 'text-xs md:text-sm text-muted-foreground',
    overline: 'text-xs uppercase tracking-wider font-medium text-muted-foreground',
  },
  
  // Spacing Scale (airy, premium feel)
  spacing: {
    xs: '0.5rem',  // 8px
    sm: '0.75rem', // 12px
    md: '1rem',    // 16px
    lg: '1.5rem',  // 24px
    xl: '2rem',    // 32px
    '2xl': '3rem', // 48px
    '3xl': '4rem', // 64px
  },
  
  // Animation durations
  duration: {
    fast: 0.15,
    normal: 0.2,
    slow: 0.3,
    slower: 0.4,
  },
  
  // Spring configurations for Framer Motion
  spring: {
    snappy: { type: 'spring' as const, damping: 20, stiffness: 300 },
    luxurious: { type: 'spring' as const, damping: 25, stiffness: 200 },
    smooth: { type: 'spring' as const, damping: 30, stiffness: 150 },
  },
  
  // Easing curves
  ease: {
    out: [0.4, 0, 0.2, 1] as [number, number, number, number],
    inOut: [0.4, 0, 0.6, 1] as [number, number, number, number],
    in: [0.4, 0, 1, 1] as [number, number, number, number],
  }
};

export type CarBuilderTokens = typeof carBuilderTokens;
